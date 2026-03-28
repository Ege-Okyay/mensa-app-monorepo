# Menu Scraper 

Go service that scrapes menu images from a third party Instagram story viewer, processes concurrently, and uses Gemini to extract structured, localized data.

## Tech Stack
- **fiber**: Fast HTTP framework for the API.
- **Gemini (google/genai)**: Image-to-JSON parsing.
- **goquery**: For parsing HTML and extracting image sources.
- **Concurrency**: Goroutines and channels to analyze multiple menu images in parallel.

## Response Schema (v2)
The service returns a nested structure for full localization support:

```json
{
  "mensa_name": "Borsellino",
  "first_courses": [
    {
      "it": { "name": "Pasta al forno", "description": "Pasta cotta al forno..." },
      "en": { "name": "Baked Pasta", "description": "Oven-baked pasta with..." },
      "tr": { "name": "Fırın Makarna", "description": "Fırında pişirilmiş..." },
      "allergens": ["Gluten", "Milk"]
    }
  ],
  "main_courses": [...],
  "side_dishes": [...],
  "specialties_available": false
}
```

**TODO:**
- ageneral allergens information without going into the details for every food
- implement x-api-key type of security between hono api and scraper
- pig meat gets translated as normal meat for example "Rosticciata" -> "Roast meat" and "Kızartılmış et" (analysis_v3)
- performance enhancments