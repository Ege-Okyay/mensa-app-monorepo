import type { TranslationKeys } from "./en";

export const tr: TranslationKeys = {
  common: {
    locations: "Konumlar",
    pick_a_mensa: "Bir yemekhane seçin",
    back_to_locations: "Konumlara Geri Dön",
    view_on_maps: "Haritalarda Göster"
  },
  status: {
    menu_available: "Menü Mevcut",
    not_published: "Henüz Yayınlanmadı",
    no_menu: "Menü Bulunamadı",
    no_menu_desc: "Mensa {name} için bugünün menüsü henüz yayınlanmadı",
  },
  install: {
    title: "MensaToday'i Ana Ekrana Ekleyin",
    description: "Bildirimleri etkinleştirin ve günlük menülere anında ulaşın.",
    install_text: "Yükle",
    ios_steps: {
      step1: "Tarayıcı menüsündeki Paylaş veya üç nokta simgesine dokunun.",
      step2: "Listeden 'Ana Ekrana Ekle' seçeneğini seçin."
    }
  },
  menu: {
    first_courses: "BAŞLANGIÇLAR",
    main_courses: "ANA YEMEKLER",
    side_dishes: "YAN LEZZETLER",
    specialties: "Özel Yemekler Mevcut",
    details: "Daha fazla detay yakında..."
  },
  allergens: {
    title: "Alerjenler",
    common: "Yaygın Alerjenler",
    no_common_detected: "Herhangi bir yaygın alerjen tespit edilmedi",
    gluten: "Gluten",
    dairy: "Süt Ürünleri",
    eggs: "Yumurta",
    fish: "Balık",
    shellfish: "Kabuklu Deniz Ürünleri",
    peanuts: "Yer Fıstığı",
    tree_nuts: "Sert Kabuklu Yemişler",
    soy: "Soya",
    sesame: "Susam",
  },
  dietary: {
    vegan: "Vegan",
    vegetarian: "Vejetaryen"
  }
};
