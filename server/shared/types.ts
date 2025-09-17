export type EventParams = {
    q: string,
    timeMin: string,
    timeMax: string
}

type attendees = {
    email: string
    displayName: string
}

export type EventData = {
    start: {
        dateTime: string
        timeZone: string
    },
    end: {
        dateTime: string
        timeZone: string
    },
    summary: string,
    description: string,
    attendees: attendees[],
    location: string
    status: string
}

export type ChangedEventData = {
    eventId: string,
    updatedEventBody: EventData
}