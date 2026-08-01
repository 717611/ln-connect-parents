import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LABELS } from "@/constants/labels";
import { COMPLAINT_CATEGORY_LABEL, type ComplaintCategory, type NewComplaintInput } from "@/models";

const CATEGORY_VALUES = Object.keys(COMPLAINT_CATEGORY_LABEL) as [ComplaintCategory, ...ComplaintCategory[]];

const schema = z.object({
  subject: z.string().trim().min(5, "Please add a short subject"),
  category: z.enum(CATEGORY_VALUES),
  description: z.string().trim().min(15, "Please describe the concern in a little more detail"),
});

type FormValues = z.infer<typeof schema>;

export function ComplaintForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (input: NewComplaintInput) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject: "", category: "academics", description: "" },
  });

  return (
    <form
      onSubmit={form.handleSubmit((values) => onSubmit(values))}
      className="space-y-4"
      noValidate
    >
      <div className="space-y-1.5">
        <Label htmlFor="subject" className="text-xs font-semibold text-muted-foreground">
          {LABELS.complaints.subject}
        </Label>
        <Input
          id="subject"
          placeholder="e.g. Bus arriving late in the morning"
          className="h-11 rounded-2xl bg-background text-sm"
          {...form.register("subject")}
        />
        {form.formState.errors.subject ? (
          <p className="text-xs font-medium text-destructive">
            {form.formState.errors.subject.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground">
          {LABELS.complaints.category}
        </Label>
        <Select
          value={form.watch("category")}
          onValueChange={(value) => form.setValue("category", value as ComplaintCategory)}
        >
          <SelectTrigger className="h-11 rounded-2xl bg-background text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_VALUES.map((category) => (
              <SelectItem key={category} value={category}>
                {COMPLAINT_CATEGORY_LABEL[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-xs font-semibold text-muted-foreground">
          {LABELS.complaints.description}
        </Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="Share the details so the school can help quickly."
          className="rounded-2xl bg-background text-sm"
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-xs font-medium text-destructive">
            {form.formState.errors.description.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:bg-primary/90"
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        {LABELS.complaints.submit}
      </Button>
    </form>
  );
}
