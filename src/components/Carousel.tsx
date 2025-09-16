"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full">
      <Carousel items={cards} />
    </div>
  );
}

const data = [
  {
    title: "Giga",
    src: "/assets/teams/giga.svg",
    href: "https://www.gigahidjrikaaa.my.id/",
  },
  {
    title: "Dzikran",
    src: "/assets/teams/dzikran.svg",
    href: "https://dzikran.sumbu.xyz",
  },
  {
    title: "Maul",
    src: "/assets/teams/maul.svg",
    href: "https://maulana.sumbu.xyz",
  },
  {
    title: "Farhan",
    src: "/assets/teams/farhan.svg",
    href: "https://frhnn.my.id",
  },
  {
    title: "Azfar",
    src: "/assets/teams/azfar.svg",
    href: "https://azfar.sumbu.xyz",
  },
];
