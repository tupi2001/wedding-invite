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
    ar: "٢٢ مايو ٢٠٢٦",
  },
}

const venue = {
  name: {
    en: "Al Masa Hotel",
    ar: "فندق الماسة",
  },
  venue: {
    en: "Andalusite Hall, Al Masa Hotel",
    ar: "قاعة اندلسيت، فندق الماسة",
  },
  address: {
    en: "Nasr City",
    ar: "مدينة نصر",
  },
  city: {
    en: "Cairo, Egypt",
    ar: "القاهرة، مصر",
  },
  coordinates: { lat: 30.0612396, lng: 31.3170778 },
  googleMapsQuery: "Al+Masa+Hotel+Nasr+City",
  // Get this from Google Maps > Share > Embed a map
  embedUrl:
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.1498245946905!2d31.317077799999993!3d30.0612396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e51103c0615%3A0xc2eb3aec54a78cbc!2sAl%20Masa%20Hotel%20Nasr%20City!5e0!3m2!1sen!2sus!4v1772921606481!5m2!1sen!2sus",
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
    volume: 0.15,
  },

  // --------------------------------------------------------------------------
  // PROGRAM OF THE DAY
  // Each entry needs: time, titleKey, descKey, icon, color
  // Available icons: Heart, Wine, Gem, GlassWater, UtensilsCrossed, Music
  // The titleKey/descKey map to translations below.
  // --------------------------------------------------------------------------
  program: [
    { time: "", titleKey: "katbKitab", descKey: "katbKitabDesc", icon: "Gem" as const, color: "#c8a96e" },
    { time: "", titleKey: "weddingEntrance", descKey: "weddingEntranceDesc", icon: "Heart" as const, color: "#b08d98" },
    { time: "", titleKey: "firstDance", descKey: "firstDanceDesc", icon: "Music" as const, color: "#8aaa7e" },
    { time: "", titleKey: "party", descKey: "partyDesc", icon: "Wine" as const, color: "#b08d98" },
    { time: "", titleKey: "food", descKey: "foodDesc", icon: "UtensilsCrossed" as const, color: "#c8a96e" },
    { time: "", titleKey: "pictures", descKey: "picturesDesc", icon: "Heart" as const, color: "#95b08a" },
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
        dayArrived: "The Day Has Arrived!",
        dayArrivedSubtitle: "We hope to see you there",
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
        katbKitab: "Katb Kitab",
        katbKitabDesc: "The marriage contract ceremony",
        weddingEntrance: "Wedding Entrance",
        weddingEntranceDesc: "The grand entrance of the bride and groom",
        firstDance: "First Dance",
        firstDanceDesc: "The couple's first dance together",
        party: "Party",
        partyDesc: "Dancing and celebration",
        food: "Food",
        foodDesc: "A grand feast to celebrate",
        pictures: "Pictures",
        picturesDesc: "Capturing the memories of the night",
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
        thankYouConfirmed: "Thank you for confirming your attendance!",
        seeYouThere: "We look forward to celebrating with you",
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
        dayArrived: "!لقد حان اليوم",
        dayArrivedSubtitle: "نأمل أن نراكم هناك",
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
        katbKitab: "كتب الكتاب",
        katbKitabDesc: "مراسم عقد القران",
        weddingEntrance: "دخلة العروسين",
        weddingEntranceDesc: "الدخلة الكبرى للعروسين",
        firstDance: "الرقصة الأولى",
        firstDanceDesc: "الرقصة الأولى للعروسين",
        party: "الحفلة",
        partyDesc: "الرقص والاحتفال",
        food: "العشاء",
        foodDesc: "بوفيه عشاء مفتوح",
        pictures: "الصور",
        picturesDesc: "تخليد ذكريات الليلة",
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
        thankYouConfirmed: "شكراً لتأكيد حضوركم!",
        seeYouThere: "نتطلع للاحتفال معكم",
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
