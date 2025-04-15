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


