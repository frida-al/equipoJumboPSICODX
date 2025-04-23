//////////////
//PSICÓLOGOS//
//////////////

// Modelos
const Prueba = require('../models/prueba.model');
const Cuadernillo = require('../models/cuadernilloOtis.model');
const CuadernilloColores = require('../models/cuadernilloColores.model');

/*
 * ANÁLISIS OTIS
*/
exports.getAnalisisOtis = (request, response, next) => {
    Prueba.getRespuestasOtis(request.params.idAspirante, request.params.idGrupo)
    .then(([rows, fieldData]) => {
        const informacionAnalisis = rows;
        Prueba.getPuntajeBrutoOtis(request.params.idAspirante, request.params.idGrupo)
        .then(([rows, fieldData]) => {
            const puntajeBruto = rows[0].puntajeBruto;
            console.log("Informacion Analisis: ", informacionAnalisis);
            console.log("Puntaje Bruto: ", puntajeBruto);
            response.render('Psicologos/analisisOtis.ejs', {
                informacionAnalisis: informacionAnalisis || [],
                puntajeBruto: puntajeBruto || 0,
                idAspirante: request.params.idAspirante || null,
                idGrupo: request.params.idGrupo || null,
                idInstitucion: request.params.idInstitucion || null,
            })
        })
        .catch((error) => {
            console.log(error);
        });
    })
    .catch((error) => {
        console.log(error);
    });
};

