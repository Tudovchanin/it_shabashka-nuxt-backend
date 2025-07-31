export function useAppConstants() {
  const config = useRuntimeConfig();
  return {
    APP_ID: config.public.APPWRITE_APP_ID,
    STORAGE_ID: config.public.APPWRITE_STORAGE_ID,
  };
}