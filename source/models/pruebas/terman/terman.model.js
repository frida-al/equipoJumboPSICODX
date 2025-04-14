const db = require('../../../config/database');

class terman {
    async fetchSerieInfoById(idSerie) {
        const [info] = await db.execute(
            'SELECT * FROM seriesTerman WHERE idSerieTerman = ?',
            [idSerie]
        );
        return info;
    }

    async fetchPreguntaSerieById(idSerie) {
        const [preguntas] = await db.execute(
            'SELECT idPreguntaTerman, numeroPregunta, preguntaTerman FROM preguntasTerman WHERE idSerieTerman = ?',
            [idSerie]
        );
        return preguntas;
    }

    async fetchOpcionesSerieById(idSerie) {
        const [opciones] = await db.execute(
            'SELECT idPreguntaTerman, opcionTerman, descripcionTerman FROM opcionesTerman WHERE idPreguntaTerman IN (SELECT idPreguntaTerman FROM preguntasTerman WHERE idSerieTerman = ?)',
            [idSerie]
        );
        return opciones;
    }
}

module.exports = terman;
