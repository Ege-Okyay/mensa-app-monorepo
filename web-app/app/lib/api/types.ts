export interface ScheduleRange {
  open: string;
  close: string;
}

export type Schedule = Record<string, ScheduleRange[]>;

export interface LocalizedDish {
  name: string;
  description: string;
}

export interface MenuItem {
  it: LocalizedDish;
  en: LocalizedDish;
  tr: LocalizedDish;
  allergens: string[];
  dietary_category: "Meat" | "Vegetarian" | "Vegan";
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
  schedule: Schedule | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
