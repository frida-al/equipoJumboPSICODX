/* Función que sirve como controlador para mostrar las instrucciones de cada una de las pruebas. 
Necesita la información de la pruebas guardadas en base de datos para obtener las instrucciones */
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

/* Función que sirve como controlador para obtener los datos personales del aspirante, y que éste solamente los verifique.
Necesita la información del aspirante guardada en base de datos, como nombre, apellidos y el grupo al que pertenece */
exports.get_datosA = (request, response, next) => {
  Prueba.fetchOne(request.params.idPrueba).then(([rows]) => {
    Aspirante.fetchOne(request.session.idUsuario).then(([aspirante]) => {
      Grupo.fetchOneId(request.session.grupo).then(([grupoCompleto]) => {
        request.session.idPrueba = rows[0].idPrueba;
        response.render("datosAspirante", {
          isLoggedIn: request.session.isLoggedIn || false,
          usuario: request.session.usuario || "",
          csrfToken: request.csrfToken(),
          privilegios: request.session.privilegios || [],
          prueba: rows[0],
          idUsuario: request.session.idUsuario,
          aspirante: aspirante[0],
          grupo: request.session.grupo,
          grupoCompleto: grupoCompleto[0],
        });
      });
    });
  });
};
