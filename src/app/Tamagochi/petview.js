'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import happy from "@/assets/dinohappy.png";
import sleep from "@/assets/dinosleep.png";
import play from "@/assets/dinoplay.png";
import iuch from "@/assets/dinoiuch.png";
import sick from "@/assets/dinosick.png";
import pop from "@/assets/dinopop.png";
import eat from "@/assets/dinoeat.png";
import hungry from "@/assets/dinohungry.png";
import insomnia from "@/assets/dinoinsomnia.png";
// Importa los íconos de Lucide React para los botones
import { Utensils, Bed, Smile, FlaskConical, Droplet, Toilet } from 'lucide-react';

const AI_SERVICE_URL = "http://172.21.103.13:3000/";

const SLEEP_DURATION_TICKS = 5; // 5 segundos de sueño (5 ticks de 1000ms)
// Define el estado inicial de la mascota al nacer
const INITIAL_STATS = {
  // Estadísticas Vitales
  hunger: 50,      // Nuevo: Hambre (para comer)
  happiness: 80,    // Nuevo: Diversión (para jugar)
  health: 80,      // Nuevo: Salud (para curar)
  energy: 50,      // Nuevo: Energía (para dormir)
  bladder: 40,     // Nuevo: Vejiga (para hacer del cuerpo)
  hygiene: 70,     // Nuevo: Higiene (para bañarse)
};

// Componente para la barra de estadísticas
const StatBar = ({ label, value, color }) => {
  // Determinar la clase de color para la barra (ej: bg-red-500, bg-green-500)
  var barColor = `bg-${color}-500`;
  if (color == "red") {
    barColor = `bg-${color}-600`;
  }

  // Asignar color dinámicamente según el nivel (Ej: rojo si es muy bajo)
  let actualBarColor = barColor;
  if (value < 20) {
    if (label == "Vejiga (Baño)") {
      actualBarColor = 'bg-green-500';
    } else {
      actualBarColor = 'bg-red-600';
    }
  } else if (value < 50) {
    if (label == "Salud (Curar)") {
      actualBarColor = 'bg-green-500';
    } else {
      actualBarColor = 'bg-red-600';
    }
    actualBarColor = 'bg-yellow-500';
  }

  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm font-medium text-gray-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${actualBarColor}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};


