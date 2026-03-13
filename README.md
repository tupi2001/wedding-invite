# Wedding Invitation Website

A bilingual (English/Arabic) wedding invitation web app with personalized invite links, group RSVP, an admin panel, and elegant animations. Built with Next.js 16, React 19, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Interactive Envelope** -- wax seal animation that reveals the invite
- **Personalized URLs** -- each guest/group gets a unique link (`/invite/ahmed-family`)
- **Group RSVP** -- one link per family/group, each person RSVPs individually up to a max headcount
- **Bilingual** -- full English & Arabic support with RTL toggle
- **Admin Panel** -- password-protected dashboard to manage guests, view RSVPs, and export CSV
- **Centralized Config** -- one file to edit all wedding details (names, date, venue, photos, music, schedule)
- **Countdown Timer** -- live countdown to the wedding day
- **Photo Gallery** -- carousel with placeholder slots for couple photos
- **Quran Verse** -- decorative Arabic verse section
- **Program of the Day** -- visual timeline of the wedding schedule
- **Music Player** -- background audio with play/pause
- **Falling Petals & Gold Particles** -- ambient animations
- **Fully Responsive** -- looks great on all screen sizes

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Fill in your Supabase keys (see "Supabase Setup" below)
#    Edit .env.local with your values

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your invitation.

---

## Configuration

All wedding details are centralized in a single file:

```
config/wedding.ts
```

### Couple Names

```typescript
couple: {
  bride: { en: "Nada", ar: "ندى" },
  groom: { en: "Karim", ar: "كريم" },
  coupleNames: { en: "Nada & Karim", ar: "ندى و كريم" },
},
```

### Date & Time

```typescript
date: {
  utc: "2026-05-22T15:00:00Z",   // UTC timestamp (used for countdown)
  timezone: "Africa/Cairo",
  display: { en: "Friday, 22nd May 2026", ar: "الجمعة ٢٢ مايو ٢٠٢٦" },
  time: { en: "5:00 PM", ar: "٥:٠٠ مساءً" },
  short: { en: "22.05.2026", ar: "٢٢.٠٥.٢٠٢٦" },
},
```

The `utc` field drives the countdown timer. If your wedding is at 5 PM Cairo time (UTC+2), set it to `3 PM UTC` (i.e. `T15:00:00Z`).

### Venue

```typescript
venue: {
  name: { en: "The Royal Ballroom", ar: "القاعة الملكية" },
  venue: { en: "Four Seasons Hotel Cairo at Nile Plaza", ar: "..." },
  address: { en: "1089 Corniche El Nil, Garden City", ar: "..." },
  city: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
  coordinates: { lat: 30.0392, lng: 31.2290 },
  googleMapsQuery: "Four+Seasons+Hotel+Cairo+at+Nile+Plaza",
  embedUrl: "https://www.google.com/maps/embed?pb=...",
},
```

To get `embedUrl`: open Google Maps, find your venue, click Share > Embed a map, and copy the `src` URL from the iframe.

### RSVP Deadline

```typescript
rsvp: {
  deadline: { en: "Kindly respond by 1st April 2026", ar: "..." },
  defaultMaxGuests: 4,
},
```

### Images

Place your images in the `/public` folder and reference them in the config:

```typescript
images: {
  heroBackground: "/ballroom_image.png",   // Hero section background
  waxSeal: "/Seal Picture.png",            // Envelope wax seal
},
```

### Music

Place your audio file in `/public/music/` and set the path:

```typescript
music: {
  src: "/music/wedding-music.mp3",
  volume: 0.25,   // 0.0 to 1.0
},
```

### Program of the Day

```typescript
program: [
  { time: "17:00", titleKey: "guestArrival", descKey: "guestArrivalDesc", icon: "Heart", color: "#c8a96e" },
  { time: "17:30", titleKey: "welcomeDrink", descKey: "welcomeDrinkDesc", icon: "Wine", color: "#8aaa7e" },
  // ...
],
```

Available icons: `Heart`, `Wine`, `Gem`, `GlassWater`, `UtensilsCrossed`, `Music`.

