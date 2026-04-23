package gemini

import "google.golang.org/genai"

func GetMenuResponseSchema() *genai.Schema {
	localizedDishSchema := &genai.Schema{
		Type: genai.TypeObject,
		Properties: map[string]*genai.Schema{
			"name":        {Type: genai.TypeString},
			"description": {Type: genai.TypeString},
		},
		Required: []string{"name", "description"},
	}

	menuItemSchema := &genai.Schema{
		Type: genai.TypeObject,
		Properties: map[string]*genai.Schema{
			"it": localizedDishSchema,
			"en": localizedDishSchema,
			"tr": localizedDishSchema,
			"allergens": {
				Type:  genai.TypeArray,
				Items: &genai.Schema{Type: genai.TypeString},
			},
			"dietary_category": {
				Type: genai.TypeString,
				Enum: []string{"Meat", "Vegetarian", "Vegan"},
			},
		},
		Required: []string{"it", "en", "tr", "allergens", "dietary_category"},
	}

	return &genai.Schema{
		Type: genai.TypeObject,
		Properties: map[string]*genai.Schema{
			"is_menu": {
				Type:        genai.TypeBoolean,
				Description: "True if the image is a red background mensa menu, false otherwise.",
			},
			"mensa_name": {
				Type:        genai.TypeString,
				Description: "The specific mensa name found in the header.",
			},
			"first_courses": {
				Type:        genai.TypeArray,
				Description: "Starters and pasta dishes (Primi Piatti).",
				Items:       menuItemSchema,
			},
			"main_courses": {
				Type:        genai.TypeArray,
				Description: "Meat, fish, or vegetarian main items (Secondi Piatti).",
				Items:       menuItemSchema,
			},
			"side_dishes": {
				Type:        genai.TypeArray,
				Description: "Vegetables and sides (Contorni).",
				Items:       menuItemSchema,
			},
			"specialties_available": {
				Type:        genai.TypeBoolean,
				Description: "True if '+specialtia espresse' appears in the image.",
			},
		},
		Required: []string{
			"is_menu",
			"mensa_name",
			"first_courses",
			"main_courses",
			"side_dishes",
			"specialties_available",
		},
	}
}
