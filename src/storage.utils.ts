export const getPath = (bucket: string, path: string) => {
  return `https://your-project.supabase.co/storage/v1/object/public/${bucket}/${path}`;
};