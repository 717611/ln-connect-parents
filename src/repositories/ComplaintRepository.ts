import { COLLECTIONS } from "@/constants/config";
import { mockComplaintMessages, mockComplaints } from "@/data/mockData";
import type { Complaint, ComplaintMessage, NewComplaintInput } from "@/models";

import {
  createDoc,
  getDocById,
  listDocs,
  orderBy,
  patchDoc,
  useFirebase,
  where,
} from "./firestore/firestore.utils";
import { mapComplaint, mapComplaintMessage } from "./firestore/mappers";
import { byNewest, clone, resolveMock } from "./repository.utils";

export interface IComplaintRepository {
  listByStudent(studentId: string): Promise<Complaint[]>;
  getById(complaintId: string): Promise<Complaint | null>;
  listMessages(complaintId: string): Promise<ComplaintMessage[]>;
  create(studentId: string, input: NewComplaintInput): Promise<Complaint>;
  sendMessage(complaintId: string, authorName: string, body: string): Promise<ComplaintMessage>;
}

const messagesPath = (complaintId: string) => [
  COLLECTIONS.complaints,
  complaintId,
  COLLECTIONS.complaintMessages,
];

/** In-memory session store so the UI behaves realistically before Firestore. */
const localComplaints: Complaint[] = clone(mockComplaints);
const localMessages: ComplaintMessage[] = clone(mockComplaintMessages);

export const ComplaintRepository: IComplaintRepository = {
  async listByStudent(studentId) {
    if (useFirebase()) {
      const docs = await listDocs(COLLECTIONS.complaints, [
        where("studentId", "==", studentId),
        orderBy("updatedAt", "desc"),
      ]);
      return docs.map(mapComplaint);
    }
    return resolveMock(byNewest(localComplaints, "updatedAt"));
  },

  async getById(complaintId) {
    if (useFirebase()) {
      const raw = await getDocById(COLLECTIONS.complaints, complaintId);
      return raw ? mapComplaint(raw) : null;
    }
    return resolveMock(localComplaints.find((item) => item.id === complaintId) ?? null);
  },

  async listMessages(complaintId) {
    if (useFirebase()) {
      const docs = await listDocs(messagesPath(complaintId), [orderBy("sentAt", "asc")]);
      return docs.map(mapComplaintMessage(complaintId));
    }
    const messages = localMessages
      .filter((message) => message.complaintId === complaintId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    return resolveMock(messages);
  },

  async create(studentId, input) {
    const now = new Date().toISOString();

    if (useFirebase()) {
      const ticketNumber = `CMP-${Date.now().toString().slice(-6)}`;
      const id = await createDoc(COLLECTIONS.complaints, {
        ticketNumber,
        studentId,
        subject: input.subject,
        description: input.description,
        category: input.category,
        status: "open",
        createdAt: now,
        updatedAt: now,
        messageCount: 1,
        source: "parent-portal",
      });
      await createDoc(messagesPath(id), {
        authorRole: "parent",
        authorName: "Parent",
        body: input.description,
        sentAt: now,
      });
      return {
        id,
        ticketNumber,
        studentId,
        subject: input.subject,
        description: input.description,
        category: input.category,
        status: "open",
        createdAt: now,
        updatedAt: now,
        messageCount: 1,
      };
    }

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

  async sendMessage(complaintId, authorName, body) {
    const now = new Date().toISOString();

    if (useFirebase()) {
      const id = await createDoc(messagesPath(complaintId), {
        authorRole: "parent",
        authorName,
        body,
        sentAt: now,
      });
      const existing = await getDocById(COLLECTIONS.complaints, complaintId);
      await patchDoc(COLLECTIONS.complaints, complaintId, {
        updatedAt: now,
        messageCount: (existing ? mapComplaint(existing).messageCount : 0) + 1,
      });
      return { id, complaintId, authorRole: "parent", authorName, body, sentAt: now };
    }

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
