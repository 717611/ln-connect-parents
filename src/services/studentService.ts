import type { Classroom, Student } from "@/models";
import { StudentRepository } from "@/repositories/StudentRepository";

export const studentService = {
  getStudentByParent(parentId: string): Promise<Student> {
    return StudentRepository.getStudentByParent(parentId);
  },
  getStudentById(studentId: string): Promise<Student> {
    return StudentRepository.getStudentById(studentId);
  },
  getClassroom(classroomId: string): Promise<Classroom> {
    return StudentRepository.getClassroom(classroomId);
  },
};
