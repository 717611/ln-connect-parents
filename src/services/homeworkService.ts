import type { Homework } from "@/models";
import { HomeworkRepository } from "@/repositories/HomeworkRepository";

export const homeworkService = {
  listByClassroom(classroomId: string, className?: string | null): Promise<Homework[]> {
    return HomeworkRepository.listByClassroom(classroomId, className ?? null);
  },
  async listPending(classroomId: string, className?: string | null): Promise<Homework[]> {
    const items = await HomeworkRepository.listByClassroom(classroomId, className ?? null);
    return items.filter((item) => item.status !== "submitted");
  },
  getById(homeworkId: string): Promise<Homework | null> {
    return HomeworkRepository.getById(homeworkId);
  },
};
