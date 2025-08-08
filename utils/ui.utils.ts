


// подсветка колонки под карточкой

 export function hoverInElemUnder({
  x,
  y,
  classHover,
  targetClass,
}: {
  x: number;
  y: number;
  classHover: string;
  targetClass: string;
}): void {
  const elementsUnderCard = document.elementsFromPoint(x, y);

  let activeElement: HTMLElement | null = null;


  for (let index = 0; index < elementsUnderCard.length; index++) {
    const elemUnderCard = elementsUnderCard[index];

    if (elemUnderCard.classList.contains(targetClass)) {
      activeElement = elemUnderCard as HTMLElement;
      break;
    }
  }

  if (activeElement) {
    activeElement.classList.add(classHover);
  }
}