/*
 * CUADERNILLO OTIS
*/
// Controlador para manejar la obtención del cuadernillo de respuestas OTIS.
exports.getCuadernilloOtis = (request, response, next) => {
    // Obtiene los datos personales del aspirante
    Prueba.getDatosPersonalesAspiranteOtis(request.params.idGrupo, request.params.idAspirante)
    .then(([rows, fieldData]) => {
        const datosPersonales = rows;
        // Obtiene las respuestas correctas del aspirante
        Cuadernillo.getRespuestasCorrectas(request.params.idGrupo, request.params.idAspirante)
        .then(([rows, fieldData]) => {
            const respuestasCorrectas = rows[0].RespuestasCorrectas;
            // Obtiene el tiempo total que tomo el aspirante para completar la prueba
            Cuadernillo.getTiempoTotal(request.params.idGrupo, request.params.idAspirante)
            .then(([rows, fieldData]) => {
                const tiempoTotal = rows[0].Tiempo;
                // Obtiene las preguntas, opciones y la respuesta del aspirante
                Cuadernillo.getRespuestasOtisAspirante(request.params.idGrupo, request.params.idAspirante)
                .then(([rows, fieldData]) => {
                    const preguntasAgrupadas = {};

                    rows.forEach(row => {
                        // Creamos el objeto de pregunta si este no existe
                        if (!preguntasAgrupadas[row.idPreguntaOtis]) {
                            preguntasAgrupadas[row.idPreguntaOtis] = {
                                idPreguntaOtis: row.idPreguntaOtis,
                                numeroPregunta: row.numeroPregunta,
                                preguntaOtis: row.preguntaOtis,
                                opciones: [],
                                esCorrecta: false,
                                tiempoRespuesta: 0,
                                contestada: null
                            };
                        }
                        // Vamos añadiendo las opciones de la pregunta correspondiente
                        preguntasAgrupadas[row.idPreguntaOtis].opciones.push({
                            idOpcionOtis: row.idOpcionOtis,
                            opcionOtis: row.opcionOtis,
                            descripcionOpcion: row.descripcionOpcion,
                            esCorrecta: row.esCorrecta === 1, 
                            seleccionada: row.opcionSeleccionada === 1
                        });

                        if (row.opcionSeleccionada === 1) {
                            preguntasAgrupadas[row.idPreguntaOtis].tiempoRespuesta = row.tiempoRespuesta;
                            preguntasAgrupadas[row.idPreguntaOtis].contestada = true;
                            preguntasAgrupadas[row.idPreguntaOtis].esCorrecta = row.esCorrecta === 1;

                        }

                        if(!preguntasAgrupadas[row.idPreguntaOtis].contestada){
                            preguntasAgrupadas[row.idPreguntaOtis].esCorrecta = null;
                        }
                    })

                    const respuestasAspitanteOtis = Object.values(preguntasAgrupadas);
                    
                    response.render('Psicologos/cuadernilloRespuestasOtis.ejs', {
                        datosPersonales: datosPersonales || [],
                        respuestasCorrectas: respuestasCorrectas || 0,
                        tiempoTotal: tiempoTotal || 0,
                        respuestasAspitanteOtis: respuestasAspitanteOtis || [],
                        aspirante: request.params.idAspirante || null,
                        grupo: request.params.idGrupo || null,
                        idInstitucion: request.params.idInstitucion || null,
                    });

                }).catch((error) => {
                    console.log(error);
                })
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
};

/*
 * CUADERNILLO COLORES
*/
exports.getCuadernilloColores = (request, response, next) => {
    // Obtener los datos personales del aspirante
    Prueba.getDatosPersonalesAspiranteColores(request.params.idGrupo, request.params.idAspirante)
    .then(([rows, fieldData]) => {
        const datosPersonales = rows;
        
        // Obtener todas las selecciones de colores
        CuadernilloColores.getSeleccionesColores(request.params.idGrupo, request.params.idAspirante)
        .then(([rows, fieldData]) => {
            // Separar las selecciones por fase
            const seleccionesFase1 = rows.filter(row => row.fase === 1)
                                        .sort((a, b) => a.posicion - b.posicion);
            const seleccionesFase2 = rows.filter(row => row.fase === 2)
                                        .sort((a, b) => a.posicion - b.posicion);
            
            response.render('Psicologos/cuadernilloColores.ejs', {
                datosPersonales: datosPersonales || [],
                seleccionesFase1: seleccionesFase1 || [],
                seleccionesFase2: seleccionesFase2 || [],
                aspirante: request.params.idAspirante || null,
                grupo: request.params.idGrupo || null,
                idInstitucion: request.params.idInstitucion || null,
            });
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
    });
};

/*
 * ANÁLISIS COLORES
 */
/*
ANALISIS COLORES
*/

function obtenerZona(posicion) {
    if (posicion <= 1) return '+';
    if (posicion <= 3) return 'X';
    if (posicion <= 5) return '=';
    return '-';
}

function mapearZona(zonaCruda) {
    if (zonaCruda === '+-' || zonaCruda === 'X-' || zonaCruda === '-+' || zonaCruda === 'X=' || zonaCruda === '=X' || zonaCruda === '=-' || zonaCruda === '-=') {
        return zonaCruda;
    }

    switch (zonaCruda) {
        case '+-X':
        case 'X-+':
        case '+-+':
            return '++';
        case '--=':
        case '=--':
        case '---':
            return '--';
        case '==-':
        case '=-=':
            return '==';
        case 'X-=':
        case '=-X':
            return '+-';
        case 'X-X':
            return 'XX';
        default:
            return zonaCruda.split('-').sort().join('');
    }
}

function obtenerParejasConZona(selecciones) {
    const pares = new Map();
    for (let i = 0; i < selecciones.length - 1; i++) {
        const a = selecciones[i];
        const b = selecciones[i + 1];
        const clave = ${a.numeroColor}-${b.numeroColor};

        const zonaCruda = ${obtenerZona(a.posicion)}-${obtenerZona(b.posicion)};
        const zona = mapearZona(zonaCruda);

        if (!pares.has(clave)) {
            pares.set(clave, []);
        }
        pares.get(clave).push(zona); 
    }
    return pares;
}

function filtrarParejasNaturalesYDisociadas(paresF1, paresF2) {
    const todasClaves = new Set([...paresF1.keys(), ...paresF2.keys()]);
    const zonasClave = new Set(['++', '--', '==', 'XX']);
    const resultado = [];

    for (let clave of todasClaves) {
        const [c1, c2] = clave.split('-').map(Number);
        const claveNorm = c1 < c2 ? ${c1}-${c2} : ${c2}-${c1};

        const zonasF1 = paresF1.get(claveNorm) || [];
        const zonasF2 = paresF2.get(claveNorm) || [];

        const zonaF1 = zonasF1[0] || null;
        const zonaF2 = zonasF2[0] || null;

        const enF1 = zonasF1.length > 0;
        const enF2 = zonasF2.length > 0;

        const esZonaValida = (zona) => zonasClave.has(zona);

        const esNatural = enF1 && enF2 && zonaF1 === zonaF2 && esZonaValida(zonaF1);
        const esDisociada = enF1 && enF2 && zonaF1 !== zonaF2 && esZonaValida(zonaF1) && esZonaValida(zonaF2);

        if (esNatural || esDisociada) {
            resultado.push({
                pareja: claveNorm,
                tipo: esNatural ? 'natural' : 'disociada',
                zonas: { fase1: zonaF1 || 'N/A', fase2: zonaF2 || 'N/A' }
            });
        }
    }

    return resultado.filter(par =>
        (par.zonas.fase1 && zonasClave.has(par.zonas.fase1)) ||
        (par.zonas.fase2 && zonasClave.has(par.zonas.fase2))
    );
}


function filtrarParejasArtificiales(paresF1, paresF2, parejasNaturalesYDisociadas = [], seleccionesF1 = [], seleccionesF2 = []) {
    const todasClaves = new Set([...paresF1.keys(), ...paresF2.keys()]);
    const resultado = [];

    const esParejaClasificada = (clave) => {
        const claveInversa = clave.split('-').reverse().join('-');
        return parejasNaturalesYDisociadas.some(p =>
            p.pareja === clave || p.pareja === claveInversa
        );
    };
    
    const esPosicionValida = (a, b) => {
        const posicionesValidas = [[0, 1], [2, 3], [4, 5], [6, 7]];
        return posicionesValidas.some(pair =>
            (pair[0] === a && pair[1] === b) || (pair[0] === b && pair[1] === a)
        );
    };

    const obtenerPosicionDeColor = (selecciones, numeroColor) => {
        for (let i = 0; i < selecciones.length; i++) {
            if (selecciones[i].numeroColor === numeroColor) {
                return selecciones[i].posicion;
            }
        }
        return null;
    };

    for (let clave of todasClaves) {
        const zonasF1 = paresF1.get(clave) || [];
        const zonasF2 = paresF2.get(clave) || [];

        const zonaF1 = zonasF1[0] || null;
        const zonaF2 = zonasF2[0] || null;

        const enF1 = zonasF1.length > 0;
        const enF2 = zonasF2.length > 0;

        if (esParejaClasificada(clave)) continue;

        const [colorA, colorB] = clave.split('-').map(Number);

        const posA_f1 = obtenerPosicionDeColor(seleccionesF1, colorA);
        const posB_f1 = obtenerPosicionDeColor(seleccionesF1, colorB);
        const posA_f2 = obtenerPosicionDeColor(seleccionesF2, colorA);
        const posB_f2 = obtenerPosicionDeColor(seleccionesF2, colorB);

        const parejaEsValida =
            esPosicionValida(posA_f1, posB_f1) || esPosicionValida(posA_f2, posB_f2);

        if (parejaEsValida) {
            if (enF1 && !enF2 && zonaF1 !== '+-' && zonaF1 !== undefined) {
                resultado.push({
                    pareja: clave,
                    tipo: 'artificial',
                    zonas: { fase1: zonaF1 || 'N/A' }
                });
            } else if (enF2 && !enF1 && zonaF2 !== '+-' && zonaF2 !== undefined) {
                resultado.push({
                    pareja: clave,
                    tipo: 'artificial',
                    zonas: { fase2: zonaF2 || 'N/A' }
                });
            }
        }
    }

    return resultado;
}

function obtenerInterpretacion(zona1, zona2, pareja) {
    if (zona1 === 'N/A' || zona2 === 'N/A') {
        return 'Interpretación no disponible para esta combinación.';
    }

    const numeros = pareja.match(/\d+/g);
    if (!numeros || numeros.length !== 2) {
        return 'Interpretación no disponible para esta combinación.';
    }

    const parejaNormalizada = ${numeros[0]}-${numeros[1]};
    const claveDirecta = ${zona1}|${parejaNormalizada};
    const claveInvertida = ${zona2}|${numeros[1]}-${numeros[0]};

    if (interpretaciones[claveDirecta]) {
        return interpretaciones[claveDirecta];
    } else if (interpretaciones[claveInvertida]) {
        return interpretaciones[claveInvertida];
    } else {
        return 'Interpretación no disponible para esta combinación.';
    }
}

function obtenerParejasClasificadas(seleccionesFase1, seleccionesFase2) {
    const paresF1 = obtenerParejasConZona(seleccionesFase1);
    const paresF2 = obtenerParejasConZona(seleccionesFase2);

    const resultadoNaturalesYDisociadas = filtrarParejasNaturalesYDisociadas(paresF1, paresF2);
    const resultadoArtificiales = filtrarParejasArtificiales(
        paresF1,
        paresF2,
        resultadoNaturalesYDisociadas,
        seleccionesFase1,
        seleccionesFase2
    );

    // Agregar interpretaciones
    const agregarInterpretaciones = (parejas) => {
        return parejas.map(p => {
            const textoFase1 = obtenerInterpretacion(p.zonas.fase1, p.zonas.fase2, p.pareja);
            const textoFase2 = obtenerInterpretacion(p.zonas.fase2, p.zonas.fase1, p.pareja);
        
            if (!p.zonas.fase1 || !p.zonas.fase2) {
                return { 
                    ...p, 
                    texto: { 
                        fase1: 'Interpretación no disponible para esta combinación.', 
                        fase2: 'Interpretación no disponible para esta combinación.' 
                    }
                };
            }

            return { ...p, texto: { fase1: textoFase1, fase2: textoFase2 } };
        });
    };

    return [...agregarInterpretaciones(resultadoNaturalesYDisociadas), ...resultadoArtificiales];
}

exports.getAnalisisColores = async (request, response, next) => {
    const { idGrupo, idAspirante, idInstitucion } = request.params;
    try {

        // Obtener información del aspirante
        const [informacionAspiranteRows] = await Prueba.getInformacionAspirante(idAspirante);

        // Obtener selecciones de colores completas
        const [seleccionesColoresRows] = await CuadernilloColores.getSeleccionesColores(idGrupo, idAspirante);
        
        // Separar selecciones por fase
        const seleccionesFase1 = seleccionesColoresRows.filter(row => row.fase === 1)
        .sort((a, b) => a.posicion - b.posicion);
        const seleccionesFase2 = seleccionesColoresRows.filter(row => row.fase === 2)
        .sort((a, b) => a.posicion - b.posicion);

        // Calcular parejas naturales
        const parejas = obtenerParejasClasificadas(seleccionesFase1, seleccionesFase2);

        // Obtener resultados de análisis
        const [rows] = await Prueba.getRespuestasColores(idAspirante, idGrupo);

        // Calcular movilidad
        const movilidad = calcularMovilidad(seleccionesFase1, seleccionesFase2);
        
        // Interpretar resultado de movilidad
        const interpretacionMovilidad = interpretarMovilidad(movilidad);

        // Inicializar arrays para resultadosFase1 y resultadosFase2
        const resultadosFase1 = [];
        const resultadosFase2 = [];

        const colores = {
            0: { nombre: 'Gris', significado: 'Participación', tipo: 'No laboral' },
            1: { nombre: 'Azul', significado: 'Paciencia', tipo: 'Laboral' },
            2: { nombre: 'Verde', significado: 'Productividad', tipo: 'Laboral' },
            3: { nombre: 'Rojo', significado: 'Empuje/Agresividad', tipo: 'Laboral' },
            4: { nombre: 'Amarillo', significado: 'Sociabilidad', tipo: 'Laboral' },
            5: { nombre: 'Morado', significado: 'Creatividad', tipo: 'Laboral' },
            6: { nombre: 'Café', significado: 'Vigor', tipo: 'No laboral' },
            7: { nombre: 'Negro', significado: 'Satisfacción', tipo: 'No laboral' },
            8: { nombre: 'Gris', significado: 'Participación', tipo: 'No laboral' },
        };
        
        rows.forEach(({ fase, idColor, posicion }) => {
            const info = colores[idColor] || { nombre: 'Desconocido', significado: '', tipo: 'Desconocido' };
        
            let porcentaje;
        
            if (info.tipo === 'No laboral') {
                porcentaje = 20 + (posicion * 10);
                if (porcentaje <= 50) porcentaje -= 10;
            } else {
                porcentaje = 90 - (posicion * 10);
                if (porcentaje <= 50) porcentaje -= 10; 
            }
        
            const resultado = {
                color: info.nombre,
                significado: info.significado,
                tipo: info.tipo,
                porcentaje
            };
        
            if (fase === 1) {
                resultadosFase1.push(resultado);
            } else if (fase === 2) {
                resultadosFase2.push(resultado);
            }
        });               

        function agregarInterpretaciones(parejas) {
            return parejas.map(p => {
                const textoFase1 = obtenerInterpretacion(p.zonas.fase1, p.zonas.fase2, p.pareja);
                const textoFase2 = obtenerInterpretacion(p.zonas.fase2, p.zonas.fase1, p.pareja);
        
                if (p.zonas.fase1 === 'N/A' || p.zonas.fase2 === 'N/A') {
                    return { 
                        ...p, 
                        texto: { 
                            fase1: 'Interpretación no disponible para esta combinación.', 
                            fase2: 'Interpretación no disponible para esta combinación.' 
                        }
                    };
                }
        
                return { ...p, texto: { fase1: textoFase1, fase2: textoFase2 } };
            });
        }   

        const parejasNormalizadas = parejas.map(p => {
            const numeros = p.pareja.match(/\d+/g); 
            if (!numeros || numeros.length !== 2) {
                return p; 
            }
        
            return {
                ...p,
                pareja: ${numeros[0]}-${numeros[1]}
            };
        });

        const parejasConInterpretaciones = agregarInterpretaciones(parejasNormalizadas);

        // Renderizar la vista con todos los datos
        response.render('Psicologos/analisisColores.ejs', {
            seleccionesFase1: seleccionesFase1 || [],
            seleccionesFase2: seleccionesFase2 || [],
            resultadosFase1,
            resultadosFase2,
            movilidad,
            interpretacionMovilidad,
            parejas: parejasConInterpretaciones,
            idGrupo, 
            idAspirante,
            idInstitucion,
            // nombre aspirante analisis
            informacionAspirante: informacionAspiranteRows[0]
        });
    } catch (error) {
        console.error('Error al obtener análisis de colores:', error);
    }
};

// Calcular la movilidad
function calcularMovilidad(seleccionesFase1, seleccionesFase2) {
    let positivosTotales = 0;
    let negativosTotales = 0;
    
    const posicionesFase1 = {};
    seleccionesFase1.forEach(seleccion => {
        posicionesFase1[seleccion.idColor] = seleccion.posicion;
    });
    
    // Comparar con las posiciones en la fase 2
    seleccionesFase2.forEach(seleccion => {
        const posicionFase1 = posicionesFase1[seleccion.idColor];
        const posicionFase2 = seleccion.posicion;
        const desplazamiento = posicionFase1 - posicionFase2;
        
        // Positivo = mover a la derecha 
        if (desplazamiento < 0) {
            positivosTotales += Math.abs(desplazamiento);
        } 
        // Negativo = mover a la izquierda 
        else if (desplazamiento > 0) {
            negativosTotales += desplazamiento;
        }
    });
    
    return {
        positivos: positivosTotales,
        negativos: negativosTotales
    };
}

// Interpretar el resultado de movilidad
function interpretarMovilidad(movilidad) {
    const totalPositivos = movilidad.positivos;
    const totalNegativos = movilidad.negativos;
    const valorAbsoluto = Math.max(totalPositivos, totalNegativos);
    
    if (totalPositivos === 0 && totalNegativos === 0) {
        return "RIGIDEZ (TERCO)";
    } else if (valorAbsoluto <= 1) {
        return "PERSONA DE MENTE ABIERTA Y DISPUESTA AL DIÁLOGO";
    } else if (valorAbsoluto <= 2) {
        return "PERSONA DISPUESTA A DIALOGAR (MENOR GRADO)";
    } else if (valorAbsoluto <= 3) {
        return "PERSONA DISPUESTA A DIALOGAR (MUCHO MENOR GRADO)";
    } else {
        return "PERSONA INESTABLE"; 
    }
}


//////////////
//ASPIRANTES//
//////////////
const PruebaColores = require('../models/prueba.model');
const PruebaOtis = require('../models/prueba.model');
const OpcionOtis = require('../models/opcionOtis.model.js');

exports.getIntruccionesOtis = (request, response, next) => {
    response.render('Aspirantes/instruccionesOtis');
};

exports.postInstruccionesOtis = (req, res) => {
    res.redirect('/aspirante/datos-personales-otis');
};

// Mostrar instrucciones colores
exports.getInstruccionesColores = (request, response, next) => {
    response.render('Aspirantes/instruccionesColores');
};

exports.postInstruccionesColores = (req, res) => {
    res.redirect('/aspirante/datos-personales-colores');
};

// Formulario datos personales
exports.getDatosPersonalesOtis = (request, response, next) => {
    response.render('Aspirantes/datosPersonalesOtis');
};

exports.getDatosPersonalesColores = (request, response, next) => {
    response.render('Aspirantes/datosPersonalesColores');
};

exports.get_respuestas_enviadas = (request, response, next) => {
    response.send('Respuestas enviadas');
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

//Obtener las areas, preguntas y opciones
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

// Obtener toda la prueba
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

// Procesar datos personales y pasar a la prueba
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
