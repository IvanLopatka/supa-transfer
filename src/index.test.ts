import { describe, it, expect, vi } from 'vitest';
import { getPublicUrlByTable, getSignedUrlByTable, uploadFileByTable } from './storage';



describe('getPublicUrlByTable', () => {
  it('should return a public URL', () => {
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          getPublicUrl: vi.fn().mockReturnValue({
            data: { publicUrl: 'https://example.com/photo.png' }
          })
        })
      }
    };

    const url = getPublicUrlByTable(mockSupabase as any, 'profiles', 'avatar_url', 'path/to/file.png');

    expect(url).toBe('https://example.com/photo.png');
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('profiles');
  });
});

describe('getSignedUrlByTable', () => {
  it('should return a signed URL', async () => {
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockReturnValue({
            data: { signedUrl: 'https://example.com/photo.png' }
          })
        })
      }
    };

    const url = await getSignedUrlByTable(mockSupabase as any, 'profiles', 'avatar_url', 'path/to/file.png', 60);

    expect(url).toBe('https://example.com/photo.png');
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('profiles');
  });

  it('should return null if the path is empty', async () => {
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          createSignedUrl: vi.fn().mockReturnValue({
            data: { signedUrl: 'https://example.com/photo.png' }
          })
        })
      }
    };

    const url = await getSignedUrlByTable(mockSupabase as any, 'profiles', 'avatar_url', '', 60);

    expect(url).toBeNull();
  });
});

describe('uploadFileByTable', () => {
  it('should upload a file', async () => {
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockReturnValue({
            data: { path: 'path/to/file.png' }
          })
        })
      }
    };

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });

    const result = await uploadFileByTable(mockSupabase as any, 'profiles', 'avatar_url', 'path/to/file.png', file);

    expect(result).toBe('path/to/file.png');
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('profiles');
  });

  it('should return null if the path is empty', async () => {
    const mockSupabase = {
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockReturnValue({
            data: { path: 'path/to/file.png' }
          })
        })
      }
    };

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    
    await expect(uploadFileByTable(mockSupabase as any, 'profiles', 'avatar_url', '', file))
      .rejects.toThrow('Path is required for upload');
  })
});