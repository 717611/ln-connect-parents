import type { Classroom, Student } from "@/models";
import {
  StudentRepository,
  type StudentLookupHints,
} from "@/repositories/StudentRepository";

export const studentService = {
  getStudentByParent(parentId: string, hints?: StudentLookupHints): Promise<Student> {
    return StudentRepository.getStudentByParent(parentId, hints);
  },
  getStudentById(studentId: string): Promise<Student> {
    return StudentRepository.getStudentById(studentId);
  },
  getClassroom(classroomId: string): Promise<Classroom> {
    return StudentRepository.getClassroom(classroomId);
  },
};
