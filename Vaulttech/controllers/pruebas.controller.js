const { request, response } = require("express");
const PruebaColores = require('../models/prueba.model');
const PruebaOtis = require('../models/prueba.model');
const OpcionOtis = require('../models/opcionOtis.model.js');
const Aspirante = require('../models/aspirante.model');

// Formulario datos personales
exports.getDatosPersonalesOtis = (request, response, next) => {
    response.render('Aspirantes/datosPersonalesOtis');
};

exports.getDatosPersonalesColores = (request, response, next) => {
    response.render('Aspirantes/datosPersonalesColores');
};

// Procesar datos personales y pasar a la prueba
exports.postDatosPersonalesOtis = (request, response, next) => {
    const { nombre, apellidoPaterno, apellidoMaterno, puestoSolicitado } = request.body;
    
    // Guardar en la sesion
    request.session.datosPersonalesOtis = {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        puestoSolicitado,
        fecha: new Date()
    };
    
    // Redirigir a la prueba
    response.redirect('/aspirante/prueba-otis');
};

//Obtener las areas, preguntas y opciones de la prueba OTIS
exports.obtenerPreguntas = async (req, res, next) => {
    try {
        const [areasDB] = await PruebaOtis.getAreaOtis();
        const [preguntasDB] = await PruebaOtis.getPreguntasOtis();
        const [opcionesDB] = await OpcionOtis.fetchAll();

        const preguntas = preguntasDB.map(pregunta => {
            const opciones = opcionesDB
                .filter(opcion => opcion.idPreguntaOtis === pregunta.idPreguntaOtis)
                .map(opcion => ({
                    idOpcionOtis: opcion.idOpcionOtis,
                    descripcionOpcion: opcion.descripcionOpcion,
                    esCorrecta: opcion.esCorrecta
                }));

            const respuestaCorrecta = opcionesDB.find(opcion =>
                opcion.idPreguntaOtis === pregunta.idPreguntaOtis && opcion.esCorrecta === 1
            )?.descripcionOpcion;

            // Buscar el nombre del área por idAreaOtis
            const area = areasDB.find(a => a.idAreaOtis === pregunta.idAreaOtis);

            return {
                num: pregunta.numeroPregunta,
                idPreguntaOtis: pregunta.idPreguntaOtis,
                pregunta: pregunta.preguntaOtis,
                respuesta: respuestaCorrecta,
                nombreAreaOtis: area ? area.nombreAreaOtis : "Sin área",
                opciones: opciones
            };
        });

        return res.json({ preguntas });
    } catch (error) {
        console.error("Error obteniendo preguntas:", error);
    }
}

// Obtener toda la prueba OTIS
exports.getPruebaOtis = (request, response, next) => {
    if (!request.session.datosPersonalesOtis) {
        return response.redirect('/aspirante/datos-personales-otis');
    }

    const idPrueba = 5;

    // Obtener el idGrupo y idPrueba por la sesión
    PruebaOtis.getGrupoPrueba(request.session.idAspirante, idPrueba)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                request.session.idGrupo = rows[0].idGrupo;
                request.session.idPrueba = idPrueba;
            } else {
                console.log("No se encontró grupo para este aspirante y prueba");
            }

            // Función para obtener las preguntas del model
            return PruebaOtis.getPreguntasOtis();
        })
        .then(([rows, fieldData]) => {
            const preguntas = rows;
            response.render('Aspirantes/pruebaOtis', {
                preguntas: preguntas || [],
                error: null
            });
        })
        .catch((error) => {
            console.error("Error al cargar la prueba OTIS:", error);
            response.render('Aspirantes/pruebaOtis', {
                preguntas: [],
                error: 'Error al cargar la prueba OTIS'
            });
        });
};

exports.postPruebaOtis = (request, response, next) => {
    response.redirect('/aspirante/prueba-completada');
};

const db = require('../util/database');
const { v4: uuidv4 } = require('uuid');

