const express = require('express');
const router = express.Router();
const isAuth = require ('../../../config/isAuth');
const canResponderPruebas = require ('../../../config/canResponderPruebas');
const verificarSesionPrueba = require('../../../middlewares/verificarSesionPrueba');
const controladorTerman = require('../../../controllers/pruebas/terman/terman.controller');

// GET

router.get('/responder/terman',isAuth, canResponderPruebas, verificarSesionPrueba(4), controladorTerman.get_responderTerman);

router.get('/responder/terman/serie/:idSerie', isAuth, canResponderPruebas, controladorTerman.get_infoSerie);

router.get('/responder/terman/progreso-terman',isAuth, canResponderPruebas, controladorTerman.get_progresoTerman);

router.get('/error/progreso-expirado', controladorTerman.errorProgresoExpirado);

// POST

router.post('/responder/terman/pregunta/:idPreguntaTerman', isAuth, canResponderPruebas, controladorTerman.post_respuestaTerman);

module.exports = router;