import type { SupabaseClient } from '@supabase/supabase-js';
import { getPublicUrlByTable, type GetPublicUrlOptions } from './storage';
import { getSignedUrlByTable, type GetSignedUrlOptions } from './storage/getSignedUrlByTable';
import { uploadFileByTable, type UploadFileOptions } from './storage/uploadFileByTable';
import { removeFileByTable, type RemoveFileOptions } from './storage/removeFileByTable';
import type { ExtractSchemaName, ExtractTables, ExtractColumns, ExtractColumnType } from './types';

/**
 * Creates a configured set of Supabase Storage utils bound to your specific Database types.
 */
export function createSupabaseImageUtils<
  Database = any,
  SchemaName extends string & Exclude<keyof Database, '__InternalSupabase'> = ExtractSchemaName<Database>
>(client: SupabaseClient<any>) {
  return {
    getPublicUrl: <
      TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
      ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
    >(
      tableName: TableName,
      columnName: ColumnName,
      path: ExtractColumnType<Database, TableName, ColumnName, SchemaName>,
      options?: GetPublicUrlOptions
    ) => getPublicUrlByTable(client, tableName, columnName, path, options),

    getSignedUrl: <
      TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
      ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
    >(
      tableName: TableName,
      columnName: ColumnName,
      path: ExtractColumnType<Database, TableName, ColumnName, SchemaName>,
      expiresIn: number,
      options?: GetSignedUrlOptions
    ) => getSignedUrlByTable(client, tableName, columnName, path, expiresIn, options),

    uploadFile: <
      TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
      ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
    >(
      tableName: TableName,
      columnName: ColumnName,
      path: ExtractColumnType<Database, TableName, ColumnName, SchemaName> | string,
      file: any,
      options?: UploadFileOptions
    ) => uploadFileByTable(client, tableName, columnName, path, file, options),

    removeFile: <
      TableName extends ExtractTables<Database, SchemaName> = ExtractTables<Database, SchemaName>,
      ColumnName extends ExtractColumns<Database, TableName, SchemaName> = ExtractColumns<Database, TableName, SchemaName>
    >(
      tableName: TableName,
      columnName: ColumnName,
      paths: ExtractColumnType<Database, TableName, ColumnName, SchemaName> | Array<ExtractColumnType<Database, TableName, ColumnName, SchemaName>>,
      options?: RemoveFileOptions
    ) => removeFileByTable(client, tableName, columnName, paths, options),
  };
}
