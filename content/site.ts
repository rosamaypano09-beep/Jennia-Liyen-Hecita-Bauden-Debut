import {
  proposalRoleDefinitions,
  proposalRoleIdAliases,
} from "@/content/proposal-roles"

export type TimelineIconName =
  | "arrival"
  | "rings"
  | "departure"
  | "cocktail"
  | "fireworks"
  | "dance"
  // Debut program icons
  | "sun"
  | "moon"
  | "crown"
  | "rose"
  | "gift"
  | "toast"
  | "candle"
  | "music"
  | "video"
  | "dinner"

export type AttireGroupId = "sponsors" | "entourage" | "guests"
// A palette color: "#9CAF88" or { name: "Sage", hex: "#9CAF88" }
export type AttireColor = string | { name: string; hex: string }

/* ============================================================================
   SOP — CREATING / UPDATING A DEBUT INVITATION
   ----------------------------------------------------------------------------
   This file is the single source of truth for the celebrant's content. Pages,
   metadata (link previews), robots.txt, sitemap.xml, QR codes, the table
   finder and proposal pages all read from here. Avoid hard-coding the
   celebrant's name, dates, URLs or image paths in components — add them here.

   Colors live in app/globals.css (→ "MOTIF COLORS — DEBUT"), not here.

   NEW INVITATION — work top to bottom:
     1. CELEBRANT       name + nickname + age ({celebrant} in any text → nickname)
     2. DATE & TIMES    debut date, day, guest arrival / program / end times
     3. VENUE           name, address, Google Maps link, photos;
                        VENUE_CARDS = labels on the Event Details venue card
     4. RSVP            deadline, coordinator, phone; HASHTAGS
     5. WEBSITE         SITE_URL = the live domain (keep the trailing "/").
                        LINK_PREVIEW_IMAGE = 1200×630 JPG for Facebook/Messenger.
                        NEXT_PUBLIC_SITE_URL (env, e.g. on Vercel) overrides SITE_URL.
     6. LOOK & FEEL     DISPLAY_MODE "plain" or "photos"
     7. SHARED IMAGES   monogram, name lettering, wax seal, theme song, CELEBRANT_PHOTOS
     8. googleAPI       new Apps Script / Form URLs for THIS celebrant's sheet —
                        never reuse a previous client's (guests would mix).
     9. SECTIONS        program flow, attire, reminders, FAQ, gift guide,
                        theme song, snap & share, socials.
    10. Search for "⚠ check" and replace anything still left over.

   BEFORE GOING LIVE:
     • Put every referenced file in /public (paths are case-sensitive on Vercel).
     • Run `npm run build` to catch typos.
     • Paste the live URL in https://developers.facebook.com/tools/debug/ and
       click "Scrape Again" so Facebook picks up the new title + preview image.
     • Test RSVP search, a test RSVP submission, messages and /table on mobile.

   CONVENTIONS:
     • Image paths start with "/" and are relative to /public.
     • "" on a decoration/image hides it; show: false hides a card/account/link.
     • Placeholders like {celebrant}, {name}, {deadline} are filled automatically —
       keep the braces when editing text.
     • ⚠ marks values that still need the client's confirmation.
   ============================================================================ */

/* ============================================================================
   QUICK SETUP — edit these first.
   Every section below reads from here, so one change updates the whole site
   (loader, envelope, hero, details, program, RSVP, FAQ, footer, …).
   ============================================================================ */

// ── The celebrant ───────────────────────────────────────────────────────────
const CELEBRANT = {
  fullName: "Jennia Liyen Hecita Bauden",
  nickname: "Lilay", // Used everywhere as {celebrant}
  age: "18",
  ageWords: "Eighteen",
  title: "Debutante",
}

// ── Event details (from the client brief) ───────────────────────────────────
const EVENT = {
  type: "18th Birthday",
  theme: "The Mystery Unfolds",
  motif: "Masquerade · Victorian",
  colors: "Red, Black, Accents of Gold",
  themeSong: {
    title: "", // Add the celebrant's chosen theme song
    artist: "",
  },
}

// ── Date & times ────────────────────────────────────────────────────────────
const EVENT_DATE = "November 27, 2026"
const EVENT_DAY = "Friday"

const TIMES = {
  guestArrival: "6:00 PM", // The Venetian Arrival
  program: "6:30 PM", // The Grand Reveal Entrance — countdown target
  end: "", // ⚠ check — last program item is 9:00 PM; add the confirmed end time
}

// ── Venue ───────────────────────────────────────────────────────────────────
const VENUE = {
  name: "Roy's Hotel and Convention Center",
  address: "Araneta Ave, Bacolod, Negros Occidental, Philippines",
  map: "https://maps.app.goo.gl/FgnJ5RqYsRHEoHqr6", // Google Maps pin (directions button + QR); "" hides the map QR and buttons
  // Step-by-step directions (FAQ) — add once the venue is confirmed
  directions: [] as string[],
  landmarks: [] as string[],
  // Venue card slideshow (Event Details) — files in public/Details ([] shows the gold monogram panel)
  photos: [
    "/Details/venue (1).jpg",
    "/Details/venue (2).jpg",
    "/Details/venue (3).jpg",
  ] as string[],
}
const CEREMONY_VENUE = VENUE
const RECEPTION_VENUE = VENUE

// ── Venue card (Event Details section) ──────────────────────────────────────
// layout:
//   "combined" = ONE card (use this for a debut — single venue)
//   "separate" = two cards (CEREMONY_VENUE + RECEPTION_VENUE)
// badge        = small pill on the photo
// sectionLabel = label above the venue name
// showDate     = show the big Month / Day / Year
// showArrival  = show "Arrival: <guest arrival time>" (otherwise "At <time>")
const VENUE_CARDS = {
  layout: "combined" as "separate" | "combined",
  combined: {
    badge: "The Masquerade",
    sectionLabel: "Venue",
    showDate: true,
    showArrival: true,
    // Time rows on the card, e.g. "Doors 7:00 PM | Program 7:30 PM"
    ceremonyLabel: "Grand Reveal",
    receptionLabel: "Until",
    // true = also show the end time on the card (needs TIMES.end)
    showReceptionTime: false,
  },
  ceremony: {
    show: true,
    badge: "Program",
    sectionLabel: "Venue",
    showDate: true,
    showArrival: true,
  },
  reception: {
    show: false,
    badge: "After Glow",
    sectionLabel: "Venue",
    showDate: false,
    showArrival: false,
  },
}

// ── RSVP & contact ──────────────────────────────────────────────────────────
const RSVP = {
  deadline: "November 13, 2026",
  coordinator: "Lilay's Family",
  phone: "0942 569 3287", // ⚠ check — carried over from the previous invitation
  alternatePhone: "0924 136 4683", // ⚠ check — carried over from the previous invitation
}

const HASHTAGS = [
  "#LilayTurns18", // ⚠ check — confirm with the family
  "#TheMysteryUnfolds",
]
// ── Attire guide (Event Details → Attire Guidelines) ────────────────────────
// SHOW = which cards to display AND their order, top to bottom. Examples:
//   ["guests"]                            guests only
//   ["entourage", "guests"]               entourage (18 Roses etc.) + guests
//   []                                    hide the whole attire guide
// Each card: fill in only what you need — anything left "" or [] is hidden.
//   image:     illustration path in /public ("" = no image)
//   palette:   colors for this card — "#9CAF88" or { name: "Sage", hex: "#9CAF88" }
//   ladies / gentlemen:
//     label:     e.g. "Ladies", "Gentlemen" — leave "" to hide the heading (good for one inclusive blurb)
//     details:   the dress code text ("" hides this half of the card)
//     highlight: phrase inside details shown bold + underlined ("" for none)
// Dress code: Elegant Noir & Masquerade Venetian — all-black formal (DRESS_PALETTE)

// Dress code: Black Formal — four shades of black. The attire card shows them
// with names, the Dress Code reminder shows the same strip without names
const DRESS_PALETTE: AttireColor[] = [
  { name: "Jet", hex: "#0A0A0A" },
  { name: "Onyx", hex: "#1C1C1E" },
  { name: "Charcoal", hex: "#2E2D30" },
  { name: "Graphite", hex: "#46454A" },
]

const ATTIRE = {
  show: ["guests"] as AttireGroupId[], // one dress code for everyone

  sponsors: {
    title: "Family & Principal Sponsors",
    image: "",
    palette: [],
    ladies: {
      label: "Ladies",
      details:
        "Formal black long gowns or elegant black dresses.",
      highlight: "Formal Gowns",
    },
    gentlemen: {
      label: "Gentlemen",
      details:
        "Black suits or tuxedos.",
      highlight: "Formal Black Suits",
    },
  },

  entourage: {
    title: "18 Roses · Treasures · Cheers",
    image: "",
    palette: [],
    ladies: {
      label: "Ladies",
      details:
        "Formal black long gowns or elegant black dresses.",
      highlight: "Formal Gowns",
    },
    gentlemen: {
      label: "Gentlemen",
      details:
        "Black suits, tuxedos, or black long-sleeved dress shirts with tailored slacks. Keep your look formal and refined.",
      highlight: "Formal Attire",
    },
  },

  guests: {
    title: "Elegant Noir & Masquerade Venetian",
    image: "/Details/AttireGuide.png", // attire sample illustration
    palette: DRESS_PALETTE,
    ladies: {
      label: "Ladies",
      details:
        "A formal or semi-formal black long gown, elegant black dresses, or formal black long skirts.",
      highlight: "black long gown",
    },
    gentlemen: {
      label: "Gentlemen",
      details:
        "A black long-sleeved polo shirt with trousers, a suit, or a tuxedo.\n\n" +
        "Please note: graphic t-shirts and casual streetwear are strictly not allowed.",
      highlight: "strictly not allowed",
    },
  },
}

