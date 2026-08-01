import type { Classwork } from "@/models";
import { ClassworkRepository } from "@/repositories/ClassworkRepository";

export const classworkService = {
  listByClassroom(classroomId: string): Promise<Classwork[]> {
    return ClassworkRepository.listByClassroom(classroomId);
  },
  getById(classworkId: string): Promise<Classwork | null> {
    return ClassworkRepository.getById(classworkId);
  },
};
