# Yeasty Boys Bread Company

An app for allowing people to sign up to be eligible for my bread lottery. Also includes admin for viewing users and randomly selecting a user to win a loaf of bread that week.

## Uses

- NextJS
- Typescript
- MongoDB
- Resend
- next-iron-session

## Local setup

Set up a Mongo instance on MongoDB Atlas, copy the credentials from there and insert into a new .env file.

If you want to set up mail through Resend:

1. Create a [Resend](https://resend.com) account and API key
2. Verify the `yeastyboysbread.com` domain in Resend (needed to send from `bread@yeastyboysbread.com`)
3. Set `RESEND_API_KEY` in your env file / Vercel project settings
4. Remove the old `SENDGRID_API_KEY` env var if it is still present

Then run
`pnpm install` then `pnpm dev`
