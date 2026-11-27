import { StructuredData } from "@/components/structured-data";
import { origin, owner, pageMetadata } from "@/lib/seo";
import { ArrowUpRight } from "lucide-react";
import { PortfolioHeader } from "@/components/portfolio-header";

export const metadata = pageMetadata(
  "/gadgets", "Gadgets — Abhimanyu Saharan",
  "A look at Abhimanyu Saharan’s desk and homelab hardware, from Logitech peripherals to the Raspberry Pi boards and NVMe drives behind his Kubernetes cluster.",
  "/gadgets-card.jpg",
);

type Gadget = { name: string; description: string; affiliateUrl?: string };

const gadgets: Gadget[] = [
  {
    name: "Logitech G915 X LIGHTSPEED",
    description: "A low-profile wireless mechanical keyboard.",
    affiliateUrl: "https://link.amazon/B06zJT0LV",
  },
  {
    name: "Logitech G502 X Lightspeed",
    description: "A wireless gaming mouse.",
    affiliateUrl: "https://link.amazon/B0bPVRRNL",
  },
  {
    name: "Logitech G733 Lightspeed",
    description: "A wireless gaming headset.",
    affiliateUrl: "https://link.amazon/B06EvRaMk",
  },
  {
    name: "Logitech MX Brio",
    description: "A webcam for video calls.",
    affiliateUrl: "https://link.amazon/B0hLqgqrf",
  },
  {
    name: "Raspberry Pi 5 Model B (16 GB RAM)",
    affiliateUrl: "https://link.amazon/B0gFkH2oU",
    description: "Nine of these boards run my Kubernetes cluster. Three handle the control plane and six run workloads.",
  },
  {
    name: "WD Green SN350 · 500 GB",
    affiliateUrl: "https://link.amazon/B01nq8Gsd",
    description: "I use these NVMe drives in four Pi nodes for the operating system and Longhorn storage.",
  },
  {
    name: "WD Blue SN5000",
    description: "An NVMe solid-state drive.",
    affiliateUrl: "https://link.amazon/B0gkeEvqN",
  },
];

export default function GadgetsPage() {
  return (
    <div className="sheet">
      <a className="skip" href="#main">Skip to content</a>
      <PortfolioHeader gadgets />
      <StructuredData data={{
        "@type": "CollectionPage", "@id": origin + "/gadgets#page", url: origin + "/gadgets",
        name: "Gadgets", author: { "@type": "Person", "@id": origin + "/#person", name: owner },
        isPartOf: { "@id": origin + "/#website" },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: gadgets.map(({ name, description }, index) => ({
            "@type": "ListItem", position: index + 1, name, description,
          })),
        },
      }} />
      <main id="main" className="gear">
        <h1>Gadgets</h1>
        <p className="bio">The gear I use at my desk and in my homelab.</p>
        {gadgets.some(item => item.affiliateUrl) && (
          <p className="disclosure">I may earn a commission if you buy through the affiliate links on this page.</p>
        )}
        <ul>
          {gadgets.map(({ name, description, affiliateUrl }) => (
            <li key={name}>
              <h2>{affiliateUrl ? <a href={affiliateUrl} rel="sponsored">{name} <ArrowUpRight size={18} /></a> : name}</h2>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
