import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  or,
  orderBy,
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

// Crear un reto (partido en estado "propuesto")
export async function crearReto(yo, rival) {
  const partido = {
    retadorUid: yo.uid,
    retadorNombre: yo.nombre,
    rivalUid: rival.uid,
    rivalNombre: rival.nombre,
    estado: "propuesto", // propuesto → aceptado → jugado → confirmado
    creado: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "partidos"), partido);
  return ref.id;
}

// Leer los partidos en los que estoy (como retador o como rival)
export async function misPartidos(miUid) {
  const ref = collection(db, "partidos");
  const q = query(
    ref,
    or(where("retadorUid", "==", miUid), where("rivalUid", "==", miUid))
  );
  const snap = await getDocs(q);
  const partidos = [];
  snap.forEach((d) => partidos.push({ id: d.id, ...d.data() }));
  return partidos;
}

// Aceptar un reto
export async function aceptarReto(partidoId) {
  await updateDoc(doc(db, "partidos", partidoId), { estado: "aceptado" });
}

// Rechazar / cancelar un reto
export async function rechazarReto(partidoId) {
  await updateDoc(doc(db, "partidos", partidoId), { estado: "rechazado" });
}

// Enviar un mensaje a un partido
export async function enviarMensaje(partidoId, autorUid, autorNombre, texto) {
  const ref = collection(db, "partidos", partidoId, "mensajes");
  await addDoc(ref, {
    autorUid,
    autorNombre,
    texto,
    creado: serverTimestamp(),
  });
}

// Escuchar los mensajes de un partido EN TIEMPO REAL
// Devuelve una función para "dejar de escuchar" cuando cierras el chat
export function escucharMensajes(partidoId, callback) {
  const ref = collection(db, "partidos", partidoId, "mensajes");
  const q = query(ref, orderBy("creado", "asc"));
  return onSnapshot(q, (snap) => {
    const mensajes = [];
    snap.forEach((d) => mensajes.push({ id: d.id, ...d.data() }));
    callback(mensajes);
  });
}

// Meter el resultado de un partido (queda pendiente de confirmar)
export async function meterResultado(partidoId, datos) {
  await updateDoc(doc(db, "partidos", partidoId), {
    estado: "jugado",
    resultado: datos.sets,          // ej: "6-3, 4-6, 6-2"
    ganadorUid: datos.ganadorUid,
    ganadorNombre: datos.ganadorNombre,
    resultadoMetidoPor: datos.metidoPor, // uid de quien lo metió
  });
}

// Confirmar el resultado (lo confirma el otro jugador)
// Confirmar el resultado → aplica el Elo
export async function confirmarResultado(partidoId) {
  // Leer el partido para saber quién ganó y quién perdió
  const ref = doc(db, "partidos", partidoId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const p = snap.data();

  // Quién perdió (el que no es el ganador)
  const perdedorUid = p.ganadorUid === p.retadorUid ? p.rivalUid : p.retadorUid;

  // Aplicar puntos
  await aplicarElo(p.ganadorUid, perdedorUid);

  // Marcar como confirmado
  await updateDoc(ref, { estado: "confirmado" });
}

// Rechazar el resultado (vuelve a "aceptado" para volver a meterlo)
export async function rechazarResultado(partidoId) {
  await updateDoc(doc(db, "partidos", partidoId), {
    estado: "aceptado",
    resultado: null,
    ganadorUid: null,
    ganadorNombre: null,
    resultadoMetidoPor: null,
  });
}

// Calcula y aplica el ajuste de puntos Elo a los dos jugadores
async function aplicarElo(ganadorUid, perdedorUid) {
  // Leer los puntos actuales de ambos
  const gRef = doc(db, "usuarios", ganadorUid);
  const pRef = doc(db, "usuarios", perdedorUid);
  const [gSnap, pSnap] = await Promise.all([getDoc(gRef), getDoc(pRef)]);
  if (!gSnap.exists() || !pSnap.exists()) return;

  const Rg = gSnap.data().puntos || 1000;
  const Rp = pSnap.data().puntos || 1000;

  const K = 32; // factor de ajuste (cuánto se mueve el ranking)
  // Probabilidad esperada de que ganara cada uno
  const Eg = 1 / (1 + Math.pow(10, (Rp - Rg) / 400));
  const Ep = 1 / (1 + Math.pow(10, (Rg - Rp) / 400));

  // El ganador suma (1 - Eg), el perdedor resta su parte
  const cambioGanador = Math.round(K * (1 - Eg));
  const cambioPerdedor = Math.round(K * (0 - Ep));

  // Aplicar: actualizar puntos, partidos y victorias
  await Promise.all([
    updateDoc(gRef, {
      puntos: increment(cambioGanador),
      partidos: increment(1),
      victorias: increment(1),
    }),
    updateDoc(pRef, {
      puntos: increment(cambioPerdedor),
      partidos: increment(1),
    }),
  ]);
}

// Devuelve tu partido "aceptado" más reciente (para el banner del home)
export async function miProximoPartido(miUid) {
  const partidos = await misPartidos(miUid); // ya la tienes
  // Buscamos uno aceptado (pendiente de jugar)
  const aceptados = partidos.filter((p) => p.estado === "aceptado");
  return aceptados.length > 0 ? aceptados[0] : null;
}

// Retos que me han planteado y están pendientes de responder
export async function misRetosPendientes(miUid) {
  const partidos = await misPartidos(miUid);
  return partidos.filter(
    (p) => p.rivalUid === miUid && p.estado === "propuesto"
  );
}