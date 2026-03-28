package models

type LocalizedDish struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type MenuItem struct {
	IT        LocalizedDish `json:"it"`
	EN        LocalizedDish `json:"en"`
	TR        LocalizedDish `json:"tr"`
	Allergens []string      `json:"allergens"`
}

type MenuResponse struct {
	MensaName            string     `json:"mensa_name"`
	FirstCourses         []MenuItem `json:"first_courses"`
	MainCourses          []MenuItem `json:"main_courses"`
	SideDishes           []MenuItem `json:"side_dishes"`
	SpecialtiesAvailable bool       `json:"specialties_available"`
}
