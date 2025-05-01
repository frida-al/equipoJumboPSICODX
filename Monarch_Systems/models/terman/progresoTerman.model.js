const db = require('../../../config/database');

class progresoTerman {
    constructor(idAspirante, idGrupo) {
        this.idAspirante = idAspirante;
        this.idGrupo = idGrupo;
    }

    async save() {
        const [resultado] = await db.execute(
            'INSERT INTO progresosterman (idAspirante, idGrupo, idSerieTermanActual, idPreguntaTerman, tiempoRestante) VALUES (?, ?, 1, NULL, 120)',
            [this.idAspirante, this.idGrupo]
        );
        return resultado;
    }

    static async fetchProgresoById(idAspirante, idGrupo) {
        const [progreso] = await db.execute(
            'SELECT * FROM progresosterman WHERE idAspirante = ? AND idGrupo = ?',
            [idAspirante, idGrupo]
        );
        return progreso;
    }

    static async updateProgresoById(idAspirante, idGrupo, idSerieTermanActual, idPreguntaTerman, tiempoRestante) {
        const [resultado] = await db.execute(
            'UPDATE progresosterman SET idSerieTermanActual = ?, idPreguntaTerman = ?, tiempoRestante = ? WHERE idAspirante = ? AND idGrupo = ?',
            [idSerieTermanActual, idPreguntaTerman, tiempoRestante, idAspirante, idGrupo]
        );
        return resultado;
    }
}

module.exports = progresoTerman;