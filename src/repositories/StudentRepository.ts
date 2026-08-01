import { mockClassroom, mockStudent } from "@/data/mockData";
import type { Classroom, Student } from "@/models";

import { resolveMock } from "./repository.utils";

export interface IStudentRepository {
  getStudentByParent(parentId: string): Promise<Student>;
  getStudentById(studentId: string): Promise<Student>;
  getClassroom(classroomId: string): Promise<Classroom>;
}

export const StudentRepository: IStudentRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.students), where("parentId", "==", parentId))
  async getStudentByParent(_parentId) {
    return resolveMock(mockStudent);
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.students, studentId))
  async getStudentById(_studentId) {
    return resolveMock(mockStudent);
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.classrooms, classroomId))
  async getClassroom(_classroomId) {
    return resolveMock(mockClassroom);
  },
};
