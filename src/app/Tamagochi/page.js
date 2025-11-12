// app/Tamagochi/page.js
// NO LLEVA 'use client'

import React, { Suspense } from 'react';
import TamagotchiPetView from './petview';

// 1. Componente de Carga (Fallback)
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen text-xl text-gray-600">
        Cargando mascota y resolviendo nombre... 🥚
    </div>
);

// 2. Componente de la Página (Server Component)
export default function TamagotchiPage() {
  return (
    // <Suspense> debe envolver al componente que utiliza el hook
    <Suspense fallback={<LoadingFallback />}>
      <TamagotchiPetView />
    </Suspense>
  );
}