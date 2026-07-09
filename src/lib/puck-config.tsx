import type { Config, Data } from "@measured/puck";
import { getTemplate, templates } from "./klin-templates";

// -----------------------------------------------------------------------------
// Component props types
// -----------------------------------------------------------------------------
type NavProps      = { brand: string };
type HeroProps     = { eyebrow: string; title: string; sub: string; cta: string; bg: string; ink: string; accent: string };
type FeatureProps  = { title: string; items: string };
type GalleryProps  = { items: string };
type TestimonialProps = { quote: string; author: string; bg: string; ink: string };
type PricingProps  = { tiers: string };
type FaqProps      = { items: string };
type CtaProps      = { title: string; button: string; bg: string; ink: string };
type FooterProps   = { brand: string };

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------
type Props = {
  Navbar: NavProps;
  Hero: HeroProps;
  FeatureGrid: FeatureProps;
  Gallery: GalleryProps;
  Testimonials: TestimonialProps;
  Pricing: PricingProps;
  FAQ: FaqProps;
  CTA: CtaProps;
  Footer: FooterProps;
};

export const puckConfig: Config<Props> = {
  components: {
    Navbar: {
      fields: { brand: { type: "text" } },
      defaultProps: { brand: "Studio" },
      render: ({ brand }: NavProps) => (
        <div className="flex items-center justify-between px-8 py-5">
          <div className="text-lg" style={{ fontFamily: "Instrument Serif, serif" }}>{brand}</div>
          <nav className="hidden gap-6 text-sm opacity-70 md:flex">
            <span>Work</span><span>About</span><span>Journal</span><span>Contact</span>
          </nav>
          <button className="rounded-full bg-black px-4 py-2 text-xs text-white">Get in touch</button>
        </div>
      ),
    },

    Hero: {
      fields: {
        eyebrow: { type: "text" },
        title:   { type: "textarea" },
        sub:     { type: "textarea" },
        cta:     { type: "text" },
        bg:      { type: "text" },
        ink:     { type: "text" },
        accent:  { type: "text" },
      },
      defaultProps: {
        eyebrow: "Now open",
        title: "A calmer way to build.",
        sub: "Design visually. Ship instantly.",
        cta: "Get started",
        bg: "#FFF7E9",
        ink: "#2A1F10",
        accent: "#D97706",
      },
      render: ({ eyebrow, title, sub, cta, bg, ink, accent }: HeroProps) => (
        <section className="px-8 py-16 md:py-24" style={{ background: bg, color: ink }}>
          <div className="text-xs uppercase tracking-widest opacity-70">{eyebrow}</div>
          <h1 className="mt-3 max-w-3xl text-5xl leading-[1.02] md:text-7xl" style={{ fontFamily: "Instrument Serif, serif" }}>
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg opacity-80">{sub}</p>
          <button className="mt-8 rounded-full px-6 py-3 text-sm font-medium" style={{ background: ink, color: bg }}>
            {cta} →
          </button>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {[1,2,3].map((i) => (
              <div key={i} className="h-28 rounded-2xl" style={{ background: i === 2 ? accent : "rgba(0,0,0,0.06)" }} />
            ))}
          </div>
        </section>
      ),
    },

    FeatureGrid: {
      fields: {
        title: { type: "text" },
        items: { type: "textarea" }, // comma separated
      },
      defaultProps: {
        title: "What we do",
        items: "Strategy, Identity, Digital, Print",
      },
      render: ({ title, items }: FeatureProps) => (
        <section className="px-8 py-16">
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "Instrument Serif, serif" }}>{title}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.split(",").map((it, i) => (
              <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="text-3xl opacity-30">0{i+1}</div>
                <div className="mt-3 font-medium">{it.trim()}</div>
              </div>
            ))}
          </div>
        </section>
      ),
    },

    Gallery: {
      fields: { items: { type: "textarea" } },
      defaultProps: { items: "Frame 01, Frame 02, Frame 03, Frame 04" },
      render: ({ items }: GalleryProps) => (
        <section className="px-8 py-16">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {items.split(",").map((it, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-gradient-to-br from-neutral-200 to-neutral-100 p-4 text-xs text-neutral-500">
                {it.trim()}
              </div>
            ))}
          </div>
        </section>
      ),
    },

    Testimonials: {
      fields: {
        quote: { type: "textarea" },
        author: { type: "text" },
        bg: { type: "text" }, ink: { type: "text" },
      },
      defaultProps: {
        quote: "They changed how our company sounds.",
        author: "CEO, Loop",
        bg: "#0F1020", ink: "#FFFFFF",
      },
      render: ({ quote, author, bg, ink }: TestimonialProps) => (
        <section className="px-8 py-20" style={{ background: bg, color: ink }}>
          <blockquote className="mx-auto max-w-3xl text-center text-3xl md:text-5xl" style={{ fontFamily: "Instrument Serif, serif" }}>
            "{quote}"
          </blockquote>
          <div className="mt-6 text-center text-sm opacity-70">— {author}</div>
        </section>
      ),
    },

    Pricing: {
      fields: { tiers: { type: "textarea" } },
      defaultProps: { tiers: "Starter|$0, Pro|$29, Team|$99" },
      render: ({ tiers }: PricingProps) => (
        <section className="px-8 py-16">
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "Instrument Serif, serif" }}>Pricing</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tiers.split(",").map((row, i) => {
              const [name, price] = row.split("|").map((s) => s.trim());
              return (
                <div key={i} className="rounded-2xl bg-white p-6 shadow-sm">
                  <div className="text-sm opacity-70">{name}</div>
                  <div className="mt-2 text-4xl" style={{ fontFamily: "Instrument Serif, serif" }}>{price}</div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    },

    FAQ: {
      fields: { items: { type: "textarea" } },
      defaultProps: { items: "Do you take insurance?|Most major plans., How long is a session?|Around 45 minutes." },
      render: ({ items }: FaqProps) => (
        <section className="px-8 py-16">
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "Instrument Serif, serif" }}>Questions</h2>
          <div className="mt-8 divide-y">
            {items.split(",").map((row, i) => {
              const [q, a] = row.split("|");
              return (
                <div key={i} className="py-4">
                  <div className="font-medium">{q}</div>
                  <div className="mt-1 text-sm opacity-70">{a}</div>
                </div>
              );
            })}
          </div>
        </section>
      ),
    },

    CTA: {
      fields: { title: { type: "text" }, button: { type: "text" }, bg: { type: "text" }, ink: { type: "text" } },
      defaultProps: { title: "See you at seven.", button: "Reserve", bg: "#0F1020", ink: "#FFFFFF" },
      render: ({ title, button, bg, ink }: CtaProps) => (
        <section className="px-8 py-24 text-center" style={{ background: bg, color: ink }}>
          <h2 className="mx-auto max-w-3xl text-5xl md:text-7xl" style={{ fontFamily: "Instrument Serif, serif" }}>
            {title}
          </h2>
          <button className="mt-8 rounded-full px-8 py-3 text-sm font-medium" style={{ background: ink, color: bg }}>
            {button} →
          </button>
        </section>
      ),
    },

    Footer: {
      fields: { brand: { type: "text" } },
      defaultProps: { brand: "Studio" },
      render: ({ brand }: FooterProps) => (
        <footer className="flex items-center justify-between px-8 py-8 text-sm opacity-70">
          <div>{brand}</div>
          <div>© {new Date().getFullYear()}</div>
        </footer>
      ),
    },
  },
};

