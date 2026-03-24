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

    // 2. Викликаємо вашу функцію
    const url = getPublicUrlByTable(mockSupabase as any, 'profiles', 'avatar_url', 'path/to/file.png');

    // 3. Перевіряємо результат
    expect(url).toBe('https://example.com/photo.png');
    // Перевіряємо, чи викликався правильний бакет (наприклад, якщо у вас там логіка мапінгу)
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('profiles');
  });
});
