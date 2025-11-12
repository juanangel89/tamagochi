// src/components/EggSetup.js (o app/components/EggSetup.js en Next.js)

import React, { useState } from 'react';
import Image from 'next/image';
import egg from "@/assets/egg.png"


const EggSetup = ({ onHatch }) => {
    const [eggName, setEggName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (eggName.trim() === '') {
            setError('Por favor, dale un nombre a tu huevo.');
            return;
        }

        setError('');
        onHatch(eggName.trim());
    };


    return (
        // Contenedor principal: centrado, sombra, fondo claro y esquinas redondeadas
        <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white shadow-2xl rounded-xl border border-gray-100">

            {/* Título */}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                ¡Bienvenido a tu Tamagotchi!
            </h1>

            {/* Visual del Huevo - Clase grande y animación de pulso */}
            {/* Nota: La animación 'animate-pulse' es una clase nativa de Tailwind */}
            {/* <div className="text-[150px] mb-8 animate-pulse">
        🥚
      </div> */}
            <div className="mb-8 w-40 h-40 mx-auto animate-bamboleo">
                <Image
                    src={egg} // Ruta directa desde la carpeta 'public'
                    alt="Huevo Prehistórico con manchas"
                    width={200} // El ancho en píxeles que corresponde a w-40
                    height={200} // La altura en píxeles que corresponde a h-40
                    priority // Opcional: Carga la imagen más rápido porque es LCP
                    className="object-contain" // Asegura que la imagen se ajuste
                />
            </div>

            {/* Instrucción */}
            <p className="text-lg text-gray-600 mb-6">
                Dale un nombre a tu huevo para que eclosione:
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Campo de entrada */}
                <input
                    type="text"
                    placeholder="Ej: Shelly, Drako, Bob..."
                    value={eggName}
                    onChange={(e) => setEggName(e.target.value)}
                    maxLength={15}
                    // Clases de Tailwind para estilo del input
                    className="p-3 border-2 bg-orange-400 border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:border-green-500 transition duration-300"
                />

                {/* Mensaje de error */}
                {error && (
                    <p className="text-red-500 font-medium text-sm">
                        {error}
                    </p>
                )}

                {/* Botón para iniciar el juego */}
                <button
                    type="submit"
                    // Clases de Tailwind para el botón: color verde, padding, sombra al pasar el mouse
                    className="p-3 bg-green-500 text-white font-bold rounded-lg text-xl hover:bg-green-600 transition duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                    disabled={eggName.trim() === ''} // Deshabilita el botón si no hay nombre
                >
                    HACER QUE ECLOSIONE
                </button>
            </form>
        </div>
    );
};

export default EggSetup;