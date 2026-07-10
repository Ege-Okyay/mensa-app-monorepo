package models

import "sort"

// Gemini Models
type LocalizedDish struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type MenuItem struct {
	IT              LocalizedDish `json:"it"`
	EN              LocalizedDish `json:"en"`
	TR              LocalizedDish `json:"tr"`
	Allergens       []string      `json:"allergens"`
	DietaryCategory string        `json:"dietary_category"`
}

type MenuResponse struct {
	IsMenu               bool       `json:"is_menu"`
	MensaName            string     `json:"mensa_name"`
	FirstCourses         []MenuItem `json:"first_courses"`
	MainCourses          []MenuItem `json:"main_courses"`
	SideDishes           []MenuItem `json:"side_dishes"`
	SpecialtiesAvailable bool       `json:"specialties_available"`
	CommonAllergens      []string   `json:"common_allergens"`
}

func (mr *MenuResponse) PopulateCommonAllergens() {
	counts := make(map[string]int)

	countFn := func(items []MenuItem) {
		for _, item := range items {
			for _, a := range item.Allergens {
				counts[a]++
			}
		}
	}

	countFn(mr.FirstCourses)
	countFn(mr.MainCourses)
	countFn(mr.SideDishes)

	if len(counts) == 0 {
		mr.CommonAllergens = []string{}
		return
	}

	uniqueAllergens := make([]string, 0, len(counts))

	for a := range counts {
		uniqueAllergens = append(uniqueAllergens, a)
	}

	sort.Slice(uniqueAllergens, func(i, j int) bool {
		return counts[uniqueAllergens[i]] > counts[uniqueAllergens[j]]
	})

	leaderCount := counts[uniqueAllergens[0]]
	threshold := float64(leaderCount) * 0.7

	common := []string{}
	for _, a := range uniqueAllergens {
		count := counts[a]

		if float64(count) >= threshold || (len(common) < 2 && count > 0) {
			common = append(common, a)
		}

		if len(common) >= 4 {
			break
		}
	}

	mr.CommonAllergens = common
}
