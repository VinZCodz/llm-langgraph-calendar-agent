import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import * as calendar from '../external-api-clients/googleCalenderAPI.ts';
import * as types from "../shared/types.ts"
import { en } from "zod/locales";

const searchTool = new TavilySearch({
    maxResults: 3,
    topic: "general",
});

const getCalenderEvents = tool(
    async (parameters) => {
        try {
            const calenderEventsList = await calendar.getCalenderEvents(parameters as types.getCalenderEventsQueryParams);
            let data = calenderEventsList?.map(_ => {
                return {
                    id: _.id,
                    summary: _.summary,
                    status: _.status,
                    organizer: _.organizer,
                    start: _.start,
                    end: _.end,
                    meetingLink: _.hangoutLink,
                    description: _.description
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
    async () => {
        try {
           
            calender.createCalenderEvent({
                date: date,
                subject: subject,
                description: description
            });
            return "Event Created!";
        } catch (error) {
            return error;
        }
    },
    {
        name: "createCalenderEvent",
        description: "Call to create the calender events.",
        schema: z.object({
            // date: z.string().describe("The event date in ISO string format:YYYY-MM-DD, to be used in calender event create."),
            // subject: z.string().describe("The event subject, to be used in calender event create."),
            // description: z.string().describe("The event description, to be used in calender event create."),
        }),
    }
);

export const availableTools = [
    searchTool,
    getCalenderEvents,
    createCalenderEvent,
];