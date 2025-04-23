document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        ciudadInput: document.getElementById('ciudad'),
        buscarBtn: document.getElementById('buscar'),
        resultadoDiv: document.getElementById('resultado'),
        errorDiv: document.getElementById('error'),
        errorMensaje: document.getElementById('error-mensaje'),
        ciudadTexto: document.getElementById('ciudad-texto'),
        fechaTexto: document.getElementById('fecha-texto'),
        horaTexto: document.getElementById('hora-texto'),
        tempTexto: document.getElementById('temp-texto'),
        sensacionTexto: document.getElementById('sensacion-texto'),
        climaIcon: document.getElementById('clima-icon'),
        pronosticoHoras: document.getElementById('pronostico-horas'),
    };

    const hoy = new Date();
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let swiper;

    const obtenerIcono = (esDia, lluvia, nieve, precipitacion) => {
        const baseClase = 'fas clima-icon ';
        if (nieve) return { clase: baseClase + 'clima-icon-nieve', nombre: 'fa-snowflake' };
        if (lluvia || precipitacion) return { clase: baseClase + 'clima-icon-lluvia', nombre: esDia ? 'fa-cloud-rain' : 'fa-cloud-moon-rain' };
        return { clase: baseClase + (esDia ? 'clima-icon-sol' : 'clima-icon-luna'), nombre: esDia ? 'fa-sun' : 'fa-moon' };
    };

    const formatearHora12h = fecha => fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });

    const iniciarRelojLocal = timezone => {
        if (window.intervaloReloj) clearInterval(window.intervaloReloj);
        const actualizarHora = () => {
            const ahora = new Date();
            const offsetLocal = ahora.getTimezoneOffset() * 60000;
            const fechaAjustada = new Date(ahora.getTime() + offsetLocal + timezone * 1000);
            elements.horaTexto.textContent = formatearHora12h(fechaAjustada);
        };
        actualizarHora();
        window.intervaloReloj = setInterval(actualizarHora, 60000);
    };

    const mostrarError = mensaje => {
        elements.errorMensaje.textContent = mensaje;
        elements.errorDiv.classList.remove('hidden');
    };

    const mostrarResultado = (ciudad, pais, data) => {
        elements.ciudadTexto.textContent = pais ? `${ciudad} - ${pais}` : ciudad;
        elements.fechaTexto.textContent = hoy.toLocaleDateString('es-ES', opcionesFecha);
        elements.tempTexto.textContent = `${data.current.temperature_2m}${data.current_units.temperature_2m}`;
        elements.sensacionTexto.textContent = `Sensación térmica: ${data.current.apparent_temperature}${data.current_units.apparent_temperature}`;

        const iconoActual = obtenerIcono(data.current.is_day === 1, data.current.rain > 0, data.current.snowfall > 0, data.current.precipitation > 0);
        elements.climaIcon.className = `${iconoActual.clase} ${iconoActual.nombre}`;

        iniciarRelojLocal(data.utc_offset_seconds);

        elements.pronosticoHoras.innerHTML = '';
        data.hourly.time.slice(0, 24).forEach((horaStr, i) => {
            const hora = new Date(horaStr);
            const temp = data.hourly.temperature_2m[i];
            const lluvia = data.hourly.rain[i];
            const nieve = data.hourly.snowfall[i];
            const iconoHora = obtenerIcono(hora.getHours() >= 6 && hora.getHours() < 20, lluvia > 0, nieve > 0, false);

            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `
                <div class="text-center p-3">
                    <p class="font-medium"><i class="far fa-clock icon"></i>${formatearHora12h(hora)}</p>
                    <div class="text-xl font-bold my-2">
                        <i class="${iconoHora.clase} ${iconoHora.nombre}"></i>
                        ${temp}${data.hourly_units.temperature_2m}
                    </div>
                    <p class="text-sm text-gray-600">
                        ${lluvia > 0 ? `<i class="fas fa-droplet text-blue-500 mr-1"></i>Lluvia: ${lluvia}${data.hourly_units.rain}` : 
                            nieve > 0 ? `<i class="fas fa-snowflake text-blue-200 mr-1"></i>Nieve: ${nieve}mm` : 
                            '<i class="fas fa-check text-green-500 mr-1"></i>Sin precipitaciones'}
                    </p>
                </div>
            `;
            elements.pronosticoHoras.appendChild(slide);
        });

        if (swiper) {
            swiper.update();
        } else {
            swiper = new Swiper('.mySwiper', {
                slidesPerView: 'auto',
                spaceBetween: 10,
                slidesPerView: 4,
                pagination: { el: '.swiper-pagination', clickable: true },
                autoplay: { delay: 1700, disableOnInteraction: true, pauseOnMouseEnter: true },
                breakpoints: { 320: { slidesPerView: 2 }, 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 } }
            });

            document.querySelector('.mySwiper').addEventListener('mouseleave', () => swiper.autoplay.start());
        }

        elements.resultadoDiv.classList.remove('hidden', 'animate__fadeIn');
        elements.resultadoDiv.classList.add('animate__fadeIn');
    };

    const buscarClima = async ciudad => {
        try {
            elements.resultadoDiv.classList.add('hidden');
            elements.errorDiv.classList.add('hidden');

            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=10&language=es&format=json`);
            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                mostrarError(`No se encontró información sobre la ciudad ${ciudad}.`);
                return;
            }

            const { latitude, longitude, name: nombreCiudad, country } = geoData.results[0];
            const climaResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,showers,snowfall,snow_depth,rain&current=is_day,apparent_temperature,temperature_2m,rain,precipitation,showers,snowfall&timezone=auto&forecast_days=1`);
            const climaData = await climaResponse.json();

            mostrarResultado(nombreCiudad || ciudad, country, climaData);
        } catch (error) {
            mostrarError('Error al conectar con el servicio de clima. Por favor, intenta de nuevo más tarde.');
            console.error('Error:', error);
        }
    };

    elements.buscarBtn.addEventListener('click', () => {
        const ciudad = elements.ciudadInput.value.trim();
        ciudad ? buscarClima(ciudad) : mostrarError('Por favor, ingresa el nombre de una ciudad');
    });

    elements.ciudadInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            const ciudad = elements.ciudadInput.value.trim();
            ciudad ? buscarClima(ciudad) : mostrarError('Por favor, ingresa el nombre de una ciudad');
        }
    });
});
