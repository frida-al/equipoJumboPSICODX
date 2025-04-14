// pruebas.model.js
const db = require('../../config/database');

class pruebasModel {
  // Método para obtener las instrucciones de una prueba por su id
    static fetchInstruccionesById(idPrueba) {
    return db.execute(
        'SELECT * FROM pruebas WHERE idPrueba = ?',
        [idPrueba]
    );
}

    // Método opcional para traer todos los registros de la tabla pruebas
    static fetchAll() {
    return db.execute('SELECT * FROM pruebas');
    }
}

module.exports = pruebasModel;


