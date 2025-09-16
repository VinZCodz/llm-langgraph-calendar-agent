import { google } from "googleapis";
import * as types from "../shared/types.ts"

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.AUTH_CALLBACK_ROUTE
);
oauth2Client.setCredentials({
    access_token: process.env.ACCESS_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const getCalenderEvents = async ({ q, timeMin, timeMax }: types.getCalenderEventsQueryParams) => {
    console.log(`Input Param: ${q} ${timeMin}, ${timeMax}`);

    const result = await calendar.events.list({
        calendarId: 'primary',
        q: q,
        timeMin: timeMin,
        timeMax: timeMax,
        maxAttendees: 5,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    });
    return result.data.items;
}

const createCalenderEvent = async ({summary, start, end, }) => {
    console.log(`Input Param: ${eventDetails}`);

    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {},
    });
    return response.data.htmlLink;
}

export {
    getCalenderEvents,
    createCalenderEvents,

}