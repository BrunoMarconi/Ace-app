// src/services/playersService.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Lee todos los usuarios MENOS el que está logueado
export async function getPlayers(miUid) {
  const snap = await getDocs(collection(db, "usuarios"));
  const jugadores = [];
  snap.forEach((doc) => {
    const data = doc.data();
    if (data.uid !== miUid) {
      jugadores.push(data);
    }
  });
  // Ordenar por puntos (ranking) de mayor a menor
  jugadores.sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
  return jugadores;
}

// Lee todos los usuarios ordenados por puntos (para el ranking)
export async function getRanking() {
  const snap = await getDocs(collection(db, "usuarios"));
  const jugadores = [];
  snap.forEach((doc) => jugadores.push(doc.data()));
  jugadores.sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
  return jugadores;
}

// Calcula la posición del usuario en el ranking (1 = primero)
export async function getMiPosicion(miUid) {
  const ranking = await getRanking(); // ya ordenado por puntos
  const idx = ranking.findIndex((j) => j.uid === miUid);
  return {
    posicion: idx === -1 ? null : idx + 1,
    total: ranking.length,
  };
}