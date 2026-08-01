import { COLLECTIONS } from "@/constants/config";
import type { Teacher } from "@/models";

import { getDocById, listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { mapTeacher } from "./firestore/mappers";
import { resolveMock } from "./repository.utils";

export interface ITeacherRepository {
  getById(teacherId: string): Promise<Teacher | null>;
  listByClassroom(classroomId: string): Promise<Teacher[]>;
}

/** Teachers are read-only for parents; mock mode has no teacher directory yet. */
export const TeacherRepository: ITeacherRepository = {
  async getById(teacherId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.teachers, teacherId);
      return raw ? mapTeacher(raw) : null;
    }
    return resolveMock(null);
  },

  async listByClassroom(classroomId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.teachers, [
        where("classroomIds", "array-contains", classroomId),
      ]);
      return docs.map(mapTeacher);
    }
    return resolveMock([]);
  },
};
