import { Injectable } from '@angular/core'
import { BehaviorSubject, combineLatest, map } from 'rxjs'
import { Book } from '../interfaces/book.interface'

@Injectable()
export class BooksService {
  private booksSubject = new BehaviorSubject<Book[]>([
    {
      id: '1',
      name: 'Book 1',
      author: 'Scott',
      company: 'Company 1',
      details: 'Additional info',
      year: 1920,
    },
    {
      id: '2',
      name: 'Book 2',
      author: 'George',
      company: 'Company 2',
      details: 'Additional info',
      year: 1949,
    },
    {
      id: '3',
      name: 'Book 3',
      author: 'Petro',
      company: 'Company 3',
      details: 'Additional info',
      year: 1960,
    },
    {
      id: '4',
      name: 'Book 4',
      author: 'Saimon',
      company: 'Company 4',
      details: 'Additional info',
      year: 1950,
    },
    {
      id: '5',
      name: 'Book 5',
      author: 'Ivan',
      company: 'Company 5',
      details: 'Additional info',
      year: 1990,
    },
  ]);
  private searchTermSubject = new BehaviorSubject<string>('');

  readonly books$ = this.booksSubject.asObservable();
  readonly filteredBooks$ = combineLatest([this.books$, this.searchTermSubject]).pipe(
    map(([books, searchTerm]) => {
      if (!searchTerm.trim()) {
        return books;
      }
      const term = searchTerm.toLowerCase().trim();
      return books.filter((book) => book.name.toLowerCase().includes(term) || book.author.toLowerCase().includes(term));
    }),
  )

  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term || '');
  }

  addBook(book: Book): void {
    const currentBooks = this.booksSubject.value;
    this.booksSubject.next([{ ...book, id: crypto.randomUUID() }, ...currentBooks]);
  }

  updateBook(id: string, book: Partial<Book>): void {
    const currentBooks = this.booksSubject.value;
    this.booksSubject.next(currentBooks.map((b) => (b.id === id ? { ...b, ...book } : b)));
  }

  deleteBook(id: string): void {
    const currentBooks = this.booksSubject.value;
    this.booksSubject.next(currentBooks.filter((b) => b.id !== id));
  }

  uploadBookImage(bookId: string, file: File): void {
    const imageUrl = URL.createObjectURL(file);
    this.updateBook(bookId, { imageUrl });
  }
}
