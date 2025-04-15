/* Solamente se utiliza el guión bajo para separar el método de la ruta */
exports.get_instrucciones = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    response.render("instruccionesPrueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      prueba: rows[0],
      idUsuario: request.session.idUsuario,
    });
  });
};


/* controlador que renderiza la primera pregunta de la prueba dependiendo de us id (1 para Kostick y 2 para 16PF). Estos id se manejan así en todos los casos) */
exports.post_preguntasPrueba = (request, response, next) => {
  if (request.params.idPrueba == 1) {
    Prueba.fetchOne(request.params.idPrueba)
      .then(([prueba]) => {
        request.session.index = 1; // Index que ayudará a recuperar el resto de las preguntas (por número de pregunta) 
        let currentQuestionIndex = request.session.index;
        PreguntaKostick.fetchOne(currentQuestionIndex)
          .then(([pregunta]) => {
            PreguntaKostick.getOpciones(pregunta[0].idPreguntaKostick)
              .then(([opciones]) => {
                return response.render("preguntasPrueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
                  idGrupo: request.session.grupo,  //Se necesita guardar el id del grupo al que pertenece el Usuario en algún punto, o recuperarlo para este y los siguientes controladores
                  idUsuario: request.session.idUsuario || "",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  } else if (request.params.idPrueba == 2) {
    Prueba.fetchOne(request.params.idPrueba)
      .then(([prueba]) => {
        request.session.index = 1;
        let currentQuestionIndex = request.session.index;
        Pregunta16PF.fetchOne(currentQuestionIndex)
          .then(([pregunta]) => {
            Pregunta16PF.getOpciones(pregunta[0].idPregunta16PF)
              .then(([opciones]) => {
                return response.render("preguntasPrueba", {
                  isLoggedIn: request.session.isLoggedIn || false,
                  usuario: request.session.usuario || "",
                  csrfToken: request.csrfToken(),
                  privilegios: request.session.privilegios || [],
                  prueba: prueba[0],
                  pregunta: pregunta[0],
                  opciones: opciones,
                  idGrupo: request.session.grupo,
                  idUsuario: request.session.idUsuario || "",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

/* post siguiente pregunta de KOSTICK (usando AJAX) */
exports.post_siguientePregunta = (request, response, next) => {
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  const newRespondeKostick = new RespondeKostick(
    request.body.idPreguntaKostick,
    request.body.idGrupo,
    request.body.idUsuario,
    request.body.idOpcionKostick,
    request.body.tiempo
  );
  newRespondeKostick.save().then((uuid) => {
    request.session.idPregunta16PF = uuid;
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });
  PreguntaKostick.fetchOne(request.session.index)
    .then(([pregunta]) => {
      PreguntaKostick.getOpciones(pregunta[0].idPreguntaKostick)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
            idGrupo: request.session.grupo,
            idUsuario: request.session.idUsuario || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

/* post siguiente pregunta de 16PF (usando AJAX) */
exports.post_siguientePregunta1 = (request, response, next) => {
  const { idOpcion16PF, idGrupo, idUsuario, idPregunta16PF, tiempo } =
    request.body;
  if (!request.session.index) {
    return response.redirect("/login");
  }
  request.session.index++;

  const newResponde16pf = new Responde16PF(
    request.body.idPregunta16PF,
    request.body.idGrupo,
    request.body.idUsuario,
    request.body.idOpcion16PF,
    request.body.tiempo
  );
  newResponde16pf.save().then((uuid) => {
    request.session.idPregunta16PF = uuid;
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });

  Pregunta16PF.fetchOne(request.session.index)
    .then(([pregunta]) => {
      Pregunta16PF.getOpciones(pregunta[0].idPregunta16PF)
        .then(([opciones]) => {
          return response.status(200).json({
            csrfToken: request.csrfToken(),
            pregunta: pregunta[0],
            opciones: opciones,
            idGrupo: request.session.grupo,
            idUsuario: request.session.idUsuario || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

/* Controlador que guarda la última pregunta de 16PF */
exports.pruebaCompletada = (request, response, next) => {
  const idOpcionKostick = request.body.idOpcionKostick;
  const idGrupo = request.body.idGrupo;
  const idUsuario = request.body.idUsuario;
  const idPreguntaKostick = request.body.idPreguntaKostick;
  const tiempo = request.body.tiempo;
  const idPrueba = 1;

  if (!request.session.index) {
    return response.redirect("/login");
  }

  const newRespondeKostick = new RespondeKostick(
    idPreguntaKostick,
    idGrupo,
    idUsuario,
    idOpcionKostick,
    tiempo
  );

  newRespondeKostick
    .save()
    .then((uuid) => {
      request.session.idPregunta16PF = uuid;
      request.session.idGrupo = uuid;
      request.session.idUsuario = uuid;
      return response.status(200).json({
        message: "Prueba completada exitosamente",
      });
    })
    .catch((error) => {
      console.error("Error saving response:", error);
      return response.status(500).json({ message: "Error saving response." });
    });

  const newPruebaAspirante = new PruebaAspirante(idUsuario, idGrupo, idPrueba);

  newPruebaAspirante.terminarPrueba().then((uuid) => {
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });
};

/* Controlador que guarda la última pregunta de 16PF */
exports.pruebaCompletada1 = (request, response, next) => {
  const idOpcion16PF = request.body.idOpcion16PF;
  const idGrupo = request.body.idGrupo;
  const idUsuario = request.body.idUsuario;
  const idPregunta16PF = request.body.idPregunta16PF;
  const tiempo = request.body.tiempo;

  const idPrueba = 2;

  if (!request.session.index) {
    return response.redirect("/login");
  }

  const newResponde16pf = new Responde16PF(
    idOpcion16PF,
    idGrupo,
    idUsuario,
    idPregunta16PF,
    tiempo
  );
  newResponde16pf
    .save()
    .then((uuid) => {
      request.session.idPregunta16PF = uuid;
      request.session.idGrupo = uuid;
      request.session.idUsuario = uuid;
      return response.status(200).json({
        message: "Prueba completada exitosamente",
      });
    })
    .catch((error) => {
      console.error("Error saving response:", error);
      return response.status(500).json({ message: "Error saving response." });
    });
  const newPruebaAspirante = new PruebaAspirante(idUsuario, idGrupo, idPrueba);

  newPruebaAspirante.terminarPrueba().then((uuid) => {
    request.session.idGrupo = uuid;
    request.session.idUsuario = uuid;
  });
};

/* Controlador que lleva a la vista con mensaje de prueba completada*/
exports.get_pruebaCompletada = (request, response, next) => {
  Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
    response.render("finPrueba", {
      isLoggedIn: request.session.isLoggedIn || false,
      usuario: request.session.usuario || "",
      csrfToken: request.csrfToken(),
      privilegios: request.session.privilegios || [],
      idUsuario: request.session.idUsuario,
      aspirante: aspirante[0],
    });
  });
};
