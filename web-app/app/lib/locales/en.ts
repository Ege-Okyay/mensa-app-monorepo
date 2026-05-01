export const en = {
  common: {
    locations: "Locations",
    pick_a_mensa: "Pick a mensa",
    back_to_locations: "Back to Locations",
    view_on_maps: "View on Maps",
  },
  status: {
    menu_available: "Menu Available",
    not_published: "Not Published Yet",
    no_menu: "No Menu Found",
    no_menu_desc: "Today's menu for Mensa {name} hasn't been published yet",
  },
  install: {
    title: "MensaToday on your Home Screen",
    description: "Enable notifications and get instant access to daily menus.",
    install_text: "Install",
    ios_steps: {
      step1: "Tap Share or the three dots in your browser menu.",
      step2: "Select 'Add to Home Screen' from the list."
    }
  },
  menu: {
    first_courses: "FIRST COURSES",
    main_courses: "MAIN COURSES",
    side_dishes: "SIDE DISHES",
    specialties: "Specialties Available",
    details: "More details coming soon..."
  },
  allergens: {
    title: "Allergens",
    common: "Common Allergens",
    no_common_detected: "No common allergens identified",
    gluten: "Gluten",
    dairy: "Dairy",
    eggs: "Eggs",
    fish: "Fish",
    shellfish: "Shellfish",
    peanuts: "Peanuts",
    tree_nuts: "Tree Nuts",
    soy: "Soy",
    sesame: "Sesame",
  },
  dietary: {
    vegan: "Vegan",
    vegetarian: "Veggie"
  }
};

export type TranslationKeys = typeof en;
