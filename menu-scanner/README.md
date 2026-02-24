# Menu Scanner
Go with Fiber to build the API, Google's genai for Gemini API, net/http for sending HTTP requests, and goquery to parse HTML data.

### Flow
- Fetches image URLs from view-ig API which returns a JSON with 'html' code
- Extracts images from the HTML
- Runs a goroutine to stream in parallel:
  1. Reads bytes into memory
  2. Send the bytes to Gemini
  3. Receive the response JSON
- Finally return the combined responses as JSON

### Gemini Response Schema
```json
{
  "first_courses": {
    "it": ["Cibo1", "Cibo2", "Cibo3"],
    "en": ["Food1", "Food2", "Food3"],
    "tr": ["Yemek1", "Yemek2", "Yemek3"],
  },
  "main_courses": {
    "it": ["Cibo1", "Cibo2", "Cibo3"],
    "en": ["Food1", "Food2", "Food3"],
    "tr": ["Yemek1", "Yemek2", "Yemek3"],
  },
  "side_dishes": {
    "it": ["Cibo1", "Cibo2", "Cibo3"],
    "en": ["Food1", "Food2", "Food3"],
    "tr": ["Yemek1", "Yemek2", "Yemek3"],
  },
  "specialties_available": true,
}
```

### Gemini Example Response
```json
{
  "first_courses": {
    "it": [
      "Pasta all'ortolana",
      "Pasta con salsiccia, radicchio e gorgonzola",
      "Minestra d'orzo",
      "Pasta/riso in bianco o al pomodoro"
    ],
    "en": [
      "Pasta with garden vegetables",
      "Pasta with sausage, radicchio, and gorgonzola",
      "Barley soup",
      "Pasta or rice plain or with tomato sauce"
    ],
    "tr": [
      "Bahçe sebzeli makarna",
      "Sosisli, radicchio ve gorgonzolalı makarna",
      "Arpa çorbası",
      "Sade veya domates soslu makarna/pirinç"
    ]
  },
  "main_courses": {
    "it": [
      "Polpette di vitello",
      "Sformato di zucca",
      "Mozzarella in carrozza"
    ],
    "en": [
      "Veal meatballs",
      "Zucchini bake",
      "Fried mozzarella"
    ],
    "tr": [
      "Dana köfteleri",
      "Kabak graten",
      "Kızartılmış mozarella"
    ]
  },
  "side_dishes": {
    "it": [
      "Broccoli gratinati",
      "Patate al forno",
      "Insalata mista"
    ],
    "en": [
      "Gratinated broccoli",
      "Baked potatoes",
      "Mixed salad"
    ],
    "tr": [
      "Gratine brokoli",
      "Fırında patates",
      "Karışık salata"
    ]
  },
  "specialties_available": true
}
```

**TODO:** Generating an image and saving it to Supabase storage