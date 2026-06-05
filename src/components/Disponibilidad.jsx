// src/components/Disponibilidad.jsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { guardarDisponibilidad } from "../services/authService";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const FRANJAS = ["Mañana", "Mediodía", "Tarde", "Noche"];

export default function Disponibilidad({ onBack }) {
  const { user, profile } = useAuth();
  // Empezamos con lo que ya tuviera guardado (o lista vacía)
  const [seleccion, setSeleccion] = useState(
    Array.isArray(profile?.disponibilidad) ? profile.disponibilidad : []
  );
  const [guardando, setGuardando] = useState(false);

  function toggle(dia, franja) {
    const clave = `${dia}-${franja}`;
    setSeleccion((prev) =>
      prev.includes(clave)
        ? prev.filter((x) => x !== clave)
        : [...prev, clave]
    );
  }

  async function guardar() {
    setGuardando(true);
    try {
      await guardarDisponibilidad(user.uid, seleccion);
      alert("Disponibilidad guardada");
      onBack();
    } catch (e) {
      console.error("Error guardando disponibilidad:", e);
      alert("No se pudo guardar.");
      setGuardando(false);
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-bg max-w-[480px] mx-auto z-50">
      {/* Cabecera */}
      <div className="flex items-center gap-3 p-4 border-b border-[rgba(20,30,50,0.08)] bg-white flex-shrink-0">
        <button onClick={onBack} className="text-2xl text-txt-2">
          <i className="ti ti-arrow-left"></i>
        </button>
        <div className="font-semibold text-ink">Mi disponibilidad</div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-txt-2 text-sm mb-5">
          Marca cuándo sueles poder jugar. Otros jugadores lo verán al buscarte.
        </p>

        {/* Por cada día, una fila con sus franjas */}
        {DIAS.map((dia) => (
          <div key={dia} className="mb-5">
            <p className="font-archivo font-bold text-sm text-ink mb-2">{dia}</p>
            <div className="grid grid-cols-2 gap-2">
              {FRANJAS.map((franja) => {
                const activo = seleccion.includes(`${dia}-${franja}`);
                return (
                  <button
                    key={franja}
                    onClick={() => toggle(dia, franja)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border-[1.5px] transition ${
                      activo
                        ? "border-acid bg-acid/10 text-acid-d"
                        : "border-[rgba(20,30,50,0.08)] bg-white text-txt-2"
                    }`}
                  >
                    {franja}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Guardar */}
      <div className="p-5 flex-shrink-0">
        <button
          onClick={guardar}
          disabled={guardando}
          className="w-full bg-acid text-white font-archivo font-extrabold text-base rounded-2xl py-4 active:scale-[0.98] transition disabled:opacity-50"
        >
          {guardando ? "Guardando..." : "Guardar disponibilidad"}
        </button>
      </div>
    </div>
  );
}