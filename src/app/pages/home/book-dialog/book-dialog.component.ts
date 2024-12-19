import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatTooltipModule } from '@angular/material/tooltip'
import { Book, BookFormControls } from '../interfaces/book.interface'

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
})
export class BookDialogComponent {
  private fb = inject(FormBuilder)
  protected dialogRef = inject(MatDialogRef<BookDialogComponent>)
  protected data: Book | null = inject(MAT_DIALOG_DATA)

  protected bookForm = this.fb.group<BookFormControls>({
    name: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    author: this.fb.control('', { nonNullable: true, validators: [Validators.required] }),
    year: this.fb.control(null, { validators: [Validators.required, Validators.min(1000)] }),
    company: this.fb.control('', { nonNullable: true }),
    details: this.fb.control('', { nonNullable: true }),
  })

  ngOnInit(): void {
    this.initializeForm()
  }

  private initializeForm(): void {
    if (this.data) {
      this.bookForm.patchValue(this.data)
    }
  }

  save(): void {
    if (this.bookForm.valid) {
      const formValue = this.bookForm.getRawValue()
      this.dialogRef.close(formValue)
    }
  }
}
