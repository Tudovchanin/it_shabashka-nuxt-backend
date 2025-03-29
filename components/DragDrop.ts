class DragDrop {
  dropZoneElement: HTMLElement;
  draggedItem: HTMLElement;
  classDragItem: string;

  selectedElem: HTMLElement | null = null;


  valueTransformX = 0;
  valueTransformY = 0;
  clickX = 0;
  clickY = 0;

  constructor(
    dropZoneElement: HTMLElement,
    draggedItem: HTMLElement,
    classDragItem: string
  ) {
    this.dropZoneElement = dropZoneElement;
    this.draggedItem = draggedItem;
    this.classDragItem = classDragItem;
  }

  dragStart(e: any) {
    if (this.draggedItem.contains(e.target)) {
      this.selectedElem = this.draggedItem;
      if(!this.selectedElem ) return;
      this.clickX = e.clientX;
      this.clickY = e.clientY;
    }
  }

  dragMove(e:any) {
    if(this.selectedElem) return;
  }

}