import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center group ${className}`}>
      <Image 
        src="/logo2.png" 
        alt="Karsaloka Logo" 
        width={400} 
        height={100} 
        className="object-contain h-10 sm:h-12 w-auto transition-opacity duration-300 group-hover:opacity-80" 
        priority
      />
    </div>
  );
}
