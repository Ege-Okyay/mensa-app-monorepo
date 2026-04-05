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
      "it": { "name": "Pasta Aglio e Olio", "description": "Pasta saltata con un soffritto..." },
      "en": { "name": "Pasta with Garlic and Oil", "description": "Pasta tossed with a fragrant..." },
      "tr": { "name": "Sarımsaklı ve Zeytinyağlı Makarna", "description": "Sarımsaklı, zeytinyağlı ve acı..." },
      "allergens": ["Gluten"]
    }
  ],
  "main_courses": [...],
  "side_dishes": [...],
  "specialties_available": false,
  "common_allergens": ["Gluten", "Soy"]
}
```

**TODO:**
- performance enhancments -> scale down images before streaming to gemini