exports.postGuardarRespuestas = async (request, response) => {

    const idAspirante = request.session.idAspirante;
    const idGrupo = request.session.idGrupo;
    const idPrueba = request.session.idPrueba;

    // Si no se encuentra el idAspirante
    if (!request.session.idAspirante) {
        return response.redirect('/aspirante/datos-personales-otis');
    }

    const respuestas = request.body;

    try {
        // Armar el array de valores para insertar
        const values = respuestas.map(r => [
            uuidv4(), // para generar el idRespuestaOtis
            idAspirante,
            idGrupo,
            r.idPreguntaOtis,
            r.idOpcionOtis,
            idPrueba,
            r.tiempoRespuesta
        ]);

        // Insertar valores en la tabla respuestaOtisAspirante
        await db.query(
            `INSERT INTO respuestaotisaspirante
            (idRespuestaOtis, idAspirante, idGrupo, idPreguntaOtis, idOpcionOtis, idPrueba, tiempoRespuesta)
            VALUES ?`, 
            [values]
        );

        // Obtener datos personales desde sesión
        const datosPersonales = request.session.datosPersonalesOtis || {
            nombre: "Usuario",
            apellidoPaterno: "",
            apellidoMaterno: "",
            puestoSolicitado: "No especificado",
            fecha: new Date()
        };

        // Guardar datos personales
        await PruebaOtis.saveDatosPersonales(
            idAspirante,
            idGrupo,
            idPrueba,
            datosPersonales
        );

        console.log("Datos personales guardados correctamente");

        // Verificar si ya existe el registro en aspirantesGruposPruebas
        const [rows] = await PruebaOtis.verificarExistencia(
            idAspirante,
            idGrupo,
            idPrueba
        );

        if (rows.length === 0) {
            console.log("No existe registro, insertando...");
            await db.execute(
                `INSERT INTO aspirantesgrupospruebas (idAspirante, idGrupo, idPrueba, idEstatus)
                VALUES (?, ?, ?, 2)`,
                [idAspirante, idGrupo, idPrueba]
            );
        } else {
            console.log("Registro encontrado, actualizando estado...");
            await PruebaOtis.updateEstatusPrueba(
                idAspirante,
                idGrupo,
                idPrueba
            );
        }

    } catch (error) {
        console.error("Error al guardar respuestas:", error);
    }
    return response.json({ success: true, redirectUrl: '/aspirante/prueba-completada' });
};

// Procesar datos personales y pasar a la prueba de colores
exports.postDatosPersonalesColores = (request, response, next) => {
    const { nombre, apellidoPaterno, apellidoMaterno, puestoSolicitado } = request.body;
    
    // Guardar en la sesion
    request.session.datosPersonalesColores = {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        puestoSolicitado,
        fecha: new Date()
    };
    
    // Primera fase de la prueba
    response.redirect('/aspirante/prueba-colores');
};

exports.getPruebaColores = (request, response, next) => {
    if (!request.session.datosPersonalesColores) {
        return response.redirect('/aspirante/datos-personales-colores');
    }

    const idPrueba = 6; 

    // Obtener el idGrupo aspirante y prueba
    PruebaColores.getGrupoPrueba(request.session.idAspirante, idPrueba)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                // Guardar el idGrupo
                request.session.idGrupo = rows[0].idGrupo;
                console.log("ID de Grupo establecido:", request.session.idGrupo);
            } else {
                console.log("No se encontró grupo para este aspirante y prueba");
            }

            // Continuar con colores
            return PruebaColores.fetchColores();
        })
        .then(([rows, fieldData]) => {
            const colores = rows;
            response.render('Aspirantes/pruebaColores', {
                colores: colores || [],
                fase: 1,
                error: null
            });
        })
        .catch((error) => {
            console.log(error);
            response.render('Aspirantes/pruebaColores', {
                colores: [],
                fase: 1,
                error: 'Error al cargar los colores'
            });
        });
};

exports.postPruebaColores = (request, response, next) => {
    response.redirect('/aspirante/prueba-completada');
};

