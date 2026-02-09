# Wedding Invitation Website

A beautiful, elegant wedding invitation website built with Next.js, featuring an interactive envelope animation, countdown timer, venue information, program schedule, and RSVP form.

## 🎨 Features

- **Interactive Envelope Animation** - Elegant opening animation with wax seal
- **Countdown Timer** - Real-time countdown to the wedding day
- **Venue Information** - Location details with embedded map
- **Program Schedule** - Timeline of wedding day events
- **RSVP Form** - Guest response collection with validation
- **Music Player** - Background music with play/pause controls
- **Fully Responsive** - Works beautifully on all devices
- **Accessibility** - WCAG AA compliant with ARIA labels

## 🚀 Getting Started

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your invitation.

### Build for Production

```bash
npm run build
npm start
```

## ⚙️ Configuration

### 1. Couple Names

Update the couple's names in these files:

**`components/wedding/envelope.tsx`** (line 95):
```tsx
Nada & Karim
```

**`components/wedding/hero-section.tsx`** (lines 108, 126):
```tsx
{"Nada"}
{"Karim"}
```

### 2. Wedding Date & Time

**`components/wedding/countdown.tsx`** (lines 8-15):
```tsx
const WEDDING_CONFIG = {
  dateUTC: "2026-05-22T15:00:00Z",  // Wedding time in UTC
  timezone: "Africa/Cairo",          // Your timezone
  displayDate: "22nd May 2026",
  displayTime: "5:00 PM",
}
```

**`components/wedding/envelope.tsx`** (line 344):
```tsx
22.05.2026
```

**`components/wedding/hero-section.tsx`** (lines 155, 164):
```tsx
{"Friday, 22nd May 2026"}
{"5:00 PM"}
```

### 3. Venue Information

**`components/wedding/location.tsx`** (lines 28-42):
```tsx
const VENUE_CONFIG = {
  name: "The Royal Ballroom",
  venue: "Four Seasons Hotel Cairo at Nile Plaza",
  address: "1089 Corniche El Nil, Garden City",
  city: "Cairo, Egypt",
  coordinates: {
    lat: 30.0392,  // Latitude for map
    lng: 31.2290,  // Longitude for map
  },
  date: "Friday, the twenty-second of May, two thousand twenty-six",
  time: "Five o'clock in the evening",
  googleMapsUrl: "https://maps.google.com/?q=Four+Seasons+Hotel+Cairo",
}
```

### 4. Program Schedule

**`components/wedding/program.tsx`** (lines 27-75):
```tsx
const schedule = [
  {
    time: "17:00",
    title: "Guest Arrival",
    description: "Welcome and reception at the ballroom",
    icon: Heart,
    color: "#b08d98",
  },
  // Add or modify events as needed
]
```

### 5. Wedding Music

Add your wedding music file:

1. Download your chosen song as MP3
2. Rename to `wedding-music.mp3`
3. Place in `/public/music/` directory

**Recommended songs** (see `/public/music/README.md`):
- Canon in D by Pachelbel
- Clair de Lune by Debussy
- Air on the G String by Bach

### 6. Color Palette

**`app/globals.css`** (lines 23-31):
```css
:root {
  --color-wedding-pink: hsl(340 18% 58%);    /* Primary accent */
  --color-wedding-blush: hsl(340 15% 91%);   /* Light backgrounds */
  --color-wedding-rose: hsl(340 20% 70%);    /* Secondary accent */
  --color-wedding-green: hsl(145 30% 45%);   /* Accent color */
  --color-wedding-sage: hsl(145 20% 65%);    /* Light green */
  --color-wedding-charcoal: hsl(0 0% 20%);   /* Dark text */
}
```

### 7. Background Image

Replace the hero background image:
- Add your image to `/public/images/`
- Update path in `components/wedding/hero-section.tsx` (line 30)

### 8. RSVP Admin Access

View RSVP responses by visiting:
```
http://localhost:3000/api/rsvp?key=wedding2026
```

Change the admin key in **`app/api/rsvp/route.ts`** (line 131):
```tsx
const expectedKey = process.env.RSVP_ADMIN_KEY || "wedding2026"
```

Or set environment variable:
```bash
RSVP_ADMIN_KEY=your_secret_key
```

## 📁 Project Structure

```
wedding-invite/
├── app/
│   ├── api/rsvp/          # RSVP API endpoint
│   ├── globals.css        # Global styles & theme
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/wedding/
│   ├── envelope.tsx       # Opening envelope animation
│   ├── hero-section.tsx   # Hero with couple names
│   ├── countdown.tsx      # Countdown timer
│   ├── location.tsx       # Venue information
│   ├── program.tsx        # Event schedule
│   ├── rsvp.tsx          # RSVP form
│   ├── music-player.tsx   # Background music
│   └── birds.tsx          # Decorative animations
├── public/
│   ├── images/           # Background images
│   └── music/            # Wedding music file
└── data/
    └── rsvp-responses.json  # RSVP submissions
```

## 🎯 Customization Tips

1. **Fonts**: The project uses Google Fonts (Great Vibes, Cormorant Garamond, Lato). Change in `app/layout.tsx`
2. **Animations**: Adjust timing in individual component files
3. **Form Fields**: Add/remove fields in `components/wedding/rsvp.tsx`
4. **Sections**: Add/remove sections in `app/page.tsx`

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy automatically

### Other Platforms

- **Netlify**: Works out of the box
- **AWS Amplify**: Supports Next.js
- **Self-hosted**: Use `npm run build && npm start`

## 📝 License

This is a personal wedding invitation project. Feel free to use and customize for your own wedding!

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)
