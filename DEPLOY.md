# Despliegue

Hay dos formas de poner esto en línea, y difieren en una cosa: si lo que se
guarda desde el panel sobrevive.

| | Persiste | Duerme | Cuesta |
|---|---|---|---|
| Render, plan gratuito | No | La API sí, a los 15 min | No |
| Una máquina con disco | Sí | No | Según el proveedor |

## Opción A — Render, plan gratuito

Dos servicios: la API como contenedor, el sitio como estático. El blueprint
está en `render.yaml`, dentro del repositorio [`umbra-api`](../umbra-api).

1. En Render: **New > Blueprint**, apuntando a `umbra-api`.
2. Dejar que cree los dos servicios y anotar las dos URL.
3. Completar las dos variables que quedaron sin valor y volver a desplegar:

   ```
   umbra-api   CORS_ORIGINS   https://umbra-web.onrender.com
   umbra-web   VITE_API_URL   https://umbra-api.onrender.com/api/v1
   ```

   `VITE_API_URL` se incrusta al compilar, así que hay que redesplegar el sitio
   después de fijarla; cambiarla más tarde obliga a compilar otra vez.

4. Comprobar:

   ```bash
   curl https://umbra-api.onrender.com/api/v1/health
   ```

### Qué esperar de este plan

**La API se suspende tras 15 minutos sin tráfico y tarda cerca de un minuto en
despertar.** La primera visita después de un rato quieto ve las secciones
cargando; pasados cuatro segundos el sitio lo explica en pantalla en vez de
quedarse en blanco. El sitio en sí no duerme: es estático y sale de un CDN.

**El plan gratuito no tiene disco.** El sistema de archivos se borra en cada
reinicio, redespliegue y despertar. Eso significa que **lo que se cree desde
`/admin` desaparece al reiniciarse**, y las colecciones vuelven a la copia del
repositorio.

Es un límite del plan, no del servicio: la misma imagen con un disco montado en
`/data` conserva todo. Para verlo funcionando de punta a punta, la opción B.

## Opción B — Una máquina, con disco

Un solo origen: nginx sirve el sitio y hace de proxy a la API bajo el mismo
host. No hay CORS que configurar, la API no queda expuesta a internet, y lo que
se guarda persiste.

```bash
git clone https://github.com/CamiloAnay/umbra-api
git clone https://github.com/CamiloAnay/umbra-web
cd umbra-web
docker compose -f docker-compose.prod.yml up -d --build
```

El sitio queda en el puerto 80. Las colecciones y las fotografías viven en un
volumen: se siembran desde la copia de la imagen la primera vez y sobreviven a
reconstruirla desde cero.

Sirve igual en local que en cualquier VM. Sobre un servidor con dominio, falta
añadir TLS —con un proxy delante o `certbot` sobre el nginx del compose.

## Qué queda fuera, en cualquiera de las dos

- **El panel no tiene autenticación.** Publicado, `/admin` queda accesible para cualquiera que conozca la ruta. Un uso real necesita sesión y rol.
- El lock de escritura es por proceso. Con una instancia alcanza; al escalar a varias, dos réplicas sobre el mismo volumen volverían a pisarse.
- Al reemplazar la fotografía de una amenidad, la anterior queda en el volumen sin que nada la referencie.