// ── Website address (used for QR codes, link previews, table finder) ────────
// NEXT_PUBLIC_SITE_URL (env) overrides this when set.
const SITE_URL = "https://jennia-liyen-hecita-bauden-debut.digitalinvitationrsvp.com/" // ⚠ check — confirm the live domain
// Image shown when the link is shared (Facebook, Messenger, Viber, X, …).
// Messenger is strict: use a JPG exactly 1200×630, under ~300 KB. When you replace it,
// change the file name (or bump ?v=) so Facebook fetches the new one instead of its cache.
const LINK_PREVIEW_IMAGE = "/Details/LinkPreview.png?v=2"
const LINK_PREVIEW_IMAGE_SIZE = { width: 1200, height: 630, type: "image/jpeg" }

// Site address with env override applied and no trailing slash — no need to edit
export const canonicalSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL).replace(/\/$/, "")
// A leftover NEXT_PUBLIC_SITE_URL from another client's project makes every link preview
// point at the wrong site (Messenger follows og:url) — flag it in the build log.
if (canonicalSiteUrl !== SITE_URL.replace(/\/$/, "")) {
  console.warn(
    `[site] NEXT_PUBLIC_SITE_URL (${canonicalSiteUrl}) differs from SITE_URL (${SITE_URL}). ` +
      "Link previews, QR codes and canonical URLs will use the env value.",
  )
}

// ── Look & feel ─────────────────────────────────────────────────────────────
// "plain"  = no photos anywhere: pearl pattern backgrounds, gold ornaments,
//            hides photo-only blocks (best until the debut photos arrive)
// "photos" = celebrant photos on the loader, envelope, hero, messages,
//            reminders, snap & share and the closing section
const DISPLAY_MODE = "photos" as "photos" | "plain"

// ── Shared images ───────────────────────────────────────────────────────────
const BRAND = {
  monogram: "/monogram/monogram.png", // botanical "B" (tinted per section)
  // Name lettering image (loader, envelope, proposals). "" = name in script text
  nameImage: "",
  seal: "/monogram/seal.png", // envelope wax seal
  // Theme song — drop the MP3 into /public/background_music with this exact name
  backgroundMusic: "/background_music/𝐃𝐢𝐧𝐢𝐧𝐠 𝐰𝐢𝐭𝐡 𝐚 𝐕𝐢𝐜𝐭𝐨𝐫𝐢𝐚𝐧 𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐃𝐚𝐫𝐤 𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐖𝐚𝐥𝐭𝐳 𝐌𝐮𝐬𝐢𝐜 (mp3cut.net).mp3", // ⚠ check — file not added yet
}

// Celebrant photos used in "photos" mode (loader, envelope, hero, reminders,
// snap & share, closing) — Lilay's debut shoot in /public/mobile-background.
// The /gallery page reads every file in /public/gallery.
// Every photo file by its number (add new ones here as Lilay's photos come in).
const PHOTO_FILES: Record<number, string> = Object.fromEntries(
  Array.from({ length: 17 }, (_, i) => [i + 1, `debut (${i + 1}).webp`]),
)
// Photo numbers that should never be shown on the invitation (loader, hero, etc.).
// The /gallery page shows every file in /public/gallery.
export const HIDDEN_PHOTOS: number[] = []
// Favorites picked for specific spots: PHOTO(n) = public/mobile-background/debut (n)
const PHOTO = (n: number) =>
  PHOTO_FILES[n] && !HIDDEN_PHOTOS.includes(n)
    ? `/mobile-background/${PHOTO_FILES[n]}`
    : undefined!
const CELEBRANT_PHOTOS = Object.keys(PHOTO_FILES)
  .map(Number)
  .filter((n) => !HIDDEN_PHOTOS.includes(n))
  .map(PHOTO)

// ── Decorations ─────────────────────────────────────────────────────────────
// The botanical PNGs are tinted antique gold by --deco-filter in app/globals.css.
// Change a path here to swap it on every section at once.
// To change ONE section only, override it there, e.g. decos: { ...SECTION_DECOS, footerVine: "" }
const DECOR = {
  cornerTopLeft: "/deco/top-left-deco.png",
  cornerTopRight: "/deco/top-right-deco.png",
  cornerBottomLeft: "/deco/bottom-left-deco.png",
  cornerBottomRight: "/deco/bottom-right-deco.png",
  headerOrnament: "/deco/lovestorydeco/Elegant-Eucalyptus-centerdot.png", // small sprig above titles
  footerVine: "/deco/lovestorydeco/Elegant-Eucalyptus-bottom.png", // long vine at section ends
  sideLeft: "/deco/lovestorydeco/Elegant-Eucalyptus-Left.png", // side sprigs
  sideRight: "/deco/lovestorydeco/Elegant-Eucalyptus-Right.png",
}

// The four corners as one set
const CORNER_DECOS = {
  topLeft: DECOR.cornerTopLeft,
  topRight: DECOR.cornerTopRight,
  bottomLeft: DECOR.cornerBottomLeft,
  bottomRight: DECOR.cornerBottomRight,
}

// Default decoration set used by most sections (corners + ornament + vine)
const SECTION_DECOS = {
  ...CORNER_DECOS,
  headerOrnament: DECOR.headerOrnament,
  footerVine: DECOR.footerVine,
}

/* ============================================================================
   SECTIONS — wording and per-section options. Values above are referenced here.
   ============================================================================ */

// Principal sponsors Google Apps Script — used by the main page and /inviteone
// ⚠ check — every googleAPI URL below still points to the template's sheets.
const SPONSORS_API = "https://script.google.com/macros/s/AKfycbyshIGnzkJcoUYvyp87stqt7njnZKNKF0klc0PWQU8PM8Dz17P6LyaipJ9XRfxljjqR/exec"

