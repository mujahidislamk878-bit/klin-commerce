// Shared template data used across landing page (hero universe, template wall, marquee)
// and the Puck editor (Section 3). Keeps design in sync everywhere.

export type Section =
  | { kind: "nav"; brand: string }
  | { kind: "hero"; title: string; subtitle: string; cta: string; image?: string }
  | { kind: "grid"; title: string; items: string[] }
  | { kind: "gallery"; items: string[] }
  | { kind: "testimonial"; quote: string; author: string }
  | { kind: "pricing"; tiers: { name: string; price: string }[] }
  | { kind: "faq"; items: { q: string; a: string }[] }
  | { kind: "cta"; title: string; button: string }
  | { kind: "footer"; brand: string };

export type Template = {
  id: string;
  name: string;
  category: string;
  palette: { bg: string; ink: string; accent: string; soft: string };
  hero: { eyebrow: string; title: string; sub: string };
  sections: Section[];
};

const P = {
  cream:    { bg: "#FFF7E9", ink: "#2A1F10", accent: "#D97706", soft: "#FDECC8" },
  mint:     { bg: "#DFF7EE", ink: "#0F2A22", accent: "#0EA36B", soft: "#BEEBD8" },
  lavender: { bg: "#E7E4FF", ink: "#1B143A", accent: "#6A5AE0", soft: "#D3CCFF" },
  sky:      { bg: "#E5F1FF", ink: "#0B2545", accent: "#2563EB", soft: "#CFE3FF" },
  blush:    { bg: "#FFE6EE", ink: "#3A0F22", accent: "#E11D74", soft: "#FFC9DC" },
  sand:     { bg: "#F4EFE6", ink: "#241B10", accent: "#8A6A3B", soft: "#E7DBC4" },
  charcoal: { bg: "#1A1B22", ink: "#F5F5F7", accent: "#B6FF6C", soft: "#2A2C36" },
  paper:    { bg: "#FAFAF7", ink: "#0F1020", accent: "#111827", soft: "#EDEDE6" },
};

