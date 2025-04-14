// Importa Express y crea una instancia del router
const express = require('express');
const router = express.Router();

// Importa el controlador que maneja la lógica para la prueba de Hartman
const hartmanController = require('../../../controllers/pruebas/hartman/hartman.controller');

// Importa el middleware que verifica si el usuario está autenticado
const isAuth = require('../../../config/isAuth');

// Importa el middleware que valida si el usuario tiene permiso para responder pruebas
const canResponderPruebas = require('../../../config/canResponderPruebas');

// Ruta GET para mostrar la primera fase de la prueba de Hartman
router.get('/hartman/fase1', isAuth, canResponderPruebas, hartmanController.get_HartmanFase1);

// Ruta POST para enviar las respuestas de la primera fase de la prueba de Hartman
router.post('/hartman/fase1', isAuth, canResponderPruebas, hartmanController.post_HartmanFase1);

// Ruta GET para mostrar la segunda fase de la prueba de Hartman
router.get('/hartman/fase2', isAuth, canResponderPruebas, hartmanController.get_HartmanFase2);

// Ruta POST para enviar las respuestas de la segunda fase de la prueba de Hartman
router.post('/hartman/fase2', isAuth, canResponderPruebas, hartmanController.post_HartmanFase2);

// Exporta el router para que pueda ser utilizado en la aplicación principal
module.exports = router;
