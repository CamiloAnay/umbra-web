# umbra-web

Landing del lanzamiento de **UMBRAL**, un proyecto residencial ficticio en El
Poblado, Medellín, más el panel con el que se administran sus zonas comunes.
Prueba técnica para Umbra Group.

- Landing: `/`
- Panel de administración: `/admin`, al que se llega desde el pie de la landing

API que la alimenta: [`umbra-api`](../umbra-api).

## Requisitos

- Node.js 22 o superior
- La API corriendo en `http://localhost:3001`

## Instalación y ejecución

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

Los dos servicios juntos, desde este repositorio. Requiere que `umbra-api` esté
clonado al lado, como carpeta hermana:

```bash
docker compose up --build    # front en :8080, API en :3001
```

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos y compila a `dist/` |
| `npm run preview` | Sirve el build |
| `npm run typecheck` | Verifica tipos sin compilar |
| `npm test` | Corre la suite |

## Variables de entorno

| Variable | Por defecto | Para qué sirve |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3001/api/v1` | Base de la API, sin barra final |

Vite incrusta este valor en el bundle al compilar, así que cambiar de entorno
significa volver a compilar. La imagen de Docker lo recibe como `ARG`.

## Estructura

```
src/
  app/                  App.tsx, el enrutado y los tokens de diseño
  features/             una carpeta por dominio, con todo lo suyo dentro
    typologies/
      model/            tipos y funciones puras de presentación
      api/              el puerto del repositorio y su implementación HTTP
      hooks/            el caso de uso, como hook
      ui/               el container y sus presentacionales
    amenities/
      ui/admin/         el panel: listado, formulario y borrado
    uploads/            el campo que sube una fotografía
    stats/  location/  lead/
  sections/             las secciones sin datos remotos
  shared/
    ui/atoms · molecules · organisms
    hooks/              useAsync, useReducedMotion, useFocusTrap
    lib/http/           cliente tipado y normalización de errores
    motion/             GSAP, parallax y reveals
```

### Las decisiones que sostienen esto

**Organización por feature, no por tipo de archivo.** Todo lo de las amenidades
vive en `features/amenities/`. La misma forma se repite en el backend, así que
hay una sola idea que entender en los dos repositorios.

**Container y presentacional.** El container tiene el estado y consume el hook;
los presentacionales reciben props y no saben que existe una API.
`TypologiesSection` posee el filtro seleccionado, y `TypologyFilters` solo
reporta hacia arriba qué botón se presionó. Por eso se puede cambiar el filtro
sin tocar nada relacionado con datos.

**El estado remoto es una unión discriminada, no un conjunto de booleanos:**

```ts
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: HttpError }
  | { status: 'empty' }
  | { status: 'ready'; data: T }
