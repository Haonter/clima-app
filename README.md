# Clima App

## Descripción
Clima App es una aplicación web que permite a los usuarios consultar el pronóstico del clima en tiempo real para cualquier ciudad del mundo. La aplicación muestra información detallada incluyendo temperatura actual, sensación térmica, hora local ajustada a la zona horaria de la ciudad consultada, y un pronóstico detallado por horas con datos de precipitaciones.

## Características
- 🔍 Búsqueda de ciudades a nivel mundial
- 🌡️ Visualización de temperatura actual y sensación térmica
- 🕒 Reloj local ajustado a la zona horaria de la ciudad consultada
- 📊 Pronóstico detallado por horas (24 horas) con:
  - Temperatura
  - Precipitaciones (lluvia o nieve)
  - Iconos dinámicos que cambian según:
    - La hora del día (sol/luna)
    - Condiciones climáticas (lluvia, nieve)
- 📱 Diseño responsive adaptable a diferentes dispositivos
- ✨ Animaciones y transiciones fluidas para mejorar la experiencia de usuario

## Tecnologías utilizadas

### Frontend
- **HTML5**
- **JavaScript (ES6+)** con programación asíncrona (async/await)
- **TailwindCSS** para los estilos y componentes responsive
- **Font Awesome 6** para iconografía
- **Animate.css** para animaciones
- **Swiper.js** para el carrusel de pronóstico horario

### APIs externas
- **Open-Meteo Geocoding API**: Para la búsqueda y geolocalización de ciudades
  - Endpoint: `https://geocoding-api.open-meteo.com/v1/search`
  - Funcionalidad: Convierte nombres de ciudades en coordenadas geográficas (latitud/longitud)

- **Open-Meteo Weather Forecast API**: Para datos meteorológicos actuales y pronósticos
  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Datos consultados: temperatura actual, temperatura por hora, sensación térmica, precipitaciones (lluvia y nieve), estado del día (día/noche)
  - Ajuste automático de zona horaria

## Funcionalidades detalladas
- **Búsqueda inteligente**: Al ingresar una ciudad, la aplicación busca y autocompleta con datos precisos de localización
- **Visualización adaptativa**: Los iconos cambian automáticamente según:
  - Si es de día o de noche en la ubicación consultada
  - Si hay lluvia o nieve
- **Pronóstico horario interactivo**: Carrusel con autoplay y control manual para revisar el clima por horas
- **Manejo de errores**: Mensajes de error amigables cuando no se encuentra una ciudad o hay problemas de conexión
- **Componentes reactivos**: La interfaz se actualiza dinámicamente sin necesidad de recargar la página

## Instalación y uso
1. Clona este repositorio
2. Abre `index.html` en tu navegador
3. Ingresa el nombre de una ciudad en el campo de búsqueda
4. Haz clic en "Buscar" o presiona Enter para ver el pronóstico

## Estructura del proyecto
```
clima-app/
│
├── index.html      # Estructura HTML y componentes de la interfaz
├── script.js       # Lógica de la aplicación y manejo de APIs
└── README.md       # Documentación del proyecto
```

## Desarrollado por
Diego Rodriguez

## Fecha
23 de abril de 2025

## Licencia
Este proyecto está disponible como código abierto bajo la licencia MIT.