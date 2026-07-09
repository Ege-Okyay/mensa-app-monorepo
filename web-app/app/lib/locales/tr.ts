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
    description: "Bildirimleri etkinleştirin ve günlük menülere anında ulaşın",
    install_text: "Yükle",
    ios_steps: {
      step1: "Tarayıcı menüsündeki Paylaş veya üç nokta simgesine dokunun",
      step2: "Listeden 'Ana Ekrana Ekle' seçeneğini seçin"
    },
    android_steps: {
      step1: "Tarayıcınızdaki üç noktaya tıklayın",
      step2: "'Uygulamayı yükle' veya 'Ana Ekrana Ekle' seçeneğini seçin"
    },
    dismiss_title: "Ana Ekrana Eklensin mi?",
    dismiss_desc: "Yeni menüler yayınlandığında bildirim alın ve ana ekranınızdan anında erişin",
    dismiss_cancel: "Şimdi Değil",
    dismiss_confirm: "Kapat"
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
  },
  footer: {
    tagline: "by students, for students",
    built_by: "Ege Okyay tarafından geliştirildi",
    no_affiliation: "Edisu veya herhangi bir resmi kurumla bağlantısı yoktur."
  },
  settings: {
    title: "Ayarlar",
    language: "Dil",
    notifications: "Bildirimler",
    push_notifications: "Anlık Bildirimler",
    notifications_desc: "Yeni menüler yayınlandığında bildirim alın",
    subscribed: "Abone olundu",
    unsubscribed: "Abone olunmadı",
    not_supported: "Bu tarayıcıda desteklenmiyor",
    loading: "Yükleniyor...",
    add_to_home: "Ana Ekrana Ekle",
    add_to_home_desc: "Yeni menüler çıktığında telefonunuzda bildirim alın"
  },
  errors: {
    title: "Hata!",
    unexpected: "Beklenmedik bir hata oluştu",
    connection: "Bağlantı kurulamadı. İnternet bağlantınızı kontrol edin.",
    timeout: "İstek zaman aşımına uğradı. Lütfen tekrar deneyin.",
    offline: "Sunucuya şu an ulaşılamıyor",
    not_found: "Aradığınız sayfa bulunamadı.",
    try_again: "Tekrar Dene",
    back_home: "Ana Sayfaya Dön"
  }
};
