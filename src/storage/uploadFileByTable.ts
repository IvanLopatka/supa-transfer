'use strict';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtractSchemaName, ExtractTables, ExtractColumns, ExtractColumnType } from '../types';

export interface UploadFileOptions {
  // If not provided, defaults to the tableName string.
  bucket?: string;

  // Supabase storage upload options.
  cacheControl?: string;
  contentType?: string;
  upsert?: boolean;
}

/**
* @param client Initialize Supabase client representing the generic `Database` type
* @param tableName The database table mapped to your bucket
* @param columnName The specific column containing the path/identifier for this file
* @param path The path where the file should be stored
* @param file The file body (File, Blob, ArrayBuffer, etc.)
* @param options Storage settings such as caching or bucket overrides
*/
export async function uploadFileByTable<T = any,
  Database = any,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>,
  TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
  ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
>(
  client: SupabaseClient<T>,
  tableName: TableName,
  _columnName: ColumnName,
  path: ExtractColumnType<Database, TableName, ColumnName, SchemaName> | string,
  file: any,
  options?: UploadFileOptions
) {
  if (!path) throw new Error('Path is required for upload');

  const bucketName = options?.bucket ?? String(tableName);

  const { data, error } = await client.storage
    .from(bucketName)
    .upload(path as string, file, {
      cacheControl: options?.cacheControl,
      contentType: options?.contentType,
      upsert: options?.upsert,
    });

  if (error) {
    throw error;
  }

  return data.path;
}
