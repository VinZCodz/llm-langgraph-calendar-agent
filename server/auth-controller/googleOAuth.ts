import express from 'express';
import { google } from 'googleapis';
import url from 'url'

const app = express();
const port = 3600;

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.AUTH_CALLBACK_ROUTE
);

app.get('/authorizeapp', async (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar'
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'online', //set 'offline' if need long time access.
        prompt: 'consent',
        scope: scopes,
        include_granted_scopes: true,
    });

    res.redirect(authorizationUrl);
});

app.get('/oauth2callback', async (req, res) => {
    let q = url.parse(req.url, true).query;

    if (q.error) {
        console.log('Error:' + q.error);
    } else {
        let { tokens } = await oauth2Client.getToken(q.code as string);
        console.log(`Copy the below ACCESS_TOKEN key value pair into your .env file \n\nACCESS_TOKEN=${tokens.access_token}`);
        //oauth2Client.setCredentials(tokens);
    }
    res.send("Token obtained! Please close this tab.")
});

app.listen(port, () => {
    console.log(`Auth Server up and running at port: ${port}`)
});