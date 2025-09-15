import { z } from "zod";
import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";

const searchTool = new TavilySearch({
    maxResults: 3,
    topic: "general",
});
const getCalenderEventsByDate = tool(
    async () => {
        return "Dummy Event!"
        //JSON.stringify(calender.getCalenderEventsByDate(date));
    },
    {
        name: "getCalenderEventsByDate",
        description: "Call to get the calender events.",
        schema: z.object({
            // date: z.string().describe("The event date in ISO string format:YYYY-MM-DD, to be used in calender event search."),
        }),
    }
);

const createCalenderEvent = tool(
    async () => {
        try {
            // calender.createCalenderEvent({
            //     date: date,
            //     subject: subject,
            //     description: description
            // });
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
    getCalenderEventsByDate,
    createCalenderEvent,
];