exports.get_respuestasA = (request, response, next) => {
   const idUsuario = request.params.idusuario;
   const idPrueba = request.params.idprueba;
 
   Aspirante.fetchOne(idUsuario).then(([datosAspirante, fieldData]) => {
     PerteneceGrupo.fetchOne(idUsuario).then(([rows, fieldData]) => {
       Grupo.fetchOneId(rows[0].idGrupo).then(([grupoRows, fieldData]) => {
         if (idPrueba == 1) {
           ResultadosKostick.fetchAll(rows[0].idGrupo, idUsuario).then(
             (resultados) => {
               response.render("consultaRespuestasAspirante", {
                 isLoggedIn: request.session.isLoggedIn || false,
                 usuario: request.session.usuario || "",
                 csrfToken: request.csrfToken(),
                 privilegios: request.session.privilegios || [],
                 prueba: "El inventario de Percepción Kostick",
                 grupo: grupoRows[0],
                 valores: resultados[0][0],
                 datos: datosAspirante[0],
               });
             }
           );
         } else if (idPrueba == 2) {
           Resultados16PF.fetchAll(rows[0].idGrupo, idUsuario).then(
             (resultados) => {
               response.render("consultaRespuestasAspirante", {
                 isLoggedIn: request.session.isLoggedIn || false,
                 usuario: request.session.usuario || "",
                 csrfToken: request.csrfToken(),
                 privilegios: request.session.privilegios || [],
                 prueba: "Personalidad 16 Factores (16 PF)",
                 grupo: grupoRows,
                 valores: resultados[0][0],
                 datos: datosAspirante[0],
               });
             }
           );
         }
       });
     });
   });
 };
