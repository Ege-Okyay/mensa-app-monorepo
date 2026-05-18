import type { TranslationKeys } from "./en";

export const it: TranslationKeys = {
  common: {
    locations: "Sedi",
    pick_a_mensa: "Scegli una mensa",
    back_to_locations: "Torna alle sedi",
    view_on_maps: "Visualizza su Maps",
  },
  status: {
    menu_available: "Menu Disponibile",
    not_published: "Non ancora pubblicato",
    no_menu: "Nessun menu trovato",
    no_menu_desc: "Il menu di oggi per Mensa {name} non è ancora stato pubblicato",
  },
  install: {
    title: "MensaToday sulla tua Home",
    description: "Attiva le notifiche e accedi istantaneamente ai menu del giorno.",
    install_text: "Installa",
    ios_steps: {
      step1: "Tocca Condividi o i tre puntini nel menu del browser.",
      step2: "Seleziona 'Aggiungi alla schermata Home' dall'elenco."
    },
    android_steps: {
      step1: "Tocca i tre puntini nel browser",
      step2: "Seleziona 'Installa app' o 'Aggiungi alla schermata Home'."
    }
  },
  menu: {
    first_courses: "PRIMI PIATTI",
    main_courses: "SECONDI PIATTI",
    side_dishes: "CONTORNI",
    specialties: "Specialità Disponibili",
    details: "Maggiori dettagli in arrivo..."
  },
  allergens: {
    title: "Allergeni",
    common: "Allergeni Comuni",
    no_common_detected: "Non sono stati individuati allergeni comuni",
    gluten: "Glutine",
    dairy: "Latticini",
    eggs: "Uova",
    fish: "Pesce",
    shellfish: "Crostacei",
    peanuts: "Arachidi",
    tree_nuts: "Frutta a guscio",
    soy: "Soia",
    sesame: "Sesamo",
  },
  dietary: {
    vegan: "Vegano",
    vegetarian: "Vegetariano"
  },
  footer: {
    built_by: "Sviluppato da Ege Okyay",
    no_affiliation: "Non affiliato a Edisu o ad alcun ente ufficiale."
  }
};
