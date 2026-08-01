import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HELP_DESK_FAQS } from "@/constants/helpDesk";

export function HelpDeskFaqs() {
  return (
    <div className="surface-card px-4 py-1">
      <Accordion type="single" collapsible className="w-full">
        {HELP_DESK_FAQS.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id} className="border-border/70 last:border-b-0">
            <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
