// Modelos
const terman = require('../../../models/pruebas/terman/terman.model.js');
const modeloTerman = new terman();
const respuestasTerman = require('../../../models/pruebas/terman/respuestasTerman.model.js');
const respuestasTermanModel = new respuestasTerman();
const sesionesPruebas = require('../../../models/pruebas/sesionesPruebas.model.js');
const sesionPruebaModel = new sesionesPruebas;
const progresoTermanModel = require('../../../models/pruebas/terman/progresoTerman.model.js');

exports.errorProgresoExpirado = (req, res) => {
    return res.status(403).render('error/error.pug', {
        message: "Tu progreso en la prueba ha expirado. Ya no puedes responder.",
        volverAtras: false
    });
};


exports.get_progresoTerman = async (req, res) => {
    const idUsuario = req.session.idUsuario;
    const idGrupo = req.session.idGrupo;
    const idPrueba = 4;

    try {
        const progreso = await progresoTermanModel.fetchProgresoById(idUsuario, idGrupo);

        if (progreso.length > 0) {
            const updatedAt = new Date(progreso[0].updatedAt);
            const ahora = new Date();
            const diferenciaHoras = (ahora - updatedAt) / (1000 * 60 * 60);

            if (diferenciaHoras > 4) {
                await sesionPruebaModel.updateSesionPrueba({
                    estatus: 1,
                    idAspirante: idUsuario,
                    idGrupo,
                    idPrueba
                });

                // En vez de renderizar JSON o error, REDIRIGIMOS
                return res.redirect('/aspirante/pruebas/error/progreso-expirado');
            }

            return res.json({
                serieActual: progreso[0].idSerieTermanActual,
                ultimaPregunta: progreso[0].idPreguntaTerman,
                tiempoRestante: progreso[0].tiempoRestante
            });
        } else {
            const nuevoProgreso = new progresoTermanModel(idUsuario, idGrupo);
            await nuevoProgreso.save();

            await sesionPruebaModel.updateSesionPrueba({
                estatus: 3,
                idAspirante: idUsuario,
                idGrupo,
                idPrueba
            });

            return res.json({ estado: "OK" });
        }
    } catch (error) {
        console.error("Error en get_progresoTerman:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.get_responderTerman = (req, res, next) => {
    res.render("pruebas/terman/responderTerman.pug", {
        csrfToken: req.csrfToken(),
        title: "Responder Terman"
    });
};

exports.get_infoSerie = (req, res, next) => {
    const idSerie = parseInt(req.params.idSerie);
    if (!idSerie || isNaN(idSerie)) {
        return res.status(400).json({ error: "ID de serie inválido o no proporcionado." });
    }

    let nombreSeccion, instruccion, preguntas, opciones;

    modeloTerman.fetchSerieInfoById(idSerie)
        .then(info => {
            id = info[0].idSerieTerman;
            nombreSeccion = info[0].nombreSeccion;
            instruccion = info[0].instruccion;
            duracion = info[0].duracion;

            return modeloTerman.fetchPreguntaSerieById(idSerie);
        })
        .then(preguntasRows => {
            preguntas = preguntasRows;
            return modeloTerman.fetchOpcionesSerieById(idSerie);
        })
        .then(opcionesRows => {
            opciones = opcionesRows;

            const preguntasConOpciones = preguntas.map(p => {
                p.opciones = opciones.filter(o => o.idPreguntaTerman === p.idPreguntaTerman);
                return p;
            });

            res.json({
                id,
                nombreSeccion,
                instruccion,
                duracion,
                preguntas: preguntasConOpciones
            });
        })
        .catch(error => {
            console.error("Error al cargar serie:", error);
            res.status(500).json({ error: "Error al cargar la serie." });
        });
};

exports.post_respuestaTerman = async (req, res) => {
    try {
        const idPreguntaTerman = parseInt(req.params.idPreguntaTerman);
        const { serieActual, respuesta, tiempo, tiempoSerie } = req.body;
        const idUsuario = req.session.idUsuario;
        const idGrupo = req.session.idGrupo;
        const idPrueba = 4;

        const respuestas = new respuestasTerman(idUsuario, idGrupo, idPrueba, [
            { idPregunta: idPreguntaTerman, opcion: respuesta, tiempo }
        ]);

        await respuestas.save();
        await progresoTermanModel.updateProgresoById(idUsuario, idGrupo, serieActual, idPreguntaTerman, tiempoSerie);

        if(idPreguntaTerman === 173) {
            await sesionPruebaModel.updateSesionPrueba({
                estatus: 2, // Completado
                idAspirante: idUsuario,
                idGrupo,
                idPrueba
            });
        }

        return res.json({ estado: "OK" });
    } catch (err) {
        console.error("Error al guardar respuesta individual:", err);
        return res.status(500).json({ estado: "ERROR" });
    }
};

exports.get_respuestasSerie = async (req, res) => {
    const { idAspirante, idGrupo, idSerie } = req.params;

    try {
        let respuestas = [];

        if ([5, 10].includes(parseInt(idSerie))) {
            // Series de texto libre
            respuestas = await respuestasTermanModel.fetchRespuestasTextoLibre(idAspirante, idGrupo, idSerie);
        } else {
            // Series normales con opciones
            respuestas = await respuestasTermanModel.fetchRespuestasOpciones(idAspirante, idGrupo, idSerie);
        }

        return res.json({ success: true, respuestas });
    } catch (error) {
        console.error("Error trayendo respuestas de Terman:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor." });
    }
};



