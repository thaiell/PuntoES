import { atom } from 'nanostores';
import type { UserForm } from '../lib/types';


export const schoolStore = atom<UserForm | null>(null);

/*   console.log(schoolStore) */
export const setSchoolStore = (form: UserForm | null) => { 
/*   console.log(form) */
  schoolStore.set(form);
}

/* schoolStore.listen((value) => {
  console.log('schoolStore updated:', value);
}); */