exports.postGuardarSeleccionesColores = (request, response) => {
    console.log("1. Iniciando controlador postGuardarSeleccionesColores");
    
    if (!request.session.idAspirante) {
        console.log("2. Error: No se encontró idAspirante en la sesión");
        return response.redirect('/aspirante/datos-personales-colores');
    }
    
    console.log("Datos recibidos:", request.body);
    
    // Recolectar las selecciones de colores desde los campos del formulario
    const selecciones = [];
    const regex = /selecciones\[(\d+)\]\[(\w+)\]/;
    
    const datos = {};
    for (const key in request.body) {
        if (key.startsWith('selecciones')) {
            const matches = key.match(regex);
            if (matches) {
                const index = matches[1];
                const prop = matches[2];
                const value = request.body[key];
                
                if (!datos[index]) {
                    datos[index] = {};
                }
                datos[index][prop] = value;
            }
        }
    }
    
    // Convertir el objeto en un array
    for (const index in datos) {
        selecciones.push({
            idColor: parseInt(datos[index].idColor),
            fase: parseInt(datos[index].fase),
            posicion: parseInt(datos[index].posicion)
        });
    }
    
    console.log("3. Selecciones procesadas:", selecciones);
    
    if (selecciones.length === 0) {
        console.log("4. Error: No hay selecciones para procesar");
        return response.redirect('/aspirante/prueba-colores');
    }
    
    const idPrueba = 6; 
    
    
    PruebaColores.getGrupoPrueba(request.session.idAspirante, idPrueba)
        .then(([rows]) => {
            if (rows.length === 0) {
                throw new Error("No se encontró grupo para este aspirante y prueba");
            }
            
            const idGrupo = rows[0].idGrupo;
            console.log("5. ID de Grupo obtenido:", idGrupo);
            
            // Separar las selecciones de fase 1 y 2
            const seleccionesFase1 = selecciones.filter(s => s.fase === 1);
            const seleccionesFase2 = selecciones.filter(s => s.fase === 2);
            
            console.log("6. Selecciones fase 1:", seleccionesFase1.length);
            console.log("7. Selecciones fase 2:", seleccionesFase2.length);
            
            // Obtener datos personales
            const datosPersonales = request.session.datosPersonalesColores || {
                nombre: "Usuario",
                apellidoPaterno: "",
                apellidoMaterno: "",
                puestoSolicitado: "No especificado",
                fecha: new Date()
            };
            
            // Guardar en base
            return PruebaColores.saveDatosPersonales(
                request.session.idAspirante,
                idGrupo,
                idPrueba,
                datosPersonales
            ).then(() => {
                console.log("8. Datos personales guardados correctamente");
                // const pruebaColores1 = new PruebaColores(seleccionesFase1);
                return PruebaColores.saveSeleccion(
                    request.session.idAspirante,
                    idGrupo,
                    idPrueba,
                    1,
                    seleccionesFase1
                );
            }).then(() => {
                console.log("9. Primera selección guardada");
                // const pruebaColores2 = new PruebaColores(seleccionesFase2);
                return PruebaColores.saveSeleccion(
                    request.session.idAspirante,
                    idGrupo,
                    idPrueba,
                    2,
                    seleccionesFase2
                );
            }).then(() => {
                console.log("10. Segunda selección guardada");
                return PruebaColores.verificarExistencia(
                    request.session.idAspirante,
                    idGrupo,
                    idPrueba
                );
            }).then(([rows]) => {
                if (rows.length === 0) {
                    console.log("11. No existe registro, insertando...");
                    return db.execute(
                        `INSERT INTO aspirantesgrupospruebas (idAspirante, idGrupo, idPrueba, idEstatus)
                        VALUES (?, ?, ?, 2)`,
                        [request.session.idAspirante, idGrupo, idPrueba]
                    );
                } else {
                    console.log("12. Registro encontrado, actualizando estado...");
                    return PruebaColores.updateEstatusPrueba(
                        request.session.idAspirante,
                        idGrupo, 
                        idPrueba
                    );
                }
            });
        })
        .then(() => {
            console.log("13. Proceso completado con éxito");
            delete request.session.datosPersonalesColores;
            delete request.session.primeraSeleccion;
            response.redirect('/aspirante/prueba-completada');
        })
        .catch((error) => {
            console.error("Error:", error.message);
            console.log(error);
            return response.send(`
                <h3>Error al procesar la prueba</h3>
                <p>${error.message}</p>
                <a href="/aspirante/prueba-colores" class="btn btn-primary">Volver a intentar</a>
            `)
            
            ;
        });
};

exports.getPruebaCompletada = (request, response, next) => {
    response.render('Aspirantes/pruebaCompletada', {
    });
};

exports.getRespuestasEnviadas = (request, response, next) => {
    response.render('Aspirantes/respuestasEnviadas');
};