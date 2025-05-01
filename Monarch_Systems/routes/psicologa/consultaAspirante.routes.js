// Importa Express y crea una instancia del router
const express = require('express');
const router = express.Router();

// Importa el controlador que contiene la lógica para consultar aspirantes
const consultaAspirante = require('../../controllers/psicologa/consultaAspirante.controller');
const consultaResultados = require ('../../controllers/psicologa/consultaResultados.controller');
const controladorTerman = require('../../controllers/pruebas/terman/terman.controller');
// Importa el middleware de autenticación
const isAuth = require('../../config/isAuth');

// Importa el middleware que verifica si el usuario puede consultar aspirantes
const canConsultarAspirante = require('../../config/canConsultarAspirante');

// Ruta para obtener las respuestas de una prueba específica del aspirante
router.get('/consultaAspirantes/:idAspirante/:idGrupo/:nombrePrueba', isAuth, canConsultarAspirante, consultaAspirante.Get_respuestasResultados);

// Ruta para obtener las respuestas de una serie Terman por INDIVIDUAL

router.get('/consultaAspirantes/:idAspirante/:idGrupo/serie/:idSerie', isAuth, canConsultarAspirante, controladorTerman.get_respuestasSerie);

//Ruta para obtener el análisis de Hartman

router.get('/consultaAspirantes/analisis/:idAspirante/:idGrupo/Inventario%20de%20Personalidad%20y%20Valores%20Hartman', isAuth, canConsultarAspirante, consultaResultados.get_analisisHartman);

// Ruta para obtener el análisis de Terman

router.get('/consultaAspirantes/analisis/:idAspirante/:idGrupo/Test%20de%20Aptitud%20Mental%20TERMAN', isAuth, canConsultarAspirante, consultaResultados.get_analisisTerman);

// Exporta el router para que pueda ser usado por la aplicación principal
module.exports = router;
