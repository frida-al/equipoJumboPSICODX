const express = require('express');
const router = express.Router();
const isAuth = require ('../../../config/isAuth');
const canResponderPruebas = require ('../../../config/canResponderPruebas');
const verificarSesionPrueba = require('../../../middlewares/verificarSesionPrueba');
const controladorTerman = require('../../../controllers/pruebas/terman/terman.controller');

router.get('/responder/terman',isAuth, canResponderPruebas, verificarSesionPrueba(4), controladorTerman.get_responderTerman);

router.get('/responder/terman/serie/:idSerie', isAuth, canResponderPruebas, controladorTerman.get_infoSerie);

router.post('/responder/terman/serie/:idSerie',isAuth, canResponderPruebas, controladorTerman.post_respuestasSerie);

module.exports = router;