export interface LocalizedDish {
  name: string;
  description: string;
}

export interface MenuItem {
  it: LocalizedDish;
  en: LocalizedDish;
  tr: LocalizedDish;
  allergens: string[];
}

export interface MenuData {
  mensa_name: string;
  first_courses: MenuItem[];
  main_courses: MenuItem[];
  side_dishes: MenuItem[];
  specialties_available: boolean;
  common_allergens: string[];
}

export interface Mensa {
  id: string;
  name: string;
  slug: string;
  location: string;
  has_menu: boolean;
  current_menu?: {
    menu_data: MenuData;
    updated_at: string | null;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
