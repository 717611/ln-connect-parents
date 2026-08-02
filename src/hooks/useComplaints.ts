import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { APP_CONFIG } from "@/constants/config";
import type { ComplaintStudentContext, NewComplaintInput } from "@/models";
import { complaintService } from "@/services/complaintService";

import { queryKeys } from "./queryKeys";

export function useComplaints(studentId: string | null) {
  return useQuery({
    queryKey: queryKeys.complaints(studentId ?? "none"),
    queryFn: () => complaintService.listByStudent(studentId!),
    enabled: Boolean(studentId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useComplaint(complaintId: string) {
  return useQuery({
    queryKey: queryKeys.complaint(complaintId),
    queryFn: () => complaintService.getById(complaintId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useComplaintMessages(complaintId: string) {
  return useQuery({
    queryKey: queryKeys.complaintMessages(complaintId),
    queryFn: () => complaintService.listMessages(complaintId),
    staleTime: APP_CONFIG.queryStaleTimeMs,
  });
}

export function useCreateComplaint(studentId: string | null, context?: ComplaintStudentContext) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NewComplaintInput) => complaintService.create(studentId!, input, context),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaints(studentId ?? "none") });
    },
  });
}

export function useSendComplaintMessage(complaintId: string, studentId: string | null, authorName: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => complaintService.sendMessage(complaintId, authorName, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaintMessages(complaintId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaint(complaintId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.complaints(studentId ?? "none") });
    },
  });
}
