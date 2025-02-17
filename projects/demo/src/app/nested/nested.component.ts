import { NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule } from '@angular/material/legacy-list';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  DndDraggableDirective,
  DndDragImageRefDirective,
  DndDropEvent,
  DndDropzoneDirective,
  DndHandleDirective,
  DndPlaceholderRefDirective,
  DropEffect,
} from 'ngx-drag-drop';

interface NestableListItem {
  content: string;
  disable?: boolean;
  handle?: boolean;
  customDragImage?: boolean;
  children?: NestableListItem[];
}

@Component({
  selector: 'dnd-nested',
  templateUrl: './nested.component.html',
  styleUrls: ['./nested.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    DndPlaceholderRefDirective,
    NgForOf,
    DndDraggableDirective,
    NgIf,
    MatIconModule,
    DndHandleDirective,
    MatLegacyListModule,
    DndDragImageRefDirective,
    DndDropzoneDirective,
    NgTemplateOutlet,
  ],
})
export default class NestedComponent {
  nestableList: NestableListItem[] = [
    {
      content: 'Got something nested',
      children: [
        {
          content: 'Nested',
          customDragImage: true,
          children: [],
        },
      ],
    },
    {
      content: 'No nested dropping here',
    },
    {
      content: 'Got more than one',
      children: [
        {
          content: 'Nested 1',
          handle: true,
          children: [],
        },
        {
          content: 'Nested 2',
          children: [],
        },
        {
          content: 'Nested 3',
          children: [],
        },
      ],
    },
    {
      content: "Drop something, I'll catch!",
      children: [],
    },
  ];

  private currentDraggableEvent?: DragEvent;
  private currentDragEffectMsg?: string;

  constructor(private snackBarService: MatSnackBar) {}

  onDragStart(event: DragEvent) {
    this.currentDragEffectMsg = '';
    this.currentDraggableEvent = event;

    this.snackBarService.dismiss();
    this.snackBarService.open('Drag started!', undefined, { duration: 2000 });
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    this.currentDragEffectMsg = `Drag ended with effect "${effect}"!`;

    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDragEnd(event: DragEvent) {
    this.currentDraggableEvent = event;
    this.snackBarService.dismiss();
    this.snackBarService.open(
      this.currentDragEffectMsg || `Drag ended!`,
      undefined,
      { duration: 2000 }
    );
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  }
}
