package models

type LanguageGroup struct {
	IT []string `json:"it"`
	EN []string `json:"en"`
	TR []string `json:"tr"`
}

type MenuResponse struct {
	FirstCourses         LanguageGroup `json:"first_courses"`
	MainCourses          LanguageGroup `json:"main_courses"`
	SideDishes           LanguageGroup `json:"side_dishes"`
	SpecialtiesAvailable bool          `json:"specialties_available"`
}
