# Menu Scraper 

Go service that scrapes menu images from a third party Instagram story viewer, processes concurrently, and uses Gemini to extract structured, localized data.

## Tech Stack
- **fiber**: Fast HTTP framework for the API.
- **Gemini (google/genai)**: Image-to-JSON parsing.
- **goquery**: For parsing HTML and extracting image sources.
- **Concurrency**: Goroutines and channels to analyze multiple menu images in parallel.

**TODO:**
- hash the image url (or the bytes), skip calling gemini if found before