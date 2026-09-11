# Despliegue

Dos servicios en dos plataformas: la API como contenedor en Fly.io, el sitio
como estático en Vercel.

El orden importa, porque cada uno necesita la dirección del otro.

## 1. La API, en Fly.io

Desde el repositorio [`umbra-api`](../umbra-api):

```bash
fly auth login
fly launch --no-deploy          # reclama el nombre; ya hay fly.toml
fly volumes create umbra_uploads --size 1 --region bog
fly deploy
```

El volumen no es opcional: las fotografías subidas viven ahí, y sin él
desaparecen en cada despliegue.

Anotá el dominio que devuelve, de la forma `https://umbra-api.fly.dev`.

**La máquina no se suspende.** `auto_stop_machines = false` con
`min_machines_running = 1` cuesta unos centavos al mes y evita el arranque en
frío, que es justo lo que no puede pasar mientras alguien mira la landing.

## 2. El sitio, en Vercel

Desde este repositorio:

```bash
npx vercel login
npx vercel link
npx vercel env add VITE_API_URL production   # https://umbra-api.fly.dev/api/v1
npx vercel --prod
```

Vite incrusta `VITE_API_URL` en el bundle al compilar, así que la variable debe
existir **antes** del despliegue: cambiarla después obliga a volver a compilar.

Anotá el dominio, de la forma `https://umbra-web.vercel.app`.

## 3. Cerrar el círculo

La API sólo acepta peticiones desde los orígenes que conoce, así que hay que
decirle cuál es el del sitio:

```bash
# en umbra-api
fly secrets set CORS_ORIGINS=https://umbra-web.vercel.app
```

Eso reinicia la máquina. Al terminar:

```bash
curl https://umbra-api.fly.dev/api/v1/health
```

y abrir el sitio: si las secciones cargan datos, el círculo está cerrado. Si
muestran el estado de error, el origen configurado no coincide con el dominio
real.

## Qué queda fuera

- **El panel no tiene autenticación.** Publicado, `/admin` queda accesible para cualquiera que conozca la ruta. Para un uso real hace falta una sesión y un rol.
- El lock de escritura es por proceso. Con una sola máquina alcanza; al escalar a varias, dos réplicas sobre el mismo volumen volverían a pisarse.
