// composables/useAppwriteClient.ts
import { Client, Storage } from 'appwrite';
import { useRuntimeConfig } from '#app';

export function useAppwriteClient() {
  const config = useRuntimeConfig();

  const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(config.public.APPWRITE_APP_ID);


  const storage = new Storage(client);

  return { client, storage };
}