export const templates: Template[] = [
  {
    id: "restaurant", name: "Ostra", category: "Restaurant", palette: P.cream,
    hero: { eyebrow: "Reservations open", title: "Coastal plates, warm rooms.", sub: "Seasonal tasting menu on the harbour." },
    sections: [
      { kind: "nav", brand: "Ostra" },
      { kind: "hero", title: "Coastal plates, warm rooms.", subtitle: "Book a table by the water.", cta: "Reserve" },
      { kind: "grid", title: "Menu", items: ["Oyster mignonette", "Line-caught bream", "Brown butter tart"] },
      { kind: "gallery", items: ["Interior", "The pass", "Terrace"] },
      { kind: "cta", title: "See you at seven.", button: "Reserve" },
      { kind: "footer", brand: "Ostra" },
    ],
  },
  {
    id: "fashion", name: "Marée", category: "Fashion", palette: P.blush,
    hero: { eyebrow: "AW26", title: "Quiet luxury, loud fabrics.", sub: "The autumn collection has arrived." },
    sections: [
      { kind: "nav", brand: "Marée" },
      { kind: "hero", title: "Quiet luxury.", subtitle: "AW26 is here.", cta: "Shop" },
      { kind: "gallery", items: ["Look 01", "Look 02", "Look 03", "Look 04"] },
      { kind: "grid", title: "Bestsellers", items: ["Wool coat", "Silk shirt", "Leather boot"] },
      { kind: "footer", brand: "Marée" },
    ],
  },
  {
    id: "agency", name: "Northroom", category: "Agency", palette: P.paper,
    hero: { eyebrow: "Independent studio", title: "Brand systems for ambitious companies.", sub: "Strategy, identity, and digital, from Copenhagen." },
    sections: [
      { kind: "nav", brand: "Northroom" },
      { kind: "hero", title: "Brand systems.", subtitle: "For ambitious teams.", cta: "Work with us" },
      { kind: "grid", title: "Services", items: ["Strategy", "Identity", "Digital"] },
      { kind: "testimonial", quote: "They changed how our company sounds.", author: "CEO, Loop" },
      { kind: "footer", brand: "Northroom" },
    ],
  },
  {
    id: "medical", name: "Clara Health", category: "Medical", palette: P.mint,
    hero: { eyebrow: "Primary care, redesigned", title: "A calmer way to see a doctor.", sub: "Same-day visits. Human staff." },
    sections: [
      { kind: "nav", brand: "Clara" },
      { kind: "hero", title: "A calmer clinic.", subtitle: "Book in 60 seconds.", cta: "Book a visit" },
      { kind: "grid", title: "Services", items: ["Primary care", "Labs on site", "Mental health"] },
      { kind: "faq", items: [{ q: "Do you take insurance?", a: "Most major plans." }] },
      { kind: "footer", brand: "Clara" },
    ],
  },
  {
    id: "gym", name: "Iron Grove", category: "Gym", palette: P.charcoal,
    hero: { eyebrow: "Members only", title: "Train like it's a craft.", sub: "Coaching-first strength gym." },
    sections: [
      { kind: "nav", brand: "Iron Grove" },
      { kind: "hero", title: "Train like it's a craft.", subtitle: "Coaching-first.", cta: "Trial week" },
      { kind: "pricing", tiers: [{ name: "Drop-in", price: "$28" }, { name: "Monthly", price: "$199" }] },
      { kind: "footer", brand: "Iron Grove" },
    ],
  },
  {
    id: "store", name: "Loam", category: "Store", palette: P.sand,
    hero: { eyebrow: "Free shipping over $60", title: "Ceramics made slowly.", sub: "Wheel-thrown tableware from Lisbon." },
    sections: [
      { kind: "nav", brand: "Loam" },
      { kind: "hero", title: "Ceramics made slowly.", subtitle: "Wheel-thrown in Lisbon.", cta: "Shop" },
      { kind: "gallery", items: ["Bowl", "Vase", "Plate", "Mug"] },
      { kind: "footer", brand: "Loam" },
    ],
  },
  {
    id: "portfolio", name: "Ada Reyes", category: "Portfolio", palette: P.paper,
    hero: { eyebrow: "Selected work", title: "Product designer building calm software.", sub: "Berlin — available for select projects." },
    sections: [
      { kind: "nav", brand: "Ada" },
      { kind: "hero", title: "Calm software.", subtitle: "Selected work, 2020–now.", cta: "See work" },
      { kind: "gallery", items: ["Case 1", "Case 2", "Case 3"] },
      { kind: "footer", brand: "Ada Reyes" },
    ],
  },
  {
    id: "photography", name: "West Light", category: "Photography", palette: P.paper,
    hero: { eyebrow: "Weddings & editorial", title: "Photographs that keep breathing.", sub: "Documentary-style, worldwide." },
    sections: [
      { kind: "nav", brand: "West Light" },
      { kind: "hero", title: "Photographs that breathe.", subtitle: "Documentary weddings.", cta: "Enquire" },
      { kind: "gallery", items: ["Frame 01", "Frame 02", "Frame 03", "Frame 04"] },
      { kind: "footer", brand: "West Light" },
    ],
  },
  {
    id: "construction", name: "Beam & Co.", category: "Construction", palette: P.sand,
    hero: { eyebrow: "Family owned since 1994", title: "We build things that last.", sub: "Residential & commercial, Pacific Northwest." },
    sections: [
      { kind: "nav", brand: "Beam & Co." },
      { kind: "hero", title: "We build things that last.", subtitle: "Since 1994.", cta: "Request quote" },
      { kind: "grid", title: "Services", items: ["Design-build", "Additions", "Commercial"] },
      { kind: "footer", brand: "Beam & Co." },
    ],
  },
  {
    id: "salon", name: "Rue Blonde", category: "Salon", palette: P.blush,
    hero: { eyebrow: "New client offer", title: "A quieter kind of salon.", sub: "Colour, cut, care." },
    sections: [
      { kind: "nav", brand: "Rue Blonde" },
      { kind: "hero", title: "A quieter salon.", subtitle: "Colour, cut, care.", cta: "Book" },
      { kind: "pricing", tiers: [{ name: "Cut", price: "$85" }, { name: "Colour", price: "$180" }] },
      { kind: "footer", brand: "Rue Blonde" },
    ],
  },
  {
    id: "realestate", name: "Meridian Homes", category: "Real Estate", palette: P.sky,
    hero: { eyebrow: "Featured this week", title: "Homes with room to breathe.", sub: "Curated listings, honest agents." },
    sections: [
      { kind: "nav", brand: "Meridian" },
      { kind: "hero", title: "Homes with room to breathe.", subtitle: "Curated listings.", cta: "Browse" },
      { kind: "gallery", items: ["3BR Bungalow", "Loft", "Farmhouse"] },
      { kind: "footer", brand: "Meridian" },
    ],
  },
  {
    id: "interior", name: "Fern Studio", category: "Interior", palette: P.mint,
    hero: { eyebrow: "Interior architecture", title: "Rooms that make sense of light.", sub: "Full-service residential design." },
    sections: [
      { kind: "nav", brand: "Fern Studio" },
      { kind: "hero", title: "Rooms that make sense of light.", subtitle: "Full-service design.", cta: "Start a project" },
      { kind: "gallery", items: ["Kitchen", "Library", "Bedroom"] },
      { kind: "footer", brand: "Fern Studio" },
    ],
  },
  {
    id: "lawfirm", name: "Halden & Wolfe", category: "Law Firm", palette: P.paper,
    hero: { eyebrow: "Corporate & IP", title: "Straightforward counsel.", sub: "Advising founders and boards." },
    sections: [
      { kind: "nav", brand: "Halden & Wolfe" },
      { kind: "hero", title: "Straightforward counsel.", subtitle: "For founders and boards.", cta: "Contact" },
      { kind: "grid", title: "Practice areas", items: ["Corporate", "IP", "Employment"] },
      { kind: "footer", brand: "Halden & Wolfe" },
    ],
  },
  {
    id: "cafe", name: "Little Kettle", category: "Cafe", palette: P.cream,
    hero: { eyebrow: "Open 7am – 4pm", title: "Coffee, pastries, sunlight.", sub: "Neighborhood cafe on Elm." },
    sections: [
      { kind: "nav", brand: "Little Kettle" },
      { kind: "hero", title: "Coffee, pastries, sunlight.", subtitle: "On Elm St.", cta: "See menu" },
      { kind: "grid", title: "Today's bakes", items: ["Almond croissant", "Kouign-amann", "Sourdough"] },
      { kind: "footer", brand: "Little Kettle" },
    ],
  },
  {
    id: "startup", name: "Ledger", category: "Startup", palette: P.lavender,
    hero: { eyebrow: "New: v2.0", title: "Finance ops for modern teams.", sub: "One place for spend, budgets, and reporting." },
    sections: [
      { kind: "nav", brand: "Ledger" },
      { kind: "hero", title: "Finance ops for modern teams.", subtitle: "Spend, budgets, reporting.", cta: "Start free" },
      { kind: "grid", title: "Why teams switch", items: ["Real-time", "Fewer spreadsheets", "Audit-ready"] },
      { kind: "pricing", tiers: [{ name: "Team", price: "$29" }, { name: "Business", price: "$99" }] },
      { kind: "footer", brand: "Ledger" },
    ],
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id) ?? templates[0];
}