The `titleKey` and `descKey` map to the `translations` section in the same config file. To add a new event, add the entry here and add matching translation keys in both the `en.program` and `ar.program` sections of `translations`.

### Photo Gallery

```typescript
gallery: [
  { src: "/photos/photo1.jpg", alt: "Us at the beach" },
  { src: "", alt: "Photo coming soon" },   // placeholder
  // ...
],
```

### Translations (English & Arabic)

All user-facing text lives inside the `translations` key in `config/wedding.ts`, organized by section (`envelope`, `hero`, `welcome`, `gallery`, `verse`, `countdown`, `location`, `program`, `rsvp`, `footer`).

**Editing text:**

1. Open `config/wedding.ts`
2. Scroll to the `translations` section
3. Find the section and key you want to change (e.g. `translations.ar.rsvp.accept`)
4. Edit the string value
5. Save -- the change is reflected immediately in development

**Example -- changing the Arabic RSVP button text:**

```typescript
translations: {
  // ...
  ar: {
    // ...
    rsvp: {
      // ...
      accept: "أقبل بسعادة",    // ← change this string
      decline: "أعتذر بأسف",
      // ...
    },
  },
}
```

**Adding a new translation key** (e.g. for a custom section):

1. Add the key under both `translations.en.yourSection` and `translations.ar.yourSection`
2. In your component, use `t(lang, "yourSection", "yourKey")` from `lib/i18n.ts`

The `lib/i18n.ts` file re-exports the translations from the config and provides the `t()` helper function. You should not need to edit `lib/i18n.ts` directly.

---

## Supabase Setup

Supabase provides the PostgreSQL database for storing invitees and RSVP responses.

### Option A: Supabase Cloud (Recommended)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, choose a name, set a database password, and select a region close to your guests
3. Wait for the project to be provisioned (~1 minute)
4. Go to **Project Settings > API** and copy:
   - **Project URL** (starts with `https://xxx.supabase.co`)
   - **Service Role Key** (under "Project API keys", the `service_role` one -- keep this secret!)
5. Go to **SQL Editor** and run the contents of `supabase/migrations/001_initial.sql`
   - This creates the `invitees` and `rsvp_responses` tables
6. If you are migrating from an older version, also run `supabase/migrations/002_group_rsvp.sql`
7. Set your keys in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD=pick-a-strong-password
```

### Option B: Supabase Local (for development)

1. Install the Supabase CLI:

```bash
# macOS
brew install supabase/tap/supabase

# npm (any platform)
npx supabase --version
```

2. Start Supabase locally:

```bash
npx supabase init    # only needed the first time
npx supabase start
```

3. The CLI prints local credentials. Use them in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=<the service_role key printed by supabase start>
ADMIN_PASSWORD=test123
```

4. Run the migration:

```bash
npx supabase db reset
```

This applies all files in `supabase/migrations/` to your local database.

### Production Keys on Vercel

When deploying to Vercel, add the same three environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`) in your Vercel project settings under **Settings > Environment Variables**.

---

## Deploying to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_SERVICE_ROLE_KEY` | your service role key |
   | `ADMIN_PASSWORD` | your chosen admin password |
5. Click **Deploy**
6. Vercel will build and deploy automatically. Your invite site will be live at `your-project.vercel.app`

To use a custom domain (e.g. `invite.karimandnada.com`), go to **Settings > Domains** in your Vercel project.

---

## Using the App

### 1. Access the Admin Panel

Go to `https://your-domain.com/admin` and enter your `ADMIN_PASSWORD`.

### 2. Add Invitees (Groups)

Click **"+ Add Group / Invitee"** and fill in:

| Field | Description | Example |
|---|---|---|
| **Group / Name (English)** | The group or individual name | `Ahmed Family` |
| **Group / Name (Arabic)** | Arabic version (optional) | `عائلة أحمد` |
| **URL Slug** | Auto-generated from name, or custom | `ahmed-family` |
| **Email** | Contact email (optional) | `ahmed@email.com` |
| **Max Guests** | How many people can RSVP under this link | `5` |
| **Default Language** | The language the invite opens in | `Arabic` |

### 3. Send Invite Links

After adding an invitee, click **"Copy Link"** next to their row. You'll get a URL like:

