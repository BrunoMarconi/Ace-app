// src/components/CompletarPerfil.jsx
import { useState } from "react";
import { completarPerfil } from "../services/authService";

const ZONAS = [
  "Málaga capital", "Alhaurín de la Torre", "Alhaurín el Grande",
  "Torremolinos", "Benalmádena", "Fuengirola", "Mijas", "Marbella",
  "Estepona", "Vélez-Málaga", "Rincón de la Victoria", "Cártama",
  "Coín", "Antequera",
];

export default function CompletarPerfil({ uid, nombre, onListo }) {
  const [zona, setZona] = useState("Málaga capital");
  const [nivel, setNivel] = useState("Avanzado");
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    setGuardando(true);
    try {
      await completarPerfil(uid, zona, nivel);
      onListo(); // avisa a la app de que ya está completo
    } catch (e) {
      console.error("Error completando perfil:", e);
      alert("No se pudo guardar. Inténtalo de nuevo.");
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex justify-center">
      <div className="w-full max-w-[480px] px-7 flex flex-col">
        <h1 className="font-archivo font-black text-3xl tracking-tight text-center mt-16 text-ink">
          ¡Hola{nombre ? ", " + nombre.split(" ")[0] : ""}!
        </h1>
        <p className="text-center text-txt-2 text-[15px] mt-2 mb-8">
          Solo falta un paso para empezar a jugar
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
              ¿De qué zona eres?
            </label>
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[rgba(20,30,50,0.08)] rounded-xl p-4 text-[15px] outline-none focus:border-acid"
            >
              {ZONAS.map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-semibold text-txt-2 mb-1.5">
              ¿Cuál es tu nivel?
            </label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              className="w-full bg-white border-[1.5px] border-[rgba(20,30,50,0.08)] rounded-xl p-4 text-[15px] outline-none focus:border-acid"
            >
              <option>Intermedio</option>
              <option>Avanzado</option>
              <option>Competición</option>
            </select>
          </div>
        </div>

        <button
          onClick={guardar}
          disabled={guardando}
          className="w-full bg-acid text-white font-archivo font-extrabold text-base rounded-2xl py-4 mt-7 active:scale-[0.98] transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Empezar a jugar"}
        </button>
      </div>
    </div>
  );
}