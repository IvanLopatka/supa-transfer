# supa-transfer 🚀

[![npm version](https://img.shields.io/npm/v/supa-transfer.svg)](https://www.npmjs.com/package/supa-transfer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tested with Vitest](https://img.shields.io/badge/tested%20with-vitest-blue)](https://vitest.dev/)

A specialized Supabase utility library designed to bridge the gap between your database tables and storage buckets. Effortlessly manage files with full type safety based on your existing database schema.

---

## 💡 Motivation

Working with Supabase Storage often requires manual mapping between database columns (where you store file paths) and storage buckets. This leads to repetitive boilerplate code:
- Constructing bucket names manually.
- Concatenating paths.
- Losing type safety between your DB schema and storage operations.

**supa-transfer** automates this by using your database metadata to derive storage locations, providing a clean, type-safe API for all storage interactions.

## 📦 Installation

```bash
# Using npm
npm install supa-transfer

# Using yarn
yarn add supa-transfer

# Using pnpm
pnpm add supa-transfer
```

## 🚀 Getting Started

Initialize the utility factory by passing your typed Supabase client.

```typescript
import { createClient } from '@supabase/supabase-js';
import { createSupabaseImageUtils } from 'supa-transfer';
import { Database } from './types/supabase'; // Your generated types

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Create the utilities bound to your Database types
const storage = createSupabaseImageUtils(supabase);
```

## 📖 API Reference

The library provides a factory function `createSupabaseImageUtils` which returns a set of bound methods.

### `getPublicUrl(tableName, columnName, path, options?)`
Retrieves the public URL for a file stored at the given path.

- **tableName**: The name of the table related to the storage.
- **columnName**: The specific column where the path is stored.
- **path**: The relative path to the file in the bucket.
- **options**: Optional Supabase storage configuration.

```typescript
const url = storage.getPublicUrl('profiles', 'avatar_url', 'avatars/user-1.png');
```

### `getSignedUrl(tableName, columnName, path, expiresIn, options?)`
Generates a temporary signed URL for private bucket access.

```typescript
const url = await storage.getSignedUrl('docs', 'file_path', 'secret.pdf', 60);
```

### `uploadFile(tableName, columnName, path, file, options?)`
Uploads a file directly to the derived bucket.

```typescript
await storage.uploadFile('profiles', 'avatar_url', 'new-avatar.png', file);
```

### `removeFile(tableName, columnName, paths, options?)`
Removes one or more files from the storage bucket.

```typescript
await storage.removeFile('profiles', 'avatar_url', ['old-avatar.png']);
```

## 🧪 Testing

This library is built with reliability in mind. We use **Vitest** for comprehensive unit testing, ensuring that all storage path derivations and client interactions work as expected.

To run the tests locally:
```bash
npm test
```

## 🛠 Development

### Local Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Run dev mode: `npm run dev`.

### Building
To build the library for production (outputs to `dist/` using Vite's library mode):
```bash
npm run build
```

---

## ⚖️ License

MIT © [Ivan Lopatka](https://github.com/IvanLopatka)
