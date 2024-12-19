import { Component, DestroyRef, inject, OnInit } from '@angular/core'
import { BookListComponent } from '../book-list/book-list.component'
import { BooksService } from '../services/books.service'
import { MatDialog } from '@angular/material/dialog'
import { BookDialogComponent } from '../book-dialog/book-dialog.component'
import { Book } from '../interfaces/book.interface'
import { AsyncPipe, CommonModule } from '@angular/common'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [
    CommonModule,
    BookListComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  providers: [BooksService],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.scss',
})
export default class BooksPageComponent implements OnInit {
  private dialog = inject(MatDialog)
  private destroyRef = inject(DestroyRef)
  private fb = inject(FormBuilder)
  protected booksService = inject(BooksService)
  protected searchControl: FormControl<string> = this.fb.control('', { nonNullable: true })
  protected books$ = this.booksService.filteredBooks$

  ngOnInit(): void {
    this.listerSearchControl()
  }

  clearSearch(): void {
    this.searchControl.setValue('')
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: Book) => {

      if (result) {
        this.booksService.addBook(result);
      }
    })
  }

  openBookDialog(book: Book): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: book,
    });

    dialogRef.afterClosed().subscribe((result: Book | string) => {
      if (result === 'delete') {
        this.booksService.deleteBook(book.id);
      } else if (result) {
        this.booksService.updateBook(book.id, result as Book);
      }
    })
  }

  deleteBook(id: string): void {
    this.booksService.deleteBook(id);
  }

  onImageUploaded(event: { bookId: string; file: File }): void {
    this.booksService.uploadBookImage(event.bookId, event.file);
  }

  private listerSearchControl(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((term: string) => {
        this.booksService.updateSearchTerm(term)
      })
  }
}
