// routes/pruebas.routes.js
const express = require('express');
const router = express.Router();

// Controladores
const pruebasController = require('../../controllers/pruebas/pruebas.controller');
const sesionesPruebasController = require('../../controllers/pruebas/sesionesPruebas.controller');

// Accesos
const isAuth = require ('../../config/isAuth');
const canResponderPruebas = require('../../config/canResponderPruebas');

// Verificación con middlewares
const verificarSesionPrueba = require('../../middlewares/verificarSesionPrueba');

// Por ejemplo, rutas para cada prueba:
/*
router.get('/instrucciones/Kostick', pruebasController.get_instruccionesKostick);
router.get('/instrucciones/16PF', pruebasController.get_instrucciones16PF);
*/
router.get('/instrucciones/3',isAuth,canResponderPruebas, verificarSesionPrueba(3), pruebasController.get_instruccionesHartman);
router.get('/instrucciones/4',isAuth,canResponderPruebas, verificarSesionPrueba(4), pruebasController.get_instruccionesTerman);
/*
router.get('/instrucciones/Otis', pruebasController.get_instruccionesOtis);
router.get('/instrucciones/Colores', pruebasController.get_instruccionesColores);
*/

// Verificación AJAX del estatus de la sesionPrueba
router.get('/verificar-sesion/:idPrueba', isAuth, sesionesPruebasController.verificarSesionPruebaAjax);

module.exports = router;
