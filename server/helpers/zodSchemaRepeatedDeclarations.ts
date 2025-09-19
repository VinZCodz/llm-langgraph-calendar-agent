import { z } from "zod";

export const zodCalenderEventProperties = {
    start: z.object({
        dateTime: z.string().describe("Combined date-time value,RFC3339 formatted.Time zone offset required unless time zone is explicitly specified in timeZone."),
        timeZone: z.string().describe("Time zone in which the time is specified.IANA formatted Database name, e.g. 'Europe/Zurich'.")
    }).describe("Event start time (inclusive) nested object."),
    end: z.object({
        dateTime: z.string().describe("Combined date-time value,RFC3339 formatted.Time zone offset required unless time zone is explicitly specified in timeZone."),
        timeZone: z.string().describe("Time zone in which the time is specified.IANA formatted Database name, e.g. 'Europe/Zurich'.")
    }).describe("Event end time (exclusive) nested object."),
    summary: z.string().describe("Title of the event."),
    description: z.string().describe("Description of the event. Can contain HTML. Optional."),
    attendees: z.array(
        z.object({
            email: z.string().describe("Attendee's email address, RFC5322 formatted. Optional."),
            displayName: z.string().describe("The attendee's name, Optional."),
        }).describe("Event end time (exclusive) nested object."),
    ).describe("Event attendees."),
    location: z.string().describe("Geographic location, free-form text. Optional."),
    status: z.string().describe("Status of event.Optional.Values:'confirmed'(default);'tentative'(Event tentatively confirmed);'cancelled'(cancelled, deleted)")
}