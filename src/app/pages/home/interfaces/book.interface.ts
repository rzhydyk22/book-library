import { FormControl } from '@angular/forms'

export interface Book extends BookFormValues {
  id: string;
}

interface BookFormValues {
  name: string;
  author: string;
  year: number | null;
  company: string;
  details: string;
  imageUrl?: string;
}

export type BookFormControls = {
  [K in keyof BookFormValues]: FormControl<BookFormValues[K]>;
}
