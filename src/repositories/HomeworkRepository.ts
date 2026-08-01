import { mockHomework } from "@/data/mockData";
import type { Homework } from "@/models";

import { byNewest, resolveMock } from "./repository.utils";

export interface IHomeworkRepository {
  listByClassroom(classroomId: string): Promise<Homework[]>;
  getById(homeworkId: string): Promise<Homework | null>;
}

export const HomeworkRepository: IHomeworkRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.homework),
  //   where("classroomId", "==", classroomId), orderBy("assignedAt", "desc"))
  async listByClassroom(_classroomId) {
    return resolveMock(byNewest(mockHomework, "assignedAt"));
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.homework, homeworkId))
  async getById(homeworkId) {
    return resolveMock(mockHomework.find((item) => item.id === homeworkId) ?? null);
  },
};
