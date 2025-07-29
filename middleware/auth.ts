

export default defineNuxtRouteMiddleware( (to, from) => {
  const authStore = useAuthStore();
  
  
  if (!authStore.user.status) {
    return navigateTo('/');
  }
});
