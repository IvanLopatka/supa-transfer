'use strict';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtractSchemaName, ExtractTables, ExtractColumns, ExtractColumnType } from '../types';

export interface GetPublicUrlOptions {

  // If not provided, defaults to the tableName string.
  bucket?: string;

  // Supabase image transformation parameters.
  transform?: {
    width?: number;
    height?: number;
    resize?: 'cover' | 'contain' | 'fill';
    quality?: number;
    format?: 'origin';
  };
}


/**
* @param client Initialize Supabase client representing the generic `Database` type
* @param tableName The database table mapped to your bucket
* @param columnName The specific column containing the path/identifier for this file
* @param path The actual string reference populated in the Database record
* @param options Storage settings such as transformations or bucket overrides
*/
export function getPublicUrlByTable<
  Database = any,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>,
  TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
  ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
>(
  client: SupabaseClient<Database, SchemaName>,
  tableName: TableName,
  _columnName: ColumnName,
  path: ExtractColumnType<Database, TableName, ColumnName, SchemaName>,
  options?: GetPublicUrlOptions
): string {
  if (!path) return '';

  const bucketName = options?.bucket ?? String(tableName);

  const { data } = client.storage
    .from(bucketName)
    .getPublicUrl(path as string, {
      transform: options?.transform,
    });

  return data.publicUrl;
}
