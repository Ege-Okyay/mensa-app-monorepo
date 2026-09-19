import type { Language } from "./contexts/language-context";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalPage {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

const CONTACT = "egeokyay0@gmail.com";
const UPDATED = "September 19, 2026";

export const privacyContent: Record<Language, LegalPage> = {
  en: {
    title: "Privacy Policy",
    updated: `Last updated: ${UPDATED}`,
    intro:
      "This policy explains what data MensaToday collects, why we collect it, and the choices you have over it.",
    sections: [
      {
        heading: "Data Controller",
        paragraphs: [
          "MensaToday is operated by Ege Okyay, the developer of mensatoday.app. If you have any questions about this policy or your personal data, write to " + CONTACT + ".",
          "MensaToday is an independent, unofficial project and is not connected to EDISU Piemonte or any other institution.",
        ],
      },
      {
        heading: "Data We Collect",
        paragraphs: [
          "Push notifications: when you enable notifications we store only what is needed to send them to you - your subscription endpoint, your public key and your preferred locale. This data is stored on managed Supabase infrastructure and is deleted when you unsubscribe.",
          "Device storage: your starred mensas and language preference are saved only in your browser (localStorage) and never leave your device.",
          "Traffic: Cloudflare handles the network traffic and may set a strictly necessary technical cookie (__cf_bm). Anonymous Cloudflare Web Analytics, configured without cookies, helps us understand how the app is used.",
        ],
      },
      {
        heading: "Purpose and Legal Basis",
        paragraphs: [
          "Your push subscription is used only to deliver the daily menu notifications you asked for. The legal basis is your consent, which you give by enabling notifications and may withdraw at any time from the app settings.",
          "Anonymous analytics are used to understand how the app is used. The legal basis is the legitimate interest in improving and maintaining the app.",
        ],
      },
      {
        heading: "Third Parties",
        paragraphs: [
          "Cloudflare Inc. - hosting of the website and backend (Workers/Pages), including privacy-safe analytics.",
          "Supabase Inc. - database where push subscriptions are stored.",
          "We never sell or share your personal data with advertisers or any other third party.",
        ],
      },
      {
        heading: "Retention",
        paragraphs: [
          "Push subscriptions are kept until you unsubscribe or the subscription stops working, and then deleted.",
          "localStorage data is fully under your control and is removed when you clear your browser data.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "MensaToday itself sets no cookies. Cloudflare may set a strictly necessary technical cookie (__cf_bm) to protect the service. We do not use advertising or tracking cookies.",
        ],
      },
      {
        heading: "Your Rights",
        items: [
          "Access, correct, delete or obtain a copy of your personal data",
          "Object to or restrict processing",
          "Withdraw consent at any time",
          "Lodge a complaint with your data protection authority (in Italy: Garante per la protezione dei dati personali)",
        ],
        paragraphs: [
          "To exercise any of these rights, or to delete your push subscription, write to " + CONTACT + ".",
        ],
      },
      {
        heading: "Changes",
        paragraphs: [
          "We may update this policy from time to time. The latest version is always available on this page.",
        ],
      },
    ],
  },
  it: {
    title: "Informativa Privacy",
    updated: `Ultimo aggiornamento: ${UPDATED}`,
    intro:
      "Questa informativa spiega quali dati raccoglie MensaToday, perché li raccogliamo e quali scelte puoi fare sui tuoi dati.",
    sections: [
      {
        heading: "Titolare del Trattamento",
        paragraphs: [
          "MensaToday è gestita da Ege Okyay, sviluppatore di mensatoday.app. Per qualsiasi domanda su questa informativa o sui tuoi dati personali, scrivi a " + CONTACT + ".",
          "MensaToday è un progetto indipendente e non ufficiale: non è collegato a EDISU Piemonte né ad altre istituzioni.",
        ],
      },
      {
        heading: "Dati che Raccogliamo",
        paragraphs: [
          "Notifiche push: quando attivi le notifiche salviamo solo ciò che serve a inviartele - il tuo endpoint di sottoscrizione, la tua chiave pubblica e la tua lingua preferita. Questi dati sono conservati su infrastruttura Supabase e vengono eliminati quando ti disiscrivi.",
          "Memoria del dispositivo: le mense preferite e la lingua sono salvate solo nel tuo browser (localStorage) e non lasciano mai il tuo dispositivo.",
          "Traffico: Cloudflare gestisce il traffico di rete e può impostare un cookie tecnico strettamente necessario (__cf_bm). Le analisi anonime di Cloudflare Web Analytics, configurate senza cookie, aiutano a capire come viene usata l'app.",
        ],
      },
      {
        heading: "Finalità e Base Giuridica",
        paragraphs: [
          "La tua sottoscrizione push è usata solo per inviarti le notifiche sui menu giornalieri che hai richiesto. La base giuridica è il consenso, che dai attivando le notifiche e che puoi revocare in qualsiasi momento dalle impostazioni dell'app.",
          "Le analisi anonime servono a capire come viene usata l'app. La base giuridica è il legittimo interesse a migliorare e mantenere l'app.",
        ],
      },
      {
        heading: "Terze Parti",
        paragraphs: [
          "Cloudflare Inc. - hosting del sito e del backend (Workers/Pages), incluse le analisi privacy-safe.",
          "Supabase Inc. - database in cui sono conservate le sottoscrizioni push.",
          "Non vendiamo né condividiamo mai i tuoi dati personali con inserzionisti o altre terze parti.",
        ],
      },
      {
        heading: "Conservazione",
        paragraphs: [
          "Le sottoscrizioni push vengono conservate finché non ti disiscrivi o finché non smettono di funzionare, poi vengono eliminate.",
          "I dati in localStorage sono interamente sotto il tuo controllo e vengono rimossi quando cancelli i dati del browser.",
        ],
      },
      {
        heading: "Cookie",
        paragraphs: [
          "MensaToday non imposta alcun cookie. Cloudflare può impostare un cookie tecnico strettamente necessario (__cf_bm) per proteggere il servizio. Non utilizziamo cookie pubblicitari o di profilazione.",
        ],
      },
      {
        heading: "I Tuoi Diritti",
        items: [
          "Accedere, correggere, cancellare o ottenere una copia dei tuoi dati personali",
          "Opporti al trattamento o chiederne la limitazione",
          "Revocare il consenso in qualsiasi momento",
          "Presentare un reclamo all'autorità di controllo (in Italia: Garante per la protezione dei dati personali)",
        ],
        paragraphs: [
          "Per esercitare uno di questi diritti, o per eliminare la tua sottoscrizione push, scrivi a " + CONTACT + ".",
        ],
      },
      {
        heading: "Modifiche",
        paragraphs: [
          "Potremmo aggiornare questa informativa di tanto in tanto. La versione più recente è sempre disponibile su questa pagina.",
        ],
      },
    ],
  },
  tr: {
    title: "Gizlilik Politikası",
    updated: `Son güncelleme: ${UPDATED}`,
    intro:
      "Bu politika, MensaToday'nin hangi verileri topladığını, neden topladığını ve bu veriler üzerindeki seçeneklerinizi açıklar.",
    sections: [
      {
        heading: "Veri Sorumlusu",
        paragraphs: [
          "MensaToday, mensatoday.app uygulamasının geliştiricisi Ege Okyay tarafından işletilmektedir. Bu politika veya kişisel verilerinizle ilgili sorularınız için " + CONTACT + " adresine yazın.",
          "MensaToday bağımsız ve resmi olmayan bir projedir; EDISU Piemonte veya herhangi bir kurumla bağlantılı değildir.",
        ],
      },
      {
        heading: "Topladığımız Veriler",
        paragraphs: [
          "Anlık bildirimler: bildirimleri etkinleştirdiğinizde, yalnızca göndermek için gereken verileri saklarız - abonelik uç noktanız, genel anahtarınız ve tercih ettiğiniz dil. Bu veriler yönetilen Supabase altyapısında saklanır ve aboneliğinizi iptal ettiğinizde silinir.",
          "Cihaz depolaması: yıldızlı yemekhaneleriniz ve dil tercihiniz yalnızca tarayıcınızda (localStorage) saklanır ve cihazınızdan asla çıkmaz.",
          "Trafik: Cloudflare ağ trafiğini yönetir ve kesinlikle gerekli bir teknik çerez (__cf_bm) ayarlayabilir. Çerezsiz yapılandırılmış anonim Cloudflare Web Analytics, uygulamanın nasıl kullanıldığını anlamamıza yardımcı olur.",
        ],
      },
      {
        heading: "Amaç ve Hukuki Dayanak",
        paragraphs: [
          "Anlık bildirim aboneliğiniz yalnızca istediğiniz günlük menü bildirimlerini göndermek için kullanılır. Hukuki dayanak, bildirimleri etkinleştirerek verdiğiniz ve dilediğiniz zaman uygulama ayarlarından geri alabileceğiniz onaydır.",
          "Anonim istatistikler, uygulamanın nasıl kullanıldığını anlamak için kullanılır. Hukuki dayanak, uygulamayı iyileştirme ve bakımını sağlama konusundaki meşru menfaattir.",
        ],
      },
      {
        heading: "Üçüncü Taraflar",
        paragraphs: [
          "Cloudflare Inc. - web sitesi ve arka ucun barındırılması (Workers/Pages), gizlilik dostu istatistikler dahil.",
          "Supabase Inc. - anlık bildirim aboneliklerinin saklandığı veritabanı.",
          "Kişisel verilerinizi asla reklamcılara veya başka üçüncü taraflara satmaz veya paylaşmayız.",
        ],
      },
      {
        heading: "Saklama Süresi",
        paragraphs: [
          "Anlık bildirim abonelikleri, aboneliğinizi iptal edene veya çalışmayı durdurana kadar saklanır ve ardından silinir.",
          "localStorage verileri tamamen sizin kontrolünüzdedir ve tarayıcı verilerinizi temizlediğinizde kaldırılır.",
        ],
      },
      {
        heading: "Çerezler",
        paragraphs: [
          "MensaToday kendisi hiçbir çerez ayarlamaz. Cloudflare, hizmeti korumak için kesinlikle gerekli bir teknik çerez (__cf_bm) ayarlayabilir. Reklam veya izleme çerezleri kullanmıyoruz.",
        ],
      },
      {
        heading: "Haklarınız",
        items: [
          "Kişisel verilerinize erişme, düzeltme, silme veya bir kopyasını alma",
          "İşlemeye itiraz etme veya kısıtlama isteme",
          "Onayı dilediğiniz zaman geri alma",
          "Veri koruma otoritesine şikayette bulunma",
        ],
        paragraphs: [
          "Bu haklardan herhangi birini kullanmak veya anlık bildirim aboneliğinizi silmek için " + CONTACT + " adresine yazın.",
        ],
      },
      {
        heading: "Değişiklikler",
        paragraphs: [
          "Bu politikayı zaman zaman güncelleyebiliriz. En son sürüm her zaman bu sayfada bulunur.",
        ],
      },
    ],
  },
};

export const termsContent: Record<Language, LegalPage> = {
  en: {
    title: "Terms of Service",
    updated: `Last updated: ${UPDATED}`,
    intro:
      "By using MensaToday you agree to these terms. If you do not agree, please do not use the app.",
    sections: [
      {
        heading: "About the Service",
        paragraphs: [
          "MensaToday shows the daily menus published by EDISU Piemonte cafeterias in Turin. Menus are collected automatically from public sources and analysed with AI tools, then published here for your convenience.",
        ],
      },
      {
        heading: "Unofficial and Independent",
        paragraphs: [
          "MensaToday is an independent, non-commercial project and is not affiliated with, endorsed by, or connected to EDISU Piemonte or any other institution. Names, logos and photographs belong to their respective owners.",
        ],
      },
      {
        heading: "Accuracy of Content",
        paragraphs: [
          "Menus are processed automatically and may contain errors, omissions or inaccuracies, including allergen and ingredient information. Allergen information in particular should always be confirmed at the cafeteria or directly with EDISU. The app is a daily convenience, not an official source.",
        ],
      },
      {
        heading: "Acceptable Use",
        paragraphs: [
          "You may use the app for private, non-commercial purposes. You may not abuse, reverse-engineer or attempt to harm the app or its infrastructure, nor use the API for purposes other than the app.",
        ],
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "MensaToday's code, design and texts are © 2026 Ege Okyay. You may not copy, redistribute or reuse them without permission. Menu content belongs to EDISU Piemonte.",
        ],
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "MensaToday is provided “as is” without warranties of any kind. To the maximum extent permitted by law, we are not liable for any damages arising from the use of the app, its unavailability, or inaccurate menu information.",
        ],
      },
      {
        heading: "Governing Law and Changes",
        paragraphs: [
          "These terms are governed by the laws of Italy. We may revise these terms from time to time; the latest version always applies.",
        ],
      },
    ],
  },
  it: {
    title: "Termini di Servizio",
    updated: `Ultimo aggiornamento: ${UPDATED}`,
    intro:
      "Usando MensaToday accetti i seguenti termini. Se non li accetti, ti preghiamo di non utilizzare l'app.",
    sections: [
      {
        heading: "Informazioni sul Servizio",
        paragraphs: [
          "MensaToday mostra i menu giornalieri pubblicati dalle mense EDISU Piemonte di Torino. I menu vengono raccolti automaticamente da fonti pubbliche e analizzati con strumenti di intelligenza artificiale, poi pubblicati qui per tua comodità.",
        ],
      },
      {
        heading: "Non Ufficiale e Indipendente",
        paragraphs: [
          "MensaToday è un progetto indipendente e non commerciale: non è affiliato, sponsorizzato o collegato a EDISU Piemonte né ad altre istituzioni. Nomi, loghi e fotografie appartengono ai rispettivi proprietari.",
        ],
      },
      {
        heading: "Accuratezza dei Contenuti",
        paragraphs: [
          "I menu sono elaborati automaticamente e possono contenere errori, omissioni o imprecisioni, inclusi allergeni e ingredienti. Le informazioni sugli allergeni in particolare dovrebbero essere sempre verificate in mensa o direttamente con EDISU. L'app è una comodità quotidiana, non una fonte ufficiale.",
        ],
      },
      {
        heading: "Uso Consentito",
        paragraphs: [
          "Puoi usare l'app per scopi privati e non commerciali. Non puoi abusare, fare reverse engineering o tentare di danneggiare l'app o la sua infrastruttura, né usare l'API per scopi diversi dall'app.",
        ],
      },
      {
        heading: "Proprietà Intellettuale",
        paragraphs: [
          "Codice, design e testi di MensaToday sono © 2026 Ege Okyay. Non puoi copiarli, ridistribuirli o riutilizzarli senza autorizzazione. I contenuti dei menu appartengono a EDISU Piemonte.",
        ],
      },
      {
        heading: "Limitazione di Responsabilità",
        paragraphs: [
          "MensaToday è fornita “così com'è”, senza garanzie di alcun tipo. Nella misura massima consentita dalla legge, non siamo responsabili di alcun danno derivante dall'uso dell'app, dalla sua indisponibilità o da informazioni di menu imprecise.",
        ],
      },
      {
        heading: "Legge Applicabile e Modifiche",
        paragraphs: [
          "Questi termini sono disciplinati dalla legge italiana. Potremmo rivedere questi termini di tanto in tanto; la versione più recente è sempre quella applicabile.",
        ],
      },
    ],
  },
  tr: {
    title: "Kullanım Şartları",
    updated: `Son güncelleme: ${UPDATED}`,
    intro:
      "MensaToday'yi kullanarak bu şartları kabul etmiş olursunuz. Kabul etmiyorsanız lütfen uygulamayı kullanmayın.",
    sections: [
      {
        heading: "Hizmet Hakkında",
        paragraphs: [
          "MensaToday, Torino'daki EDISU Piemonte yemekhanelerinin yayınladığı günlük menüleri gösterir. Menüler kamuya açık kaynaklardan otomatik olarak toplanır ve yapay zeka araçlarıyla analiz edilir, ardından sizin için burada yayınlanır.",
        ],
      },
      {
        heading: "Resmi Olmayan ve Bağımsız",
        paragraphs: [
          "MensaToday bağımsız, ticari olmayan bir projedir; EDISU Piemonte veya başka bir kurumla bağlantılı, onun tarafından desteklenen veya onunla ilişkili değildir. İsimler, logolar ve fotoğraflar ilgili sahiplerine aittir.",
        ],
      },
      {
        heading: "İçerik Doğruluğu",
        paragraphs: [
          "Menüler otomatik olarak işlenir ve alerjen ve içerik bilgileri dahil olmak üzere hatalar, eksiklikler veya yanlışlıklar içerebilir. Özellikle alerjen bilgileri her zaman yemekhanede veya doğrudan EDISU ile teyit edilmelidir. Uygulama günlük bir kolaylıktır, resmi bir kaynak değildir.",
        ],
      },
      {
        heading: "Kabul Edilebilir Kullanım",
        paragraphs: [
          "Uygulamayı özel, ticari olmayan amaçlarla kullanabilirsiniz. Uygulamayı veya altyapısını kötüye kullanamaz, tersine mühendislik yapamaz veya zarar vermeye çalışamazsınız; API'yi uygulama dışındaki amaçlarla kullanamazsınız.",
        ],
      },
      {
        heading: "Fikri Mülkiyet",
        paragraphs: [
          "MensaToday'nin kodu, tasarımı ve metinleri © 2026 Ege Okyay'a aittir. İzinsiz kopyalayamaz, yeniden dağıtamaz veya yeniden kullanamazsınız. Menü içerikleri EDISU Piemonte'ye aittir.",
        ],
      },
      {
        heading: "Sorumluluğun Sınırlandırılması",
        paragraphs: [
          "MensaToday, hiçbir türde garanti olmaksızın “olduğu gibi” sağlanır. Kanunun izin verdiği azami ölçüde, uygulamanın kullanımından, kullanılamamasından veya hatalı menü bilgilerinden kaynaklanan hiçbir zarardan sorumlu değiliz.",
        ],
      },
      {
        heading: "Uygulanacak Hukuk ve Değişiklikler",
        paragraphs: [
          "Bu şartlar İtalya yasalarına tabidir. Zaman zaman bu şartları revize edebiliriz; geçerli olan her zaman en son sürümdür.",
        ],
      },
    ],
  },
};
