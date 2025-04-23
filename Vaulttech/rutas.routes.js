// Cuadernillo de respuestas de la prueba OTIS por aspirante
router.get('/cuadernillo-otis/:idGrupo/:idAspirante/:idInstitucion', controller.getCuadernilloOtis);

// Vista con el análisis de la prueba otis del aspirante
router.get('/analisis-otis/:idGrupo/:idAspirante/:idInstitucion', controller.getAnalisisOtis);

// Vista con el análisis de la prueba Colores del aspirante
router.get('/analisis-colores/:idGrupo/:idAspirante/:idInstitucion', controller.getAnalisisColores);
// CUADERNILLO COLORES
router.get('/cuadernillo-colores/:idGrupo/:idAspirante/:idInstitucion', controller.getCuadernilloColores);

router.get('/instrucciones-otis', controller.getIntruccionesOtis);
router.post('/instrucciones-otis', controller.postInstruccionesOtis);
router.get('/datos-personales-otis', controller.getDatosPersonalesOtis);
router.post('/datos-personales-otis', controller.postDatosPersonalesOtis);

router.get('/prueba-otis', controller.getPruebaOtis);
router.post('/prueba-otis', controller.obtenerPreguntas);
router.post('/prueba-otis', controller.postPruebaOtis);
router.post('/guardar-selecciones-otis', controller.postGuardarRespuestas);
router.get('/prueba-completada', controller.getPruebaCompletada);

router.get('/instrucciones-colores', controller.getInstruccionesColores);
router.post('/instrucciones-colores', controller.postInstruccionesColores);
router.get('/datos-personales-colores', controller.getDatosPersonalesColores);
router.post('/datos-personales-colores', controller.postDatosPersonalesColores);

router.get('/prueba-colores', controller.getPruebaColores);
router.post('/prueba-colores', controller.postPruebaColores);
router.post('/guardar-selecciones-colores', controller.postGuardarSeleccionesColores);
router.get('/prueba-completada', controller.getPruebaCompletada);

router.get('/respuestas-enviadas', controller.getRespuestasEnviadas);
