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
    },
    android_steps: {
      step1: "Tap the three dots in your browser.",
      step2: "Select 'Install app' or 'Add to Home Screen'."
    },
    dismiss_title: "Add to Home Screen?",
    dismiss_desc: "Get notified when new menus drop and access them instantly from your home screen",
    dismiss_cancel: "Not Now",
    dismiss_confirm: "Dismiss"
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
  },
  footer: {
    tagline: "by students, for students",
    built_by: "Built by Ege Okyay",
    no_affiliation: "Not affiliated with Edisu or any official institution."
  },
  settings: {
    title: "Settings",
    language: "Language",
    notifications: "Notifications",
    push_notifications: "Push Notifications",
    notifications_desc: "Get notified when new menus are published",
    subscribed: "Subscribed",
    unsubscribed: "Unsubscribed",
    not_supported: "Not supported on this browser",
    loading: "Loading...",
    add_to_home: "Add to Home Screen",
    add_to_home_desc: "Get notified on your phone when new menus drop"
  },
  errors: {
    title: "Oops!",
    unexpected: "An unexpected error occured.",
    connection: "Unable to connect. Check your internet connection.",
    timeout: "Request timed out. Please try again.",
    offline: "Server is temporarily unavailable",
    not_found: "The page you are looking for doesn't exist.",
    try_again: "Try Again",
    back_home: "Back to Home"
  },
  schedule: {
    opens_at: "Opens at {time}",
    closes_at: "Closes at {time}",
    closed: "Closed today",
  }
};

export type TranslationKeys = typeof en;
