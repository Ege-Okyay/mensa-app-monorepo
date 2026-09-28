package engine

import (
	"fmt"
	"log"
	"strings"
	"sync"

	"github.com/Ege-Okyay/mensa-app-monorepo/internal/models"
)

var printMu sync.Mutex

func (e *ScraperEngine) LogSummary() {
	printMu.Lock()
	defer printMu.Lock()

	log.Println("")
	log.Println(" Scraper Run Summary")
	log.Printf("  %-17s: %d", "images fetched", e.summary.fetched)
	log.Printf("  %-17s: %d", "cached / skipped", e.summary.skipped)
	log.Printf("  %-17s: %d", "analyzed", e.summary.analyzed)
	log.Printf("  %-17s: %d", "menus found", e.summary.menus)
	log.Printf("  %-17s: %d", "not a menu", e.summary.notMenu)
	log.Printf("  %-17s: %d", "errors", e.summary.errors)
	log.Println("")
}

func (e *ScraperEngine) logOutcome(m *models.MenuResponse, err error) {
	if !e.Config.DetailedLogs {
		return
	}

	printMu.Lock()
	defer printMu.Lock()

	if err != nil {
		log.Printf("[ERR] %v", err)
		return
	}

	if !m.IsMenu {
		log.Printf("[SKIP] is_menu=false mensa_name=%q", m.MensaName)
		return
	}

	log.Printf("::group::[MENU] is_menu=true mensa_name=%q\n", m.MensaName)
	log.Printf("  specialties_available : %v", m.SpecialtiesAvailable)
	log.Printf("  common_allergens : %s", joinOrDash(m.CommonAllergens))

	logItems("first_courses", m.FirstCourses)
	logItems("main_courses", m.MainCourses)
	logItems("side_dishes", m.SideDishes)

	fmt.Println("::endgroup::")
}

func logItems(label string, items []models.MenuItem) {
	if len(items) == 0 {
		return
	}

	log.Printf("  %s (%d)", label, len(items))

	for i, item := range items {
		name := item.IT.Name

		if item.DietaryCategory != "" {
			name += " [" + item.DietaryCategory + "]"
		}

		log.Printf("    %d. %s", i+1, name)
	}
}

func joinOrDash(values []string) string {
	if len(values) == 0 {
		return "-"
	}

	return strings.Join(values, ", ")
}
