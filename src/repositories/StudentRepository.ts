import { COLLECTIONS } from "@/constants/config";
import { mockClassroom, mockStudent } from "@/data/mockData";
import type { Classroom, Student } from "@/models";

import { mapClassroom, mapStudent } from "./firestore/mappers";
import { getDocById, listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { resolveMock } from "./repository.utils";

export interface IStudentRepository {
  getStudentByParent(parentId: string): Promise<Student>;
  getStudentById(studentId: string): Promise<Student>;
  getClassroom(classroomId: string): Promise<Classroom>;
}

export const StudentRepository: IStudentRepository = {
  async getStudentByParent(parentId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.students, [where("parentId", "==", parentId)]);
      const first = docs[0];
      if (!first) throw new Error("No student is linked to this parent account.");
      return mapStudent(first);
    }
    return resolveMock(mockStudent);
  },

  async getStudentById(studentId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.students, studentId);
      if (!raw) throw new Error("Student record not found.");
      return mapStudent(raw);
    }
    return resolveMock(mockStudent);
  },

  async getClassroom(classroomId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.classrooms, classroomId);
      if (!raw) throw new Error("Classroom record not found.");
      return mapClassroom(raw);
    }
    return resolveMock(mockClassroom);
  },
};
