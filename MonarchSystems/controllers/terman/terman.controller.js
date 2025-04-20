// Modelos
const terman = require('../../../models/pruebas/terman/terman.model.js');
const modeloTerman = new terman();
const respuestasTerman = require('../../../models/pruebas/terman/respuestasTerman.model.js');

// Middlewares de apoyo
const calificarSerieTerman = require("../../../middlewares/pruebas/calificarTerman.js");

exports.get_responderTerman = (req, res, next) => {
    res.render("pruebas/terman/responderTerman.pug", {
        csrfToken: req.csrfToken(),
        title: "Responder Terman"
    });
};

exports.get_infoSerie = (req, res, next) => {
    const idSerie = parseInt(req.params.idSerie);
    console.log("Valor recibido en req.params.idSerie:", idSerie);

    if (!idSerie || isNaN(idSerie)) {
        return res.status(400).json({ error: "ID de serie inválido o no proporcionado." });
    }

    let nombreSeccion, instruccion, preguntas, opciones;

    modeloTerman.fetchSerieInfoById(idSerie)
        .then(info => {
            // console.log("info:", info);
            id = info[0].idSerieTerman
            nombreSeccion = info[0].nombreSeccion;
            instruccion = info[0].instruccion;
            duracion = info[0].duracion

            return modeloTerman.fetchPreguntaSerieById(idSerie);
        })
        .then(preguntasRows => {
            preguntas = preguntasRows;
            return modeloTerman.fetchOpcionesSerieById(idSerie);
        })
        .then(opcionesRows => {
            opciones = opcionesRows;

            // Adjunta las opciones a cada pregunta
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
            console.log(res.json)
        })
        .catch(error => {
            console.error("Error al cargar serie:", error);
            res.status(500).json({ error: "Error al cargar la serie." });
        });
};

exports.post_respuestasSerie = async (req, res, next) => {
    try {

        // Constantes de construcción

        const idSerie = parseInt(req.params.idSerie);
        const { respuestas } = req.body;
        // console.log("Recibimos respuestas en el backend:", respuestas);
        const idUsuario = req.session.idUsuario;
        const idGrupo = req.session.idGrupo;
        const idPrueba = 4;

        // PASO 49 DE DIAGRAMA: Calificamos la serie
        await calificarSerieTerman(idSerie, idUsuario, idGrupo, respuestas)

        // PASO 69 DE DIAGRAMA: Creamos el modelo con esos datos 
        const respuestasModel = new respuestasTerman(
            idUsuario,
            idGrupo,
            idPrueba,
            respuestas
        );

        // Guardamos las respuestas
        await respuestasModel.save();
        res.status(200).json({ ok: true, message: "Respuestas guardadas" });

    } catch (error) {
        console.log("Algo salió mal en post_respuestasSerie:", error);
        res.status(500).json({ error: "Error al guardar respuestas" });
    }
};
