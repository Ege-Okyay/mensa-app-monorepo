# Mensa App
Monorepo for a web app where users can see their selected mensa menu for that time of the day with an AI generated image that shows what the food may look like + some information about it

## Base Structure

There will be few main components

- **Client web app** -> React Router v7, Tailwind, shadcn, daisyui or some other component library

- **API** -> Typescript, looking to try Hono for something lightweight

- **Menu Scanner** -> Go

- **Database** -> Supabase free tier because it also has 1 GB file storage for the generated images, which will be most likely enough because every day the old images will get deleted

- **Hosting** -> For now Vercel for frontend and API, Supabase for database to host everything without paying anything, Render to host menu scanner because its in Go (may migrate to Typescript if it gives any problems)

- **Security** -> At first rate limiting etc on the API would most likely be enough, but probably gonna need to add Cloudflare or something later because when gone public app will 100% get attacked