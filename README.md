# Mensa App

A monorepo for a web application that digitizes Mensa menus. The app uses Gemini to parse menu images, translate them, and generate visual previews of the dishes (work in progress).

## Project Structure

- **`web-app`**: Frontend built with React Router v7.
- **`api`**: Backend service to bridge the database and the frontend (Node.js/TypeScript).
- **`menu-scraper`**: A Go service that fetches menu images, uses Gemini to parse the text into structured data, and handles translations.
- **`supabase`**: Handles our database (Postgres) and storage for AI-generated images.

## Current Tech Stack

- **Frontend**: React Router, Tailwind CSS, daisyUI component library.
- **Backend**: Hono/Typescript (API) & Go (Scraper).
- **AI**: Gemini for OCR/Translation/Analysis.
- **Infrastructure**: Supabase (DB & Storage), Vercel/Render for hosting.

## How it works (The Flow)
1. The scraper fetches the latest menu image from a third-party instagram story viewer API. 
2. Gemini parses the image to extract dish names, descriptions, and allergens in Italian, English, and Turkish.
3. The structured data is stored in Supabase.
4. (WIP) An AI-generated image is created for each dish to give users a better idea of what they're eating.
5. Users can check the menu on the web app in their preferred language.