const TamagotchiPetView = () => {
  const searchParams = useSearchParams();
  const petName = searchParams.get('name') || 'Amigo';
  const [petStats, setPetStats] = useState(INITIAL_STATS);

  const [dinoImageSrc, setDinoImageSrc] = useState(happy);
  const [think, setThink] = useState(null); // Usamos 'null' para que el diálogo no se muestre inicialmente
  const [loading, setLoading] = useState(false); // Estado para indicar si la IA está pensando

  // 2. Función para llamar al servicio de IA
  const fetchAIDialog = async (stats) => {
    // const stats={ 
    //   'hunger':prevStats.hunger,
    //   'energy':prevStats.energy,
    //   'happiness':prevStats.happiness,
    //   'health':prevStats.health,
    //   'bladder':prevStats.bladder,
    //   'hygiene':prevStats.hygiene
    // }

    // Si ya está cargando, sal
    if (loading) return;

    setLoading(true);
    setThink("Estoy penshando..."); // Mensaje temporal de carga

    try {
      // Realiza la petición POST enviando las estadísticas actuales
      const response = await fetch(`${AI_SERVICE_URL}api/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envía el objeto de estadísticas como JSON en el cuerpo
        body: JSON.stringify({ stats: stats, name: petName }),
      });

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      // Asume que la respuesta es un JSON con una propiedad 'message' o similar
      const data = await response.json();

      // La respuesta de la IA (ajusta 'data.message' si tu API usa otro nombre de campo)
      const aiResponse = data.message || "No hay respuesta clara de la IA.";

      // Actualiza el estado 'think' con la respuesta real
      setThink(aiResponse);

    } catch (error) {
      console.error("Error al obtener algo en mi cabeza:", error);
      setThink("¡Oops! No she me ocurre naita."); // Mensaje de error
    } finally {
      setLoading(false); // Siempre desactiva la carga al finalizar
    }
  };

  const handleFetchThink = async (stats) => {
    await fetchAIDialog(stats)
  }

  // const petName = "Dino Prehistórico";

  // --- LÓGICA DE DETERIORO GLOBAL (SE EJECUTA CADA SEGUNDO) ---
  useEffect(() => {
    const interval = setInterval(() => {

      setPetStats(prevStats => {
        if (prevStats.energy >= 70) {
          setDinoImageSrc(happy);
        }
        if (prevStats.hygiene <= 50) {
          setDinoImageSrc(iuch);
        }
        if (prevStats.bladder >= 80) {
          setDinoImageSrc(hungry);
        }
        if (prevStats.hunger <= 45) {
          setDinoImageSrc(hungry);
        }
        if (prevStats.energy <= 40) {
          setDinoImageSrc(insomnia);
        }
        if (prevStats.health < 55) {
          setDinoImageSrc(sick);
        }
        // Si el dino está durmiendo, el deterioro se maneja en el ciclo de sueño.
        if (prevStats.isSleeping) {
          // Si está durmiendo, no aplicamos el deterioro general, pero si sigue
          // bajando lentamente el hambre.
          return {
            ...prevStats,
            hunger: Math.max(0, prevStats.hunger - 1),
          }
        }

        // --- Deterioro General (Solo cuando está despierto) ---
        const newStats = {
          ...prevStats,
          // Disminución constante de las estadísticas
          energy: Math.max(0, prevStats.energy - 1),
          hunger: Math.max(0, prevStats.hunger - 1),
          happiness: Math.max(0, prevStats.happiness - 1),
          bladder: Math.min(100, prevStats.bladder + 1), // Vejiga sube (necesita ir al baño)
          hygiene: Math.max(0, prevStats.hygiene - 1),

          // La salud puede deteriorarse si alguna stat está muy baja
          health: (prevStats.hunger < 20 || prevStats.hygiene < 20)
            ? Math.max(0, prevStats.health - 5)
            : prevStats.health,
        };

        handleFetchThink(newStats)
        return newStats;
      });

    }, 5000); // Se ejecuta cada 1 segundo (1000ms)

    return () => clearInterval(interval); // Limpieza
  }, []); // Se ejecuta solo una vez al montar

  // --- LÓGICA DEL CICLO DE SUEÑO (SE ACTIVA CON isSleeping = true) ---
  useEffect(() => {
    let sleepInterval;

    if (petStats.isSleeping) {
      setDinoImageSrc(sleep); // Cambia la imagen a dormir

      sleepInterval = setInterval(() => {
        setPetStats(prevStats => {
          const newTick = prevStats.sleepTick + 1;
          const isFinished = newTick > SLEEP_DURATION_TICKS;

          const newStats = {
            ...prevStats,
            // 1. CARGA PROGRESIVA DE ENERGÍA: +10 por tick (hasta 50 en total)
            energy: Math.min(100, prevStats.energy + 10),

            // 2. Controla si el ciclo terminó
            sleepTick: isFinished ? 0 : newTick,
            isSleeping: !isFinished, // Si terminó, se despierta (false)

            // 3. Vuelve a la imagen de feliz si despertó
            // NOTA: setDinoImageSrc no debe estar aquí, se debe hacer después del setPetStats
          };

          if (isFinished) {
            clearInterval(sleepInterval); // Detiene el temporizador de sueño
            setDinoImageSrc(happy); // Despierta y pone la imagen feliz
          }

          return newStats;
        });
      }, 1000); // Se ejecuta cada 1 segundo (1000ms)
    }

    return () => {
      if (sleepInterval) {
        clearInterval(sleepInterval);
      }
      // Cuando el dino despierta, también reiniciamos el tick por seguridad.
      if (!petStats.isSleeping && petStats.sleepTick !== 0) {
        setPetStats(prevStats => ({ ...prevStats, sleepTick: 0 }));
      }
    };
  }, [petStats.isSleeping]); // Dependencia en isSleeping para iniciar el ciclo

  // Función placeholder para manejar las acciones (por ahora solo loguea)
  const handleAction = (action) => {
    // Si está durmiendo, no se puede hacer nada
    if (petStats.isSleeping && action !== 'SLEEP') return;
    var val = 1
    console.log(`Acción ejecutada: ${action}`);
    setPetStats(prevStats => {
      const newStats = { ...prevStats }; // Copia del estado anterior

      switch (action) {
        case 'FEED':
          // Llenar el hambre al 100%, pero sin exceder 100
          newStats.hunger = Math.min(100, prevStats.hunger + 40);
          newStats.energy = Math.max(0, prevStats.energy - 10);
          newStats.bladder = Math.min(100, prevStats.bladder + 15);
          newStats.hygiene = Math.max(0, prevStats.hygiene - 10);
          val = Math.floor(Math.random() * 21)
          newStats.health = Math.max(0, prevStats.health - val);
          setDinoImageSrc(eat);
          setTimeout(() => {
            setDinoImageSrc(happy);
          }, 3000);
          break;
        case 'SLEEP':
          // Solo inicia el ciclo si está despierto
          if (!prevStats.isSleeping) {
            newStats.isSleeping = true;
          }

          break;
        case 'PLAY':
          // Llenar felicidad
          newStats.happiness = Math.min(100, prevStats.happiness + 50);
          newStats.energy = Math.max(0, prevStats.energy - 30);
          newStats.hunger = Math.max(0, prevStats.hunger - 10);
          newStats.hygiene = Math.max(0, prevStats.hygiene - 30);
          val = Math.floor(Math.random() * 21)
          newStats.health = Math.max(0, prevStats.health - val);
          setDinoImageSrc(play);
          setTimeout(() => {
            setDinoImageSrc(happy);
          }, 3000);

          break;
        case 'HEAL':
          // Llenar salud
          newStats.health = 100;
          newStats.happiness = Math.max(0, prevStats.happiness - 50);
          newStats.energy = Math.max(0, prevStats.energy - 10);
          if (prevStats.bladder < 50) {
            newStats.bladder = Math.min(100, prevStats.bladder + 20);
          }
          break;
        case 'BATH':
          // Llenar higiene
          newStats.hygiene = 100;
          newStats.energy = Math.max(0, prevStats.energy - 10);
          break;
        case 'POOP':
          // Vaciar vejiga
          newStats.bladder = 0;
          newStats.hygiene = Math.max(0, prevStats.hygiene - 20);
          setDinoImageSrc(pop);
          setTimeout(() => {
            setDinoImageSrc(happy);
          }, 3000);
          break;
        default:
          break;
      }

      return newStats; // Retornar el nuevo objeto para la re-renderización
    });
    // Aquí es donde actualizarías setPetStats({...})
  };


  // --- Botones de la Interfaz ---

  // Estilo base para todos los botones
  const actionButtonClasses = "flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition duration-200 text-gray-700";

  return (
    <div className=" p-8 bg-white shadow-2xl rounded-xl text-center border-4 border-yellow-400">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
        {petName}
      </h1>
      <p className="text-lg text-gray-500 mb-8">
        Tu compañero prehistórico
      </p>

      {/* ÁREA VISUAL DEL DINO (Contenedor central) */}
      <div className=" flex flex-col items-center justify-center">

        {/* DIV DE BOTONES FLOTANTE (Encima del Dino) */}
        <div className=" flex justify-between ">

          {/* Fila superior de botones (Comer, Dormir, Jugar) */}
          <div className="flex gap-2">
            <button className={actionButtonClasses} onClick={() => handleAction('FEED')}>
              <Utensils className="w-6 h-6 text-red-500" />
              <span className="text-xs mt-1">Comer</span>
            </button>
            <button className={actionButtonClasses} onClick={() => handleAction('SLEEP')}>
              <Bed className="w-6 h-6 text-purple-500" />
              <span className="text-xs mt-1">Dormir</span>
            </button>
            <button className={actionButtonClasses} onClick={() => handleAction('PLAY')}>
              <Smile className="w-6 h-6 text-green-500" />
              <span className="text-xs mt-1">Jugar</span>
            </button>
          </div>

          {/* Fila inferior de botones (Curar, Bañar, Baño) */}
          <div className="flex gap-2">
            <button className={actionButtonClasses} onClick={() => handleAction('HEAL')}>
              <FlaskConical className="w-6 h-6 text-blue-500" />
              <span className="text-xs mt-1">Curar</span>
            </button>
            <button className={actionButtonClasses} onClick={() => handleAction('BATH')}>
              <Droplet className="w-6 h-6 text-cyan-500" />
              <span className="text-xs mt-1">Bañar</span>
            </button>
            <button className={actionButtonClasses} onClick={() => handleAction('POOP')}>
              <Toilet className="w-6 h-6 text-yellow-700" />
              <span className="text-xs mt-1">Baño</span>
            </button>
          </div>
        </div>

        {/* DIV DEL DINO (Para la imagen centrada) */}
        <div className="w-100 h-90 flex content-center items-center relative ">

          <div className="w-100 h-90 relative">
            <Image
              src={dinoImageSrc}
              alt="Mascota Digital"
              fill
              style={{ objectFit: "contain" }}
              priority
              className="animate-respiracion"
            />
          </div>
          {
            think && (
              <div className=" p-1 w-40 h-20 flex items-center justify-center text-sm text-center bg-blue-400 text-blue-800  rounded-lg absolute top-0 right-0 ">
                <h2>
                  {think}
                </h2>
              </div>
            )
          }

        </div>


      </div>

      {/* Sección de Estadísticas (Abajo del Dino) */}
      <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Estadísticas Vitales</h2>

        <StatBar label="Energía (Dormir)" value={petStats.energy} color="green" />
        <StatBar label="Hambre (Comer)" value={petStats.hunger} color="green" />
        <StatBar label="Diversión (Jugar)" value={petStats.happiness} color="green" />
        <StatBar label="Salud (Curar)" value={petStats.health} color="green" />
        <StatBar label="Vejiga (Baño)" value={petStats.bladder} color="red" />
        <StatBar label="Higiene (Bañar)" value={petStats.hygiene} color="green" />
      </div>

    </div>
  );
};

export default TamagotchiPetView;