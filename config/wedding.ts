// ============================================================================
// WEDDING CONFIGURATION
// ============================================================================
// This is the single source of truth for all wedding details AND translations.
// Edit the values below to customize your wedding invite.
// ============================================================================

// --- Core details (referenced by translations below) -----------------------

const couple = {
  bride: { en: "Nada", ar: "ندى" },
  groom: { en: "Karim", ar: "كريم" },
  coupleNames: { en: "Nada & Karim", ar: "ندى و كريم" },
}

const date = {
  // UTC timestamp of the wedding (used for countdown timer)
  // Cairo is UTC+2, so 5:00 PM Cairo = 3:00 PM UTC
  utc: "2026-05-22T15:00:00Z",
  timezone: "Africa/Cairo",
  display: {
    en: "Friday, 22nd May 2026",
    ar: "الجمعة ٢٢ مايو ٢٠٢٦",
  },
  formal: {
    en: "Friday, the twenty-second of May, two thousand twenty-six",
    ar: "الجمعة، الثاني والعشرون من مايو، ألفان وستة وعشرون",
  },
  time: {
    en: "5:00 PM",
    ar: "٥:٠٠ مساءً",
  },
  timeFormal: {
    en: "Five o'clock in the evening",
    ar: "الخامسة مساءً",
  },
  short: {
    en: "22.05.2026",
    ar: "٢٢.٠٥.٢٠٢٦",
  },
}

const venue = {
  name: {
    en: "The Royal Ballroom",
    ar: "القاعة الملكية",
  },
  venue: {
    en: "Four Seasons Hotel Cairo at Nile Plaza",
    ar: "فندق فور سيزونز القاهرة نايل بلازا",
  },
  address: {
    en: "1089 Corniche El Nil, Garden City",
    ar: "١٠٨٩ كورنيش النيل، جاردن سيتي",
  },
  city: {
    en: "Cairo, Egypt",
    ar: "القاهرة، مصر",
  },
  coordinates: { lat: 30.0392, lng: 31.229 },
  googleMapsQuery: "Four+Seasons+Hotel+Cairo+at+Nile+Plaza",
  // Get this from Google Maps > Share > Embed a map
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8!2d31.2290!3d30.0392!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c5a7e8e8e7%3A0x8e8e8e8e8e8e8e8e!2sFour%20Seasons%20Hotel%20Cairo%20at%20Nile%20Plaza!5e0!3m2!1sen!2seg!4v1",
}

const rsvp = {
  deadline: {
    en: "Kindly respond by 1st April 2026",
    ar: "يرجى الرد قبل ١ أبريل ٢٠٢٦",
  },
  defaultMaxGuests: 4,
}

// ============================================================================
// EXPORTED CONFIG
// ============================================================================

