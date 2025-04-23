/* RUTAS EN ASPIRANTE */
router.get(
  "/instruccionesPrueba/:idPrueba",
  isAuth,
  consultarPrueba,
  aspiranteController.get_instrucciones
);

router.post(
  "/preguntasPrueba/:idPrueba",
  isAuth,
  aspiranteController.post_preguntasPrueba
);

router.post(
  "/siguientePregunta",
  isAuth,
  aspiranteController.post_siguientePregunta
);

router.post("/pruebaCompletada", isAuth, aspiranteController.pruebaCompletada);

router.get(
  "/pruebaCompletada",
  isAuth,
  aspiranteController.get_pruebaCompletada
);

router.post(
  "/siguientePregunta1",
  isAuth,
  aspiranteController.post_siguientePregunta1
);

router.post(
  "/pruebaCompletada1",
  isAuth,
  aspiranteController.pruebaCompletada1
);






/* RUTA EN PSICÓLOGA */
router.get(
  "/consultaRespuestasAspirante/:idusuario/:idprueba",
  isAuth,
  consultarRespuestasAspirante,
  psicologaController.get_respuestasA
);
