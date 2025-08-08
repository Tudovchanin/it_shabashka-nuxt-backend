

import type { Project } from "#imports";


export function sortDescNumbers<T>(array: T[], property: keyof T): void {
  if (array.length <= 1) return;

  array.sort((a, b) => {
    const valA = a[property];
    const valB = b[property];

    if (typeof valA !== "number" || typeof valB !== "number") {
      throw new Error(`Property ${String(property)} is not of type number on all items.`);
    }

    return (valB as number) - (valA as number);
  });
}

export function sortAscNumbers<T>(array: T[], property: keyof T): void {
  if (array.length <= 1) return;

  array.sort((a, b) => {
    const valA = a[property];
    const valB = b[property];

    if (typeof valA !== "number" || typeof valB !== "number") {
      throw new Error(`Property ${String(property)} is not of type number on all items.`);
    }

    return (valA as number) - (valB as number);
  });
}


export function sortDateDesc<T>(
  array: T[],
  property: keyof T
): void {
  if (array.length <= 1) return;

  const MAX_DATE = new Date(8640000000000000);

  array.sort((a, b) => {
    // Приведение к string|number|Date|null|undefined для конструктора Date
    const valA = a[property] as unknown as string | number | Date | null | undefined;
    const valB = b[property] as unknown as string | number | Date | null | undefined;

    const dateA = valA ? new Date(valA) : MAX_DATE;
    const dateB = valB ? new Date(valB) : MAX_DATE;

    return dateB.getTime() - dateA.getTime();
  });
}

export function sortDateAsc<T>(
  array: T[],
  property: keyof T
): void {
  if (array.length <= 1) return;

  const MAX_DATE = new Date(8640000000000000);

  array.sort((a, b) => {
    // Приведение к string|number|Date|null|undefined для конструктора Date
    const valA = a[property] as unknown as string | number | Date | null | undefined;
    const valB = b[property] as unknown as string | number | Date | null | undefined;

    const dateA = valA ? new Date(valA) : MAX_DATE;
    const dateB = valB ? new Date(valB) : MAX_DATE;

    return dateA.getTime() - dateB.getTime();
  });
}

