/* router para obtener las instrucciones de cada prueba*/
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

/* siguientes dos rutas: Kostick */
router.post(
  "/siguientePregunta",
  isAuth,
  aspiranteController.post_siguientePregunta
);

router.post("/pruebaCompletada", isAuth, aspiranteController.pruebaCompletada);


/* Siguientes dos rutas: 16PF */
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

/* router para obtener vista de prueba completada */
router.get(
  "/pruebaCompletada",
  isAuth,
  aspiranteController.get_pruebaCompletada
);