```
https://your-domain.com/invite/ahmed-family
```

Send this link to the guest/group via WhatsApp, SMS, email, etc.

### 4. Guests RSVP

When a guest opens their link:
- They see a personalized invitation with their group name
- They can accept or decline
- Each person in the group enters their own name and RSVPs individually
- The form shows how many spots are remaining
- Once all spots are filled, the form shows a "full" message

### 5. Monitor Responses

Back in the admin panel:
- **Summary cards** show confirmed, declined, and pending counts
- **Invitee table** shows each group with their RSVP status
- Click a row to **expand** and see individual names
- Click **"Export CSV"** to download all data as a spreadsheet

### 6. Preview the Invite

Visit `https://your-domain.com/` (no slug) to see the generic invite without personalization -- useful for previewing the design.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (secret, server-side only) |
| `ADMIN_PASSWORD` | Yes | Password for the `/admin` panel |

---

## Project Structure

```
wedding-invite/
├── app/
│   ├── admin/page.tsx              # Admin panel (guest management, RSVP dashboard)
│   ├── api/
│   │   ├── invitees/               # Invitee CRUD API
│   │   │   ├── route.ts            # GET (list) / POST (create)
│   │   │   └── [slug]/route.ts     # GET / PUT / DELETE by slug
│   │   └── rsvp/route.ts           # RSVP submission & retrieval API
│   ├── invite/[slug]/
│   │   ├── page.tsx                # Server component: fetches invitee data
│   │   └── client.tsx              # Client component: renders the invite
│   ├── globals.css                 # Global styles, color palette, animations
│   ├── layout.tsx                  # Root layout, fonts, metadata
│   └── page.tsx                    # Generic invite (no personalization)
├── components/wedding/
│   ├── arabesque-frame.tsx         # Decorative SVG frame + divider
│   ├── birds.tsx                   # Bird/butterfly animation
│   ├── countdown.tsx               # Countdown timer
│   ├── envelope.tsx                # Opening envelope animation
│   ├── falling-petals.tsx          # Ambient falling petal animation
│   ├── floral-divider.tsx          # Section divider
│   ├── gold-particles.tsx          # Gold shimmer particles
│   ├── hero-section.tsx            # Hero with couple names + background
│   ├── language-toggle.tsx         # EN/AR toggle button
│   ├── location.tsx                # Venue info + embedded map
│   ├── music-player.tsx            # Background music player
│   ├── personalized-welcome.tsx    # Personalized greeting
│   ├── photo-gallery.tsx           # Photo carousel
│   ├── program.tsx                 # Day schedule timeline
│   ├── rsvp.tsx                    # Group RSVP form
│   └── verse-section.tsx           # Quran verse display
├── config/
│   └── wedding.ts                  # ** MAIN CONFIG + TRANSLATIONS ** (edit this!)
├── context/
│   └── language-context.tsx        # Language provider (EN/AR)
├── hooks/
│   └── use-scroll-reveal.ts        # Scroll-triggered animation hook
├── lib/
│   ├── database.types.ts           # Supabase TypeScript types
│   ├── db.ts                       # Database query functions
│   ├── i18n.ts                     # Re-exports translations from config + t() helper
│   ├── supabase.ts                 # Supabase client initialization
│   └── types.ts                    # Shared TypeScript interfaces
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql         # Initial database schema
│       └── 002_group_rsvp.sql      # Migration to group RSVP model
├── public/
│   ├── ballroom_image.png          # Hero background image
│   ├── Seal Picture.png            # Wax seal image
│   └── music/                      # Place wedding-music.mp3 here
├── .env.example                    # Template for environment variables
├── next.config.mjs                 # Next.js configuration
├── tailwind.config.ts              # Tailwind theme & colors
└── package.json
```

---

## Tech Stack

- **Next.js 16** (App Router) -- framework
- **React 19** -- UI library
- **Tailwind CSS 4** -- styling
- **Framer Motion** -- animations
- **Supabase** -- PostgreSQL database + API
- **TypeScript** -- type safety
- **Embla Carousel** -- photo gallery
- **Lucide Icons** -- iconography
