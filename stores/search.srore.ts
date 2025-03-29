


export const useSearchStore = defineStore('search', () => {

  const searchQuery = ref<string>('');
  const flagSearch = ref(false);


  const setSearchQuery = (data: string):void => {
    searchQuery.value = data;
  }


  const getSearchQuery = (data: string):string => {
    return searchQuery.value
  }
 
  const resetSearchQuery = ():void => {
    searchQuery.value = '';
  }



  return {
    setSearchQuery, searchQuery, resetSearchQuery, flagSearch
  }
})