export interface Teacher {
  id: string;
  fullName: string;
  photoUrl: string | null;
  subjectIds: string[];
  designation: string;
}
