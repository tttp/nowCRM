/**
 * useEventCalendar Hook
 *
 * A custom hook for managing calendar event data and operations.
 *
 * Primary Responsibilities:
 * - Managing event data state
 * - Handling CRUD operations
 * - Managing loading states
 * - Basic undo functionality
 * - Error handling with retry options
 * - Toast notifications
 * - Debounced date range changes
 *
 * Key Features:
 * 1. State Management
 *    - Event data storage using useState
 *    - Loading states for async operations
 *    - Last operation tracking for undo
 *
 * 2. Data Operations
 *    - Add events with optimistic updates
 *    - Update existing events
 *    - Delete events
 *    - Debounced date range based event fetching
 *    - Basic error handling for all operations
 *
 * 3. User Feedback
 *    - Success toast notifications
 *    - Error toast notifications
 *    - Undo options for add/update/delete
 *    - Retry options for failed operations
 *
 * 4. Performance Optimizations
 *    - Debounced view/date change handlers to prevent excessive API calls
 *    - Configurable debounce timeout through config.events.debounceTimeOnViewOrDateChange
 */

import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  CalendarEventType,
  EventCalendarConfigType,
  EventCalendarTranslations,
} from "../types";
import { enUS } from "../locales/en";
import { useDebounce } from "./utils/useDebounce";

export interface EventCalendarHookConfig {
  events?: {
    allowUserRetryAfterFailure?: boolean;
    debounceTimeOnViewOrDateChange?: number;
  };
  calendarConfig?: EventCalendarConfigType;
}

export interface EventCalendarHookProps {
  config?: EventCalendarHookConfig;
  initialEvents?: CalendarEventType[];
  onEventAdd?: (
    event: Omit<CalendarEventType, "id">
  ) => Promise<CalendarEventType>;
  onEventUpdate?: (event: CalendarEventType) => Promise<CalendarEventType>;
  onEventDelete?: (eventId: string) => Promise<void>;
  onDateRangeChange?: (
    startDate: Date,
    endDate: Date,
    signal?: AbortSignal
  ) => Promise<CalendarEventType[]>;
}

export interface EventCalendarHookReturn {
  events: CalendarEventType[];
  isLoading: boolean;
  addEvent: (
    newEvent: Omit<CalendarEventType, "id">,
    isUndo?: boolean
  ) => Promise<void>;
  updateEvent: (event: CalendarEventType, isUndo?: boolean) => Promise<void>;
  deleteEvent: (eventId: string, isUndo?: boolean) => Promise<void>;
  onViewOrDateChange: (startDate: Date, endDate: Date) => Promise<void>;
}

export function useEventCalendar({
  config = {},
  initialEvents = [],
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  onDateRangeChange,
}: EventCalendarHookProps): EventCalendarHookReturn {
  // State
  const [events, setEvents] = useState<CalendarEventType[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(false);
  const currentFetchRef = useRef<AbortController | null>(null);
  const lastAddedEventRef = useRef<CalendarEventType | null>(null);
  const localization: EventCalendarTranslations =
    config.calendarConfig?.localization || enUS;

  // Event Actions
  const addEvent = async (
    newEvent: Omit<CalendarEventType, "id">,
    isUndo?: boolean
  ) => {
    let addedEvent: CalendarEventType;
    try {
      if (onEventAdd) {
        addedEvent = await onEventAdd(newEvent);
      } else {
        addedEvent = {
          ...newEvent,
          id:
            Date.now().toString() + Math.random().toString(36).substring(2, 7),
        };
      }

      setEvents((prevEvents) => [...prevEvents, addedEvent]);
      lastAddedEventRef.current = addedEvent;

      if (!isUndo) {
        toast.success(localization.eventAdded, {
          action: {
            label: localization.undo,
            onClick: () => deleteEvent(addedEvent.id, true),
          },
        });
      } else {
        toast.success(localization.eventRestored);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(
        localization.failedToAddEvent,
        config.events?.allowUserRetryAfterFailure !== false
          ? {
              action: {
                label: localization.tryAgain,
                onClick: () => addEvent(newEvent, isUndo),
              },
            }
          : undefined
      );
    }
  };

  const updateEvent = async (
    updatedEvent: CalendarEventType,
    isUndo?: boolean
  ) => {
    try {
      if (onEventUpdate) {
        await onEventUpdate(updatedEvent);
      }
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );

      if (!isUndo) {
        toast.success(localization.eventUpdated, {
          action: {
            label: localization.undo,
            onClick: () =>
              updateEvent(events.find((e) => e.id === updatedEvent.id)!, true),
          },
        });
      } else {
        toast.success(localization.eventRestored);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(
        localization.failedToUpdateEvent,
        config.events?.allowUserRetryAfterFailure !== false
          ? {
              action: {
                label: localization.tryAgain,
                onClick: () => updateEvent(updatedEvent, isUndo),
              },
            }
          : undefined
      );
    }
  };

  const deleteEvent = async (eventId?: string, isUndo?: boolean) => {
    if (!eventId) return;
    const eventToDelete = isUndo
      ? lastAddedEventRef.current
      : events.find((e) => e.id === eventId);

    if (!eventToDelete) {
      console.error(`Event with id ${eventId} not found`);
      return;
    }

    try {
      if (onEventDelete) {
        await onEventDelete(eventId);
      }
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );

      if (!isUndo) {
        toast.success(localization.eventDeleted, {
          action: {
            label: localization.undo,
            onClick: () => addEvent(eventToDelete, true),
          },
        });
      } else {
        toast.success(localization.eventDeleted);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(
        localization.failedToDeleteEvent,
        config.events?.allowUserRetryAfterFailure !== false
          ? {
              action: {
                label: localization.tryAgain,
                onClick: () => deleteEvent(eventId, isUndo),
              },
            }
          : undefined
      );
    }
  };
  // Optional debouncing to avoid spam requests, 300 = 300ms (config.events.debounceTimeOnViewOrDateChange)
  const onViewOrDateChange = useDebounce(
    async (startDate: Date, endDate: Date) => {
      if (!onDateRangeChange) return;

      // Cancel any ongoing fetch
      if (currentFetchRef.current) {
        currentFetchRef.current.abort();
      }

      // Create new abort controller for this fetch
      const abortController = new AbortController();
      currentFetchRef.current = abortController;

      try {
        setIsLoading(true);

        const fetchedEvents = await onDateRangeChange(
          startDate,
          endDate,
          abortController.signal
        );

        // Only update state if this is still the current fetch
        if (currentFetchRef.current === abortController) {
          setEvents((prev) => {
            const byId = new Map<string, CalendarEventType>();
            for (const e of [...prev, ...fetchedEvents]) {
              if (!e.id) continue;
              byId.set(String(e.id), e);
            }
            return Array.from(byId.values());
          });
        }
        
      } catch (error: unknown) {
        // Properly type check for AbortError
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Error fetching events:", error);
        toast.error(
          localization.failedToFetchEvents,
          config.events?.allowUserRetryAfterFailure !== false
            ? {
                action: {
                  label: localization.tryAgain,
                  onClick: () => onViewOrDateChange(startDate, endDate),
                },
              }
            : undefined
        );
      } finally {
        // Only reset loading state if this is still the current fetch
        if (currentFetchRef.current === abortController) {
          setIsLoading(false);
          currentFetchRef.current = null;
        }
      }
    },
    config.events?.debounceTimeOnViewOrDateChange,
    { onDebounce: () => {} }
  );

  return {
    events,
    isLoading,
    addEvent,
    updateEvent,
    deleteEvent,
    onViewOrDateChange,
  };
}
