// ============================================
// ETS InfoPlus - Lógica de Detección de ETS
// ============================================

// 1. Datos de Síntomas (Array más compacto)
const SINTOMAS = [
    { id: 1, nombre: "Ardor al orinar" },
    { id: 2, nombre: "Llagas o heridas en la zona íntima" },
    { id: 3, nombre: "Flujo anormal o mal olor" },
    { id: 4, nombre: "Fiebre sin explicación" },
    { id: 5, nombre: "Dolor en la zona pélvica o testicular" },
    { id: 6, nombre: "Sangrado anormal" },
    { id: 7, nombre: "Dolor o inflamación en las articulaciones" },
    { id: 8, nombre: "Erupciones en la piel o llagas en otras partes del cuerpo" },
    { id: 9, nombre: "Ganglios inflamados" },
    { id: 10, nombre: "Cansancio extremo o pérdida de peso" },
    { id: 11, nombre: "Sudoraciones nocturnas" },
    { id: 12, nombre: "Náuseas, vómito o diarrea persistente" }
];

// 2. Datos de Centros Médicos (Array más compacto)
const CENTROS = [
    { id: 1, ciudad: "Bogotá", nombre: "AHF Colombia", direccion: "Carrera 40 #94-75", telefono: "+57 310 804 8187", servicios: "Pruebas rápidas de VIH, asesoramiento" },
    { id: 2, ciudad: "Medellín", nombre: "Centro Diversidad Sexual", direccion: "Centro de la ciudad", telefono: "Consultar", servicios: "Atención integral en salud sexual" },
    { id: 3, ciudad: "Cali", nombre: "Corporación Viviendo", direccion: "Zona sur", telefono: "Consultar", servicios: "Pruebas y tratamiento de ETS" },
    { id: 4, ciudad: "Cartagena", nombre: "Vivir Bien IPS", direccion: "Centro histórico", telefono: "Consultar", servicios: "Atención médica especializada" },
    { id: 5, ciudad: "Cúcuta", nombre: "AHF Colombia", direccion: "Zona norte", telefono: "+57 310 804 8187", servicios: "Pruebas rápidas de VIH" },
    { id: 6, ciudad: "Bucaramanga", nombre: "Cruz Roja", direccion: "Zona central", telefono: "Consultar", servicios: "Atención de emergencia y pruebas" },
    { id: 7, ciudad: "Valledupar", nombre: "Hospital Eduardo Arredondo", direccion: "Zona urbana", telefono: "Consultar", servicios: "Atención médica general" },
    { id: 8, ciudad: "Riohacha", nombre: "Cruz Roja", direccion: "Centro de la ciudad", telefono: "Consultar", servicios: "Atención de emergencia" }
];

// 3. Datos de Descripciones de ETS (Objeto más compacto)
const DESCRIPCIONES_ETS = {
    "Clamidia": "Infección bacteriana muy común. Se transmite por contacto sexual sin protección. Muchas veces no presenta síntomas pero puede causar complicaciones graves si no se trata.",
    "Gonorrea": "Otra infección bacteriana común. Causa dolor al orinar y secreción genital. Se cura con antibióticos si se detecta a tiempo.",
    "Sífilis": "Infección que avanza en varias etapas. Comienza con una úlcera indolora y puede progresar a síntomas más graves si no se trata.",
    "Herpes genital": "Virus que causa ampollas dolorosas en los genitales. No tiene cura pero se puede controlar con medicamentos.",
    "VIH": "Virus que ataca el sistema inmunológico. Con tratamiento antirretroviral las personas pueden llevar una vida normal.",
    "Sífilis avanzada": "Etapa avanzada de la sífilis que puede afectar órganos internos.",
    "Epididimitis": "Inflamación del epidídimo (conducto que almacena esperma). Causa dolor testicular.",
    "VPH (Virus del Papiloma Humano)": "Virus común que se previene con vacuna. Algunos tipos pueden causar cáncer."
};

// 4. Lógica Central: Detección de ETS
function detectarETS(sintomasSeleccionados) {
    const etsDetectadas = new Set();
    sintomasSeleccionados.forEach(sintoma => {
        if ([1, 3, 6, 12].includes(sintoma)) etsDetectadas.add("Clamidia").add("Gonorrea");
        if ([2, 8].includes(sintoma)) etsDetectadas.add("Sífilis").add("Herpes genital");
        if ([4, 10, 11, 7, 9].includes(sintoma)) etsDetectadas.add("VIH");
        if ([4, 10, 11].includes(sintoma)) etsDetectadas.add("Sífilis avanzada");
        if (sintoma === 5) etsDetectadas.add("Epididimitis");
    });
    etsDetectadas.add("VPH (Virus del Papiloma Humano)"); // Prevención
    return Array.from(etsDetectadas);
}

// 5. Función de Ayuda: Obtener Descripción
const obtenerDescripcionETS = ets => DESCRIPCIONES_ETS[ets] || "Información no disponible";

