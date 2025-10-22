import { z } from "zod"
import type { EventCalendarTranslations } from "./EventCalendarTranslations"

export const eventFormSchema = (translations: EventCalendarTranslations) => {
  return z.object({
    id: z.string().optional(),
    name: z.string().min(1, translations.validations.eventNameRequired),
    description: z.string().optional(),
    status: z.string().optional(),
    publish_date: z.date(),
    color: z.string().min(1, translations.validations.colorRequired),
    channel:
      z.object
      ({ label: z.string(), value: z.string() }).optional(),
    composition:    z.object
    ({ label: z.string(), value: z.string() }).optional(),
    send_to: z
      .object({
        type: z.enum(["contact", "list", "organization"]),
        send_data: z.union([
          z.string(),
          z.object({
            label: z.string(),
            value: z.coerce.string(),
          }),
        ]).optional(),
        identity:  z.object({
          label: z.string(),
          value: z.coerce.string(),
        }).optional(),
      })
      .optional(),
  })
}

export type CalendarEventType = z.infer<ReturnType<typeof eventFormSchema>>
