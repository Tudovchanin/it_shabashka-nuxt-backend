
export function formatDateToRussianLocale(dateString: string): string {
  const date: Date = new Date(dateString);
  return new Intl.DateTimeFormat('ru').format(date);
}

export function getDaysUntilDeadline(date: string): number {
  const currentDate = new Date().getTime();
  const targetDate = new Date(date).getTime();

  if (isNaN(targetDate)) {
    throw new Error("Invalid date format");
  }

  const differenceInMs = targetDate - currentDate;
  const daysRemaining = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
  return daysRemaining < 0 ? 0 : daysRemaining;
}


// utils/date.js
export function formatDate(dateString:string):string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "-";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const numberDate = String(date.getDate()).padStart(2, "0");

  return `${numberDate}-${month}-${year}`;
}
