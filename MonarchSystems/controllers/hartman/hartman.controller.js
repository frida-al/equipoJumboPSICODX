// Importa los modelos necesarios para la prueba de Hartman, sesiones de pruebas y respuestas.
const hartman = require('../../../models/pruebas/hartman/hartman.model');
const sesionesPruebas = require('../../../models/pruebas/sesionesPruebas.model');
const respuestasPrueba = require('../../../models/pruebas/respuestas/respuestasPruebasX.model');
const hartmanAnalysisModel = require('../../../models/pruebas/hartman/hartmanAnalysis.model');
const {calcularResultados} = require('../../../config/analisisHartman/valorHartman.js'); 
 
// Variable global para almacenar el tiempo de inicio de la fase.
let tiempoInicio;

/**
 * Controlador para la primera fase de la prueba de Hartman.
 * Almacena el tiempo de inicio, obtiene las preguntas de la fase 1,
 * actualiza la sesión de la prueba y renderiza la vista.
 */
exports.get_HartmanFase1 = async (request, response, next) => {
    try {
        tiempoInicio = Date.now();
        console.log("Contador iniciado:", tiempoInicio);

        const fasePregunta = 1;
        const [rows] = await hartman.fetchFase1(fasePregunta);
        const sesiones = new sesionesPruebas();
        await sesiones.updateSesionPrueba({
            idAspirante: request.session.idUsuario,
            idGrupo: request.session.idGrupo,
            idPrueba: 3,
            estatus: 1,
        });

        response.render('aspirante/fase_hartman.pug', {
            idsPreguntasHartman: rows.map(row => row.idPreguntaHartman),
            numerosPreguntas: rows.map(row => row.idPreguntaHartman),
            preguntasHartman: rows.map(row => row.preguntaHartman),
            fase1: true,
        });
    } catch (error) {
        console.error('Error obteniendo las preguntas de la fase 1:', error);
        response.status(500).send('Error al obtener las preguntas de la fase 1.');
    }
};

/**
 * Controlador para procesar las respuestas de la primera fase de Hartman.
 * Calcula el tiempo, extrae las respuestas, las guarda y redirige a la siguiente fase.
 */
exports.post_HartmanFase1 = (request, response, next) => {
    const tiempoFin = Date.now();
    const tiempoTotalSegundos = Math.floor((tiempoFin - tiempoInicio) / 1000);
    console.log("Contador detenido:", tiempoFin, " -> Tiempo total:", tiempoTotalSegundos, "segundos");

    const totalPreguntas = Object.keys(request.body).filter(key => key.startsWith("respuesta_")).length;
    const tiempoPromedio = totalPreguntas > 0 ? tiempoTotalSegundos / totalPreguntas : 0;
    console.log("Tiempo promedio por pregunta:", tiempoPromedio);

    const respuestas = Object.entries(request.body)
        .filter(([pregunta_id]) => pregunta_id.startsWith("respuesta_"))
        .map(([pregunta_id, respuesta]) => {
            const idPregunta = parseInt(pregunta_id.replace("respuesta_", ""), 10);

            return [
                request.session.idUsuario,
                request.session.idGrupo,
                idPregunta,
                3,
                respuesta,
                tiempoPromedio
            ];
        });

    const respuestasFase1 = new hartman(respuestas);

    respuestasFase1.save()
        .then(() => {
            response.redirect('/aspirante/hartman/fase2');
        })
        .catch(err => {
            console.error('Error al guardar respuestas:', err);
            response.status(500).send('Error interno del servidor');
        });
};

/**
 * Controlador para la segunda fase de la prueba de Hartman.
 * Almacena el tiempo de inicio, obtiene las preguntas de la fase 2 y renderiza la vista.
 */
