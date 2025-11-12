// app/page.js 
'use client';
import React, { useState } from 'react';
import EggSetup from '../components/EggSetup';
import Image from 'next/image';
import egg from "@/assets/egg.png";
import { useRouter } from 'next/navigation'; 
// import TamagotchiPet from '../components/TamagotchiPet'; 

const TamagotchiGame = () => {
  const [isHatched, setIsHatched] = useState(false);
  const [petName, setPetName] = useState('');
  const router = useRouter(); 

  const handleHatch = (name) => {
    setPetName(name);
    setIsHatched(true);
  };

      const handleClick = () => {
    // Redirige programáticamente a la ruta '/tamagochi'
    router.push(`Tamagochi?name=${encodeURIComponent(petName)}`); 
  };

  return (
    // Puedes darle a tu main un fondo gris ligero de Tailwind
    <main className="min-h-screen bg-gray-50 flex items-start justify-center pt-20">
      {isHatched ? (
        // <TamagotchiPet name={petName} />
        <div className="text-center mt-20 p-8 bg-orange-200 shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-700">¡Felicidades, {petName}! Tu mascota ha nacido.</h2>
          <p className="text-gray-500 mt-2">Ahora es tu turno de cuidarla.</p>

            <button type='button' onClick={handleClick} className="mb-8 w-40 h-40 mx-auto cursor-pointer">
              <Image
                src={egg} // Ruta directa desde la carpeta 'public'
                alt="Huevo Prehistórico con manchas"
                width={160} // El ancho en píxeles que corresponde a w-40
                height={160} // La altura en píxeles que corresponde a h-40
                priority // Opcional: Carga la imagen más rápido porque es LCP
                className="absolute object-contain" // Asegura que la imagen se ajuste
              />
              <Image
                src={egg} // Ruta directa desde la carpeta 'public'
                alt="Huevo Prehistórico con manchas"
                width={160} // El ancho en píxeles que corresponde a w-40
                height={160} // La altura en píxeles que corresponde a h-40
                priority // Opcional: Carga la imagen más rápido porque es LCP
                className="relative object-contain animate-ping" // Asegura que la imagen se ajuste
              />
            </button>

        </div>
      ) : (
        <EggSetup onHatch={handleHatch} />
      )}
    </main>
  );
};

export default TamagotchiGame;