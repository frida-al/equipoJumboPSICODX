
    // -----------------------------
    // VARIABLES GLOBALES DE CONTROL
    // -----------------------------
    let serieActual = 1;
    const totalSeries = 10;

    // Barra de progreso
    const preguntasTotales = 173;
    let preguntasRespondidas = 0;

    // Duración de la serie en segundos (recibido del backend)
    let tiempoSerie;        
    // Control del cronómetro global
    let tiempoRestante;     
    // Intervalo del setInterval
    let intervalo;          

    // Arrays y contadores para las preguntas de la serie
    let preguntasActuales = [];
    let indicePregunta = 0;
    // Almacena respuestas: [{ idPregunta, opcion, tiempo }, ...]
    let tiemposRespuestas = [];
    let serieFinalizada = false;
    let finalizandoSerie = false; // nueva bandera de exclusión

    // Marca el inicio de cada pregunta
    let tiempoInicio;

    // ----------------------------
    // PREVENCIÓN DE RECARGA Y RETROCESO
    // ----------------------------

    // Handler referenciable para beforeunload
    const handlerBeforeUnload = function (e) {
        e.preventDefault();
        e.returnValue = '';
    };

    function activarBloqueoDeSalida() {
        window.addEventListener('beforeunload', handlerBeforeUnload);
    }

    function desactivarBloqueoDeSalida() {
        window.removeEventListener('beforeunload', handlerBeforeUnload);
    }

    // Handler referenciable para popstate
    const handlerPopstate = function (event) {
        history.pushState(null, null, location.href);
    };

    function prevenirBotonAtras() {
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', handlerPopstate);
    }

    function permitirBotonAtras() {
        window.removeEventListener('popstate', handlerPopstate);
    }


    // ----------------------------
    // INICIO DEL CRONÓMETRO GLOBAL
    // ----------------------------

    function iniciarCronometro(callbackFin) {
        clearInterval(intervalo);
        const cronometroElem = document.getElementById('cronometro');

        // Asigna la duración recibida de la serie
        tiempoRestante = tiempoSerie; 
        cronometroElem.innerText = `Tiempo restante: ${tiempoRestante}s`;
        cronometroElem.style.display = 'block'; 

        intervalo = setInterval(() => {
            tiempoRestante--;
            cronometroElem.innerText = `Tiempo restante: ${tiempoRestante}s`;
            if (tiempoRestante <= 0) {
                clearInterval(intervalo);

                // Llama a la función que finaliza la serie si se agotó el tiempo
                callbackFin(); 
            }
        }, 1000);
    }

    // ----------------------------
    // BARRA DE PROGRESO
    // ----------------------------
    function actualizarProgresoGlobal() {
        const barra = document.getElementById('barra-progreso');
        const texto = document.getElementById('progreso-texto');

        const porcentaje = Math.round((preguntasRespondidas / preguntasTotales) * 100);

        barra.value = porcentaje;
        texto.innerText = `${porcentaje}% completado`;
    }

    function aumentarProgreso() {
        preguntasRespondidas++;
        actualizarProgresoGlobal();
    }

    // ---------------------
    // TRAER DATOS DE LA SERIE
    // ---------------------
    function traerSerie(idSerie) {
        fetch(`/aspirante/pruebas/responder/terman/serie/${idSerie}`, {
            method: 'GET',
            credentials: 'include',
        })
        .then(res => res.json())
        .then(info => {
            // Muestra las instrucciones + botón "Comenzar"
            mostrarSerie(info); 
        })
        .catch(error => {
            console.error("Error al traer la serie:", error);
        });
    }

    // ----------------------------
    // OBTENER RESPUESTAS RESTANTES
    // (para las preguntas que faltan cuando se acaba el tiempo)
    // ----------------------------
    function completarRespuestasFaltantes() {
        const preguntasFaltantes = preguntasActuales.slice(indicePregunta);
        const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
        const csrfToken = document.getElementById('_csrf').value;

        preguntasRespondidas += preguntasFaltantes.length;
        actualizarProgresoGlobal();

        // Separamos la última para enviarla al final
        const todasMenosLaUltima = preguntasFaltantes.slice(0, -1);
        const ultimaPregunta = preguntasFaltantes[preguntasFaltantes.length - 1];

        const promesas = todasMenosLaUltima.map(p => {
            return fetch(`/aspirante/pruebas/responder/terman/pregunta/${p.idPreguntaTerman}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'csrf-token': csrfToken
                },
                body: JSON.stringify({
                    serieActual,
                    respuesta: 0,
                    tiempo: tiempoRespuesta,
                    tiempoSerie: tiempoRestante
                })
            });
        });

        // Luego mandamos la última
        if (ultimaPregunta) {
            promesas.push(
                fetch(`/aspirante/pruebas/responder/terman/pregunta/${ultimaPregunta.idPreguntaTerman}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'csrf-token': csrfToken
                    },
                    body: JSON.stringify({
                        serieActual,
                        respuesta: 0,
                        tiempo: tiempoRespuesta,
                        tiempoSerie: tiempoRestante
                    })
                })
            );
        }
        return Promise.all(promesas);
    }


    // ------------------------------------
    // MOSTRAR INSTRUCCIONES DE LA SERIE
    // ------------------------------------
    function mostrarSerie(info) {
        tiempoSerie = info.duracion;
        mostrarInstruccionesSerie(
            info,
            `Tiempo para esta serie: ${info.duracion} segundos`,
            "Comenzar serie",
            () => iniciarPreguntas(info.preguntas)
        );
    }
    
    function mostrarInstruccionesSerie(info, tiempoVisible, textoBoton, callbackInicio) {
        const instruccionesElem = document.getElementById('instrucciones-serie');
        const cronometroElem = document.getElementById('cronometro');
        cronometroElem.innerText = '';
        cronometroElem.style.display = 'none';
    
        const extraInstruccion = (info.id === 4)
            ? '<p><strong>SELECCIONA 2 OPCIONES POR CADA PREGUNTA</strong></p>'
            : '';
    
        instruccionesElem.innerHTML = `
            <h3>Serie ${info.id}: ${info.nombreSeccion}</h3>
            <p>${info.instruccion}</p>
            <p><strong>TIP</strong>: Si no deseas responder la pregunta, solo da click en <strong>"No contestar"</strong>.<p>
            ${extraInstruccion}
            <div id="tiempo-boton">
                <p><strong>${tiempoVisible}</strong></p>
                <button id="comenzar-serie" class="button is-large has-text-white">${textoBoton}</button>
            </div>
        `;
    
        document.getElementById('preguntas-serie').innerHTML = '';
    
        document.getElementById('comenzar-serie').addEventListener('click', () => {
            document.getElementById('tiempo-boton').remove();
            callbackInicio();
        });
    }
    

    // -------------------------------
    // mostrarPreguntaDinamica
    // -------------------------------

    function mostrarPreguntaDinamica() {
        const pregunta = preguntasActuales[indicePregunta];
    
        const callback = () => {
            if (indicePregunta < preguntasActuales.length) {
                mostrarPreguntaDinamica();
            } else {
                finalizarSerie();
            }
        };
    
        if (serieActual === 4) {
            mostrarPregunta("checkbox", pregunta, callback);
        } else if (serieActual === 5) {
            mostrarPregunta("text", pregunta, callback);
        } else if (serieActual === 10) {
            mostrarPregunta("doubleText", pregunta, callback);
        } else {
            mostrarPregunta("radio", pregunta, callback);
        }
    }
    
    function finalizarSerie() {
        if (serieFinalizada || finalizandoSerie) return;
        finalizandoSerie = true;
    
        clearInterval(intervalo);
    
        completarRespuestasFaltantes()
            .then(() => {
                serieFinalizada = true;   // solo la primera en completarse marcará esto
                avanzarOSalir();
            })
            .catch(err => {
                console.error("Error al completar respuestas faltantes:", err);
                alert("Hubo un error al completar respuestas.");
            })
            .finally(() => {
                finalizandoSerie = false; // suelta la bandera aunque haya error
            });
    }
    

    function avanzarOSalir() {
        serieActual++;
        if (serieActual <= totalSeries) {
            traerSerie(serieActual);
        } else {
            desactivarBloqueoDeSalida();
            permitirBotonAtras();
            setTimeout(() => {
                alert("¡Has terminado la prueba!");
                window.location.href = "/inicio/aspirante";
            }, 100);
        }
    };

    // -------------------------------
    // INICIAR LAS PREGUNTAS DE LA SERIE
    // -------------------------------
    function iniciarPreguntas(preguntas, desde = 0) {
        preguntasActuales = preguntas;
        indicePregunta = desde;
        tiemposRespuestas = [];

        // RESETEO
        serieFinalizada = false;
        finalizandoSerie = false;

        iniciarCronometro(finalizarSerie);

        mostrarPreguntaDinamica();
    };

    // -----------------------------------
    // MOSTRAR PREGUNTAS SERIE GENÉRICA 
    // -----------------------------------
    function mostrarPregunta(tipo, pregunta, desdeCallback) {
        const contenedor = document.getElementById('preguntas-serie');
        tiempoInicio = Date.now();
    
        let contenido = `<p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>`;
        let eventoRegistro;
        if (tipo === "radio") {
            contenido += pregunta.opciones.map(op => `
                <label>
                    <input type="radio" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                    ${op.descripcionTerman}
                </label>
            `).join('<br>');
        }
    
        if (tipo === "checkbox") {
            contenido += pregunta.opciones.map(op => `
                <label>
                    <input type="checkbox" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                    ${op.descripcionTerman}
                </label>
            `).join('<br>');
        }
    
        if (tipo === "text") {
            contenido += `<input type="text" id="respuestaTexto" placeholder="Escribe tu respuesta..." pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">`;
        }
    
        if (tipo === "doubleText") {
            contenido += `
                <div id="serie10-input">
                    <input type="text" id="respuestaTextoA" placeholder="[ número 1 ]" pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">
                    <span class="separador"> - </span>
                    <input type="text" id="respuestaTextoB" placeholder="[ número 2 ]" pattern="[0-9.\\/]*" inputmode="decimal" autocomplete="off">
                </div>
            `;
        }
    
        contenido += `
            <p id="error-seleccion" style="color:red;"></p>
            <div class="botones-preguntas">
                <button id="no-contestar" class="button is-large has-text-white">No contestar</button>
                <button id="siguiente-pregunta" class="button is-large has-text-white" disabled>Siguiente</button>
            </div>
        `;
    
        contenedor.innerHTML = contenido;

        // Función de restricción para inputs
        function permitirSoloNumerosYPuntosDiagonal(event) {
            const regex = /^[0-9./\\]*$/;
            if (!regex.test(event.target.value)) {
                event.target.value = event.target.value.replace(/[^0-9./\\]/g, '');
            }
        }

        // Ahora SÍ puedes buscar los inputs y agregar validación
        if (tipo === "text") {
            const input = document.getElementById('respuestaTexto');
            input.addEventListener('input', permitirSoloNumerosYPuntosDiagonal);
        }

        if (tipo === "doubleText") {
            const inputA = document.getElementById('respuestaTextoA');
            const inputB = document.getElementById('respuestaTextoB');
            inputA.addEventListener('input', permitirSoloNumerosYPuntosDiagonal);
            inputB.addEventListener('input', permitirSoloNumerosYPuntosDiagonal);
        }
    
        const btnNoContestar = document.getElementById('no-contestar');
        const btnSiguiente = document.getElementById('siguiente-pregunta');
        const error = document.getElementById('error-seleccion');
    
        function procesar(opcion) {
            const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
            const csrfToken = document.getElementById('_csrf').value;
        
            fetch(`/aspirante/pruebas/responder/terman/pregunta/${pregunta.idPreguntaTerman}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'csrf-token': csrfToken
                },
                body: JSON.stringify({
                    serieActual,
                    respuesta: opcion,
                    tiempo: tiempoRespuesta,
                    tiempoSerie: tiempoRestante
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.estado === "OK") {
                    tiemposRespuestas.push({
                        idPregunta: pregunta.idPreguntaTerman,
                        opcion,
                        tiempo: tiempoRespuesta
                    });
        
                    aumentarProgreso();
                    indicePregunta++;
                    desdeCallback();
                } else {
                    console.error("Error al guardar respuesta:", data);
                }
            })
            .catch(err => {
                console.error("Error de red al guardar respuesta:", err);
            });
        }

        function procesarMultiple(opciones) {
            const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);
            const csrfToken = document.getElementById('_csrf').value;
        
            const promesas = opciones.map(opcion => 
                fetch(`/aspirante/pruebas/responder/terman/pregunta/${pregunta.idPreguntaTerman}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'csrf-token': csrfToken
                    },
                    body: JSON.stringify({
                        serieActual,
                        respuesta: opcion,
                        tiempo: tiempoRespuesta,
                        tiempoSerie: tiempoRestante
                    })
                })
            );
        
            Promise.all(promesas)
            .then(() => {
                tiemposRespuestas.push({
                    idPregunta: pregunta.idPreguntaTerman,
                    opcion: opciones.join(', '),
                    tiempo: tiempoRespuesta
                });
        
                aumentarProgreso();
                indicePregunta++;
                desdeCallback();
            })
            .catch(err => {
                console.error("Error de red al guardar respuestas múltiples:", err);
            });
        }

        // Agrega lógica específica por tipo
        if (tipo === "radio") {
            const radios = document.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    btnSiguiente.disabled = false;
                    error.textContent = '';
                });
            });
    
            btnSiguiente.addEventListener('click', () => {
                const seleccionado = document.querySelector(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
                if (!seleccionado) {
                    error.textContent = 'Selecciona una opción o usa "No contestar".';
                    return;
                }
                procesar(seleccionado.value);
            });
    
        } else if (tipo === "checkbox") {
            const maxSelections = 2;
            const checkboxes = document.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]`);
    
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const seleccionados = document.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
                    if (seleccionados.length > maxSelections) {
                        cb.checked = false;
                        error.textContent = `Máximo ${maxSelections} opciones.`;
                    } else {
                        btnSiguiente.disabled = !(seleccionados.length === maxSelections);
                        error.textContent = '';
                    }
                });
            });
    
            btnSiguiente.addEventListener('click', () => {
                const seleccionados = document.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
                if (seleccionados.length !== maxSelections) {
                    error.textContent = `Selecciona exactamente ${maxSelections} opciones.`;
                    return;
                }
            
                const opciones = Array.from(seleccionados).map(cb => cb.value);
                procesarMultiple(opciones);
            });
            
    
        } else if (tipo === "text") {
            const input = document.getElementById('respuestaTexto');
            input.addEventListener('input', () => {
                btnSiguiente.disabled = input.value.trim().length === 0;
                error.textContent = '';
            });
    
            btnSiguiente.addEventListener('click', () => {
                const val = input.value.trim();
                if (!val) {
                    error.textContent = 'Ingresa una respuesta o selecciona "No contestar".';
                    return;
                }
                procesar(val);
            });
    
        } else if (tipo === "doubleText") {
            const a = document.getElementById('respuestaTextoA');
            const b = document.getElementById('respuestaTextoB');
    
            [a, b].forEach(el => el.addEventListener('input', () => {
                btnSiguiente.disabled = !(a.value.trim() && b.value.trim());
                error.textContent = '';
            }));
    
            btnSiguiente.addEventListener('click', () => {
                if (!a.value.trim() || !b.value.trim()) {
                    error.textContent = 'Debes llenar ambos campos.';
                    return;
                }
                procesar(`${a.value.trim()} - ${b.value.trim()}`);
            });
        }
    
        // Omitir
        btnNoContestar.addEventListener('click', () => {
            const valorOmitido = (tipo === "doubleText") ? '0 - 0' : 0;
            procesar(valorOmitido);
        });
    }

    // ----------------------------------
    // EVENTOS INICIALES AL CARGAR LA VISTA
    // ----------------------------------
    document.getElementById('iniciar-prueba').addEventListener('click', () => {
    document.getElementById('advertencia-inicial').style.display = 'none';
    document.getElementById('contenedor-serie').style.display = 'block';

    activarBloqueoDeSalida();     
    prevenirBotonAtras();       

    // Nueva verificación de progreso
    fetch('/aspirante/pruebas/responder/terman/progreso-terman', {
    method: 'GET',
    credentials: 'include'
    })
        .then(res => {
        // Si el servidor me redirige, el fetch NO lo sigue como navegador
            if (res.redirected) {
                desactivarBloqueoDeSalida();
                window.location.href = res.url;
                return;
            }
            if (!res.ok) throw new Error("Progreso inválido");
            return res.json();
        })
    .then(data => {
    if (data.estado === "OK") {
        traerSerie(serieActual);
    } else {
        serieActual = data.serieActual;

        if (typeof data.ultimaPregunta == 'number'){
            ultimaPregunta = data.ultimaPregunta;
        } else {
            ultimaPregunta = 0;
        }

        tiempoRestante = data.tiempoRestante;
        cargarProgresoActual(serieActual, ultimaPregunta, tiempoRestante);
    }
    })
    .catch(err => {
    console.error("Error al cargar progreso:", err);
    });         
    });

    document.getElementById('volver-prueba').addEventListener('click', () => {
    window.history.back();
    });


        // ----------------------------------
        // cargarProgresoActual
        // ----------------------------------

        function cargarProgresoActual(serie, ultimaPreguntaRespondida, tiempoRestanteServidor) {
            fetch(`/aspirante/pruebas/responder/terman/serie/${serie}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                tiempoSerie = tiempoRestanteServidor;
        
                const preguntas = data.preguntas;
        
                let desde;
                if (ultimaPreguntaRespondida == 0) {
                    desde = 0;
                } else {
                    const index = preguntas.findIndex(p => p.idPreguntaTerman === ultimaPreguntaRespondida);
                    desde = index >= 0 ? index + 1 : 0;
                }

                // Actualizar barra de progreso
                preguntasRespondidas = ultimaPreguntaRespondida;
                actualizarProgresoGlobal();

                if (desde >= preguntas.length) {
                    finalizarSerie();
                    return;
                }

                // Mostrar instrucciones con botón de reanudación
                mostrarInstruccionesSerie(
                    data,
                    `Tiempo restante para esta serie: ${tiempoRestanteServidor} segundos`,
                    "Reanudar serie",
                    () => iniciarPreguntas(preguntas, desde)
                );
            })
            .catch(err => {
                console.error("Error al cargar serie con progreso:", err);
                alert("Ocurrió un error al recuperar tu progreso. Por favor intenta más tarde.");
            });
        }