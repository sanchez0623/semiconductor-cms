// lib/notion-products.ts
import { notion, NOTION_PRODUCTS_DB_ID, getDatabaseDataSourceId } from "./notion";

export type NotionProduct = {
  id: string;
  name: string;
  slug: string;
  visible: boolean;
  category?: string[];
  description?: string;
  price?: number;
  imageUrl?: string;
};

// 分页响应类型
export type PaginatedProductsResponse = {
  items: NotionProduct[];
  hasMore: boolean;
  nextCursor: string | null;
  total: number; // 当前返回的数量
};

function getPlainText(richTexts: any[] | undefined): string {
  if (!richTexts) return "";
  return richTexts.map((r: any) => r?.plain_text ?? "").join("");
}


// 🆕 分页获取可见产品
export async function getProductsPaginated(options?: {
  pageSize?: number;
  startCursor?: string;
  category?: string; // 可选：按分类筛选
}): Promise<PaginatedProductsResponse> {
  if (!NOTION_PRODUCTS_DB_ID) {
    return {
      items: [],
      hasMore: false,
      nextCursor: null,
      total: 0,
    };
  }

  const dataSourceId = await getDatabaseDataSourceId(NOTION_PRODUCTS_DB_ID);
  const pageSize = options?.pageSize ?? 12; // 默认每页 12 条（产品列表常用）

  // 构建过滤条件
  const filters: any[] = [
    {
      property: "is_active",
      checkbox: { equals: true },
    },
  ];

  // 如果指定了分类，添加分类过滤
  if (options?.category) {
    filters.push({
      property: "category",
      select: { equals: options.category },
    });
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: filters.length > 1 ? { and: filters } : filters[0],
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
    page_size: pageSize,
    start_cursor: options?.startCursor, // 传入游标以获取下一页
  });

  const items = response.results.map((page: any) => {
    const props = page.properties;

    const name = getPlainText(props["name"]?.title);
    const slug = props["slug"]?.rich_text?.[0]?.plain_text ?? "";
    const description = getPlainText(props["description"]?.rich_text);
    const price = props["price"]?.number ?? null;
    const category = props["category"]?.select?.name ?? "";

    return {
      id: page.id,
      name,
      slug,
      visible: true,
      description: description || undefined,
      price: price ?? undefined,
      category: category || undefined,
    };
  });

  return {
    items,
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
    total: items.length,
  };
}

// 获取所有可见产品
export async function getAllProducts(): Promise<NotionProduct[]> {
  if (!NOTION_PRODUCTS_DB_ID) return [];

  const dataSourceId = await getDatabaseDataSourceId(NOTION_PRODUCTS_DB_ID);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "is_active",
      checkbox: { equals: true },
    },
    sorts: [
      {
        timestamp: "created_time",
        direction: "descending",
      },
    ],
  });

  if (response.results.length === 0) return [];

  console.log(response.results)
  return response.results.map((page: any) => {
    const props = page.properties;

    const name = getPlainText(props["name"]?.title);
    const slug = props["slug"]?.rich_text?.[0]?.plain_text ?? "";
    const description = getPlainText(props["description"]?.rich_text);
    const price = props["price"]?.number ?? null;
    const category = props["category"]?.select.name ?? "";

    return {
      id: page.id,
      name,
      slug,
      visible: true,
      description: description || undefined,
      price: price ?? undefined,
      category,
    };
  });
}

// 按 slug 查单个产品（如果你有详情页）
export async function getProductBySlug(
  slug: string
): Promise<NotionProduct | null> {
  if (!NOTION_PRODUCTS_DB_ID) return null;

  const dataSourceId = await getDatabaseDataSourceId(NOTION_PRODUCTS_DB_ID);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          property: "slug",
          rich_text: { equals: slug },
        },
        {
          property: "is_active",
          checkbox: { equals: true },
        },
      ],
    },
    page_size: 1,
  });

  if (response.results.length === 0) return null;

  const page: any = response.results[0];
  const props = page.properties;

  const name = getPlainText(props["name"]?.title);
  const description = getPlainText(props["description"]?.rich_text);
  const price = props["price"]?.number ?? null;
  const category = props["category"]?.select.name ?? "";

  return {
    id: page.id,
    name,
    slug,
    visible: true,
    description: description || undefined,
    price: price ?? undefined,
    category,
  };
}