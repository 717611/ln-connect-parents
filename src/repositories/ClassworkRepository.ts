import { COLLECTIONS } from "@/constants/config";
import { mockClasswork } from "@/data/mockData";
import type { Classwork } from "@/models";

import { getDocById, listDocs, orderBy, useFirebase, where } from "./firestore/firestore.utils";
import { mapClasswork } from "./firestore/mappers";
import { byNewest, resolveMock } from "./repository.utils";

export interface IClassworkRepository {
  listByClassroom(classroomId: string): Promise<Classwork[]>;
  getById(classworkId: string): Promise<Classwork | null>;
}

export const ClassworkRepository: IClassworkRepository = {
  async listByClassroom(classroomId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.classwork, [
        where("classroomId", "==", classroomId),
        orderBy("conductedAt", "desc"),
      ]);
      return docs.map(mapClasswork);
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
