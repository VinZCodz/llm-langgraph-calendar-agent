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

const getCalenderEvents = async ({ q, timeMin, timeMax }: types.EventParams) => {
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

const createCalenderEvent = async ({ start, end, summary, description, attendees, location, status }: types.EventData) => {
    const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
            start: start,
            end: end,
            summary: summary,
            description: description,
            attendees: attendees,
            location: location,
            status: status
        }
    });
    return response.data.htmlLink;
}

const updateCalenderEvent = async ({ eventId, updatedEventBody }: types.ChangedEventData) => {
    const response = await calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        requestBody: updatedEventBody
    });
    return response.data.htmlLink;
}

const deleteCalenderEvent = async ( eventId : string) => {
    await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
    });
}

export {
    getCalenderEvents,
    createCalenderEvent,
    updateCalenderEvent,
    deleteCalenderEvent,
}