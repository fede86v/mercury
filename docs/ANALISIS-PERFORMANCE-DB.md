# Análisis de performance – llamadas a base de datos

## Resumen

Se detectaron **varias causas** de llamadas excesivas a Firestore que consumen datos y degradan la experiencia. Las correcciones aplicadas reducen lecturas duplicadas y aprovechan la caché de React Query.

---

## 1. Doble (o triple) fetch en cada visita a una vista

**Problema:** En muchas vistas se usa `useQuery` (que ya hace un fetch al montar) y además un `useEffect` con `query.refetch()` y dependencias `[]`. Eso provoca:

- **Primera lectura:** `useQuery` ejecuta la función al montar.
- **Segunda lectura:** `useEffect` ejecuta `refetch()` al montar.

Resultado: **2× lecturas** cada vez que entrás a la página (en Productos, hasta **4×** porque hay 3 queries + refetch de las 3 en el mismo `useEffect`).

**Archivos afectados:**

- `Clientes.jsx`: `useQuery` + `useEffect(() => query.refetch(), [])`
- `Vendedores.jsx`: idem
- `Ventas.jsx`: idem
- `Productos.jsx`: 3 `useQuery` + `useEffect` que hace refetch de las 3
- `Config.jsx`: 2 `useQuery` + `useEffect` que hace refetch de ambas
- `DetalleVenta.jsx`: 2 `useQuery` + `useEffect` que hace refetch de ambas
- `DetalleCliente.jsx`, `DetalleVendedor.jsx`, `DetalleProducto.jsx`, `Perfil.jsx`: mismo patrón
- `Reportes.jsx`: 2 `useFirebaseQuery` + `useEffect` que hace refetch de ambas
- `Cliente.jsx` (componente): `useQuery` + `useEffect(() => query.refetch(), [])`
- `Vendedor.jsx` (componente): idem

**Solución:** Eliminar todos los `useEffect` que solo hacen `refetch()` al montar. `useQuery` ya hace el fetch inicial; no hace falta un refetch extra.

---

## 2. Mismos datos con distintas cache keys → sin reutilización

**Problema:** La misma colección se pide con keys de React Query distintas, así que la caché no se comparte y se repiten lecturas:

- Lista de **clientes**: en vista Clientes se usa `['clientes']` y en el componente `Cliente` (DetalleVenta, etc.) se usa `['client']` → **misma data, dos keys** → se vuelve a leer toda la lista al abrir una venta.
- Lista de **vendedores**: en vista Vendedores `['vendedores']` y en componente `Vendedor` `['vendedor']` → mismo efecto.

Cada vez que se abre DetalleVenta se cargan de nuevo **todos** los clientes y **todos** los vendedores aunque ya se hayan cargado en Clientes / Vendedores.

**Solución:** Usar la misma key donde sea la misma data:

- Siempre `['clientes']` para la lista de clientes (vista Clientes y componente Cliente).
- Siempre `['vendedores']` para la lista de vendedores (vista Vendedores y componente Vendedor).

Así, si el usuario ya visitó Clientes o Vendedores, al abrir DetalleVenta se reutiliza la caché y no se hacen lecturas extra.

---

## 3. Cliente.jsx: fetch directo al cerrar en lugar de usar la query

**Problema:** En `handleClose` del componente Cliente se llama directamente `getClientList()` en lugar de `query.refetch()`. Eso implica:

- Otra lectura completa a Firestore.
- Los datos no se actualizan en la caché de React Query (`['client']` / `['clientes']`), por lo que otras partes de la app no ven el nuevo cliente hasta un refetch manual o otra visita.

**Solución:** En `handleClose` usar `query.refetch()` (y, tras unificar keys, la key será `['clientes']` y toda la app verá los datos actualizados).

---

## 4. DetalleVenta: useQuery mal usado y refetch innecesario

**Problema:**

- Se usa `useQuery(["ventas"], getVenta, id)`. En React Query el tercer argumento es **opciones**, no `id`. Pasar `id` como tercer parámetro puede dar comportamiento raro.
- La query que carga una venta concreta debería depender de `id`, así que la key debe incluir `id`, por ejemplo `['venta', id]`.
- De nuevo, `useEffect` con `queryProductos.refetch()` y `queryVenta.refetch()` al montar provoca doble fetch.

**Solución:**

- Usar `useQuery(['venta', id], getVenta, { enabled: !!id })` (o equivalente con la API actual) para que la key sea por venta y la query solo se ejecute cuando hay `id` si hace falta.
- Quitar el `useEffect` que hace refetch al montar.

---

## 5. Falta de staleTime

**Problema:** No se define `staleTime` en el `QueryClient`. Con `staleTime: 0` (por defecto), los datos se consideran obsoletos de inmediato. Aunque tengas `refetchOnMount: false` y `refetchOnWindowFocus: false`, en otros escenarios (por ejemplo refetch manual o invalidation) se puede disparar más refetch de lo necesario.

**Solución:** Definir un `staleTime` razonable (por ejemplo 2–5 minutos) en las opciones por defecto del `QueryClient` para que, tras una lectura, no se vuelva a pedir la misma data a Firestore por un tiempo.

---

## Cambios aplicados en código

1. **Eliminación de `useEffect` que solo hacen `refetch()` al montar** en todas las vistas y en los componentes Cliente y Vendedor.
2. **Unificación de cache keys:** `['clientes']` en vista Clientes y en componente Cliente; `['vendedores']` en vista Vendedores y en componente Vendedor.
3. **Cliente.jsx:** En `handleClose` usar `query.refetch()` en lugar de `getClientList()`.
4. **DetalleVenta.jsx:** Key `['venta', id]` para la venta, opciones correctas y eliminación del refetch en mount.
5. **QueryClient:** `staleTime` por defecto (por ejemplo 2 * 60 * 1000 ms) para reducir refetches automáticos.

Con estos cambios se reducen de forma importante las lecturas a Firestore al navegar y al abrir/cerrar pantallas y formularios, manteniendo la funcionalidad actual.
