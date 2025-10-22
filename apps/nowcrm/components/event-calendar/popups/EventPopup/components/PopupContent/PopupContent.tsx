"use client"

import type React from "react"

import type { z } from "zod"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CalendarDays, CalendarPlus, Loader2, Trash2, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EVENT_COLOR_OPTIONS } from "@/components/event-calendar/constants/eventColors"
import type { CalendarEventType, EventCalendarTranslations } from "@/components/event-calendar/types"
import { eventFormSchema } from "@/components/event-calendar/types/CalendarEventType"
import { AsyncSelect } from "@/components/autoComplete/AsyncSelect"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Option } from "@/components/autoComplete/autoComplete"

interface EventPopupContent {
  event?: Partial<CalendarEventType>
  onAddEvent: (event: Omit<CalendarEventType, "id">) => void
  onUpdateEvent?: (event: CalendarEventType) => void
  onDeleteEvent?: (eventId: string) => void
  onClosePopup?: () => void
  open?: boolean
  dateFromViewClick?: Date
  translations: EventCalendarTranslations
}

export const EventPopupContent: React.FC<EventPopupContent> = ({
  event,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onClosePopup,
  open,
  dateFromViewClick,
  translations,
}) => {
  const [isSaving, setIsSaving] = useState(false)
  const [datetimeOpen, setDatetimeOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("contact");
  const [isDeleting, setIsDeleting] = useState(false)
  const getDefaultValues = (): CalendarEventType => ({
    id: event?.id || "",
    name: event?.name || "",
    description: event?.description || "",
    publish_date: event?.publish_date || dateFromViewClick || new Date(),
    color: event?.color || "blue",
    channel: event?.channel,         
    composition: event?.composition, 
    send_to: event?.send_to
  })
  const form = useForm<CalendarEventType>({
    resolver: zodResolver(eventFormSchema(translations)),
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    form.reset({
      name: event?.name || "",
      description: event?.description || "",
      publish_date: event?.publish_date || dateFromViewClick || new Date(),
      color: event?.color || "blue",
      channel: event?.channel,         
      composition: event?.composition, 
      send_to: event?.send_to
    })
  }, [form, open, event, dateFromViewClick])

  if (!translations) {
    console.error("Translations are required for PopupContent")
    return null
  }

  const onSubmit = async (values: z.infer<ReturnType<typeof eventFormSchema>>) => {
    setIsSaving(true)
    try {
      if (!event?.id) {
        // New event
        console.log(values)
        const newEvent: Omit<CalendarEventType, "id"> = {
          name: values.name,
          description: values.description,
          publish_date: values.publish_date,
          color: values.color,
          channel: values.channel,         
          composition: values.composition, 
          send_to: values.send_to, 
        }
        await Promise.resolve(onAddEvent(newEvent))
      } else {
        // Update existing event
        const updatedEvent: CalendarEventType = {
          ...(event as CalendarEventType),
          name: values.name,
          description: values.description,
          publish_date: values.publish_date,
          color: values.color,
          channel: values.channel,         
          composition: values.composition, 
          send_to: values.send_to,
        }
        
        if (onUpdateEvent) {
          await Promise.resolve(onUpdateEvent(updatedEvent))
        }
      }
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("Error saving event")
    } finally {
      setIsSaving(false)
      onClosePopup?.()
    }
  }

  const handleDelete = async () => {
    if (!event?.id) {
      throw Error("Missing Event Id")
    }

    setIsDeleting(true)
    try {
      if (onDeleteEvent) {
        await Promise.resolve(onDeleteEvent(event.id))
      }
    } finally {
      setIsDeleting(false)
      onClosePopup?.()
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px] w-full max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
          <CalendarPlus className="h-5 w-5" />
          {event?.id ? translations.editEvent : translations.addEvent}
          {event?.status && (
            <span
              className={cn(
                "px-2 py-[2px] rounded text-[13px] font-semibold  tracking-wide",
                event.status === "published" && "bg-green-100 text-green-700 dark:bg-green-800/40 dark:text-green-300",
                event.status === "scheduled" && "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300",
                event.status === "processing" && "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
              )}
            >
              {event.status}
            </span>
          )}
        </DialogTitle>

        <DialogDescription className="text-sm sm:text-base">
          {event?.id ? translations.editEventDescription : translations.createEventDescription}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="composition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Composition</FormLabel>
                <FormControl>
                  <AsyncSelect
                    serviceName="compositionService"
                    label="composition"
                    onValueChange={(opt) => field.onChange(opt ? { label: opt.label, value: String(opt.value) } : undefined)}
                    useFormClear={false}
                    formValue={field.value}
                    presetOption={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
  control={form.control}
  name="channel"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Channel</FormLabel>
      <FormControl>
        <AsyncSelect
          serviceName="channelService"
          label="channel"
          presetOption={field.value}
          formValue={field.value}
          onValueChange={(opt) =>
            field.onChange(opt ? { label: opt.label, value: String(opt.value) } : undefined)
          }
          useFormClear={false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
  
/>{(() => {
  const selectedChannel = form.watch("channel")?.label ?? "";
  const isSendableChannel = ["Email", "SMS", "WhatsApp", "Linkedin_Invitations"].includes(selectedChannel);
  if (!isSendableChannel) return null;

  const sendToType = form.watch("send_to")?.type ?? activeTab;
  const sendToIdentity = form.watch("send_to")?.identity;
  const sendToData = form.watch('send_to')?.send_data;
  console.log(sendToType)
  const identityServiceName =
    selectedChannel === "Linkedin_Invitations"
      ? "unipileIdentityService"
      : "identityService";
  return (
    <div className="pt-3 space-y-4">
      <Tabs
        defaultValue={sendToType}
        onValueChange={(value) => {
          setActiveTab(value);
          form.setValue("send_to", {
            type: value as "contact" | "list" | "organization",
            send_data: undefined,
            identity: undefined,
          });
        }}
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>

        {/* CONTACT */}
        <TabsContent value="contact" className="pt-3">
          <FormField
            control={form.control}
            name="send_to.send_data"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter contact email..."
                    {...field}
                    value={field.value as string}
                    onChange={(e) => {
                      form.setValue("send_to", {
                        type: "contact",
                        send_data: e.target.value,
                        identity: sendToIdentity ? sendToIdentity : undefined
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        {/* LIST */}
        <TabsContent value="list" className="pt-3">
          <FormField
            control={form.control}
            name="send_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>List</FormLabel>
                <FormControl>
                  <AsyncSelect
                    serviceName="listService"
                    label="List"
                    presetOption={ sendToType === "organization"
                    ? field.value?.send_data as Option
                    : undefined}
                    formValue={
                      sendToType === "list"
                        ? field.value?.send_data
                        : undefined
                    }
                    onValueChange={(opt) =>{
                      field.onChange(
                        opt
                          ? { type: "list", send_data: opt, identity: sendToIdentity ? sendToIdentity: undefined }
                          : { type: "list", send_data: undefined, identity: sendToIdentity ? sendToIdentity : undefined }
                      )
                    }
                    }
                    useFormClear={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>

        {/* ORGANIZATION */}
        <TabsContent value="organization" className="pt-3">
          <FormField
            control={form.control}
            name="send_to"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <AsyncSelect
                    serviceName="organizationService"
                    label="Organization"
                    presetOption={ sendToType === "organization"
                    ? field.value?.send_data as Option
                    : undefined}
                    formValue={
                      sendToType === "organization"
                        ? field.value?.send_data
                        : undefined
                    }
                    onValueChange={(opt) =>
                      field.onChange(
                        opt
                          ? { type: "organization", send_data: opt, identity: sendToIdentity ? sendToIdentity : undefined }
                          : { type: "organization", send_data: undefined, identity: sendToIdentity ? sendToIdentity : undefined }
                      )
                    }
                    useFormClear={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>

      {/* IDENTITY */}
      <FormField
        control={form.control}
        name="send_to"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Identity</FormLabel>
            <FormControl>
              <AsyncSelect
                serviceName={identityServiceName}
                label="Identity"
                useFormClear={false}
                presetOption={field.value?.identity as Option}
                formValue={field.value?.identity}
                onValueChange={(opt) =>field.onChange(
                  opt
                  ? { type: "organization", send_data: sendToData ? sendToData : undefined, identity: opt }
                  : { type: "organization", send_data: sendToData ? sendToData : undefined, identity: undefined }
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
})()}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter event name" {...field} autoFocus={!event} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter event description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publish_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time</FormLabel>
                <Popover open={datetimeOpen} onOpenChange={setDatetimeOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            <span>{format(field.value, "PPP")}</span>
                            <Clock className="h-3 w-3" />
                            <span>{format(field.value, "HH:mm")}</span>
                          </div>
                        ) : (
                          <span>Pick date and time</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            // Preserve the time when selecting a new date
                            const currentTime = field.value || new Date()
                            const newDateTime = new Date(date)
                            newDateTime.setHours(currentTime.getHours())
                            newDateTime.setMinutes(currentTime.getMinutes())
                            field.onChange(newDateTime)
                          }
                        }}
                        defaultMonth={field.value || new Date()}
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <Label className="text-sm font-medium">Time</Label>
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={field.value ? format(field.value, "HH:mm") : "09:00"}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":")
                            const newDateTime = new Date(field.value || new Date())
                            newDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
                            field.onChange(newDateTime)
                          }}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" size="sm" onClick={() => setDatetimeOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_COLOR_OPTIONS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full mr-2 ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between items-center w-full">
            {event?.id && (
              <div className="w-full sm:w-auto">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isDeleting}
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="w-full gap-1 h-10 sm:w-auto bg-red-600 dark:bg-red-800 hover:bg-red-500 dark:hover:bg-red-900 text-xs sm:text-sm"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {translations.deleting}
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          {translations.delete}
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center">
                        <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                        {translations.confirmDelete}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-left">
                        {translations.confirmDeleteDescription}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{translations.cancel}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="w-full sm:w-auto bg-red-600 dark:bg-red-800 hover:bg-red-500 dark:hover:bg-red-900 sm:text-sm dark:text-white"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        {translations.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClosePopup}
                className="w-full sm:w-1/2 text-xs sm:text-sm bg-transparent"
              >
                {translations.cancel}
              </Button>
              <Button type="submit" className="w-full sm:w-1/2 text-xs sm:text-sm" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {translations.saving}
                  </>
                ) : (
                  translations.save
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
