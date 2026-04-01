import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtractSchemaName, ExtractTables, ExtractColumns, ExtractColumnType } from '../types';

export interface RemoveFileOptions {
  /**
   * If not provided, defaults to the tableName string.
   */
  bucket?: string;
}

/**
* @param client Initialize Supabase client representing the generic `Database` type
* @param tableName The database table mapped to your bucket
* @param columnName The specific column containing the path/identifier for this file
* @param paths The path or array of paths to delete
* @param options Storage settings such as bucket overrides
*/
export async function removeFileByTable<
  Database = any,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>,
  TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
  ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
>(
  client: SupabaseClient<Database, SchemaName>,
  tableName: TableName,
  _columnName: ColumnName,
  paths: ExtractColumnType<Database, TableName, ColumnName, SchemaName> | Array<ExtractColumnType<Database, TableName, ColumnName, SchemaName>>,
  options?: RemoveFileOptions
) {
  if (!paths) return;

  const bucketName = options?.bucket ?? String(tableName);
  
  const formattedPaths = Array.isArray(paths) ? paths : [paths];

  const { data, error } = await client.storage
    .from(bucketName)
    .remove(formattedPaths as string[]);

  if (error) {
    throw error;
  }

  return data;
}