// -----------------------------------------------------------------------------
// Convert shared Template → Puck Data
// -----------------------------------------------------------------------------
export function templateToPuckData(templateId: string): Data {
  const t = getTemplate(templateId);
  const content: Data["content"] = [];

  for (const s of t.sections) {
    switch (s.kind) {
      case "nav":
        content.push({ type: "Navbar", props: { id: `nav-${templateId}`, brand: s.brand } });
        break;
      case "hero":
        content.push({
          type: "Hero",
          props: {
            id: `hero-${templateId}`,
            eyebrow: t.hero.eyebrow, title: s.title, sub: s.subtitle, cta: s.cta,
            bg: t.palette.bg, ink: t.palette.ink, accent: t.palette.accent,
          },
        });
        break;
      case "grid":
        content.push({
          type: "FeatureGrid",
          props: { id: `grid-${templateId}`, title: s.title, items: s.items.join(", ") },
        });
        break;
      case "gallery":
        content.push({ type: "Gallery", props: { id: `gal-${templateId}`, items: s.items.join(", ") } });
        break;
      case "testimonial":
        content.push({
          type: "Testimonials",
          props: { id: `t-${templateId}`, quote: s.quote, author: s.author, bg: t.palette.ink, ink: t.palette.bg },
        });
        break;
      case "pricing":
        content.push({
          type: "Pricing",
          props: { id: `p-${templateId}`, tiers: s.tiers.map((x) => `${x.name}|${x.price}`).join(", ") },
        });
        break;
      case "faq":
        content.push({
          type: "FAQ",
          props: { id: `f-${templateId}`, items: s.items.map((x) => `${x.q}|${x.a}`).join(", ") },
        });
        break;
      case "cta":
        content.push({
          type: "CTA",
          props: { id: `cta-${templateId}`, title: s.title, button: s.button, bg: t.palette.ink, ink: t.palette.bg },
        });
        break;
      case "footer":
        content.push({ type: "Footer", props: { id: `foot-${templateId}`, brand: s.brand } });
        break;
    }
  }

  return { content, root: { props: { title: t.name } } };
}

export const editableCategories = templates.map((t) => ({ id: t.id, label: t.category }));
