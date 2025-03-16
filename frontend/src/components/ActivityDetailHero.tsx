// src/components/ActivityDetailHero.tsx
import React from "react";

interface ActivityDetailHeroProps {
  image: string;
  name: string;
}

const ActivityDetailHero: React.FC<ActivityDetailHeroProps> = ({ image, name }) => {
  return (
    <div className="relative h-[60vh]">
      <img src={image} alt={name} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">{name}</h1>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailHero;
