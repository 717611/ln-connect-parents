import { mockComplaintMessages, mockComplaints } from "@/data/mockData";
import type { Complaint, ComplaintMessage, NewComplaintInput } from "@/models";

import { byNewest, clone, resolveMock } from "./repository.utils";

export interface IComplaintRepository {
  listByStudent(studentId: string): Promise<Complaint[]>;
  getById(complaintId: string): Promise<Complaint | null>;
  listMessages(complaintId: string): Promise<ComplaintMessage[]>;
  create(studentId: string, input: NewComplaintInput): Promise<Complaint>;
  sendMessage(complaintId: string, authorName: string, body: string): Promise<ComplaintMessage>;
}

/** In-memory session store so the UI behaves realistically before Firestore. */
const localComplaints: Complaint[] = clone(mockComplaints);
const localMessages: ComplaintMessage[] = clone(mockComplaintMessages);

export const ComplaintRepository: IComplaintRepository = {
  // TODO(firebase): query(collection(db, COLLECTIONS.complaints),
  //   where("studentId", "==", studentId), orderBy("updatedAt", "desc"))
  async listByStudent(_studentId) {
    return resolveMock(byNewest(localComplaints, "updatedAt"));
  },

  // TODO(firebase): getDoc(doc(db, COLLECTIONS.complaints, complaintId))
  async getById(complaintId) {
    return resolveMock(localComplaints.find((item) => item.id === complaintId) ?? null);
  },

  // TODO(firebase): collection(db, COLLECTIONS.complaints, complaintId, COLLECTIONS.complaintMessages)
  async listMessages(complaintId) {
    const messages = localMessages
      .filter((message) => message.complaintId === complaintId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    return resolveMock(messages);
  },

  // TODO(firebase): addDoc(collection(db, COLLECTIONS.complaints), payload)
  async create(studentId, input) {
    const now = new Date().toISOString();
    const sequence = 25 + localComplaints.length;
    const complaint: Complaint = {
      id: `cmp-${sequence}`,
      ticketNumber: `CMP-0${sequence}`,
      studentId,
      subject: input.subject,
      description: input.description,
      category: input.category,
      status: "open",
      createdAt: now,
      updatedAt: now,
      messageCount: 1,
    };
    localComplaints.unshift(complaint);
    localMessages.push({
      id: `msg-${localMessages.length + 1}`,
      complaintId: complaint.id,
      authorRole: "parent",
      authorName: "You",
      body: input.description,
      sentAt: now,
    });
    return resolveMock(complaint);
  },

  // TODO(firebase): addDoc(messages subcollection) + updateDoc(parent complaint)
  async sendMessage(complaintId, authorName, body) {
    const now = new Date().toISOString();
    const message: ComplaintMessage = {
      id: `msg-${localMessages.length + 1}`,
      complaintId,
      authorRole: "parent",
      authorName,
      body,
      sentAt: now,
    };
    localMessages.push(message);
    const complaint = localComplaints.find((item) => item.id === complaintId);
    if (complaint) {
      complaint.updatedAt = now;
      complaint.messageCount += 1;
    }
    return resolveMock(message);
  },
};