export const siteConfig = {
  siteUrl: SITE_URL,
  linkPreviewImage: LINK_PREVIEW_IMAGE,
  linkPreviewImageSize: LINK_PREVIEW_IMAGE_SIZE,
  // The celebrant — read by every section. {celebrant} in any text → nickname.
  celebrant: {
    ...CELEBRANT,
    monogram: BRAND.monogram,
  },
  event: EVENT,
  // Navbar links (components/navbar.tsx) — same order as the sections on the page.
  // wideOnly: shown in the desktop bar only on extra-wide screens (always in the phone menu).
  nav: {
    links: [
      { href: "#home", label: "Home" },
      { href: "#welcome", label: "Welcome", wideOnly: true },
      { href: "#love-story", label: "My Note" },
      { href: "#countdown", label: "Countdown", wideOnly: true },
      { href: "#gallery", label: "Gallery" },
      { href: "#messages", label: "Messages" },
      { href: "#details", label: "Details" },
      { href: "#wedding-timeline", label: "Program" },
      { href: "#entourage", label: "Entourage" },
      { href: "#guest-list", label: "RSVP" },
      { href: "#guests", label: "Guests" },
      { href: "#faq", label: "FAQ" },
      { href: "#registry", label: "Gifts" },
      { href: "#playlist", label: "Theme Song" },
      { href: "#snap-share", label: "Snap & Share" },
      { href: "#see-you-there", label: "See You There", wideOnly: true },
    ] as { href: string; label: string; wideOnly?: boolean }[],
  },
  // Legacy shape kept for the dashboard / Google Sheet merge — mirrors the celebrant.
  couple: {
    bride: CELEBRANT.fullName,
    brideNickname: CELEBRANT.nickname,
    groom: "",
    groomNickname: "",
    monogram: BRAND.monogram,
    backgroundMusic: BRAND.backgroundMusic,
  },
  googleAPI:{
    messageForm: "https://docs.google.com/forms/d/e/1FAIpQLSe1oN68s4ojBnxnF_c8O7zHgum9xUpA1TMHT3Eye5UO4gKUDg/formResponse", // ⚠ check
    message: "https://script.google.com/macros/s/AKfycby7aSB3uTOvlk9uIv7JukMQpBAKhdsCDVANNns2LOj8Shlcuzxbp_L5XbV3qctDwIbt/exec", // ⚠ check
    guestList: "https://script.google.com/macros/s/AKfycbxqGbIQf6gChhaufmN9KksmPUKYuA12AiFL-tj7NBB2aAgy7f1lqrdWmcP8xb44faUR/exec", // ⚠ check
    guestRequest: "https://script.google.com/macros/s/AKfycbxkOXKtljDYPU7lwmAqfoUjY9MmewJ6mXMoqwRqr64n4zwNlssu2HisUFbfStF4fs5o/exec", // ⚠ check
    entourage: "https://script.google.com/macros/s/AKfycbxHWKLlyzQSMd9bauGFZF3g0MzfaIMtGAyGGkIkXqJxtQ7XgpcELwfo9gj8GLfGINuI/exec", // ⚠ check
    sponsors: SPONSORS_API,
    // Principal sponsors shown on /inviteone and /invitetwo (entourage section)
    sponsorsInviteOne: SPONSORS_API,
    sponsorsInviteTwo: "https://script.google.com/macros/s/AKfycbyshIGnzkJcoUYvyp87stqt7njnZKNKF0klc0PWQU8PM8Dz17P6LyaipJ9XRfxljjqR/exec",
    googleShare: "https://docs.google.com/spreadsheets/d/146ZQb9Lx1JPX-WpL3h0BhkLf3cBgYxhQ9sUEy4uk5KY/edit?usp=sharing", // ⚠ check
    videoMessageForm:
      "https://docs.google.com/forms/d/e/1FAIpQLSfeGlEl4CMXWefdvCw6AOPHFS1ROku_rs-Gbofa2LkVJ0sLGQ/viewform",
  },
  wedding: {
    date: EVENT_DATE,
    time: TIMES.program,
    venue: VENUE.name,
    tagline: `is turning ${CELEBRANT.age}`,
    theme: EVENT.theme,
    motif: EVENT.colors,
  },
  // Top hero on the main page (components/sections/hero.tsx)
  hero: {
    srTitle: "You're invited to the debut of {celebrant} — Jennia Liyen Hecita Bauden turns eighteen",
    // Ornate mask floating above the invitation line ("" hides it)
    crestImage: "/images/Ornate Venetian Masquerade Mask with Red Feathers.png",
    kicker: "You are cordially invited to the masquerade of", // Small line above the name ("" hides it)
    titleMain: "{celebrant}", // Nickname in large gold script
    eyebrow: CELEBRANT.fullName, // Full name in caps under the nickname ("" hides it)
    titleScript: "turns eighteen", // Script line above the date ("" hides it)
    // Italic line under the date ("" hides it)
    tagline: "Behind every mask is a story. Come write the first chapter of mine.",
    // Weekday · time · venue under the tagline (from ceremony); false hides it
    showMeta: true,
    countdownHeading: "Until the masquerade begins",
    countdownLabels: {
      days: "Days",
      hours: "Hours",
      minutes: "Minutes",
      seconds: "Seconds",
    },
  },
  // Welcome letter (components/sections/welcome.tsx)
  welcome: {
    // Header lockup: title (serif caps) → connector (small caps between gold rules) → script
    title: "The Mystery",
    connector: "unfolds", // "" hides this line
    script: "at eighteen",
    // Featured pull-quote under the title, between gold rules ("" hides it)
    quote: "Behind every mask is a story. Come write the first chapter of mine.",
    // Opening line of the letter ("" hides it)
    greeting: "To the people who shaped my story,",
    paragraphs: [
      "For eighteen years, you have watched me grow — through every quiet season, every lesson, and every small victory. Now, as I step out of the shadows of youth and into the light of adulthood, there is no one I would rather have beside me to witness it.",
      "You are cordially invited to an evening of mystery, elegance, and celebration: a modern Venetian Masquerade, where we will share cherished traditions, count down together to the stroke of the night, and step into the future completely unmasked.",
      "Come dressed in noir, bring your finest mask, and let the evening keep its secrets until the very last moment. Everything you need — the program, the venue, and the dress code — waits in the pages ahead.",
    ],
    // "The evening at a glance" — short moments from the program ([] hides the strip)
    highlightsTitle: "The evening at a glance",
    highlights: ["The Grand Reveal", "The Mystery Waltz", "The Royal Banquet", "The Unmasking Hour"],
    signOff: "Until the masks come off,",
    signature: "{celebrant}",
  },
  // Opening "Save the Date" loading screen (components/loader/LoadingScreen.tsx).
  // Styled like a red-velvet soirée poster: celebrant name as the big serif title,
  // pearls + gold details, a two-column "highlights" row and a three-column details row.
  loadingScreen: {
    // "photos" = sliding photo background + photo date cards
    // "plain"  = no photos: red velvet backdrop with pearls + engraved date
    display: DISPLAY_MODE,
    // Debut poster (red velvet + gold). {celebrant} → nickname; "" hides a line.
    // Date / time / venue in the details row come from ceremony.
    gala: {
      photo: "/Details/debutant.png", // cut-out portrait (transparent background)
      eyebrow: "You are cordially invited to the masquerade of",
      // Gilded corner pieces on the loader ("" hides one)
      corners: {
        topLeft: "/deco/top-left.png",
        topRight: "/deco/top-right.png",
        bottomLeft: "/deco/bottom-left.png",
        bottomRight: "/deco/bottom-right.png",
      },
      // Date · time and venue under the full name (from ceremony); false hides them
      showDetails: true,
      cardEyebrow: "You're Invited", // top line on the paper card inside the envelope
      // Invitation line on the paper card, above the name ("" hides it)
      cardLine: "You are cordially invited to an evening of mystery, elegance, and celebration",
      title: "{celebrant}", // nickname in gold script
      subtitle: CELEBRANT.fullName, // full name in caps beneath
      taglineLeft: ["Behind", "every mask", "is a", "story"],
      taglineRight: ["Come write", "the first", "chapter", "of mine"],
      kicker: "A Venetian Masquerade",
      // Ghost lettering that drifts down the left edge and up the right ([] hides it)
      ghostText: ["{celebrant}", CELEBRANT.fullName, "Eighteen"],
      occasionNumber: CELEBRANT.age,
      occasionSuffix: "th",
      occasion: "Birthday",
    },
    // Colors used when display is "plain"
    plainTheme: {
      background: "var(--color-welcome-bg)",
      text: "var(--color-welcome-text)",
      accent: "var(--color-welcome-gold)",
    },
    // Sliding background photos (display: "photos"); files live in /public
    backgroundPhotos: CELEBRANT_PHOTOS,
    // Photo marquee behind the loading screen poster only (falls back to backgroundPhotos if empty)
    loaderPhotos: [17, 16, 15, 14, 13, 12, 11, 10].map(PHOTO).filter(Boolean),
    // Poster corners: small caps at the very top (left sits beside the monogram). "" hides one.
    topLeft: "The Debut",
    topRight: VENUE.name,
    headline: "Save the Date",
    // {days} is replaced with the number of days left before the debut
    countdownText: "{days} nights until the eighteenth",
    countdownOneDayText: "One night until the eighteenth",
    countdownTodayText: "Tonight, she turns eighteen",
    countdownPastText: "Thank you for celebrating her eighteenth",
    coupleNameImage: BRAND.nameImage,
    // Polaroids that rise out of the envelope: [left, right, then extra desktop spots]
    photos: [
      PHOTO(1), // left
      PHOTO(2), // right
      PHOTO(6),
      PHOTO(10),
    ],
    dateLabels: ["Month", "Day", "Year"],
    // Wording around the celebrant's name (both modes; "" to hide a line)
    plainInvite: {
      ornament: DECOR.headerOrnament, // sprig on the envelope letter ("" = none)
      lineAbove: "You are cordially invited to an evening of mystery, elegance, and celebration —",
      lineBelow: "",
    },
    // Two numbered highlights, like a poster's "01 / 02" offers ([] hides the row)
    highlights: [
      { label: "Dress Code", text: "Elegant Noir & Masquerade Venetian" },
      { label: "The Night", text: "A modern Venetian Masquerade" },
    ],
    // Bottom details row — {guestsTime}, {programTime}, {endTime}, {venue} are filled in
    showCeremonyDetails: true,
    details: [
      { label: "Doors", value: "{guestsTime}" },
      { label: "Venue", value: "{venue}" },
      { label: "Program", value: "{programTime}" },
    ],
    // Used by the envelope (components/loader/Hero.tsx)
    eyebrow: "You are invited",
    message: "An evening of mystery, elegance & celebration",
    // Rotates under the progress bar while the invitation loads
    statusMessages: [
      "Polishing the masks",
      "Lighting the candelabras",
      "Setting the royal banquet",
      "Saving your seat at the ball",
    ],
    durationMs: 8000, // minimum — longer only if the files are still loading
    // Invitation envelope (components/loader/Hero.tsx) — shares display + photos with loader above
    hintText: "Tap the Seal to Open",
    enterButtonText: "View the Invitation",
    sealImage: BRAND.seal,
    cornerDecos: { ...CORNER_DECOS },
  },
  // Letters section (components/sections/love-story.tsx + StorySection)
  // Plain mode shows each note as a card; photos mode adds the chapter image.
  loveStory: {
    title: "My Story",
    subtitle: "twelve chapters, eighteen years",
    // Word before each card's number, e.g. "Chapter 01"
    chapterLabel: "Chapter",
    closingQuote:
      "Behind every mask is a story. Thank you for being part of mine.",
    closingCitation: "{celebrant}",
    eucalyptusDecos: {
      topLeft: DECOR.sideLeft,
      bottomRight: DECOR.sideRight,
      timelineTop: DECOR.headerOrnament,
      sectionBottom: DECOR.footerVine,
    },
    // Ornate corners on each chapter photo — alternate per chapter:
    // chapters 1, 3, 5… use top-left + bottom-right; 2, 4, 6… use top-right + bottom-left
    photoCorners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    // Twelve chapters, one per photo (PHOTO(n) = public/mobile-background/debut (n).webp).
    // ⚠ check — written around the masquerade theme; ask the family to personalize
    // any chapter with real names, places, or memories.
    chapters: [
      {
        title: "The First Light",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(1),
        paragraphs: [
          "Every story begins in the dark before the curtain rises. Mine began with a family who waited, prayed, and welcomed me with open arms — the very first audience to ever see my face.",
        ],
      },
      {
        title: "Little Masks",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(17),
        paragraphs: [
          "As a child, I wore a hundred different faces: princess, dreamer, explorer, storyteller. Every game of pretend was a small rehearsal for the person I would one day become.",
        ],
      },
      {
        title: "Home & Hearth",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(16),
        paragraphs: [
          "Long before I knew what a ballroom was, I knew what home felt like — warm meals, familiar voices, and the people who loved me exactly as I was. They are the foundation of every chapter that followed.",
        ],
      },
      {
        title: "Lessons in Grace",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(15),
        paragraphs: [
          "School taught me more than lessons on paper. It taught me patience, courage, and how to stand back up with grace whenever I stumbled.",
        ],
      },
      {
        title: "Kindred Hearts",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(5),
        paragraphs: [
          "Somewhere along the way, I found my people — friends who laughed with me, kept my secrets, and stayed. Some stories are only worth telling because of the ones who shared them.",
        ],
      },
      {
        title: "The Quiet Seasons",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(6),
        paragraphs: [
          "Not every chapter was easy. There were seasons of doubt and silence, but they shaped me in ways the bright days never could. Behind every mask, I learned, is a heart still growing.",
        ],
      },
      {
        title: "Finding My Voice",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(7),
        paragraphs: [
          "Slowly, I stopped hiding behind the masks. I began to discover what I love, what I believe, and who I want to be — and I learned that being myself was the bravest role of all.",
        ],
      },
      {
        title: "Faith in the Unseen",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(13),
        paragraphs: [
          "Through every turn, I was never alone. Prayers whispered by the people who love me, and grace I could not always see, carried me further than I could have gone on my own.",
        ],
      },
      {
        title: "Rouge & Noir",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(14),
        paragraphs: [
          "I grew into my own colors — a little bold, a little mysterious, and entirely mine. Like red against black, I learned that strength and softness can belong to the same story.",
        ],
      },
      {
        title: "The Waltz of Time",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(10),
        paragraphs: [
          "The years moved like a waltz: slow at first, then suddenly spinning. One moment I was a little girl at the window; the next, I was counting down to eighteen.",
        ],
      },
      {
        title: "On the Eve",
        theme: "light" as const,
        layout: "image-left" as const,
        image: PHOTO(11),
        paragraphs: [
          "Now the candles are lit and the masks are ready. Before I step into the light, I look back with gratitude at everyone who walked with me to this night.",
        ],
      },
      {
        title: "Unmasked",
        theme: "dark" as const,
        layout: "image-right" as const,
        image: PHOTO(12),
        paragraphs: [
          "At the stroke of the Grand Countdown, the masks will come off and a new chapter will begin. I would be honored to have you there as I step into the future — completely myself, completely unmasked.",
        ],
      },
    ],
  },
  // Gallery section (components/sections/gallery.tsx — not on the main page by default)
  gallery: {
    eyebrow: "My Moments",
    title: "Gallery",
    subtitle: "eighteen years of memories",
    description:
      "From my very first steps to this new chapter — every photo holds a memory I treasure.",
    footnote:
      "Tap any photo to view it up close. More moments will be added after the masquerade.",
    buttonText: "View Full Gallery", // button removed from the section; kept for the /gallery page
    buttonHref: "/gallery",
    decos: { ...SECTION_DECOS },
    // Mask & rose corner pieces on the section ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    images: CELEBRANT_PHOTOS.map((image) => ({ image, text: "" })),
  },
  // Countdown section (components/sections/countdown.tsx)
  countdown: {
    title: "Counting Down",
    script: "to my eighteenth",
  },
  // Event details section (components/sections/details.tsx)
  // Venue name, address, date, times, map and photos come from VENUE above.
  // In reminder text, {guestsTime}, {ceremonyTime} and {endTime} are filled in.
  eventDetails: {
    eyebrow: "The Masquerade",
    title: "Event Details",
    subtitle: "where the mystery unfolds",
    description: "Everything you need for an evening of mystery and elegance — the venue, the dress code, and a few gentle notes before the masks come out.",
    // Mask & rose corner pieces: on the section, and in pairs on the venue + attire cards ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    decos: { ...SECTION_DECOS },
    venues: VENUE_CARDS,
    labels: {
      arrival: "Arrival",
      at: "At",
      scanForDirections: "Scan for directions",
      getDirections: "Get Directions",
      copyAddress: "Copy Address",
      copied: "Copied!",
    },
    attire: {
      title: "Attire Guidelines",
      description: "To maintain the mysterious and unified look of our Venetian ball, we kindly ask all guests to strictly follow our all-black formal palette.",
      paletteTitle: "Dress Code Palette",
      paletteSubtitle: "All Black",
      colorGuideTitle: "Dress Code: Elegant Noir & Masquerade Venetian",
      colorGuideNote:
        "To maintain the mysterious and unified look of our Venetian ball, we kindly ask all guests to strictly follow our all-black formal palette.",
      // Order and visibility come from ATTIRE.show (skips blanks, typos and repeats)
      groups: ATTIRE.show
        .filter((id, i, list) => ["sponsors", "entourage", "guests"].includes(id) && list.indexOf(id) === i)
        .map((id) => ({ id, ...ATTIRE[id] })),
      palette: DRESS_PALETTE, // shown (without names) in the Dress Code reminder
    },
    reminders: {
      title: "Gentle Reminders",
      description: "A few thoughtful notes so everyone can enjoy the night.",
      // Shown as 9:16 portrait cards; the 1st sits in front, the rest fan out behind it
      images: [PHOTO(1), PHOTO(2), PHOTO(3), PHOTO(5)],
      // showPalette: shows the dress code palette after the first paragraph
      items: [
        {
          title: "Dress Code",
          variant: "accent" as "accent" | "soft",
          showPalette: true, // color strip after the first paragraph
          paragraphs: [
            "Elegant Noir & Masquerade Venetian — please strictly follow our all-black formal palette. Graphic t-shirts and casual streetwear are not allowed.",
          ],
        },
        {
          title: "Arrival",
          variant: "soft" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "Doors open at {guestsTime}. Please arrive on time so you can find your seat and settle in before the program begins at {ceremonyTime}.",
          ],
        },
        {
          title: "Capture the Night",
          variant: "accent" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "Feel free to take photos and videos throughout the evening! We kindly ask that you let our official photographers take the lead during the Grand Reveal Entrance, the Mystery Waltz, and the Unmasking Hour so every moment is captured beautifully.",
          ],
        },
        {
          title: "For My 18 Candles",
          variant: "soft" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "To my 18 Candles, instead of a spoken message, may I kindly ask you to bring a handwritten letter? Your words will become keepsakes I can hold onto, reread, and treasure for many years to come.",
          ],
        },
        {
          title: "The Unmasking Hour",
          variant: "accent" as "accent" | "soft",
          showPalette: false,
          paragraphs: [
            "Bring your mask and stay for the Grand Countdown & Unmasking Hour at 8:30 PM, followed by the Illuminated Pathway & the Grand Toast at 9:00 PM.",
          ],
        },
      ],
    },
  },
  // Program flow (components/sections/wedding-timeline.tsx) — from the client brief
  weddingTimeline: {
    // Built from EVENT_DATE + TIMES so it always matches Event Details
    kicker: `${EVENT_DAY}, ${EVENT_DATE.replace(/,\s*\d{4}$/, "")} · Doors ${TIMES.guestArrival} · Grand Reveal ${TIMES.program}`,
    title: "The Program",
    subtitle: "an evening in six acts",
    description:
      "From the first masked arrival to the final toast — here is how the mystery will unfold.",
    // Word before each event's number, e.g. "Act I" ("" hides the numbering)
    actLabel: "Act",
    quote: "Behind every mask is a story. Tonight, the first chapter begins.",
    quoteCitation: "{celebrant}",
    // Corner decorations — mask & rose pieces ("" hides one)
    decos: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    // Each event — shown top to bottom in this order (move a block to reorder):
    //   show:     false = hide it (kept here to edit later)
    //   tag:      small label beside the time, e.g. "Guests Arrival" ("" to hide)
    //   location: text under the title; {ceremony} / {reception} → venue name ("" to hide)
    //   image:    line-art illustration in /public/debut-timeline (black on transparent,
    //             shown gold); "" uses the icon instead
    //   icon:     "sun" | "moon" | "crown" | "rose" | "gift" | "toast" | "candle" |
    //             "music" | "video" | "dinner" | "arrival" | "dance" | "departure" | …
    //   description: one short line about the moment ("" to hide)
    events: [
      {
        show: true,
        time: "6:00 PM",
        title: "The Venetian Arrival",
        tag: "Guests Arrival", // small label beside the time ("" hides it)
        description: "Masks on and dressed in noir — arrive, find your seat, and let the candlelit ballroom set the mood.",
        location: "",
        image: "/debut-timeline/message.png",
        icon: "arrival" as TimelineIconName,
      },
      {
        show: true,
        time: "6:30 PM",
        title: "The Grand Reveal Entrance",
        tag: "", // small label beside the time ("" hides it)
        description: "The curtains part and the debutante makes her grand entrance into the masquerade.",
        location: "",
        image: "/debut-timeline/assembly.png",
        icon: "crown" as TimelineIconName,
      },
      {
        show: true,
        time: "7:00 PM",
        title: "The Mystery Waltz",
        tag: "", // small label beside the time ("" hides it)
        description: "A masked waltz opens the dance floor — an elegant first dance in the spirit of a Venetian ball.",
        location: "",
        image: "/debut-timeline/dance-party.png",
        icon: "dance" as TimelineIconName,
      },
      {
        show: true,
        time: "7:30 PM",
        title: "Royal Banquet & Parlor Games",
        tag: "", // small label beside the time ("" hides it)
        description: "Dinner is served, followed by parlor games that bring every table into the fun.",
        location: "",
        image: "/debut-timeline/dinner.png",
        icon: "dinner" as TimelineIconName,
      },
      {
        show: true,
        time: "8:30 PM",
        title: "The Grand Countdown & Unmasking Hour",
        tag: "", // small label beside the time ("" hides it)
        description: "Together we count down to the stroke of the hour — and at the final second, every mask comes off.",
        location: "",
        image: "/debut-timeline/18roses-candle-lighting.png",
        icon: "candle" as TimelineIconName,
      },
      {
        show: true,
        time: "9:00 PM",
        title: "The Illuminated Pathway & The Grand Toast",
        tag: "", // small label beside the time ("" hides it)
        description: "The lights lead the way to a final toast — to eighteen, and to every chapter still to come.",
        location: "",
        image: "/debut-timeline/debutant-speech.png",
        icon: "toast" as TimelineIconName,
      },
    ],
  },
  // Debut entourage (components/sections/entourage.tsx)
  // Names and roles come from the Google Sheet (googleAPI.entourage) — use the
  // RoleCategory values listed in categoryOrder below.
  entourage: {
    // ⚠ Shown on request while googleAPI.entourage still points to the template's
    // sheet — it lists a previous client's wedding party (Parents of the Groom/Bride,
    // Best Man, …). Swap in Lilay's own sheet before sharing the invitation.
    show: true,
    eyebrow: "The Masquerade Court",
    title: "The Entourage",
    subtitle: "my court of the evening",
    description:
      "The cherished hearts who will stand beside me on the night the masks come off — family, friends, and everyone who shaped my first eighteen years.",
    // Ornate mask at the top of the arched card ("" hides it)
    crestImage: "",
    // Mask & rose corner pieces on the section ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    coupleKicker: "The Debutante",
    coupleLine: "Eighteen years behind the mask",
    coupleHeading: "The Celebrant",
    celebrantRole: "Debutante",
    // Kept for the template — not shown on a debut
    groomRole: "",
    brideRole: "Debutante",
    loadingText: "Loading the entourage...",
    retryingText: "Still gathering the entourage. Trying again...",
    errorText: "Unable to load the entourage",
    retryText: "Try again",
    // Sheet RoleCategory values shown in this order (anything else shows after them)
    categoryOrder: [
      "Parents of the Debutante",
      "18 Roses",
      "One of My 18 Roses",
      "18 Candles",
      "One of My 18 Candles",
      "18 Treasures",
      "One of My 18 Treasures",
      "18 Shots",
      "18 Cheers",
      "One of My 18 Cheers",
      "18 Monetary Gifts",
      "One of My 18 Monetary Gifts",
    ],
    // Leave any path "" to hide that decoration
    decos: { ...SECTION_DECOS },
    // Rename any heading shown in the entourage card: "Heading as shown": "Your text"
    headingLabels: {
      "Parents of the Debutante": "Parents of the Debutante",
      Escort: "Escort",
      "18 Roses": "18 Roses",
      "18 Candles": "18 Candles",
      "18 Treasures": "18 Treasure Gifts",
      "18 Shots": "18 Shots",
      "18 Cheers": "18 Cheers",
      "18 Monetary Gifts": "18 Monetary Gifts",
      // Category names as written in the entourage sheet
      "One of My 18 Roses": "18 Roses",
      "One of My 18 Candles": "18 Candles",
      "One of My 18 Treasures": "18 Treasure Gifts",
      "One of My 18 Treasure Gifts": "18 Treasure Gifts",
      "One of My 18 Cheers": "18 Cheers",
      "One of My 18 Monetary Gifts": "18 Monetary Gifts",
    } as Record<string, string>,
  },
  // RSVP / guest list (components/sections/guest-list.tsx) — card, search, RSVP form and all modals.
  // Placeholders: {name}, {count}, {n}, {celebrant}. The deadline comes from details.rsvp.deadline.
  rsvp: {
    headerOrnament: DECOR.headerOrnament, // "" to hide
    title: "RSVP",
    script: "Will you be there",
    intro: "Kindly confirm your attendance so a seat can be saved for you on this special night.",
    deadlineLabel: "RSVP Deadline",
    openButton: "Tap here to respond",
    search: {
      title: "RSVP",
      script: "Find your Name",
      placeholder: "Begin with your first name",
      loading: "Preparing the guest list. We'll keep trying until names appear.",
      refine: "Keep typing to refine results",
      notFoundTitle: "Not finding your name?",
      notFoundText: "I'd love to have you there. Send a request to join the celebration.",
      requestButton: "Request to Join",
    },
    invite: {
      title: "You are Invited",
      scriptFallback: "to my debut",
      greeting: "Hello {name}, you are invited to {celebrant}'s debut!",
      seats: "We've reserved {count} for you.",
      seatSingular: "seat",
      seatPlural: "seats",
    },
    responded: {
      title: "Thank You for Responding!",
      text: "Your RSVP is in — I can't wait to celebrate with you!",
      attending: "You're Attending!",
      declined: "Unable to Attend",
      guestCountLabel: "Number of Guests",
      closeButton: "Close",
    },
    form: {
      attendLabel: "Can you attend? *",
      yes: "Yes!",
      no: "Sorry, No",
      companionsLabel: "Who's Coming With You?",
      companionsHint: "Please provide names and relationships for your {count} additional {guests}",
      guestSingular: "guest",
      guestPlural: "guests",
      companionTitle: "Guest {n}",
      companionNameLabel: "Full Name",
      companionNamePlaceholder: "Name of guest {n}",
      relationshipLabel: "Relationship with {name}",
      relationshipFallbackName: "Primary Guest",
      relationshipPlaceholder: "e.g., Spouse, Friend, Child, Parent",
      relationshipOptions: ["Spouse", "Partner", "Child", "Parent", "Sibling", "Friend"],
      companionProgress: "Guest {n} of {total}",
      companionsAdded: "{done} of {total} added",
      prevButton: "Back",
      nextButton: "Next guest",
      phoneLabel: "Phone Number *",
      phonePlaceholder: "09XX XXX XXXX",
      phoneNote: "For debut updates only. Your number stays private and will never be shown to other guests.",
      submitting: "Submitting...",
      submit: "Submit RSVP",
    },
    phoneAlert: {
      title: "A phone number is needed",
      paragraphs: [
        "We ask for your number so we can reach you with important updates — seating, timing, or anything you may need on the night.",
        "Your number will not appear on this invitation and will not be shared with other guests. It is kept private and used only by the family and coordinators.",
      ],
      button: "Add my number",
    },
    success: {
      title: "RSVP Confirmed",
      attending: "I'm so happy you'll be there — your seat is saved!",
      declined: "You'll be missed, but thank you for letting me know.",
      neutral: "Thank you for your response!",
      messagePrompt:
        "Before you go, leave a message for {celebrant} — your words will be a keepsake from her eighteenth.",
      messageButton: "Leave a Message",
      laterButton: "Maybe later — close",
    },
    request: {
      title: "Request",
      script: "to join",
      greetingNamed: "Hi {name} — want to celebrate with us? Send a request!",
      greeting: "Want to celebrate with us? Send a request!",
      optional: "(Optional)",
      nameLabel: "Full Name *",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email Address",
      emailPlaceholder: "your.email@example.com",
      phoneLabel: "Phone Number",
      phonePlaceholder: "+63 912 345 6789",
      guestsLabel: "Number of Guests *",
      guestsPlaceholder: "How many guests?",
      messageLabel: "Message",
      messagePlaceholder: "Share why you'd like to join...",
      submitting: "Submitting...",
      submit: "Send Request",
      sentTitle: "Request Sent!",
      sentText: "Your request has been received",
      sentSubtext: "The family will review it and get back to you soon",
      autoClose: "This will close automatically",
    },
    messages: {
      thankYou: "Thank you for your response!",
      requestSubmitted: "Request submitted! The family will review and get back to you.",
      loadFailed: "Failed to load guest list",
      selectAttendance: "Please select if you can attend",
      nameRequired: "Name is required",
      requestFailed: "Failed to submit request. Please try again.",
      submitFailed: "We couldn't save your RSVP. Please check your connection and try again.",
    },
  },
  // Messages section (components/sections/messages.tsx)
  messages: {
    title: "Love Notes",
    script: "for the debutante",
    description: "Share a note, a wish, or a prayer for {celebrant}. Every message becomes a keepsake from her eighteenth.",
    formTitle: "Share Your Wishes",
    formSubtitle: "Leave a note for {celebrant} to read and keep.",
    messagePlaceholder: "Write your wishes, prayer, or kind words for {celebrant}...",
    wallTitle: "Messages from Loved Ones",
    wallSubtitle: "Warm words from family and friends",
  },
  // Messages wall (components/sections/message-wall-display.tsx)
  // Small decorations on each message card — leave "" to hide
  messageWall: {
    emptyText: "Be the first to leave a note for the debutante.",
    cardDecos: {
      topRight: DECOR.cornerTopRight,
      bottomLeft: "",
    },
  },
  // Book of guests (components/sections/book-of-guests.tsx) — confirmed guests come from the guest list API.
  bookOfGuests: {
    title: "Book of Guests",
    subtitle: "celebrating with me",
    description:
      "Meet the cherished people joining the celebration — your presence makes this night truly special.",
    statsEyebrow: "The Celebration",
    guestSingular: "Guest",
    guestPlural: "Guests",
    statsCaption: "Celebrating With Me",
    rsvpSingular: "RSVP",
    rsvpPlural: "RSVPs",
    partySingular: "Party",
    partyPlural: "Parties",
    thankYou: "Thank you for confirming your RSVP — your presence means the world to me.",
    updatedLabel: "Updated",
    refreshLabel: "Refresh guest counts",
    listEyebrow: "Joining Us",
    listDescription: "A glimpse of the wonderful guests celebrating with me",
    vipLabel: "VIP",
    noTable: "No Table Yet",
    companionsLabel: "With Them",
    companionsMore: "+{count} more",
    companionsLess: "Show less",
    confirmedLabel: "Confirmed",
    emptyTitle: "Guest list updating",
    emptyText: "Confirmed guests will appear here as RSVPs come in.",
    cardsPerView: 4,
    decos: { ...SECTION_DECOS },
  },
  // FAQ (components/sections/faq.tsx)
  // In answers you can use:
  //   {deadline}    → details.rsvp.deadline
  //   {coordinator} → details.rsvp.coordinator
  //   {contact}     → " at <phone>" when details.rsvp.phone is set (empty while "to be announced")
  //   {celebrant}   → celebrant nickname
  //   [link text](#section-id) → a link that smoothly scrolls to that section
  //   A blank line (\n\n) starts a new paragraph; lines starting with "• " show as a bulleted list
  faq: {
    eyebrow: "Before the Masquerade",
    title: "Frequently Asked Questions",
    subtitle: "secrets worth sharing",
    description:
      "A few gentle notes so you can simply arrive, put on your mask, and enjoy the night with me.",
    // Mask & rose pieces: section corners + two corners of the question card ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    decos: { ...SECTION_DECOS },
    // In answers: {deadline}, {coordinator}, {contact}, {celebrant}, {guestsTime},
    // {programTime}, {endTime}, {venueName}, {venueAddress} are filled in,
    // [label](#section-id) becomes a link that scrolls to that section, a blank line
    // starts a new paragraph, and lines starting with "• " show as a list.
    items: [
      {
        question: "How do I RSVP?",
        answer:
          "Open the [RSVP](#guest-list) card on this invitation, search for your name, and confirm whether you can join the masquerade.\n\nKindly respond by {deadline} so your seat can be prepared.\n\nFor any questions, please reach out to {coordinator}{contact}.",
      },
      {
        question: "What is the dress code?",
        answer:
          "Elegant Noir & Masquerade Venetian. To keep the ball mysterious and unified, we kindly ask every guest to follow our all-black formal palette.\n\n• Ladies: a formal or semi-formal black long gown, an elegant black dress, or a formal black long skirt.\n• Gentlemen: a black long-sleeved polo shirt with trousers, a suit, or a tuxedo.\n\nGraphic t-shirts and casual streetwear are strictly not allowed. See the [Attire Guidelines](#details) for more.",
      },
      {
        question: "Do I need to bring a mask?",
        answer:
          "Yes — it's a masquerade! Any Venetian or masquerade mask is welcome; touches of gold or red look beautiful with the all-black dress code.\n\nKeep it on through the evening until the Grand Countdown & Unmasking Hour, when every mask comes off together.",
      },
      {
        question: "What time should I arrive?",
        answer:
          "Doors open at {guestsTime} for the Venetian Arrival, and the Grand Reveal Entrance begins at {programTime}. Please arrive a little early so you can find your seat and not miss the debutante's entrance.",
      },
      {
        question: "Where is the masquerade?",
        answer:
          "At {venueName}, {venueAddress}.\n\nTap Get Directions in [Event Details](#details) or scan the QR code there to open the map.",
      },
      {
        question: "What happens during the evening?",
        answer:
          "The night unfolds in six acts:\n\n• The Venetian Arrival\n• The Grand Reveal Entrance\n• The Mystery Waltz\n• Royal Banquet & Parlor Games\n• The Grand Countdown & Unmasking Hour\n• The Illuminated Pathway & The Grand Toast\n\nSee the full [Program](#wedding-timeline) for the times.",
      },
      {
        question: "May I bring a plus one?",
        answer:
          "Seating is limited and the masquerade is by invitation only. Kindly RSVP only for the number of seats reserved under your name.",
      },
      {
        question: "What if I can no longer attend?",
        answer:
          "Please let us know as soon as you can, so your seat can be offered to another guest.",
      },
      {
        question: "May I take photos and videos?",
        answer:
          "Of course! We'd love to see the night through your eyes — share them in [Snap & Share](#snap-share) with our hashtags.\n\nDuring the Grand Reveal Entrance, the Mystery Waltz, and the Unmasking Hour, kindly give way to the official photographers.",
      },
      {
        question: "I'm one of the 18 Candles. What should I prepare?",
        answer:
          "Instead of a spoken message, {celebrant} would love to receive a handwritten letter from each of her 18 Candles.\n\nWrite from the heart — a memory you share, a wish for her future, or simply what she means to you. These letters will be kept and treasured for years to come.",
      },
      {
        question: "What time does the evening end?",
        answer:
          "The program closes with the Illuminated Pathway & the Grand Toast at 9:00 PM — stay until the very end so you don't miss the final toast.",
      },
      {
        question: "I have dietary restrictions or allergies.",
        answer:
          "Please mention them when you RSVP, or let {coordinator} know, so the kitchen can prepare something just for you.",
      },
      {
        question: "Is there a gift registry?",
        answer:
          "Your presence is the greatest gift. If you wish to give something more, you'll find a gentle note in the [Gift Guide](#registry).",
      },
    ],
  },
  // Gift guide (components/sections/registry.tsx).
  registry: {
    // Mask & rose pieces on two corners of the letter card ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    eyebrow: "A Token of Love",
    title: "Gift Guide",
    subtitle: "with gratitude",
    description: "Your presence at the masquerade is the finest gift I could ask for.",
    // First paragraph: "Salutation — letter…" shows the salutation as an engraved heading
    paragraphs: [
      "Dear family and friends — sharing this milestone with the people who shaped my story already means more than words can hold. Your presence on the night the masks come off is the greatest gift of all.",
      "Should you wish to honor me with something more, a monetary blessing toward my studies and the dreams of this new chapter would be warmly appreciated.",
      "Above all, simply come as you are — masked, merry, and ready to celebrate. Your love and prayers are the treasures I will keep long after the music fades.",
    ],
    thankYou: "Thank you for being part of my story.", // "" hides the line
    signOff: "With a grateful heart,",
    signature: "", // "" falls back to the celebrant's nickname
    // Colors — any CSS color or a palette token from app/globals.css (e.g. "var(--color-motif-accent)")
    colors: {
      title: "var(--color-motif-deep)",                                       // account names / numbers: wine
      script: "color-mix(in srgb, var(--color-welcome-gold) 78%, var(--color-motif-deep))", // drop cap, signature: gold
      eyebrow: "color-mix(in srgb, var(--color-welcome-gold) 78%, var(--color-motif-deep))", // small caps labels, heart
      body: "color-mix(in srgb, var(--color-welcome-text) 85%, var(--color-motif-deep))",  // paragraphs: warm ink
      soft: "color-mix(in srgb, var(--color-motif-deep) 70%, transparent)",   // "With love," and secondary text
      card: "var(--color-motif-soft)",                                        // letter card (top)
      cardEdge: "var(--color-motif-cream)",                                   // letter card (bottom of the paper gradient)
      accountCard: "color-mix(in srgb, var(--color-motif-blush) 22%, var(--color-motif-soft))", // e-gift account cards
      button: "var(--color-motif-accent)",                                    // tab shadow tint (seal + selected tab use a crimson → wine gradient)
      line: "color-mix(in srgb, var(--color-welcome-gold) 45%, transparent)", // card edge + seal ring
      glow: "color-mix(in srgb, var(--color-welcome-gold) 22%, transparent)", // tab track / letter badge
      background: "transparent",                                              // section has no background
    },
    // E-gift accounts — optional, as many as you like.
    //   showAccounts: false hides the whole block
    //   show:  false hides one account
    //   qr:    "/QR/BPI.png" to show a QR image, or "" when you have no QR
    showAccounts: false, // hidden: no QR codes or e-gift accounts on the page
    accountsTitle: "For e-gifts",
    // Small italic note under the QR ("" hides it)
    accountsNote: "Sample image for display only — not yet official.", // ⚠ check — clear once the real QR codes are in
    accounts: [
      { show: true, label: "GCash", accountName: "", accountNumber: "", qr: "/QR/GCASH.png" },
      { show: true, label: "BDO", accountName: "", accountNumber: "", qr: "/QR/BDO.png" },
    ] as { show: boolean; label: string; accountName: string; accountNumber: string; qr: string }[],
    // Leave any path "" to hide that decoration
    decos: { ...SECTION_DECOS },
  },
  // Table finder page (/table — components/table-finder.tsx)
  tableFinder: {
    decos: { ...CORNER_DECOS },
    // "Find Your Table" QR card on the dashboard (components/table-finder-qr-card.tsx)
    // {celebrant} → nickname. "" hides a line or image.
    qrCard: {
      coupleNameImage: BRAND.nameImage, // name lettering; "" shows the name as text
      coupleImage: "/Details/debutant.png", // illustration beside the text
      eyebrow: "The debut of",
      title: "Find Your Table",
      script: "please be seated",
      description:
        "Place this code at the entrance. Guests scan it, search their name, and go straight to their table.",
      scanLabel: "Scan to find your table",
      buttonText: "Download QR",
      downloadNote: "Saves a print-ready PNG for signs and table cards.",
      previewText: "Preview seating page",
    },
  },
  // Entourage proposal pages (components/proposal-page.tsx)
  // Roles live in content/proposal-roles.ts (18 Roses, 18 Treasures, 18 Cheers, …).
  // Text placeholders: {name} = invitee, {role} = role title, {celebrant} = nickname.
  // Each invitation type has its own wording:
  //   party      → every debut role (18 Roses, Candles, Cheers, Treasure Gifts, Monetary Gifts)
  //   sponsor    → Principal Sponsors (only if you add sponsor roles)
  //   bearer     → kept from the template (unused)
  //   flowerGirl → kept from the template (unused)
  // A list ([...]) shows one paragraph per line; "" or [] hides that part.
  proposal: {
    decos: { ...CORNER_DECOS },
    // Mask & rose corner pieces fixed to the screen corners ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    coupleNameImage: BRAND.nameImage, // name lettering at the top of the card; "" shows the name as text
    coupleImage: "/Details/debutant.png", // illustration above the question
    ornament: DECOR.headerOrnament, // small sprig at the top of the card; "" to hide
    // Eucalyptus sprigs on either side of the couple name; "" to hide one
    nameDecos: { left: DECOR.sideLeft, right: DECOR.sideRight },
    showDate: true, // big date under the couple name (Month / Day / Day-number / Time / Year)
    // Use "Maid of Honor" for unmarried, "Matron of Honor" for married
    honorAttendant: "Matron of Honor" as "Matron of Honor" | "Maid of Honor",
    roles: proposalRoleDefinitions,
    roleIdAliases: proposalRoleIdAliases,
    // Shared labels used on every invitation
    labels: {
      // Two lines above the picture ("" hides one)
      topEyebrow: "A Personal Invitation",
      topLine: "From behind the mask",
      headerEyebrow: "A Place in My Court", // small gold line above the heading
      headerScript: "at my 18th Masquerade", // big heading under the image
      saveTheDate: "Save the Date",
      roleOffered: "Role offered",
      preparedFor: "Prepared for",
      askQuestion: "Will you be", // + role title, e.g. "Will you be one of my 18 Roses?"
      registeredName: "Registered name",
      returnButton: "Return to the Invitation",
      saving: "Saving...",
      sending: "Sending...",
      sendButton: "Send Response",
      goBack: "Go Back",
      saveError: "We couldn't save your response. Please try again.",
      // Shown when the invite link has no name and the guest says yes
      nameForm: {
        title: "You Said Yes",
        script: "we're so happy",
        subheader: "One quick detail",
        body: "I couldn't be happier to have you by my side! Please confirm the name you'd like on the invitation and guest lists.",
        label: "Your Preferred Name",
        placeholder: "e.g. Aunt Maria Clara / Mr. James Bond",
        required: "Please type your preferred name so we can add it to our invitation.",
        submit: "Submit Response",
        cancel: "Cancel",
      },
    },
    copy: {
      party: {
        greeting: "Dear",
        intro: [],
        body: [
          "On the night the masks come off, I want the people who matter most standing beside me. I would be honored to have you in my masquerade court — a symbol of the love, friendship, and beautiful memories we share.",
        ],
        askLead: "",
        askNote: "",
        yesButton: "Yes, I'd Love To!",
        noButton: "No, With Love & Warm Wishes",
        signOff: "With love,", // followed by the celebrant's name
        yes: {
          title: "You Said Yes",
          script: "thank you",
          subheader: "I couldn't be happier",
          roleLine: "As {role}",
          body: [
            "Thank you for saying yes! I can't wait to celebrate, waltz, and unmask with you on my eighteenth. Having you in the program will make the night even more special.",
          ],
          signOff: "With love,",
        },
        no: {
          title: "Thank You",
          script: "for responding",
          subheader: "I completely understand",
          body: [
            "Thank you for taking the time to consider it. There are absolutely no hard feelings — I'm grateful to have you in my life, and I hope to celebrate with you in any way you can.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Your message has reached me",
          body: [
            "Your love and warmest wishes mean the world to me. Thank you!",
          ],
          signOff: "With love,",
        },
      },
      sponsor: {
        greeting: "Dear",
        intro: [
          "I have some wonderful news that I would love to share with you.",
          "I am turning eighteen and will be celebrating my debut — a brand-new chapter of my life.",
        ],
        body: [
          "This is not a general invitation. This is a personal ask, especially meant for you.",
          "As I prepare for my debut, I keep thinking of the people I would be grateful to have by my side on one of the most meaningful nights of my life.",
          "To me, a {role} is more than a part in the program. It is someone I look up to, someone whose wisdom and blessings I would be grateful to carry with me into adulthood.",
        ],
        askLead: "With great respect and sincerity, I would like to ask you a very special question:",
        askNote: "Having you share this moment with me would make my eighteenth truly meaningful.",
        yesButton: "Yes, I'd Be Honored 🤍",
        noButton: "No, With Love & Warm Wishes",
        signOff: "With love and respect,",
        yes: {
          title: "You Said Yes",
          script: "thank you",
          subheader: "Thank you for saying yes!",
          roleLine: "Our {role}",
          body: [
            "I am truly happy and honored that you accepted this special role in my debut. Your support means so much to me, and I look forward to celebrating with you and creating a memory I will cherish for years to come.",
          ],
          signOff: "With love and heartfelt gratitude,",
        },
        no: {
          title: "Thank You",
          script: "for responding",
          subheader: "I completely understand and respect your decision",
          body: [
            "Thank you for taking the time to read my letter and consider my request. There are no hard feelings at all — I am simply grateful to have you in my life and to have you celebrate with me in your own way.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Your message has reached me",
          body: [
            "Thank you for sharing this moment with me. Your love and warmest wishes mean the world to me.",
          ],
          signOff: "With love,",
        },
      },
      bearer: {
        greeting: "Hi",
        intro: [
          "We have a very special day coming up, and we would love for you to be part of it! 🤍",
          "{celebrant} is turning eighteen!",
        ],
        body: [
          "Our wedding day is a very important moment for us, and we would love to have you take part in making it even more special.",
        ],
        askLead: "So we have a very important question for you:",
        askNote: "We would be so happy to have you walk down the aisle and carry this special part of our wedding ceremony.",
        yesButton: "Yes, I'd Love To! 🤍",
        noButton: "Maybe Next Time 🤍",
        signOff: "With lots of love,",
        yes: {
          title: "Yay!",
          script: "you said yes!",
          subheader: "We are so excited to have you on our team!",
          roleLine: "Our {role}",
          body: [
            "We are so excited to have you as our {role}! We can't wait to see you walk down the aisle and be part of our special day. Your little role will be a very special part of our wedding, and we hope you have lots of fun celebrating with us! See you on our big day! 🤍",
          ],
          signOff: "With lots of love,",
        },
        no: {
          title: "That's Okay!",
          script: "we understand",
          subheader: "We completely understand 😊",
          body: [
            "Thank you for considering being our {role}. We hope you know that you are special to us, and we'll be happy to have you celebrate our wedding with us in any way.",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Thank you for letting us know",
          body: ["We hope you know how special you are to us, and we look forward to celebrating with you."],
          signOff: "With lots of love,",
        },
      },
      flowerGirl: {
        greeting: "Hi",
        intro: [
          "We have a very special day coming up, and we would love for you to be part of it! 🤍",
          "{celebrant} is turning eighteen!",
        ],
        body: [
          "Our wedding day wouldn't be complete without some extra sweetness, smiles, and a little bit of magic.",
        ],
        askLead: "And we have a very special role we would love for you to have.",
        askNote: "We would love to have you walk down the aisle and help make our wedding day even more beautiful and memorable.",
        yesButton: "Yes, I'd Love To! 🌸",
        noButton: "Maybe Next Time 🤍",
        signOff: "With lots of love,",
        yes: {
          title: "Yay!",
          script: "you said yes!",
          subheader: "We are so happy to have you as our Flower Girl!",
          roleLine: "Our {role}",
          body: [
            "We can't wait to see you walk down the aisle and be part of our special day. We hope you have lots of fun, smile big, and enjoy every moment! We can't wait to see you on our big day! 🤍",
          ],
          signOff: "With lots of love,",
        },
        no: {
          title: "That's Okay!",
          script: "we understand",
          subheader: "We completely understand 😊",
          body: [
            "Thank you for taking the time to consider being our Flower Girl. Whether you're able to be part of our wedding or not, we hope you know how special you are to us. We'll still be very happy to celebrate our special day with you!",
          ],
        },
        sent: {
          title: "Response Sent",
          script: "successfully",
          subheader: "Thank you for letting us know",
          body: ["We hope you know how special you are to us, and we look forward to celebrating with you."],
          signOff: "With lots of love,",
        },
      },
    },
  },
  details: {
    rsvp: { ...RSVP },
  },
  contact: {
    bridePhone: "to be announced",
    groomPhone: "to be announced",
    email: "to be announced",
  },
  giftRegistry: {
    // QR_1:{
    // id: "BPI",
    // src: "/QR/BPI.png",
    // label: "BPI",
    // accountNumber: "KAMS : ***********569",
    // },
    // QR_2:{
    // id: "MariBank",
    // src: "/QR/MariBank.png",
    // label: "MariBank",
    // accountNumber: "****7672",
    // }
    // ,
    // QR_3:{
    // id: "Gcash",
    // src: "/QR/pleaseProvideQR.png",
    // label: "Gcash",
    // accountNumber: "to be announced",
    // }
  },
  // Built from QUICK SETUP — edit the values at the top of the file
  // The program ("ceremony") and the end of the night ("reception") at the one venue —
  // names kept from the template so every section keeps working.
  ceremony: {
    location: CEREMONY_VENUE.name,
    venue: CEREMONY_VENUE.address,
    map: CEREMONY_VENUE.map,
    date: EVENT_DATE,
    day: EVENT_DAY,
    time: TIMES.program,
    entourageTime: TIMES.guestArrival,
    guestsTime: TIMES.guestArrival,
    image: CEREMONY_VENUE.photos,
  },
  reception: {
    location: RECEPTION_VENUE.name,
    venue: RECEPTION_VENUE.address,
    map: RECEPTION_VENUE.map,
    date: EVENT_DATE,
    day: EVENT_DAY,
    time: TIMES.end,
    image: RECEPTION_VENUE.photos,
  },
  // Legacy blocks (not shown on the main page) — kept so older components compile.
  dressCode: {
    theme: EVENT.theme,
    sponsors: {
      title: "Family",
      ninang: { label: "Ladies", description: "Formal gown in black, silver, or deep red.", image: "", palette: ["#111013", "#C0C0C6", "#7A0F1A"] },
      ninong: { label: "Gentlemen", description: "Black suit or barong with black slacks.", image: "", palette: ["#111013", "#3A3A40"] },
    },
    entourage: {
      title: "Entourage",
      bridesmaid: { label: "18 Candles", description: "Formal dress in silver or black.", image: "", palette: ["#C0C0C6", "#111013"] },
      groomsmen: { label: "18 Roses", description: "Black suit with a red rose boutonniere.", image: "", palette: ["#111013", "#7A0F1A"] },
    },
    guests: {
      title: "Guests",
      label: "Guests",
      description: "Elegant Noir & Masquerade Venetian — all-black formal attire.",
      image: "",
      palette: ["#C0C0C6", "#8E8E96", "#3A3A40", "#111013"],
    },
    paletteNote: `Our theme is ${EVENT.theme}: ${EVENT.colors}. Guests: all-black formal attire.`,
    closing: "Thank you for helping make this night so special. I can't wait to celebrate with you!",
    note: "Kindly follow our all-black formal palette.",
  },
  narratives: {
    ourStory: "",
    groom: "",
    bride: "",
  },
  colors: {
    primary: "#7A0F1A",
    secondary: "#C9A24A",
  },
  // Theme song (components/sections/wedding-playlist.tsx). {celebrant} → nickname.
  playlist: {
    eyebrow: "Now Playing",
    title: "The Sound of the Night",
    script: "my eighteenth, in a song",
    subtitle: "Every celebration has a soundtrack — this is the one that sets the mood for mine.",
    // Shown on the player card: small label (artist), big title (song), then the note
    cardEyebrow: `Theme song · ${EVENT.themeSong.artist}`,
    playlistName: EVENT.themeSong.title,
    cardNote:
      "The song I chose to open my eighteenth. Press play and step into the night with me.",
    buttonText: "Listen on Spotify",
    // Leave any path "" to hide that decoration
    decos: { ...CORNER_DECOS, headerOrnament: DECOR.headerOrnament },
    // ⚠ check — Spotify link for "Goth" by Sidewalks and Skeletons (track, playlist or album links all work)
    embedUrl: "https://open.spotify.com/embed/playlist/2rdoTgcClqsSfL7rz5w1WY?utm_source=generator&si=e985bd36136a4689",
    spotifyUrl: "https://open.spotify.com/playlist/2rdoTgcClqsSfL7rz5w1WY",
  },
  // Closing "See you there!" section (components/sections/see-you-there.tsx).
  //   photos mode (loadingScreen.display "photos") → full-screen celebrant photo
  //   plain mode  (loadingScreen.display "plain")  → ornamental card, no photo
  // {celebrant} → nickname.
  seeYouThere: {
    titleLine1: "See you",
    titleLine2: "there!",
    // Photos mode — lines around the title (like the closing card of the invitation); "" hides one
    eyebrow: "Until we celebrate",
    script: "with love, {celebrant}",
    message: "I can't wait to celebrate my eighteenth with you.",
    // Photos mode — full-screen background that slowly crossfades between the photos.
    // Phones (portrait) use "mobile", tablets / desktops (landscape) use "desktop".
    photos: {
      mobile: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(PHOTO),
      // Same portraits on wide screens (cropped to fill, framed on her face)
      desktop: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(PHOTO),
    },
    photoAlt: "{celebrant}",
    // Plain mode
    plain: {
      eyebrow: `Until the night of ${EVENT_DATE.replace(/,\s*\d{4}$/, "")}`,
      script: "with love, {celebrant}",
      message: "I can't wait to celebrate my eighteenth with you.",
      decos: { ...CORNER_DECOS, footerVine: DECOR.footerVine },
    },
  },
  // Footer (components/sections/footer.tsx).
  // {celebrant} → nickname, {year} → current year. Date comes from ceremony, deadline from details.rsvp.
  footer: {
    // Mask & rose corner pieces on the footer ("" hides one)
    corners: {
      topLeft: "/deco/top-left.png",
      topRight: "/deco/top-right.png",
      bottomLeft: "/deco/bottom-left.png",
      bottomRight: "/deco/bottom-right.png",
    },
    showMonogram: true, // celebrant.monogram, tinted to the motif
    // Small line under the name, e.g. "turns eighteen" ("" to hide)
    nameLine: `turns ${CELEBRANT.ageWords.toLowerCase()}`,
    dateLabel: "Debut Date",
    // Program & end of night at a glance (times and places come from ceremony / reception)
    summary: {
      show: true,
      ceremonyLabel: "Program",
      receptionLabel: "Until",
    },
    noteTitle: "A Note From Me",
    // Typed out one after another
    quotes: [
      "Behind every mask is a story. Come write the first chapter of mine.",
      "Welcome to my debut website! Join me for a modern Venetian Masquerade — an evening of mystery, elegance, and celebration.",
      "Thank you for your love, prayers, and support. I can't wait to celebrate with you!",
    ],
    rsvp: {
      show: true,
      title: "RSVP Deadline",
      label: "Please respond by",
      note: "Please confirm your attendance by this date.",
      button: "Tap here to respond",
      href: "#guest-list",
    },
    // Social links — replace each href with your own profile link.
    //   show: false hides one; platforms: facebook | instagram | tiktok | youtube | twitter | threads | messenger | email
    //   email: use "mailto:you@example.com"; messenger: use "https://m.me/yourpage"
    followTitle: "Follow Along",
    followNote: "Share your photos and tag me — I'd love to see the night through your eyes.",
    socials: [
      { show: true, platform: "facebook", href: "https://www.facebook.com" },
      { show: true, platform: "instagram", href: "https://www.instagram.com/" },
      { show: true, platform: "tiktok", href: "https://www.tiktok.com/" },
      { show: true, platform: "youtube", href: "https://www.youtube.com" },
      { show: true, platform: "twitter", href: "https://x.com/" },
      { show: false, platform: "threads", href: "https://www.threads.net/" },
      { show: false, platform: "messenger", href: "https://m.me/" },
      { show: false, platform: "email", href: "mailto:" },
    ] as {
      show: boolean
      platform: "facebook" | "instagram" | "tiktok" | "youtube" | "twitter" | "threads" | "messenger" | "email"
      href: string
    }[],
    quickLinksTitle: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Event Details", href: "#details" },
      { label: "Gallery", href: "#gallery" },
      { label: "RSVP", href: "#guest-list" },
      { label: "Program", href: "#wedding-timeline" },
      { label: "Messages", href: "#messages" },
      { label: "FAQ", href: "#faq" },
    ],
    copyright: "© {year} {celebrant}'s Debut — crafted with love, prayers, and gratitude.",
    tagline: "This celebration site was made to share the joy of my eighteenth with you.",
    // Hashtag chips under the date in the footer header ([] hides them)
    hashtags: HASHTAGS,
    credit: {
      show: true,
      developedBy: "Developed by",
      developerName: "Lance Valle",
      developerUrl: "https://lance28-beep.github.io/portfolio-website/",
      promoText: "Visit and follow us:",
      promoName: "Debut Digital Invites",
      promoUrl: "https://www.facebook.com/debutinvitation/",
    },
  },
  // Snap & Share (components/sections/snap-share.tsx). {celebrant} → nickname.
  snapShare: {
    // ⚠ check — Google Drive upload folder + its QR are still from the template
    googleDriveLink:
      "https://drive.google.com/drive/folders/1yLq1yU22_AS25bO_nV3Bj-2eD2ue91Oq?usp=sharing",
    albumQR: "/QR/AlbumQR.png",
    hashtag: HASHTAGS,
    instructions: "Please scan this QR code and upload the photos and videos you took during the debut. I'd love to see the night through your eyes!",
    title: "Snap and Share",
    subtitle: "Share your memories",
    description:
      "Help capture the little moments of {celebrant}'s eighteenth — every smile, dance, and candid laugh. Your photos and clips complete the story of the night.",
    // "Favorite Moments" photo card — always hidden when loadingScreen.display is "plain"
    moments: {
      show: false, // hidden — set true to bring back the photo card
      title: "Favorite Moments",
      caption: "Share your snapshots to be featured in the keepsake gallery.",
      // 3 photos: two side by side on top (3:4 frames), one wider frame below (4:3, framed on the face)
      images: [PHOTO(6), PHOTO(1), PHOTO(2)],
    },
    website: {
      show: true,
      title: "Share the Debut Website",
      description:
        "Spread the word about {celebrant}'s celebration. Share this QR code so friends and family can find every detail.",
      downloadButton: "Download QR",
      note: "Scan with any camera app to open the full invitation and schedule.",
    },
    hashtags: {
      show: true,
      title: "Debut Hashtags",
      copy: "Copy",
      copied: "Copied",
      copyAll: "Copy All",
      allCopied: "All Copied!",
    },
    social: {
      show: true,
      title: "Share on Social Media",
      description: "Help spread the word about {celebrant}'s debut across your favorite platforms.",
      // Remove any you don't want: "instagram" | "facebook" | "tiktok" | "twitter"
      platforms: ["instagram", "facebook", "tiktok", "twitter"] as ("instagram" | "facebook" | "tiktok" | "twitter")[],
      shareText: "Celebrate {celebrant}'s debut! Explore the details and share your special memories:",
    },
    // Shown only when googleDriveLink is set
    upload: {
      badge: "Upload Your Photos & Videos",
      scanNote: "Scan with your camera app",
      copyLink: "Copy Link",
      copied: "Copied!",
      downloadQr: "Download QR",
      uploadButton: "Upload Photos",
    },
    closing:
      "Thank you for helping make {celebrant}'s eighteenth unforgettable. Your photos and messages become memories she will treasure for a lifetime.",
    closingTag: "Thank you for sharing the joy",
  },
  // Accommodation (components/sections/accommodation.tsx — not on the main page)
  accommodation: {
    coordinator: {
      name: RSVP.coordinator,
      phone: RSVP.phone,
    },
    hotels: [] as { name: string; discount?: string; phone?: string; facebook?: string }[],
    carRentals: [] as { name: string; facebook?: string }[],
  },
}
