import { COLLECTIONS } from "@/constants/config";
import { mockComplaintMessages, mockComplaints } from "@/data/mockData";
import type {
  Complaint,
  ComplaintMessage,
  ComplaintStudentContext,
  NewComplaintInput,
} from "@/models";

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
  create(
    studentId: string,
    input: NewComplaintInput,
    context?: ComplaintStudentContext,
  ): Promise<Complaint>;
  sendMessage(complaintId: string, authorName: string, body: string): Promise<ComplaintMessage>;
}

/** Tickets live in `helpdesk`; `complaints` is kept as a legacy fallback. */
const TICKET_COLLECTIONS = [COLLECTIONS.helpdesk, COLLECTIONS.complaints] as const;

/** Remembers which collection a ticket came from so replies land in the right thread. */
const ticketCollection = new Map<string, string>();

const messagesPath = (collectionName: string, complaintId: string) => [
  collectionName,
  complaintId,
  COLLECTIONS.complaintMessages,
];

/** Firestore rejects `undefined` values, so drop them before writing. */
const sanitize = <T extends Record<string, unknown>>(payload: T): Record<string, unknown> =>
  JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;

const resolveCollection = async (complaintId: string): Promise<string | null> => {
  const known = ticketCollection.get(complaintId);
  if (known) return known;
  for (const name of TICKET_COLLECTIONS) {
    const raw = await getDocById(name, complaintId);
    if (raw) {
      ticketCollection.set(complaintId, name);
      return name;
    }
  }
  return null;
};

/** In-memory session store so the UI behaves realistically before Firestore. */
const localComplaints: Complaint[] = clone(mockComplaints);
const localMessages: ComplaintMessage[] = clone(mockComplaintMessages);

export const ComplaintRepository: IComplaintRepository = {
  async listByStudent(studentId) {
    if (useFirebase()) {
      const byId = new Map<string, Complaint>();
      for (const name of TICKET_COLLECTIONS) {
        for (const field of ["studentId", "admissionNo"]) {
          try {
            const docs = await listDocs(name, [where(field, "==", studentId)]);
            docs.forEach((raw) => {
              ticketCollection.set(raw.id, name);
              byId.set(raw.id, mapComplaint(raw));
            });
          } catch (error) {
            console.error(`[helpdesk] failed reading ${name} by ${field}`, error);
          }
        }
      }
      return byNewest([...byId.values()], "updatedAt");
    }
    return resolveMock(byNewest(localComplaints, "updatedAt"));
  },

  async getById(complaintId) {
    if (useFirebase()) {
      const name = await resolveCollection(complaintId);
      if (!name) return null;
      const raw = await getDocById(name, complaintId);
      return raw ? mapComplaint(raw) : null;
    }
    return resolveMock(localComplaints.find((item) => item.id === complaintId) ?? null);
  },

  async listMessages(complaintId) {
    if (useFirebase()) {
      const name = (await resolveCollection(complaintId)) ?? COLLECTIONS.helpdesk;
      try {
        const docs = await listDocs(messagesPath(name, complaintId), [orderBy("sentAt", "asc")]);
        return docs.map(mapComplaintMessage(complaintId));
      } catch (error) {
        console.error("[helpdesk] failed reading messages", error);
        const docs = await listDocs(messagesPath(name, complaintId));
        return docs
          .map(mapComplaintMessage(complaintId))
          .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
      }
    }
    const messages = localMessages
      .filter((message) => message.complaintId === complaintId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    return resolveMock(messages);
  },

  async create(studentId, input, context) {
    const now = new Date().toISOString();

    if (useFirebase()) {
      const ticketNumber = `CMP-${Date.now().toString().slice(-6)}`;
      const payload = sanitize({
        ticketNumber,
        subject: input.subject,
        category: input.category,
        description: input.description,
        studentId: studentId || context?.admissionNumber || "",
        studentName: context?.studentName || "Student",
        admissionNo: context?.admissionNumber || "",
        className: context?.className || "",
        status: "open",
        statusLabel: "Pending",
        createdAt: now,
        updatedAt: now,
        messageCount: 1,
        source: "parent-portal",
      });

      try {
        const id = await createDoc(COLLECTIONS.helpdesk, payload);
        ticketCollection.set(id, COLLECTIONS.helpdesk);
        await createDoc(
          messagesPath(COLLECTIONS.helpdesk, id),
          sanitize({
            authorRole: "parent",
            authorName: context?.studentName ? `Parent of ${context.studentName}` : "Parent",
            body: input.description,
            sentAt: now,
          }),
        );
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
      } catch (error) {
        console.error("[helpdesk] failed to submit request", error);
        throw error instanceof Error ? error : new Error("Failed to submit request.");
      }
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
      const name = (await resolveCollection(complaintId)) ?? COLLECTIONS.helpdesk;
      try {
        const id = await createDoc(
          messagesPath(name, complaintId),
          sanitize({ authorRole: "parent", authorName, body, sentAt: now }),
        );
        const existing = await getDocById(name, complaintId);
        await patchDoc(name, complaintId, {
          updatedAt: now,
          messageCount: (existing ? mapComplaint(existing).messageCount : 0) + 1,
        });
        return { id, complaintId, authorRole: "parent", authorName, body, sentAt: now };
      } catch (error) {
        console.error("[helpdesk] failed to send message", error);
        throw error instanceof Error ? error : new Error("Failed to send message.");
      }
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
