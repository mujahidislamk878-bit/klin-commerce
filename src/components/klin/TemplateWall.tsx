"use client";
import { useMemo } from "react";
import { templates } from "@/lib/klin-templates";
import { TemplateThumbnail } from "./TemplateThumbnail";

type ProductCard = {
  id: string;
  templateIndex: number;
};

export function TemplateWall() {
  const cards = useMemo<ProductCard[]>(() => (
    templates.slice(0, 8).map((template, index) => ({ id: `product-${index}`, templateIndex: index }))
  ), []);

  const duplicatedCards = useMemo(() => [...cards, ...cards], [cards]);

  return (
    <section className="relative w-full px-0 pt-12 lg:pt-16 pb-8 lg:pb-10">
      <div className="relative w-full" style={{ left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <div className="w-screen px-0 md:px-0">
          <div className="w-full rounded-[40px] border border-[#E7E9F2] bg-white shadow-soft">
            <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-10">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-5xl leading-[1.02] tracking-[-0.02em] md:text-7xl">
                  Every business starts differently.
                  <span className="block italic text-[#6A5AE0]">Yours starts here.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg text-[#0F1020]/70">
                  Thousands of professionally designed websites. Every one fully customizable.
                </p>
              </div>

              <div className="mt-10 w-full overflow-visible px-0">
                <div className="relative -mx-6 overflow-visible md:-mx-8">
                  <div className="flex min-w-[200%] gap-5 animate-scroll-left overflow-visible px-6 md:px-8" style={{ width: "max-content" }}>
                    {duplicatedCards.map((card, index) => (
                      <div
                        key={`top-${index}-${card.id}`}
                        className={`shrink-0 rounded-[34px] border border-[#E5E7EB] bg-white shadow-soft transition-transform duration-300 ${index % 2 === 0 ? "-rotate-3" : "rotate-3"}`}
                        style={{ width: 280, minWidth: 280 }}
                      >
                        <div className="h-[220px] overflow-hidden rounded-[30px]">
                          <TemplateThumbnail template={templates[card.templateIndex]} compact />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex min-w-[200%] gap-5 animate-scroll-right overflow-visible px-6 md:px-8" style={{ width: "max-content" }}>
                    {duplicatedCards.map((card, index) => (
                      <div
                        key={`bottom-${index}-${card.id}`}
                        className={`shrink-0 rounded-[34px] border border-[#E5E7EB] bg-white shadow-soft transition-transform duration-300 ${index % 2 === 0 ? "rotate-3" : "-rotate-3"}`}
                        style={{ width: 280, minWidth: 280 }}
                      >
                        <div className="h-[220px] overflow-hidden rounded-[30px]">
                          <TemplateThumbnail template={templates[card.templateIndex]} compact />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
