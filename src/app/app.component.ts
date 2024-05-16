import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditElementDialogComponent } from './edit-element-dialog/edit-element-dialog.component';

interface Element {
  id: number;
  name: string;
  top: string;
  left: string;
}

interface Connection {
  from: Element;
  to: Element;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connections: Connection[] = [];
  elements: Element[] = [];
  nextId = 0;
  currentPosition: { [id: number]: { top: string, left: string } } = {};

  constructor(public dialog: MatDialog) {}


  

  addElement(x: number=10, y: number=10) {
    
    const newElement: Element = {
      id: this.nextId++,
      name: 'New Element',
      top: `${y}px`,
      left: `${x}px`,
    };
    this.elements.push(newElement);
  }

  editElement(element: Element) {
    const dialogRef = this.dialog.open(EditElementDialogComponent, {
      width: '250px',
      data: { name: element.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        element.name = result;
      }
    });
  }

  deleteElement(element: Element) {
    const index = this.elements.indexOf(element);
    if (index > -1) {
      this.elements.splice(index, 1);
    }
  }

  dragMoved(event: CdkDragMove, element: Element) {
    const { x, y } = event.pointerPosition;
    this.currentPosition[element.id] = {
      top: `${y}px`,
      left: `${x}px`,
    };
  }

  drop(event: CdkDragDrop<Element[]>) {
    const element = this.elements[event.previousIndex];
    if (this.currentPosition[element.id]) {
      element.top = this.currentPosition[element.id].top;
      element.left = this.currentPosition[element.id].left;
    }
    moveItemInArray(this.elements, event.previousIndex, event.currentIndex);
  }

  addConnection(from: Element, to: Element) {
    this.connections.push({ from, to });
  }
}

