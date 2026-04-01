import { describe, it, expect, vi } from 'vitest';
import { getPublicUrlByTable } from './storage/getPublicUrlByTable';



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