```

El estado inválido `loading && error` no se puede representar, y `AsyncBoundary`
hace un `switch` sobre los cuatro casos: si mañana aparece un quinto, el
compilador señala todos los lugares que hay que actualizar.

**Cada feature declara su repositorio como interfaz.** El hook depende de esa
interfaz, no de `fetch`. Eso es lo que permite probar el camino de error sin red
ni servidor, como en `tests/useTypologies.test.tsx`.

**Cada sección pide sus propios datos.** Un endpoint lento no retrasa el resto
de la página, y quitar una sección es borrar una línea de `App.tsx`.

## Animaciones

Una sola librería: **GSAP**, con ScrollTrigger y Flip. Sumar además Framer
Motion habría sido una segunda dependencia de motion en una landing, sin nada
que la justifique.

| Efecto | Dónde | Cómo |
|---|---|---|
| Entrada orquestada | Hero, al cargar | Una timeline: la sombra se estira desde las letras, la palabra sube dentro de su recorte, la foto y el texto se acomodan después |
| Parallax | Hero, al hacer scroll | Tres capas atadas al scroll con `scrub`. La sombra viaja más que la foto, así que se va destapando conforme baja el sol |
| Pin | Experiencia | La sección se fija, la luz se desliza sobre la foto y el texto se asienta. Solo en pantallas anchas |
| FLIP | Filtro de tipologías | Las tarjetas viajan a su nueva posición al filtrar, en lugar de saltar |
| Cruce | Selector de amenidades | La foto y el texto entran juntos, a distancias distintas |
| Entrada en viewport | Proyecto, Tipologías, Ubicación | `useReveal`, con `stagger` entre hijos |
| Contador | Cifras | El número cuenta hasta su valor al entrar en pantalla |
| Transiciones | Filtros, mapa, hover, foco | CSS |

Tres decisiones que sostienen esto:

**El estado inicial lo aplica GSAP, nunca el CSS.** Si el script no corre
—movimiento reducido, un error de JavaScript, un navegador viejo— el contenido
queda visible, en vez de quedarse en `opacity: 0` sin nada que lo revele.

**El título del hero no se desvanece.** Es el elemento más grande que pinta la
página, así que aparecerlo con un fundido atrasaría el momento en que el
navegador la considera renderizada. Se pinta de inmediato y se mueve dentro de
un recorte.

**El pin no se aplica en móvil.** Fijar una sección pelea con el scroll por
inercia de una pantalla táctil y le quita el gesto a quien lo está haciendo.
Ahí la foto simplemente deriva. La separación se hace con `gsap.matchMedia`.

Todo el motion pasa por `useReducedMotion`, que lee la preferencia del sistema y
la sigue leyendo: si se cambia con la página abierta, la coreografía se detiene
en ese momento.

## Panel de administración

En `/admin` se listan las zonas comunes, se crean, se editan y se eliminan con
confirmación. Cada escritura muestra su estado —guardando, guardado, falló— y los
mensajes por campo que devuelve la API.

**La fotografía se sube, no se escribe una ruta.** El archivo va a
`POST /uploads`, el servidor lo convierte a WebP en dos tamaños y devuelve la
ruta base; lo que se guarda en la amenidad es esa ruta. La vista previa lee el
valor guardado, no el archivo local, así que lo que se ve en pantalla es lo que
quedó almacenado.

**El enrutado son veinte líneas.** Dos vistas no justifican una librería de
routing: `useSyncExternalStore` sobre `popstate` cubre leer la ruta, escuchar
atrás y adelante, y empujar historial. El servidor ya tenía la parte que falta,
porque nginx devuelve el documento para cualquier ruta desconocida.

**El panel usa el mismo repositorio que la landing.** Lo que se guarda aparece
en la landing en la siguiente carga, sin una segunda fuente de verdad.

## Responsive

Mobile no es el desktop angosto. El hero cambia de composición, las amenidades
pasan de un selector con panel a una fila que se recorre con el dedo —porque una
tira de pestañas no es un gesto de pulgar—, las tipologías muestran la planta al
lado de los datos en vez de encima, y el mapa se ubica antes de la lista.

Las dos interacciones de amenidades se alimentan del mismo container, así que el
camino de datos es idéntico.

## Accesibilidad y performance

- Navegación completa por teclado, incluidos los puntos del mapa.
- El menú mobile atrapa el foco, cierra con `Escape` y lo devuelve al abridor.
- Los errores de formulario se anuncian con `aria-describedby` y `aria-invalid`; el resultado del envío con `role="status"`.
- Dos tamaños por fotografía en WebP: un teléfono nunca descarga la versión de 1600 px.
- Todo lo que está bajo el pliegue carga en diferido y declara su tamaño, así el layout no salta.
- Meta tags, Open Graph y JSON-LD en `index.html`.

## Pruebas

```bash
npm test
```

Veintidós casos:

- `typology.model.test.ts` — filtros y formatos, como funciones puras.
- `lead.model.test.ts` — las reglas de validación del formulario.
- `useTypologies.test.tsx` — los tres desenlaces del hook (`ready`, `empty`, `error`) contra repositorios falsos.
- `useAmenityAdmin.test.tsx` — que cree o actualice según corresponda, que no envíe un borrador inválido, que adopte los mensajes del servidor, y que un borrado fallido no reporte un cambio.
- `TypologyFilters.test.tsx` — que el filtro reporte hacia arriba en vez de filtrar por su cuenta.

## Uso de IA

Herramienta(s):
- Claude (Claude Code) para la implementación de ambos repositorios.
- Claude Design para la dirección visual.

Para qué la utilicé:
- Redacté yo el prompt de dirección de arte y lo ejecuté en Claude Design, que devolvió los nueve bloques en desktop y mobile con su paleta y su escala tipográfica. Ese archivo es referencia visual: la maquetación, los componentes y el estado son código propio escrito sobre la arquitectura definida antes de generar el diseño.
- Generación asistida de los componentes, los datos ficticios del proyecto y los archivos de configuración.

Código o partes asistidas:
- Marcado y estilos de las nueve secciones, a partir del diseño.
- Estructura inicial de las features en ambos repositorios.
- El CRUD de las cuatro colecciones y el panel de administración.
- Datos del proyecto ficticio (tipologías, amenidades, cifras y puntos de interés).
- Dockerfiles y configuración de nginx.

Qué revisé/modifiqué:
- Rechacé la arquitectura que la IA propuso primero. Venía con hexagonal completa —`domain`, `application`, `infrastructure` por feature— para siete endpoints sin base de datos. Sin reglas de negocio no hay nada que aislar, así que la bajé a organización por feature con una sola interfaz de repositorio.
- También descarté MVC cuando apareció como alternativa: en una API REST no existe la vista, y sin persistencia el modelo se reduce a un tipo más un lector de archivos.
- Descarté Next.js. Con un backend separado el SSR no aporta nada, y el SEO se cubre con meta tags estáticos porque es una sola página.
- Quité un `as never` que la IA usó para reutilizar `formatBedrooms` con un objeto incompleto. Cambié la firma de la función para que reciba el número.
- Los datos ficticios salieron sin tildes en la primera pasada («bano», «jardin»). Los reescribí completos: es texto que ve el usuario.
- Fijé la convención de idioma: comentarios e identificadores en inglés, copy visible en español.
- Corregí el alcance del backend. La primera versión era de solo lectura, lo que no sostiene la mitad «fullstack» del enunciado, así que pedí el CRUD completo de las cuatro colecciones.
- Rechacé que la imagen de una amenidad se ingresara escribiendo una ruta. Un panel para una persona que administra el proyecto necesita subir el archivo, así que pedí la subida y la conversión en el servidor.
- Rechacé un `onEnter` que la IA dejó en el hook de FLIP: era una función que compilaba sin hacer nada. Lo reemplacé por las animaciones reales de entrada y salida.

Decisiones técnicas tomadas por mí:
- Organización por feature en los dos repositorios, con la misma forma en ambos.
- Las reglas de escritura comunes a las cuatro colecciones viven una sola vez, en `shared/crud`; cada feature aporta solo lo suyo.
- Sin base de datos para este volumen: cuatro colecciones de menos de diez registros, escritas por una persona. Un archivo JSON con lock y escritura atómica alcanza, y el puerto queda declarado para cuando el lock por proceso deje de servir.
- Sin librería de routing para dos vistas.
- Sin TanStack Query. Resuelve caché, revalidación y deduplicación, problemas que esta landing no tiene con cuatro lecturas y una sola carga. El estado remoto se modela como unión discriminada con un hook propio.
- Una sola librería de motion.
- El filtro de tipologías es interacción de interfaz y vive en el cliente: con cuatro tipologías, ir al servidor por cada clic sería latencia comprada a cambio de nada.
- Validar los archivos de datos contra su esquema al leerlos, para que un JSON mal editado falle nombrando el campo.

Problemas encontrados en código generado y cómo los solucioné:
- **El detalle por campo del error 400 no llegaba al cliente.** El manejador de errores estaba declarado después de registrar las rutas, y en Fastify cada plugin hereda el manejador que su padre tenía en el momento del registro: los contextos de ruta se quedaron con el de fábrica. Se resolvió declarando `setErrorHandler` y `setNotFoundHandler` antes de todos los `register`.
- **`exactOptionalPropertyTypes` rompía el cliente HTTP.** `RequestInit.signal` admite `AbortSignal | null`, no `undefined`. Se arregló componiendo el init sin la propiedad cuando no hay señal, en vez de relajar la configuración del compilador.
- **La unión discriminada de `FormField` no se estrechaba.** Al hacer `spread` del objeto completo, TypeScript colapsaba los tipos de `onChange` de `input` y `textarea`. Se separó en dos ramas para que el estrechamiento ocurra antes del `spread`.
- **TypeScript 7 eliminó `baseUrl`.** Los alias se reescribieron como rutas relativas en `paths`.
- **`inert` es booleano en React 19**, no una cadena vacía.
- **El contenedor de la API no arrancaba.** El proceso corre como usuario sin privilegios y `/app` pertenece a root, así que no podía crear el directorio de subidas al iniciar. Se resolvió creándolo en la imagen con el dueño correcto antes de bajar de root, y declarándolo volumen para que las fotos sobrevivan a un recambio de contenedor.
- **Las escrituras concurrentes se pisaban.** Cada una es un read-modify-write sobre la colección completa, así que diez altas simultáneas dejaban una. Se resolvió con un lock por archivo; hay un test que falla si se desactiva.
- **Los mensajes de campo faltante salían en inglés.** Cuando un campo no llega, Zod emite un error de tipo con su propio texto y sin el valor recibido, así que hay que recorrer el payload por la ruta del error para distinguir «ausente» de «inválido».

## Despliegue

El procedimiento completo está en [`DEPLOY.md`](./DEPLOY.md). En resumen: en el
plan gratuito de Render la API se suspende tras 15 minutos y no tiene disco, así
que **lo que se guarde desde el panel no sobrevive a un reinicio**; con
`docker compose -f docker-compose.prod.yml up` sobre cualquier máquina con disco,
sí, y además todo queda en un solo origen sin CORS de por medio.

Cuando la API tarda más de cuatro segundos en responder, la interfaz lo dice en
pantalla en lugar de quedarse cargando: en el plan gratuito, la primera visita
después de un rato quieto está esperando a que el servidor despierte.

## Pendientes

- **El panel no tiene autenticación.** Cualquiera que conozca `/admin` puede escribir. Para un uso real hace falta una sesión y un rol; está fuera del alcance de la prueba y se documenta como límite, no como olvido.
- **Faltan fotografías.** Hay cuatro imágenes reales para diez espacios, así que algunas se repiten entre amenidades y tipologías. Se pueden reemplazar una por una desde el panel, sin tocar código.
- Las plantas de las tipologías son esquemas dibujados con datos de path, no planos aprobados.
- El mapa es un diagrama de distancias, no cartografía. Un mapa real habría sumado una dependencia pesada y una llave de API para responder la única pregunta que importa aquí: a cuánto queda cada referencia.