exports.get_HartmanFase2 = async (request, response, next) => {
    try {
        tiempoInicio = Date.now();
        console.log("Contador iniciado:", tiempoInicio);
        const fasePregunta = 2;
        const [rows] = await hartman.fetchFase1(fasePregunta);

        response.render('aspirante/fase_hartman.pug', {
            numerosPreguntas: rows.map(row => row.idPreguntaHartman),
            preguntasHartman: rows.map(row => row.preguntaHartman),
            fase1: false,
        });
    } catch (error) {
        console.error('Error obteniendo las preguntas de la fase 2:', error);
        response.status(500).send('Error al obtener las preguntas de la fase 2.');
    }
};

/**
 * Controlador para procesar las respuestas de la segunda fase de Hartman.
 * Calcula el tiempo, extrae las respuestas, las guarda, actualiza la sesión
 * de la prueba y redirige al aspirante.
 */

exports.post_HartmanFase2 = async (request, response, next) => {
    try {
        const tiempoFin = Date.now();
        const tiempoTotalSegundos = Math.floor((tiempoFin - tiempoInicio) / 1000);
        console.log("Contador detenido:", tiempoFin, " -> Tiempo total:", tiempoTotalSegundos, "segundos");
        
        const totalPreguntas = Object.keys(request.body).filter(key => key.startsWith("respuesta_")).length;
        const tiempoPromedio = totalPreguntas > 0 ? tiempoTotalSegundos / totalPreguntas : 0;
        console.log("Tiempo promedio por pregunta:", tiempoPromedio);
        
        const respuestas = Object.entries(request.body)
            .filter(([pregunta_id]) => pregunta_id.startsWith("respuesta_"))
            .map(([pregunta_id, respuesta]) => {
                const idPregunta = parseInt(pregunta_id.replace("respuesta_", ""), 10);

                return [
                    request.session.idUsuario,
                    request.session.idGrupo,
                    idPregunta,
                    3,
                    respuesta,
                    tiempoPromedio,
                ];
            });

        console.log("Respuestas array:", respuestas); // Log the array

        const respuestasFase2 = new hartman(respuestas);

        await respuestasFase2.save();
        
/**
 * Análisis Hartman y guardado de variables 
 */
        
    // 1. Recuperar todas las respuestas del usuario 
    const todasLasRespuestas = await hartman.getRespuestasUsuario(
        request.session.idUsuario,
        request.session.idGrupo
    );
    console.log("Todas las respuestas del usuario:", todasLasRespuestas);

    // Separar las respuestas en arreglos de 'cita' y 'frase' y los convierte a numeros 
    const respuestasFrase = todasLasRespuestas
        .filter((r) => r.idPreguntaHartman >= 1 && r.idPreguntaHartman <= 18)
        .map((r) => parseInt(r.respuestaAbierta, 10)); 

    const respuestasCita = todasLasRespuestas
        .filter((r) => r.idPreguntaHartman >= 19 && r.idPreguntaHartman <= 36)
        .map((r) => parseInt(r.respuestaAbierta, 10)); 
        console.log("Respuestas Frase:", respuestasFrase);
        console.log("Respuestas Cita:", respuestasCita);
            
    // 2. Analizar las respuestas 
    const resultadosAnalisis = calcularResultados(respuestasFrase, respuestasCita);
    console.log("Resultados del análisis:", resultadosAnalisis);
    
    // 3. Guardar los resultados del análisis
    const hartmanAnalysis = new hartmanAnalysisModel(
    request.session.idUsuario,
    request.session.idGrupo,
    resultadosAnalisis
    );
    await hartmanAnalysis.save();
    console.log("Análisis guardado en la base de datos.");
    
    // --- FIN ANÁLISIS Y GUARDADO ---
            
            const sesiones = new sesionesPruebas();
            await sesiones.updateSesionPrueba({
            idAspirante: request.session.idUsuario,
            idGrupo: request.session.idGrupo,
            idPrueba: 3,
            estatus: 2,
    });
    
    response.redirect('/inicio/aspirante');
    } catch (err) {
    console.error('Error en post_HartmanFase2:', err);
    response.status(500).send('Error interno del servidor.');
    }
    };