



export function sortDesc(array: DataCardAppWrite[], property: string): void {  
  if(array.length <= 1) return;
  
  array.sort((a, b) => b[property] - a[property]);
}

export function sortAsc(array: DataCardAppWrite[], property: string): void {
  if(array.length <= 1) return;

  array.sort((a, b) => a[property] - b[property]);
}



export function sortDateStringDesc(array: DataCardAppWrite[], property: string): void {
  if(array.length <= 1) return;

  const MAX_DATE = new Date(8640000000000000);

  array.sort((a, b) => {
    const dateA = a[property] ? new Date(a[property]) : MAX_DATE;
    const dateB = b[property] ? new Date(b[property]) : MAX_DATE;
    
    return dateB.getTime() - dateA.getTime();
  });
}

export function sortDateStringAsc(array: DataCardAppWrite[], property: string): void {
  if(array.length <= 1) return;
  const MAX_DATE = new Date(8640000000000000);
  array.sort((a, b) => {
    const dateA = a[property] ? new Date(a[property]) : MAX_DATE;
    const dateB = b[property] ? new Date(b[property]) : MAX_DATE;
    
    return dateA.getTime() - dateB.getTime();
  });
}
