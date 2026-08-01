import type { Homework } from "@/models";
import { HomeworkRepository } from "@/repositories/HomeworkRepository";

export const homeworkService = {
  listByClassroom(classroomId: string): Promise<Homework[]> {
    return HomeworkRepository.listByClassroom(classroomId);
  },
  async listPending(classroomId: string): Promise<Homework[]> {
    const items = await HomeworkRepository.listByClassroom(classroomId);
    return items.filter((item) => item.status !== "submitted");
  },
  getById(homeworkId: string): Promise<Homework | null> {
    return HomeworkRepository.getById(homeworkId);
  },
};
