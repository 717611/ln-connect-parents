import type { Classwork } from "@/models";
import { ClassworkRepository } from "@/repositories/ClassworkRepository";

export const classworkService = {
  listByClassroom(classroomId: string, className?: string | null): Promise<Classwork[]> {
    return ClassworkRepository.listByClassroom(classroomId, className ?? null);
  },
  getById(classworkId: string): Promise<Classwork | null> {
    return ClassworkRepository.getById(classworkId);
  },
};
