# RR Tuition Website

A responsive, original implementation inspired by the structure and visual feel of rrtuitions.com.

## Files
- `index.html` — page structure/content
- `style.css` — responsive styling
- `script.js` — mobile navigation, scrollspy, testimonial slider, reveal animation and WhatsApp enquiry form
- `assets/learning-home.svg` — custom original vector illustration for the hero
- `assets/favicon.svg` — brand favicon

## Run
Open `index.html` in a browser, or serve the folder with any static file server.

## Interactive layer (touch, animation, cursor effects)
- **Cursor-follow glow**: a soft spring-green radial glow trails the mouse (desktop/mouse only — auto-disabled on touch devices and for `prefers-reduced-motion`), implemented with `requestAnimationFrame` + easing so it glides rather than snaps.
- **Animated hero background**: three blurred gradient blobs drift slowly behind the hero copy for a living, colourful backdrop instead of a flat fill.
- **Orchestrated hero entrance**: the eyebrow, headline, paragraph, buttons and stats fade/slide in as a staggered sequence on load; the illustration scales in alongside them.
- **Count-up stats**: "500+ / 10+ / 3" animate up from zero once scrolled into view.
- **3D card tilt**: course and benefit cards tilt subtly toward the cursor on desktop (disabled on touch).
- **Touch/tap feedback**: a ripple effect on buttons and cards for `pointerdown` (works for touch and mouse), scale-down `:active` states on buttons, and swipe-left/right support on the testimonial slider.
- Every motion effect respects `prefers-reduced-motion` and gracefully turns off on coarse/touch pointers where it wouldn't make sense.

## What's new in this enhancement pass
- **Fixed the hero image**: it referenced `assets/learning-home.svg`, which didn't exist in the upload — added an original flat-style illustration in the brand palette.
- **Content parity with the live site**: added the 4th testimonial (Bhanu), an Instagram link (topbar, contact card, footer), and a "Open in Google Maps" link next to the address.
- **Accessibility**: skip-to-content link, visible focus states, proper `aria-*` on the nav toggle and testimonial carousel, keyboard-operable prev/next controls on the reviews slider, `prefers-reduced-motion` support throughout (disables autoplay/animations for users who request it).
- **SEO**: meta description rewritten to be more specific, Open Graph/Twitter card tags, canonical URL, favicon, and `TutoringService` JSON-LD structured data so Google can show rich results (rating, address, phone).
- **UX**: a sticky WhatsApp button, scrollspy that highlights the current section in the nav, pause-on-hover/focus for the testimonial autoplay, and a light local visit counter in the footer.
- **Small fixes**: phone field now has an input pattern/validation hint, image has explicit width/height to avoid layout shift, mobile menu closes on `Escape` and updates its icon.

## Easy editing — start here
Every file now has a `# EDIT HERE` / `# WORKING CONDITION` comment system so you don't need to hunt through the code:

- **`style.css`** — every color is a `:root` variable at the very top of the file (`--brand`, `--accent`, `--bg-soft`, etc). Change one value there and it updates everywhere that color is used. The file is also split into labeled sections (`HEADER`, `HERO`, `COURSES`, `CONTACT`, ...) and each interactive effect (cursor glow, card tilt, drifting background blobs...) has a `/* # WORKING CONDITION: ... */` comment right above it explaining exactly when that effect turns on or off.
- **`script.js`** — a single `CONFIG` object at the top holds the numbers you're most likely to tweak (WhatsApp number, autoplay speed, swipe sensitivity, tilt strength, glow smoothness). Change a value there instead of searching through the code. Every feature block below it has a `# WORKING CONDITION` comment stating its trigger (e.g. "mouse/trackpad only", "fires on tap or click", "only if reduced-motion is off").
- **`index.html`** — `<!-- # EDIT HERE -->` comments mark the content blocks you'll actually touch: the hero headline/stats, the course cards, the "Why Us" points, testimonials, and the contact details. A note above the WhatsApp number explains that it's intentionally repeated as plain links in ~6 places (so the site keeps working with JavaScript off) and needs updating in both `index.html` and `CONFIG.whatsappNumber` in `script.js` if it ever changes.

## Customize
Change the phone number, address, course copy, testimonials and WhatsApp number in `index.html` and `script.js` — see "Easy editing" above for exactly where.
The form currently opens WhatsApp instead of requiring a backend.

## Note
The layout is an original recreation based on the referenced site's public structure and your own business's publicly listed details (address, phone, reviews). The hero illustration is an original custom SVG — swap in real photos of your space/tutors whenever you have licensed images ready, for an even more authentic feel.
