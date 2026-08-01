import type { Complaint, ComplaintMessage, NewComplaintInput } from "@/models";
import { ComplaintRepository } from "@/repositories/ComplaintRepository";

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
  create(studentId: string, input: NewComplaintInput): Promise<Complaint> {
    return ComplaintRepository.create(studentId, input);
  },
  sendMessage(complaintId: string, authorName: string, body: string): Promise<ComplaintMessage> {
    return ComplaintRepository.sendMessage(complaintId, authorName, body);
  },
};
