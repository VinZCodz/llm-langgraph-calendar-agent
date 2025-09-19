import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import * as calendar from '../external-api-clients/googleCalenderAPI.ts';
import * as types from "../shared/types.ts"
import * as schema from "../helpers/zodSchemaRepeatedDeclarations.ts"

const searchTool = new TavilySearch({
    maxResults: 3,
    topic: "general",
});

const getCalenderEvents = tool(
    async (payload) => {
        try {
            const calenderEventsList = await calendar.getCalenderEvents(payload as types.EventParams);
            let data = calenderEventsList?.map(_ => {
                return {
                    id: _.id,
                    start: _.start,
                    end: _.end,
                    summary: _.summary,
                    description: _.description,
                    attendees: _.attendees,
                    location: _.location,
                    status: _.status,
                    meetingLink: _.hangoutLink,
                }
            });
            return JSON.stringify(data);
        } catch (error) {
            console.warn(error);
        }
        return "Error occurred! Please try after sometime!";
    },
    {
        name: "getCalenderEvents",
        description: "Call to get calender single or list of events",
        schema: z.object({
            q: z.string().describe("Free text search. Find events matching: summary, description, location, attendee's displayName, organizer's displayName etc."),
            timeMin: z.string().describe("Event end time, Lower bound (exclusive).RFC3339 timestamp, mandatory time zone offset, eg: 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z"),
            timeMax: z.string().describe("Event start time, Upper bound (exclusive).RFC3339 timestamp, mandatory time zone offset, eg: 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z")
        }),
    }
);

const createCalenderEvent = tool(
    async (payload) => {
        try {
            const eventLink = await calendar.createCalenderEvent(payload as types.EventData);
            return `Event Created! link: ${eventLink}`;
        } catch (error) {
            console.warn(error);
        }
        return "Error occurred! Please try after sometime!";
    },
    {
        name: "createCalenderEvent",
        description: "Call to create a single calender event.",
        schema: z.object(schema.zodCalenderEventProperties).describe("New calender event payload."),
        responseFormat: "content_and_artifact",
    }
);

const updateCalenderEvent = tool(
    async (payload) => {
        try {
            const eventLink = await calendar.updateCalenderEvent(payload as types.ChangedEventData);
            console.log(`${eventLink}`);
            return `Event Updated! link: ${eventLink}`;
        } catch (error) {
            console.warn(error);
        }
        return "Error occurred! Please try after sometime!";
    },
    {
        name: "updateCalenderEvent",
        description: "Call to update a single calender event.",
        schema: z.object({
            eventId: z.string().describe("Event identifier."),
            updatedEventBody: z.object(schema.zodCalenderEventProperties).describe("Modified calender event payload: The field changed should replace existing values, all other fields should remain unchanged.")
        }),
        responseFormat: "content_and_artifact",
    }
);

const deleteCalenderEvent = tool(
    async (payload) => {
        try {
            await calendar.deleteCalenderEvent(payload as string);
            return `Event Deleted!`;
        } catch (error) {
            console.warn(error);
        }
        return "Error occurred! Please try after sometime!";
    },
    {
        name: "deleteCalenderEvent",
        description: "Call to delete a single calender event.",
        schema: z.object({
            eventId: z.string().describe("Event identifier.")
        }),
        responseFormat: "content_and_artifact",
    }
);

export const autonomousTools = [
    searchTool,
    getCalenderEvents,
    createCalenderEvent,
    updateCalenderEvent,
];

export const sensitiveTools = [
    deleteCalenderEvent,
];