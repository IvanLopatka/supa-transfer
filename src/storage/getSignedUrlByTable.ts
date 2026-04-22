import type { SupabaseClient } from '@supabase/supabase-js';
import type { ExtractSchemaName, ExtractTables, ExtractColumns, ExtractColumnType } from '../types';

export interface GetSignedUrlOptions {
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
* @param expiresIn The number of seconds until the signed URL expires.
* @param options Storage settings such as transformations or bucket overrides
*/
export async function getSignedUrlByTable<T = any,
  Database = any,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>,
  TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
  ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
>(
  client: SupabaseClient<T>,
  tableName: TableName,
  _columnName: ColumnName,
  path: ExtractColumnType<Database, TableName, ColumnName, SchemaName>,
  expiresIn: number,
  options?: GetSignedUrlOptions
): Promise<string | null> {
  if (!path) return null;

  const bucketName = options?.bucket ?? String(tableName);

  const { data, error } = await client.storage
    .from(bucketName)
    .createSignedUrl(path as string, expiresIn, {
      transform: options?.transform,
    });

  if (error || !data) {
    if (error) {
      console.error(`Error generating signed URL for ${String(tableName)}/${String(path)}:`, error);
    }
    return null;
  }

  // Handle both v1 and v2 responses if necessary, 
  // though peerDeps say ^2.0.0, it's safer to check.
  const url = typeof data === 'string' ? data : (data as any).signedUrl;

  return url || null;
}

