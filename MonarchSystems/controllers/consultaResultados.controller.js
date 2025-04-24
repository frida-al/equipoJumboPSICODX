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
 
/*
*   OBTIENE ANALISIS DE HARTMAN DE LA BASE DE DATOS
*/

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
                Sq1: rows[0].fraseVQ1 != null ? buscarValor(rows[0].fraseVQ1, VQ) : 0,
                Sq2: rows[0].fraseVQ2 != null ? buscarValor(rows[0].fraseVQ2, DIM) : 0,
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

async function obtenerCalificacion(aspiranteId, grupoId) {
    try {
        const [rows, fields] = await consultaResultados.fetchCalificacionTerman(aspiranteId, grupoId);
        return { filas: rows, campos: fields };
    } catch (error) {
        console.error("Error al obtener la calificación:", error);
        return null;
    }
};

async function obtenerSerie(aspiranteId, grupoId, serieId, calificacionId) {
    try {
      const [rows] = await consultaResultados.fetchResultadosSerieTerman(aspiranteId, grupoId, serieId, calificacionId);
      if (rows.length > 0) {
        return { puntuacion: rows[0].puntuacion, rango: rows[0].rango };
      } else {
        return { puntuacion: 0, rango: '' };
      }
    } catch (error) {
      console.error("Error al obtener los resultados de la serie:", error);
      return { puntuacion: 0, rango: '' }; 
    }
}

function reglaDeTres(num,max) {
    return ((num * 100) / max)
}

/*
*   OBTENER ANALISIS DE TERMAN
*/

exports.getanalisisTerman = async (request, response, next) => {
    const idAspirante = request.params.idAspirante;
    const idGrupo = request.params.idGrupo;
    console.log('Analisis Terman');

    try{
        const calificacionData = await obtenerCalificacion(idAspirante, idGrupo);

        if (!calificacionData || !calificacionData.filas || calificacionData.filas.length === 0) {
            return response.status(404).send("No se encontraron datos de calificación.");
        }

        const serie1 = await obtenerSerie(idAspirante, idGrupo, 1, calificacionData.filas[0].idCalificacionTerman);
        const serie2 = await obtenerSerie(idAspirante, idGrupo, 2, calificacionData.filas[0].idCalificacionTerman);
        const serie3 = await obtenerSerie(idAspirante, idGrupo, 3, calificacionData.filas[0].idCalificacionTerman);
        const serie4 = await obtenerSerie(idAspirante, idGrupo, 4, calificacionData.filas[0].idCalificacionTerman);
        const serie5 = await obtenerSerie(idAspirante, idGrupo, 5, calificacionData.filas[0].idCalificacionTerman);
        const serie6 = await obtenerSerie(idAspirante, idGrupo, 6, calificacionData.filas[0].idCalificacionTerman);
        const serie7 = await obtenerSerie(idAspirante, idGrupo, 7, calificacionData.filas[0].idCalificacionTerman);
        const serie8 = await obtenerSerie(idAspirante, idGrupo, 8, calificacionData.filas[0].idCalificacionTerman);
        const serie9 = await obtenerSerie(idAspirante, idGrupo, 9, calificacionData.filas[0].idCalificacionTerman);
        const serie10 = await obtenerSerie(idAspirante, idGrupo, 10, calificacionData.filas[0].idCalificacionTerman);

        const s1 = reglaDeTres(serie1.puntuacion, 16);
        const s2 = reglaDeTres(serie2.puntuacion, 22);
        const s3 = reglaDeTres(serie3.puntuacion, 30);
        const s4 = reglaDeTres(serie4.puntuacion, 18);
        const s5 = reglaDeTres(serie5.puntuacion, 20);
        const s6 = reglaDeTres(serie6.puntuacion, 20);
        const s7 = reglaDeTres(serie7.puntuacion, 20);
        const s8 = reglaDeTres(serie8.puntuacion, 17);
        const s9 = reglaDeTres(serie9.puntuacion, 18);
        const s10 = reglaDeTres(serie10.puntuacion, 20);

        const resultados = {
            serie1: s1,
            serie2: s2,
            serie3: s3,
            serie4: s4,
            serie5: s5,
            serie6: s6,
            serie7: s7,
            serie8: s8,
            serie9: s9,
            serie10: s10,
        };

        const analisis = {
            serie1: serie1,
            serie2: serie2,
            serie3: serie3,
            serie4: serie4,
            serie5: serie5,
            serie6: serie6,
            serie7: serie7,
            serie8: serie8,
            serie9: serie9,
            serie10: serie10,
        }

        response.render('pruebas/terman/analisisTerman.ejs', {
            csrfToken: request.csrfToken(),
            datos: calificacionData.filas[0] || null,
            res: resultados,
            analisisTerman: analisis
        });

    } catch (error) {
        console.error("Algo pasó:", error);
        response.status(500).send("Algo sucedió mal");
    }
};