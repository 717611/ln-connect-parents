import { mockClasswork } from "@/data/mockData";
import type { Classwork } from "@/models";

import { byNewest, resolveMock } from "./repository.utils";

export interface IClassworkRepository {
  listByClassroom(classroomId: string): Promise<Classwork[]>;
  getById(classworkId: string): Promise<Classwork | null>;
}

export const ClassworkRepository: IClassworkRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.classwork),
  //   where("classroomId", "==", classroomId), orderBy("conductedAt", "desc"))
  async listByClassroom(_classroomId) {
    return resolveMock(byNewest(mockClasswork, "conductedAt"));
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.classwork, classworkId))
  async getById(classworkId) {
    return resolveMock(mockClasswork.find((item) => item.id === classworkId) ?? null);
  },
};