// 6. Funciones de Interfaz (Refactorizadas para usar arrays y map/join)

// Utilidad para encontrar un síntoma por ID
const getSintomaById = id => SINTOMAS.find(s => s.id === id);

// Utilidad para encontrar un centro por ID
const getCentroById = id => CENTROS.find(c => c.id === id);

function inicializarCuestionario() {
    const cont = document.getElementById('cuestionario-interactivo');
    if (!cont) return;

    const sintomasHtml = SINTOMAS.map(s => `
        <label class="sintoma-label">
            <input type="checkbox" value="${s.id}" class="sintoma-check">
            <span>${s.id}. ${s.nombre}</span>
        </label>
    `).join('');

    cont.innerHTML = `
        <div class="cuestionario-container">
            <h3>Cuestionario de Síntomas</h3>
            <p>Selecciona los síntomas que presentas:</p>
            <div class="sintomas-checkbox">${sintomasHtml}</div>
            <div class="cuestionario-botones">
                <button onclick="mostrarResultados()" class="btn-evaluar">Evaluar Síntomas</button>
                <button onclick="limpiarCuestionario()" class="btn-limpiar">Limpiar</button>
            </div>
            <div id="resultados-cuestionario" class="resultados-ocultos"></div>
        </div>
    `;
}

function mostrarResultados() {
    const checks = document.querySelectorAll('.sintoma-check:checked');
    const sintomasSel = Array.from(checks).map(cb => parseInt(cb.value));
    const resDiv = document.getElementById('resultados-cuestionario');

    if (sintomasSel.length === 0) {
        resDiv.innerHTML = `<div class="resultado-alerta"><p>⚠️ Por favor selecciona al menos un síntoma para evaluar.</p></div>`;
        resDiv.classList.remove('resultados-ocultos');
        return;
    }

    const etsDetectadas = detectarETS(sintomasSel);

    const sintomasHtml = sintomasSel.map(num => `<li>${num}. ${getSintomaById(num).nombre}</li>`).join('');
    const etsHtml = etsDetectadas.map(ets => `<li>${ets}</li>`).join('');
    const descripcionesHtml = etsDetectadas.map(ets => `
        <div class="ets-info">
            <strong>${ets}:</strong>
            <p>${obtenerDescripcionETS(ets)}</p>
        </div>
    `).join('');

    resDiv.innerHTML = `
        <div class="resultado-container">
            <h4>Resultados de tu Evaluación</h4>
            <div class="sintomas-seleccionados">
                <h5>Síntomas seleccionados:</h5>
                <ul>${sintomasHtml}</ul>
            </div>
            <div class="ets-detectadas">
                <h5>Posibles ETS detectadas:</h5>
                <ul>${etsHtml}</ul>
            </div>
            <div class="ets-descripciones">
                <h5>Información detallada:</h5>
                ${descripcionesHtml}
            </div>
            <div class="recomendacion">
                <p><strong>⚠️ Recomendación:</strong> Esta evaluación es solo orientativa. Consulta con un profesional médico para un diagnóstico preciso.</p>
            </div>
        </div>
    `;
    resDiv.classList.remove('resultados-ocultos');
}

function limpiarCuestionario() {
    document.querySelectorAll('.sintoma-check').forEach(cb => cb.checked = false);
    document.getElementById('resultados-cuestionario').classList.add('resultados-ocultos');
}

function inicializarLocalizador() {
    const cont = document.getElementById('localizador-centros');
    if (!cont) return;

    const ciudadesHtml = CENTROS.map(c => `
        <button class="btn-ciudad" onclick="mostrarCentro(${c.id})">${c.ciudad}</button>
    `).join('');

    cont.innerHTML = `
        <div class="localizador-container">
            <h3>Localizador de Centros Médicos</h3>
            <p>Selecciona tu ciudad para encontrar centros de atención:</p>
            <div class="ciudades-grid">${ciudadesHtml}</div>
            <div id="info-centro" class="info-centro-oculta"></div>
        </div>
    `;
}

function mostrarCentro(ciudadId) {
    const centro = getCentroById(ciudadId);
    const infoCentro = document.getElementById('info-centro');

    infoCentro.innerHTML = `
        <div class="centro-info">
            <h4>${centro.ciudad}</h4>
            <div class="centro-detalles">
                <p><strong>Centro:</strong> ${centro.nombre}</p>
                <p><strong>Dirección:</strong> ${centro.direccion}</p>
                <p><strong>Teléfono:</strong> ${centro.telefono}</p>
                <p><strong>Servicios:</strong> ${centro.servicios}</p>
            </div>
            <div class="centro-recomendacion">
                <p>📞 Llama antes de ir para confirmar horarios y disponibilidad.</p>
            </div>
        </div>
    `;
    infoCentro.classList.remove('info-centro-oculta');
}

// 7. Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarCuestionario();
    inicializarLocalizador();
});
