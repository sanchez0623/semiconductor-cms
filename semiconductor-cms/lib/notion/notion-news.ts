// lib/notion-news.ts
import { notion, NOTION_NEWS_DB_ID, getDatabaseDataSourceId } from "./notion";

export type NotionNewsItem = {
  id: string;
  title: string;
  slug: string;
  content?: string; // 简化为纯文本；若要富文本/块结构可再扩展
  published: boolean;
  publishedAt?: string; // ISO 字符串
};

// 分页响应类型
export type PaginatedNewsResponse = {
  items: NotionNewsItem[];
  hasMore: boolean;
  nextCursor: string | null;
  total: number; // 当前返回的数量
};

function getPlainText(richTexts: any[]): string {
  return (richTexts || []).map((r: any) => r.plain_text ?? "").join("");
}

// 🆕 分页获取已发布的 news
export async function getNewsPaginated(options?: {
  pageSize?: number;
  startCursor?: string;
}): Promise<PaginatedNewsResponse> {
  if (!NOTION_NEWS_DB_ID) {
    return {
      items: [],
      hasMore: false,
      nextCursor: null,
      total: 0,
    };
  }

  const dataSourceId = await getDatabaseDataSourceId(NOTION_NEWS_DB_ID);
  const pageSize = options?.pageSize ?? 10; // 默认每页 10 条

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "is_published",
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: "published_at",
        direction: "descending",
      },
    ],
    page_size: pageSize,
    start_cursor: options?.startCursor, // 传入游标以获取下一页
  });

  const items = response.results.map((page: any) => {
    const props = page.properties;

    const title = getPlainText(props["title"]?.title ?? []);
    const slug = getPlainText(props["slug"]?.rich_text ?? "");
    const publishedAt = props["published_at"]?.date?.start ?? null;
    const content = getPlainText(props["content"]?.rich_text ?? []);

    return {
      id: page.id,
      title,
      slug,
      content: content || undefined,
      published: true,
      publishedAt: publishedAt || undefined,
    };
  });

  return {
    items,
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
    total: items.length,
  };
}

// 获取所有已发布的 news（用于列表页）
export async function getAllNews(): Promise<NotionNewsItem[]> {
  if (!NOTION_NEWS_DB_ID) return [];

  const dataSourceId = await getDatabaseDataSourceId(NOTION_NEWS_DB_ID);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      property: "is_published",
      checkbox: { equals: true },
    },
    sorts: [
      {
        property: "published_at",
        direction: "descending",
      },
    ],
  });

  return response.results.map((page: any) => {
    const props = page.properties;

    const title = getPlainText(props["title"]?.title ?? []);
    const slug = getPlainText(props["slug"]?.rich_text ?? ""); 
    const publishedAt = props["published_at"]?.date?.start ?? null;
    const content = getPlainText(props["content"]?.rich_text ?? []);

    return {
      id: page.id,
      title,
      slug,
      content: content || undefined,
      published: true,
      publishedAt: publishedAt || undefined,
    };
  });
}

// 根据 slug 获取单篇 news（用于详情页）
export async function getNewsBySlug(slug: string): Promise<NotionNewsItem | null> {
  if (!NOTION_NEWS_DB_ID) return null;

  const dataSourceId = await getDatabaseDataSourceId(NOTION_NEWS_DB_ID);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          property: "slug",
          rich_text: { equals: slug },
        },
        {
          property: "is_published",
          checkbox: { equals: true },
        },
      ],
    },
    page_size: 1,
  });

  if (response.results.length === 0) {
    console.log(`No news found with slug: ${slug}`);
    return null;
  }

  const page: any = response.results[0];
  const props = page.properties;

  const title = getPlainText(props["title"]?.title ?? []);
  const publishedAt = props["published_at"]?.date?.start ?? null;
  const content = getPlainText(props["content"]?.rich_text ?? []);

  return {
    id: page.id,
    title,
    slug,
    content: content || undefined,
    published: true,
    publishedAt: publishedAt || undefined
  };
}