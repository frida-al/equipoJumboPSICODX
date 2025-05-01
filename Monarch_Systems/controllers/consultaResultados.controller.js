// Modelos
const sesionesPruebas = require('../../models/pruebas/sesionesPruebas.model.js');
const sesionPruebaModel = new sesionesPruebas();

// - - - - - - - - - - - - - - - - - - - - - - - - 
// Modelos de Hartman
// - - - - - - - - - - - - - - - - - - - - - - - - 
const consultaResultados = require('../../models/psicologa/consultaResultados.model');
const {
     buscarValor, // Importa la función
    DIM,
    DIF,
    dimGeneral,
    dimPorcentaje,
    INT,
    DI,
    DIS,
    VQ,
    Equilibrio_BQR,
    Equilibrio_BQA,
    Equilibrio_CQ1,
    Equilibrio_CQ2
} = require('../../../src/config/analisisHartman/encuentraValor');


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Lógica de Hartman
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

exports.get_analisisHartman = async (request, response, next) => {

    const idAspirante = request.params.idAspirante;
    const idGrupo = request.params.idGrupo;
    console.log('Analisis Hartman');

    try {
        const [rows] = await consultaResultados.fetchHartmanAspirante(idAspirante, idGrupo);
        console.log("Datos de la base de datos:", rows);

        if (!rows || rows.length === 0) {
            return response.status(404).send("No se encontraron resultados de Hartman.");
        }

         // Procesa los datos del analisis de hartman para poder graficarlos
        const analisisProcesado = {
            MundoInterno: {
                DimI: rows[0].citaDimI != null ? buscarValor(rows[0].citaDimI, DIM) : 0,
                DimE: rows[0].citaDimE != null ? buscarValor(rows[0].citaDimE, DIM) : 0,
                DimS: rows[0].citaDimS != null ? buscarValor(rows[0].citaDimS, DIM) : 0,
                DiF: rows[0].citaDif != null ? buscarValor(rows[0].citaDif, DIF) : 0,
                DimGeneral: rows[0].citaDimGeneral != null ? buscarValor(rows[0].citaDimGeneral, dimGeneral) : 0,
                DimPorcentaje: rows[0].citaDimPorcentaje != null ? buscarValor(rows[0].citaDimPorcentaje, dimPorcentaje) : 0,
                IntI: rows[0].citaIntI != null ? buscarValor(rows[0].citaIntI, INT) : 0,
                IntE: rows[0].citaIntE != null ? buscarValor(rows[0].citaIntE, INT) : 0,
                IntS: rows[0].citaIntS != null ? buscarValor(rows[0].citaIntS, INT) : 0,
                IntGeneral: rows[0].citaIntGeneral != null ? buscarValor(rows[0].citaIntGeneral, DIM) : 0,
                IntPorcentaje: rows[0].citaIntPorcentaje != null ? buscarValor(rows[0].citaIntPorcentaje, dimPorcentaje) : 0,
                Di: rows[0].citaDi != null ? buscarValor(rows[0].citaDi, DI) : 0,
                Dis: rows[0].citaDIS != null ? buscarValor(rows[0].citaDIS, DIS) : 0,
                Sq1: rows[0].citaSQ1 != null ? buscarValor(rows[0].citaSQ1, VQ) : 0,
                Sq2: rows[0].citaSQ2 != null ? buscarValor(rows[0].citaSQ2, DIM) : 0,
            },
            MundoExterno: {
                DimI: rows[0].fraseDimI != null ? buscarValor(rows[0].fraseDimI, DIM) : 0,
                DimE: rows[0].fraseDimE != null ? buscarValor(rows[0].fraseDimE, DIM) : 0,
                DimS: rows[0].fraseDimS != null ? buscarValor(rows[0].fraseDimS, DIM) : 0,
                DiF: rows[0].fraseDif != null ? buscarValor(rows[0].fraseDif, DIF) : 0,
                DimGeneral: rows[0].fraseDimGeneral != null ? buscarValor(rows[0].fraseDimGeneral, dimGeneral) : 0,
                DimPorcentaje: rows[0].fraseDimPorcentaje != null ? buscarValor(rows[0].fraseDimPorcentaje, dimPorcentaje) : 0,
                IntI: rows[0].fraseIntI != null ? buscarValor(rows[0].fraseIntI, INT) : 0,
                IntE: rows[0].fraseIntE != null ? buscarValor(rows[0].fraseIntE, INT) : 0,
                IntS: rows[0].fraseIntS != null ? buscarValor(rows[0].fraseIntS, INT) : 0,
                IntGeneral: rows[0].fraseIntGeneral != null ? buscarValor(rows[0].fraseIntGeneral, DIM) : 0,
                IntPorcentaje: rows[0].fraseIntPorcentaje != null ? buscarValor(rows[0].fraseIntPorcentaje, dimPorcentaje) : 0,
                Di: rows[0].fraseDi != null ? buscarValor(rows[0].fraseDi, DI) : 0,
                Dis: rows[0].fraseDIS != null ? buscarValor(rows[0].fraseDIS, DIS) : 0,
                Vq1: rows[0].fraseVQ1 != null ? buscarValor(rows[0].fraseVQ1, VQ) : 0,
                Vq2: rows[0].fraseVQ2 != null ? buscarValor(rows[0].fraseVQ2, DIM) : 0,
            },
            Equilibrio: {
                Bqr1: rows[0].BQr1 != null ? buscarValor(rows[0].BQr1, Equilibrio_BQR) : 0,
                Bqr2: rows[0].BQr2 != null ? buscarValor(rows[0].BQr2, Equilibrio_BQR) : 0,
                Bqa1: rows[0].BQa1 != null ? buscarValor(rows[0].BQa1, Equilibrio_BQA) : 0,
                Bqa2: rows[0].BQa2 != null ? buscarValor(rows[0].BQa2,DIM) : 0, 
                Cq1: rows[0].CQ1 != null ? buscarValor(rows[0].CQ1, Equilibrio_CQ1) : 0,
                Cq2: rows[0].CQ2 != null ? buscarValor(rows[0].CQ2, Equilibrio_CQ2) : 0,
            }
        };

         console.log("Datos procesados para la gráfica:", analisisProcesado);


         response.render('pruebas/hartman/analisisHartman.pug', {
             csrfToken: request.csrfToken(),
             datos: analisisProcesado,
             analisisHartman: rows,
         });
 

     } catch (error) {
         console.error("Error al obtener o procesar los datos de Hartman:", error);
         response.status(500).send("Error al procesar el análisis de Hartman");
     }
 };

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Lógica de Terman
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function obtenerTotalPorSerie(numeroSerie) {
    const totales = {
        1: 16, 2: 22, 3: 30, 4: 18, 5: 24,
        6: 20, 7: 20, 8: 17, 9: 18, 10: 22
    };
    return totales[numeroSerie] || 1; // Por si acaso
}

