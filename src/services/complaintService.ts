import type { Complaint, ComplaintMessage, ComplaintStudentContext, NewComplaintInput } from "@/models";
import {
  ComplaintRepository,
  type ComplaintThread,
} from "@/repositories/ComplaintRepository";

export type { ComplaintThread };

export const complaintService = {
  listByStudent(studentId: string): Promise<Complaint[]> {
    return ComplaintRepository.listByStudent(studentId);
  },
  async listActive(studentId: string): Promise<Complaint[]> {
    const complaints = await ComplaintRepository.listByStudent(studentId);
    return complaints.filter((item) => item.status === "open" || item.status === "in_progress");
  },
  getById(complaintId: string): Promise<Complaint | null> {
    return ComplaintRepository.getById(complaintId);
  },
  listMessages(complaintId: string): Promise<ComplaintMessage[]> {
    return ComplaintRepository.listMessages(complaintId);
  },
  subscribeThread(complaintId: string, onChange: (thread: ComplaintThread) => void): () => void {
    return ComplaintRepository.subscribeThread(complaintId, onChange);
  },

  subscribeByStudent(studentId: string, onChange: (complaints: Complaint[]) => void): () => void {
    return ComplaintRepository.subscribeByStudent(studentId, onChange);
  },

  create(
    studentId: string,
    input: NewComplaintInput,
    context?: ComplaintStudentContext,
  ): Promise<Complaint> {
    return ComplaintRepository.create(studentId, input, context);
  },
  sendMessage(complaintId: string, authorName: string, body: string): Promise<ComplaintMessage> {
    return ComplaintRepository.sendMessage(complaintId, authorName, body);
  },
};
