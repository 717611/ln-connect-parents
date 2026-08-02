import { COLLECTIONS } from "@/constants/config";
import { mockClasswork } from "@/data/mockData";
import type { Classwork } from "@/models";

import { matchesStudentClass } from "./classFilter";
import { getDocById, listDocs, useFirebase } from "./firestore/firestore.utils";
import { mapClasswork } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface IClassworkRepository {
  listByClassroom(classroomId: string, className?: string | null): Promise<Classwork[]>;
  getById(classworkId: string): Promise<Classwork | null>;
}

export const ClassworkRepository: IClassworkRepository = {
  async listByClassroom(classroomId, className = null) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.classwork);
      const items = docs
        .filter((raw) => matchesStudentClass(raw, classroomId, className))
        .map(mapClasswork);
      return byNewest(items, "conductedAt");
    }
    return resolveMock(byNewest(mockClasswork, "conductedAt"));
  },

  async getById(classworkId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.classwork, classworkId);
      return raw ? mapClasswork(raw) : null;
    }
    return resolveMock(mockClasswork.find((item) => item.id === classworkId) ?? null);
  },
};
