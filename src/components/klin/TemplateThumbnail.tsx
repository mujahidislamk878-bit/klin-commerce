import type { Template, Section } from "@/lib/klin-templates";

/**
 * Renders a miniature "website preview" from a Template's shared data.
 * Used in hero universe, template wall, and Section 5 marquee — so the
 * landing page and the Puck editor render from the same source.
 */
export function TemplateThumbnail({ template, compact = false }: { template: Template; compact?: boolean }) {
  const { palette, hero, sections } = template;
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: palette.bg, color: palette.ink }}
    >
      {/* faux nav */}
      <div className="flex items-center justify-between px-4 pt-3 text-[8px] font-medium tracking-wide">
        <span className="font-display text-[11px] leading-none">{template.name}</span>
        <div className="flex gap-2 opacity-70">
          <span>Work</span><span>About</span><span>Contact</span>
        </div>
        <span
          className="rounded-full px-2 py-[3px] text-[8px]"
          style={{ background: palette.accent, color: palette.bg }}
        >
          {hero.eyebrow.split(" ").slice(0, 2).join(" ")}
        </span>
      </div>
      {/* hero */}
      <div className={compact ? "px-4 pt-3" : "px-5 pt-5"}>
        <div className="text-[8px] uppercase tracking-widest opacity-60">{template.category}</div>
        <div className={`font-display leading-[1.05] ${compact ? "text-[15px] mt-1" : "text-[22px] mt-2"}`}
             style={{ color: palette.ink }}>
          {hero.title}
        </div>
        <div className={`opacity-70 ${compact ? "text-[8px] mt-1" : "text-[10px] mt-2"}`}>
          {hero.sub}
        </div>
        <div
          className={`inline-flex mt-2 rounded-full px-2.5 py-1 text-[8px] font-medium`}
          style={{ background: palette.ink, color: palette.bg }}
        >
          Get started →
        </div>
      </div>
      {/* content strip: derives from sections */}
      <div className="mt-3 grid grid-cols-3 gap-1.5 px-4 pb-4">
        {sections.slice(1, 4).map((s, i) => (
          <div
            key={i}
            className="rounded-md h-10"
            style={{ background: i % 2 === 0 ? palette.soft : palette.accent, opacity: i % 2 === 0 ? 1 : 0.8 }}
            title={sectionLabel(s)}
          />
        ))}
      </div>
    </div>
  );
}

function sectionLabel(s: Section) {
  return s.kind;
}
