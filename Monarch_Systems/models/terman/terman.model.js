const db = require('../../../config/database');

class terman {
    async fetchSerieInfoById(idSerie) {
        const [info] = await db.execute(
            'SELECT * FROM seriesterman WHERE idSerieTerman = ?',
            [idSerie]
        );
        return info;
    }

    async fetchPreguntaSerieById(idSerie) {
        const [preguntas] = await db.execute(
            'SELECT idPreguntaTerman, numeroPregunta, preguntaTerman FROM preguntasterman WHERE idSerieTerman = ?',
            [idSerie]
        );
        return preguntas;
    }

    async fetchOpcionesSerieById(idSerie) {
        const [opciones] = await db.execute(
            'SELECT idPreguntaTerman, opcionTerman, descripcionTerman FROM opcionesterman WHERE idPreguntaTerman IN (SELECT idPreguntaTerman FROM preguntasterman WHERE idSerieTerman = ?)',
            [idSerie]
        );
        return opciones;
    }

    async fetchOpcionesCorrectasById(idSerie) {
        const [opcionesCorrectas] = await db.execute(
            'SELECT OT.idPreguntaTerman, OT.opcionTerman, OT.descripcionTerman ,OT.esCorrecta FROM opcionesterman AS OT WHERE OT.esCorrecta = 1 AND OT.idPreguntaTerman IN (SELECT PT.idPreguntaTerman FROM preguntasterman AS PT WHERE PT.idSerieTerman = ?)',
            [idSerie]
        );
        return opcionesCorrectas;
    }

    async fetchRespuestasAspiranteById(idAspirante, idGrupo, idSerie) {
        const [respuestasAspirante] = await db.execute(
            'SELECT p.numeroPregunta, p.preguntaTerman, o.descripcionTerman AS respuestaAspirante, r.tiempoRespuesta FROM respuestasterman r INNER JOIN preguntasterman p ON r.idPreguntaTerman = p.idPreguntaTerman INNER JOIN opcionesterman o ON o.idPreguntaTerman = p.idPreguntaTerman AND o.opcionTerman = r.respuestaAbierta WHERE p.idSerieTerman = ? AND r.idAspirante = ? AND r.idGrupo = ? ORDER BY p.numeroPregunta ASC;',
            [idSerie, idAspirante, idGrupo]
        )
        return respuestasAspirante;
    };
}

module.exports = terman;
