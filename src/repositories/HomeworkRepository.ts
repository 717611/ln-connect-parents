import { COLLECTIONS } from "@/constants/config";
import { mockHomework } from "@/data/mockData";
import type { Homework } from "@/models";

import { matchesStudentClass } from "./classFilter";
import { getDocById, listDocs, useFirebase } from "./firestore/firestore.utils";
import { mapHomework } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface IHomeworkRepository {
  listByClassroom(classroomId: string, className?: string | null): Promise<Homework[]>;
  getById(homeworkId: string): Promise<Homework | null>;
}

export const HomeworkRepository: IHomeworkRepository = {
  async listByClassroom(classroomId, className = null) {
    if (useFirebase()) {
      // Read without Firestore constraints: class fields differ between School
      // Portal releases, so filtering happens client-side and never returns 0.
      const docs = await listDocs(COLLECTIONS.homework);
      const items = docs
        .filter((raw) => matchesStudentClass(raw, classroomId, className))
        .map(mapHomework);
      return byNewest(items, "assignedAt");
    }
    return resolveMock(byNewest(mockHomework, "assignedAt"));
  },

  async getById(homeworkId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.homework, homeworkId);
      return raw ? mapHomework(raw) : null;
    }
    return resolveMock(mockHomework.find((item) => item.id === homeworkId) ?? null);
  },
};
