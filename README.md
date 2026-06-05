# Ace — App de tenis

Proyecto en Vite + React + Tailwind + Firebase. Versión mínima (paso 1: registro/login).

## Cómo arrancar

1. Instala las dependencias:
   ```
   npm install
   ```

2. Pon tu configuración de Firebase en `src/firebase.js`
   (la copias de console.firebase.google.com → ⚙️ Configuración → Tus apps → icono web `</>`).

3. En la consola de Firebase, activa:
   - **Authentication** → método "Correo electrónico/contraseña" y "Google"
   - **Firestore Database** → crear en modo de prueba, ubicación Europa

4. Arranca:
   ```
   npm run dev
   ```
   Abre la URL que te muestre (normalmente http://localhost:5173).

## Estructura

```
src/
  firebase.js              ← config de Firebase (PON TU CONFIG AQUÍ)
  hooks/useAuth.js         ← gestiona la sesión y carga el perfil
  services/authService.js  ← registro, login, logout, crear perfil
  components/Auth.jsx      ← pantalla de login/registro
  App.jsx                  ← ata todo
```

## Estado del proyecto

- [x] Paso 1: Registro + login (Google y email) + guardar perfil en Firestore
- [ ] Paso 2: Lista de jugadores (Buscar)
- [ ] Paso 3: Retar + chat
- [ ] Paso 4: Resultado + confirmación
- [ ] Paso 5: Ranking
- [ ] Paso 6: Disponibilidad
- [ ] Empaquetar para Android

## Datos en Firestore

**usuarios** (cada documento = un jugador, id = uid):
nombre, email, foto, zona, nivel, puntos (empieza en 1000), partidos, victorias, disponibilidad, creado