export const weddingConfig = {
  couple,
  date,
  venue,
  rsvp,

  // --------------------------------------------------------------------------
  // IMAGES
  // Place your images in the /public folder and reference them here.
  // --------------------------------------------------------------------------
  images: {
    heroBackground: "/ballroom_image.png",
    waxSeal: "/Seal Picture.png",
  },

  // --------------------------------------------------------------------------
  // MUSIC
  // Place your music file at /public/music/wedding-music.mp3
  // --------------------------------------------------------------------------
  music: {
    src: "/music/wedding-music.mp3",
    volume: 0.25,
  },

  // --------------------------------------------------------------------------
  // PROGRAM OF THE DAY
  // Each entry needs: time, titleKey, descKey, icon, color
  // Available icons: Heart, Wine, Gem, GlassWater, UtensilsCrossed, Music
  // The titleKey/descKey map to translations below.
  // --------------------------------------------------------------------------
  program: [
    { time: "17:00", titleKey: "guestArrival", descKey: "guestArrivalDesc", icon: "Heart" as const, color: "#c8a96e" },
    { time: "17:30", titleKey: "welcomeDrink", descKey: "welcomeDrinkDesc", icon: "Wine" as const, color: "#8aaa7e" },
    { time: "18:00", titleKey: "ceremony", descKey: "ceremonyDesc", icon: "Gem" as const, color: "#b08d98" },
    { time: "19:00", titleKey: "cocktailHour", descKey: "cocktailHourDesc", icon: "GlassWater" as const, color: "#95b08a" },
    { time: "21:00", titleKey: "banquet", descKey: "banquetDesc", icon: "UtensilsCrossed" as const, color: "#c8a96e" },
    { time: "00:00", titleKey: "party", descKey: "partyDesc", icon: "Music" as const, color: "#b08d98" },
  ],

  // --------------------------------------------------------------------------
  // PHOTO GALLERY
  // Add your photos to /public/photos/ and reference them here.
  // Leave src empty ("") to show a placeholder.
  // --------------------------------------------------------------------------
  gallery: [
    { src: "", alt: "Photo 1" },
    { src: "", alt: "Photo 2" },
    { src: "", alt: "Photo 3" },
    { src: "", alt: "Photo 4" },
    { src: "", alt: "Photo 5" },
    { src: "", alt: "Photo 6" },
  ],

  // --------------------------------------------------------------------------
  // TRANSLATIONS  (English & Arabic)
  // --------------------------------------------------------------------------
  // All user-facing text lives here. Edit any string value to change what
  // guests see. Keys must stay the same (they are referenced by components).
  // --------------------------------------------------------------------------
  translations: {
    en: {
      envelope: {
        families: "Together with their families",
        coupleNames: couple.coupleNames.en,
        requestPleasure: "Request the pleasure of your company",
        tapToOpen: "TAP THE SEAL TO OPEN",
        date: date.short.en,
        awaitMessage: "Your invitation awaits...",
      },
      hero: {
        requestHonour: "Request the honour of your presence",
        bride: couple.bride.en,
        groom: couple.groom.en,
        and: "&",
        date: date.display.en,
        time: date.time.en,
        scrollDown: "Scroll down",
      },
      welcome: {
        dear: "Dear",
        invitedTo: "You are cordially invited to celebrate the union of",
        and: "and",
        together: "We would be honoured by your presence on this special day",
      },
      gallery: {
        title: "Our Moments",
        subtitle: "Captured memories",
        placeholder: "Photo coming soon",
      },
      verse: {
        title: "A Blessing",
      },
      countdown: {
        title: "Countdown",
        subtitle: "Until we say 'I do'",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        confirmAttendance: "Confirm Attendance",
      },
      location: {
        title: "Location",
        venueName: venue.name.en,
        venue: venue.venue.en,
        address: venue.address.en,
        city: venue.city.en,
        getDirections: "Get Directions",
      },
      program: {
        title: "Program of the Day",
        subtitle: "Order of Celebrations",
        guestArrival: "Guest Arrival",
        guestArrivalDesc: "Welcome and reception at the ballroom",
        welcomeDrink: "Welcome Drink",
        welcomeDrinkDesc: "Cocktails and hors d'oeuvres to start the celebration",
        ceremony: "Ceremony",
        ceremonyDesc: "The most special moment of the day",
        cocktailHour: "Cocktail Hour",
        cocktailHourDesc: "Drinks and canapés in the garden terrace",
        banquet: "Banquet",
        banquetDesc: "Fine dining and celebration",
        party: "Party",
        partyDesc: "Dancing until the early hours",
      },
      rsvp: {
        title: "RSVP",
        subtitle: rsvp.deadline.en,
        willYouAttend: "Will you be attending?",
        accept: "Joyfully Accept",
        decline: "Regretfully Decline",
        declineTitle: "Sorry you won't be able to make it",
        declineMessage: "We understand and appreciate you letting us know.",
        fullName: "Your Name",
        namePlaceholder: "Enter your name",
        email: "Email (optional)",
        emailPlaceholder: "your@email.com",
        message: "Leave us a message",
        messagePlaceholder: "We'd love to hear from you...",
        sendRsvp: "Send RSVP",
        sendResponse: "Send Response",
        sending: "Sending...",
        thankYou: "Thank You!",
        missYou: "We'll Miss You!",
        confirmedMessage: "Your response has been recorded. We can't wait to celebrate with you!",
        declinedMessage: "Thank you for letting us know. We hope to celebrate with you another time!",
        validationName: "Please enter your name",
        alreadyRsvpd: "You have already submitted your RSVP",
        spotsRemaining: "spots remaining",
        spotsFilled: "spots confirmed",
        confirmedGuests: "Confirmed Guests",
        groupFull: "All spots have been filled for this invitation",
        noResponses: "Be the first to RSVP!",
      },
      footer: {
        coupleNames: couple.coupleNames.en,
        date: date.short.en,
        madeWith: "Made with love",
      },
    },
    ar: {
      envelope: {
        families: "مع عائلاتهم",
        coupleNames: couple.coupleNames.ar,
        requestPleasure: "يتشرفون بدعوتكم لحضور",
        tapToOpen: "اضغط على الختم للفتح",
        date: date.short.ar,
        awaitMessage: "...دعوتكم بانتظاركم",
      },
      hero: {
        requestHonour: "يتشرفون بدعوتكم لحضور حفل زفاف",
        bride: couple.bride.ar,
        groom: couple.groom.ar,
        and: "و",
        date: date.display.ar,
        time: date.time.ar,
        scrollDown: "اسحب للأسفل",
      },
      welcome: {
        dear: "عزيزنا",
        invitedTo: "نتشرف بدعوتكم لحضور حفل زفاف",
        and: "و",
        together: "نتمنى أن نشرف بحضوركم في هذا اليوم المميز",
      },
      gallery: {
        title: "لحظاتنا",
        subtitle: "ذكريات محفوظة",
        placeholder: "الصورة قريباً",
      },
      verse: {
        title: "بركة",
      },
      countdown: {
        title: "العد التنازلي",
        subtitle: "حتى نقول 'أقبل'",
        days: "أيام",
        hours: "ساعات",
        minutes: "دقائق",
        seconds: "ثواني",
        confirmAttendance: "تأكيد الحضور",
      },
      location: {
        title: "الموقع",
        venueName: venue.name.ar,
        venue: venue.venue.ar,
        address: venue.address.ar,
        city: venue.city.ar,
        getDirections: "الاتجاهات",
      },
      program: {
        title: "برنامج اليوم",
        subtitle: "ترتيب الاحتفالات",
        guestArrival: "وصول الضيوف",
        guestArrivalDesc: "الاستقبال في القاعة",
        welcomeDrink: "مشروب الترحيب",
        welcomeDrinkDesc: "كوكتيلات ومقبلات لبدء الاحتفال",
        ceremony: "حفل الزفاف",
        ceremonyDesc: "أجمل لحظة في اليوم",
        cocktailHour: "ساعة الكوكتيل",
        cocktailHourDesc: "مشروبات ومقبلات في شرفة الحديقة",
        banquet: "المأدبة",
        banquetDesc: "عشاء فاخر واحتفال",
        party: "الحفلة",
        partyDesc: "الرقص حتى ساعات الصباح الأولى",
      },
      rsvp: {
        title: "تأكيد الحضور",
        subtitle: rsvp.deadline.ar,
        willYouAttend: "هل ستحضر؟",
        accept: "أقبل بسعادة",
        decline: "أعتذر بأسف",
        declineTitle: "نأسف لعدم تمكنكم من الحضور",
        declineMessage: "نتفهم ونقدر إخباركم لنا.",
        fullName: "اسمك",
        namePlaceholder: "أدخل اسمك",
        email: "البريد الإلكتروني (اختياري)",
        emailPlaceholder: "your@email.com",
        message: "اتركوا لنا رسالة",
        messagePlaceholder: "نود أن نسمع منكم...",
        sendRsvp: "إرسال التأكيد",
        sendResponse: "إرسال الرد",
        sending: "جاري الإرسال...",
        thankYou: "شكراً لكم!",
        missYou: "سنفتقدكم!",
        confirmedMessage: "تم تسجيل ردكم. لا نستطيع الانتظار للاحتفال معكم!",
        declinedMessage: "شكراً لإخباركم لنا. نأمل أن نحتفل معكم في مناسبة أخرى!",
        validationName: "يرجى إدخال اسمك",
        alreadyRsvpd: "لقد قمت بتأكيد حضورك مسبقاً",
        spotsRemaining: "أماكن متبقية",
        spotsFilled: "أماكن مؤكدة",
        confirmedGuests: "الضيوف المؤكدون",
        groupFull: "تم ملء جميع الأماكن لهذه الدعوة",
        noResponses: "كن أول من يؤكد الحضور!",
      },
      footer: {
        coupleNames: couple.coupleNames.ar,
        date: date.short.ar,
        madeWith: "صُنع بحب",
      },
    },
  },
} as const

export type WeddingConfig = typeof weddingConfig
