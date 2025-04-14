// routes/pruebas.routes.js
const express = require('express');
const router = express.Router();
const pruebasController = require('../../controllers/pruebas/pruebas.controller');
const isAuth = require ('../../config/isAuth');
const canResponderPruebas = require('../../config/canResponderPruebas');

// Por ejemplo, rutas para cada prueba:
/*
router.get('/instrucciones/Kostick', pruebasController.get_instruccionesKostick);
router.get('/instrucciones/16PF', pruebasController.get_instrucciones16PF);
*/
router.get('/instrucciones/Hartman',isAuth,canResponderPruebas, pruebasController.get_instruccionesHartman);
router.get('/instrucciones/Terman',isAuth,canResponderPruebas, pruebasController.get_instruccionesTerman);
/*
router.get('/instrucciones/Otis', pruebasController.get_instruccionesOtis);
router.get('/instrucciones/Colores', pruebasController.get_instruccionesColores);
*/

module.exports = router;
