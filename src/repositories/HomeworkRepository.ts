import { COLLECTIONS } from "@/constants/config";
import { mockHomework } from "@/data/mockData";
import type { Homework } from "@/models";

import { getDocById, listDocs, orderBy, useFirebase, where } from "./firestore/firestore.utils";
import { mapHomework } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface IHomeworkRepository {
  listByClassroom(classroomId: string): Promise<Homework[]>;
  getById(homeworkId: string): Promise<Homework | null>;
}

export const HomeworkRepository: IHomeworkRepository = {
  async listByClassroom(classroomId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.homework, [
        where("classroomId", "==", classroomId),
        orderBy("assignedAt", "desc"),
      ]);
      return docs.map(mapHomework);
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