function reglaDeTres(valor, totalMaximo) {
    return (valor / totalMaximo) * 100;
}

/*
    OBTENER ANALISIS DE TERMAN
*/

// - - - - - - - - - - - - - - - - - - - - - - - - 
// Modelos de Terman
// - - - - - - - - - - - - - - - - - - - - - - - - 
const respuestasTermanModel = require('../../models/pruebas/terman/respuestasTerman.model.js');
respuestasTerman = new respuestasTermanModel();

const progresoTermanModel = require('../../models/pruebas/terman/progresoTerman.model.js');

const calificacionesTerman = require('../../models/pruebas/terman/calificacionesTerman.model.js');
const calificacionTerman = new calificacionesTerman();

const resultadosSeriesTerman = require('../../models/pruebas/terman/resultadosSeriesTerman.model.js');
const resultadoSerieTerman = new resultadosSeriesTerman();

const usuariosModel = require('../../models/users.model.js');

const terman = require('../../models/pruebas/terman/terman.model.js');
const modeloTerman = new terman();



// Middleware de apoyo para calificar Terman
const calificarSerieTerman = require("../../middlewares/pruebas/calificarTerman");

exports.get_analisisTerman = async (request, response, next) => {
    const idAspirante = request.params.idAspirante;
    const idGrupo = request.params.idGrupo;
    const idPrueba = 4;
    const sesionAspirante = await sesionPruebaModel.fetchById({ idAspirante, idGrupo, idPrueba });

    try {
        // 1. Buscar calificación
        const calificacionExistente = await calificacionTerman.fetchCalificacionById(idAspirante, idGrupo);

        // 2. Si NO existe, hacemos la calificación
        if (!calificacionExistente || calificacionExistente.length === 0) {
            console.log('No existe análisis previo. Calificando...');

            const sesionAspirante = await sesionPruebaModel.fetchById({ idAspirante, idGrupo, idPrueba });

            if (!sesionAspirante || sesionAspirante.length === 0) {
                return response.status(403).render('error/error.pug', {
                    message: "No hay asignación de prueba Terman para este aspirante.",
                    volverAtras: true
                });
            }

            const progreso = await progresoTermanModel.fetchProgresoById(idAspirante, idGrupo);

            if (progreso.length > 0) {
                const updatedAt = new Date(progreso[0].updatedAt);
                const ahora = new Date();
                const diferenciaHoras = (ahora - updatedAt) / (1000 * 60 * 60);

                console.log("Diferencia Horas: ", diferenciaHoras)

                if (diferenciaHoras > 4 && sesionAspirante[0].estatus === "En progreso") {
                    await sesionPruebaModel.updateSesionPrueba({
                        estatus: 1, // Incompleto
                        idAspirante,
                        idGrupo,
                        idPrueba
                    });
                }

                if (diferenciaHoras < 4 && sesionAspirante[0].estatus === "En progreso") {
                    return response.status(403).render('error/error.pug', {
                        message: "El aspirante sigue en progreso. No se pueden generar resultados aún.",
                        volverAtras: true
                    });
                }

                if (sesionAspirante[0].estatus === "No iniciado") {
                    return response.status(403).render('error/error.pug', {
                        message: "El aspirante no contestó esta prueba.",
                        volverAtras: true
                    });
                }

            // Calificar series
            const series = [1,2,3,4,5,6,7,8,9,10];

            for (const idSerie of series) {
                const respuestasAspirante = await respuestasTerman.fetchRespuestasSerieById(idAspirante, idGrupo, idSerie);

                if (idSerie >= 1 && idSerie <= 9) {
                    for (const resp of respuestasAspirante) {
                        if (typeof resp.respuestaAbierta === 'string') {
                            resp.respuestaAbierta = parseInt(resp.respuestaAbierta, 10);
                        }
                    }
                }

                if (respuestasAspirante.length > 0) {
                    await calificarSerieTerman(idSerie, idAspirante, idGrupo, respuestasAspirante);
                }
            }
        }
    }

        // 3. Buscar usuario y análisis ya guardado
        const [rows] = await usuariosModel.fetchUsuarioById(idAspirante);
        const usuarioData = rows[0];
        const calificacion = await calificacionTerman.fetchCalificacionById(idAspirante, idGrupo);
        const series = await resultadoSerieTerman.fetchSeriesById(idAspirante, idGrupo);

        /*
        console.log("UsuarioData: ", usuarioData)
        console.log("calificacion: ", calificacion)
        console.log("series: ", series)
        */
        if (!usuarioData || !calificacion || !series || series.length === 0) {
            return response.status(404).send("No se encontraron datos suficientes para el análisis.");
        }

        const resultados = series.map(serie => ({
            numero: serie.idSerieTerman,
            categoria: serie.categoria,
            puntuacion: serie.puntuacion,
            rango: serie.rango,
            porcentaje: reglaDeTres(serie.puntuacion, obtenerTotalPorSerie(serie.idSerieTerman))
        }));        

        const resumen = {
            nombreCompleto: `${usuarioData.nombre} ${usuarioData.apellidoPaterno} ${usuarioData.apellidoMaterno}`,
            puntosTotales: calificacion[0].puntosTotales,
            rango: calificacion[0].rango,
            coeficienteIntelectual: calificacion[0].coeficienteIntelectual
        };
        

        // 4. Renderizar
        return response.render('pruebas/terman/analisisTerman.pug', {
            csrfToken: request.csrfToken(),
            resumen,
            resultados,
            resultadosJSON: JSON.stringify(resultados),
            estatusPrueba: sesionAspirante[0].estatus
        });
        

    } catch (error) {
        console.error('Error en get_analisisTerman:', error);
        return response.status(500).render('error/error.pug', { message: "Ocurrió un error al analizar los resultados del Terman." });
    }
};
