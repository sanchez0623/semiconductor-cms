// lib/notion.ts
import { Client, isFullDatabase } from "@notionhq/client";

if (!process.env.NOTION_TOKEN) {
  throw new Error("NOTION_TOKEN is not set");
}

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const NOTION_NEWS_DB_ID = process.env.NOTION_NEWS_DB_ID!;
export const NOTION_PRODUCTS_DB_ID = process.env.NOTION_PRODUCTS_DB_ID!;

if (!NOTION_NEWS_DB_ID) {
  throw new Error("NOTION_NEWS_DB_ID is not set");
  // console.warn("⚠️ NOTION_NEWS_DB_ID is not set");
}

if (!NOTION_PRODUCTS_DB_ID) {
  throw new Error("NOTION_PRODUCTS_DB_ID is not set");
  // console.warn("⚠️ NOTION_PRODUCTS_DB_ID is not set");
}

export async function getDatabaseDataSourceId(databaseId: string): Promise<string> {
  const database = await notion.databases.retrieve({ database_id: databaseId });
  if (isFullDatabase(database) && database.data_sources?.length) {
    return database.data_sources[0].id;
  }
  throw new Error(`No data source found for database ${databaseId}`);
}