import { COLLECTIONS } from "@/constants/config";
import { mockClassroom, mockStudent } from "@/data/mockData";
import type { Classroom, Student } from "@/models";

import { mapClassroom, mapStudent } from "./firestore/mappers";
import { getDocById, listDocs, useFirebase, where } from "./firestore/firestore.utils";
import { resolveMock } from "./repository.utils";

/** Extra identifiers used when the parentId link is missing on the student doc. */
export interface StudentLookupHints {
  admissionNumber?: string | null;
  email?: string | null;
}

export interface IStudentRepository {
  getStudentByParent(parentId: string, hints?: StudentLookupHints): Promise<Student>;
  getStudentById(studentId: string): Promise<Student>;
  getClassroom(classroomId: string): Promise<Classroom>;
}

export const StudentRepository: IStudentRepository = {
  async getStudentByParent(parentId, hints = {}) {
    if (!useFirebase()) return resolveMock(mockStudent);

    const admissionNumber = hints.admissionNumber?.trim() ?? "";
    const email = hints.email?.trim() ?? "";

    // 1. Primary link: students.parentId == parentId
    const byParent = await listDocs(COLLECTIONS.students, [where("parentId", "==", parentId)]);
    if (byParent[0]) return mapStudent(byParent[0]);

    // 2. Fallback: students.parentEmail == signed-in email
    if (email) {
      const byEmail = await listDocs(COLLECTIONS.students, [where("parentEmail", "==", email)]);
      if (byEmail[0]) return mapStudent(byEmail[0]);
    }

    if (admissionNumber) {
      // 3. Fallback: students.admissionNo / admissionNumber == admission number
      for (const field of ["admissionNo", "admissionNumber"]) {
        const byAdmission = await listDocs(COLLECTIONS.students, [
          where(field, "==", admissionNumber),
        ]);
        if (byAdmission[0]) return mapStudent(byAdmission[0]);
      }

      // 4. Fallback: direct document id lookups.
      for (const docId of [`stud_${admissionNumber}`, admissionNumber]) {
        const raw = await getDocById(COLLECTIONS.students, docId);
        if (raw) return mapStudent(raw);
      }
    }

    throw new Error("No student is linked to this parent account.");
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
