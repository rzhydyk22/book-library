import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { Book } from '../interfaces/book.interface'

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent {
  @Input() books: Book[] | null = [];
  @Output() bookSelected = new EventEmitter<Book>();
  @Output() bookDeleted = new EventEmitter<string>();
  @Output() imageUploaded = new EventEmitter<{ bookId: string, file: File }>();

  onImageUploadClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: Event, bookId: string): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files?.length) {
      const file = fileInput.files[0];
      this.imageUploaded.emit({ bookId, file });
    }
  }
}
