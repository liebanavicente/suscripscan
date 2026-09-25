# Suscripscan

Suscripscan es una herramienta web para controlar el gasto real de tus suscripciones digitales. Permite registrar servicios recurrentes, ver el gasto mensual, anual y diario, detectar renovaciones cercanas y exportar un informe en CSV o PDF.

> Nombre correcto del proyecto: **suscripscan**.

## Funcionalidades

- Dashboard con resumen mensual, anual y diario.
- Alta, edicion y eliminacion de suscripciones.
- Categorias visuales para streaming, musica, IA, software, gaming, nube, telefono e internet.
- Busqueda y filtros por categoria.
- Avisos de renovaciones proximas.
- Frases de impacto para entender mejor el coste acumulado.
- Exportacion a CSV y PDF.
- Datos guardados localmente en el navegador, sin cuentas ni servidor.

## Identidad visual

Suscripscan se diseña como **un tique de caja**: papel térmico, tinta negra y un sello de goma rojo.

- **Paleta**: papel `#efe9dc`, tinta `#17150f`, sello `#e2361b`, carbón `#2743c4` (gastos puntuales) y fosforito `#ffe14a` para resaltar.
- **Tipografía**: Bricolage Grotesque (titulares estrechos y pesados) + DM Mono (importes y etiquetas).
- **Recursos gráficos**: bordes rasgados en zigzag, puntos guía entre concepto e importe, sellos ("EN 3D", "¡REVISAR!"), código de barras, sombras duras de tinta y un láser de escaneo en la portada.
- **Categorías**: colores de tinta Risograph, legibles sobre papel.

Los tokens y utilidades (`.card`, `.btn-*`, `.field`, `.stamp`, `.leader`, `.receipt-edge-*`) están en `app/globals.css`.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Recharts
- jsPDF
- lucide-react

## Desarrollo

Instala dependencias:

```bash
npm install
```

Arranca el entorno local:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Comandos

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Privacidad

Suscripscan guarda la informacion en `localStorage`. Los datos no salen del dispositivo del usuario salvo que este exporte un CSV o PDF manualmente.

## Renombrar el repositorio

Si el repositorio publico aun aparece como `subscripscan`, renombralo en GitHub a `suscripscan` desde:

`Settings -> General -> Repository name`

Despues actualiza el remoto local:

```bash
git remote set-url origin https://github.com/liebanavicente/suscripscan.git
```
