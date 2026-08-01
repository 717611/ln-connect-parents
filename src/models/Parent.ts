export type ParentRelation = "father" | "mother" | "guardian";

export interface Parent {
  id: string;
  fullName: string;
  relation: ParentRelation;
  mobileNumber: string;
  email: string | null;
  photoUrl: string | null;
  studentIds: string[];
}

export type UserRole = "parent" | "guardian";

export interface AuthUser {
  uid: string;
  parentId: string;
  role: UserRole;
  admissionNumber: string;
  displayName: string;
}

export interface AuthSession {
  user: AuthUser;
  issuedAt: string;
}

export interface LoginCredentials {
  admissionNumber: string;
  password: string;
}
