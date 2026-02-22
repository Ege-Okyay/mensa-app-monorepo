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

**TODO:** Generating an image and saving it to Supabase storage