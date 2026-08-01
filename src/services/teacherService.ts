import type { Teacher } from "@/models";
import { TeacherRepository } from "@/repositories/TeacherRepository";

export const teacherService = {
  getById(teacherId: string): Promise<Teacher | null> {
    return TeacherRepository.getById(teacherId);
  },
  listByClassroom(classroomId: string): Promise<Teacher[]> {
    return TeacherRepository.listByClassroom(classroomId);
  },
};
