const pruebasModel = require('../../models/pruebas/pruebas.model');

// Traer instrucciones

async function renderInstrucciones(res, idPrueba, options = {}) {
    try {
        const [rows] = await pruebasModel.fetchInstruccionesById(idPrueba);

        if (!rows || rows.length === 0) {
            return res.status(404).render('error', { message: `No se encontraron instrucciones para la prueba con ID ${idPrueba}` });
        }

        console.log([rows])
        res.render('pruebas/instruccionesPruebas.pug', {
            
            title: `Prueba ${rows[0].nombre}`,
            instrucciones: rows[0].instrucciones,
            ...options
        });

    } catch (err) {
        console.error(`Error obteniendo las instrucciones para la prueba con ID ${idPrueba}:`, err);
        res.status(500).render('error', { message: 'Error interno del servidor' });
    }
}

// - - - - - - - - A Q U I     I N I C I A N      L A S      P R U E B A S - - - - - - - - - - - - 

// P R U E B A    H A R T M A N

exports.get_instruccionesHartman = async (req, res, next) => {
    await renderInstrucciones(res, 3,{
    botonIniciarLink: '/aspirante/hartman/fase1'});
};

// P R U E B A    T E R M A N

exports.get_instruccionesTerman = async (req, res, next) => {
    await renderInstrucciones(res, 4, {
        csrfToken: req.csrfToken(), 
        botonIniciarLink: '/aspirante/pruebas/responder/terman'
    });
};
