// -----------------------------
// VARIABLES GLOBALES DE CONTROL
// -----------------------------
let serieActual = 1;
const totalSeries = 10;

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
// Marca el inicio de cada pregunta
let tiempoInicio;

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
    // Marcar las preguntas no respondidas con opcion=0
    // Esto es útil si se acaba el tiempo o el usuario no contestó.
    const preguntasFaltantes = preguntasActuales.slice(indicePregunta);
    const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

    preguntasFaltantes.forEach(p => {
        tiemposRespuestas.push({
            idPregunta: p.idPreguntaTerman,
            opcion: 0,
            tiempo: tiempoRespuesta
        });
    });
}

// ----------------------------
// ENVIAR RESPUESTAS AL SERVIDOR
// ----------------------------
function enviarRespuestas(respuestas) {
    const csrfToken = document.getElementById('_csrf').value;
    console.log("Token CSRF:", csrfToken);

    return fetch(`/aspirante/pruebas/responder/terman/serie/${serieActual}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrfToken
        },
        body: JSON.stringify({ respuestas })
    });
}

// ------------------------------------
// MOSTRAR INSTRUCCIONES DE LA SERIE
// ------------------------------------
function mostrarSerie(info) {
    // Recibimos data con { id, nombreSeccion, duracion, instruccion, preguntas[] }

    // Valor en segundos para esta serie
    tiempoSerie = info.duracion; 

    const cronometroElem = document.getElementById('cronometro');
    cronometroElem.innerText = '';
    cronometroElem.style.display = 'none';

    const instruccionesElem = document.getElementById('instrucciones-serie');
    instruccionesElem.innerHTML = `
        <h3>Serie ${info.id}: ${info.nombreSeccion}</h3>
        <p>${info.instruccion}</p>
        <p><strong>TIP</strong>: Si no deseas responder la pregunta, solo da click en "Siguiente" sin seleccionar ninguna opción.<p>
        <p><strong>Tiempo para esta serie: ${info.duracion} segundos</strong></p>
        <button id="comenzar-serie">Comenzar serie</button>
    `;
    
    // Limpia el contenedor de preguntas
    document.getElementById('preguntas-serie').innerHTML = '';

    // Al hacer clic en "Comenzar serie", se ocultan las instrucciones, se muestra el cronómetro y se inician las preguntas
    document.getElementById('comenzar-serie').addEventListener('click', () => {
        instruccionesElem.innerHTML = '';
        iniciarPreguntas(info.preguntas);
    });
}

// -------------------------------
// INICIAR LAS PREGUNTAS DE LA SERIE
// -------------------------------
function iniciarPreguntas(preguntas) {
    preguntasActuales = preguntas;
    indicePregunta = 0;
    tiemposRespuestas = [];

    // Iniciamos el cronómetro global
    iniciarCronometro(() => {
        // Se acabó el tiempo => forzamos terminar la serie y marcar pendientes con 0
        completarRespuestasFaltantes();
        finalizarSerie();
    });

    // Dependiendo de la serieActual, usamos una función distinta
    if (serieActual === 4) {
        mostrarPreguntaActualSerie4();
    } 
    else if (serieActual === 5) {
        // Un input text (una sola)
        mostrarPreguntaActualTexto();  
    }
    else if (serieActual === 10) {
        // Dos inputs text
        mostrarPreguntaActualDobleTexto(); 
    }
    else {
        // Lógica genérica: radio
        mostrarPreguntaActual(); 
    }
}

// -----------------------------------
// MOSTRAR PREGUNTAS SERIE GENÉRICA (RADIO)
// -----------------------------------
function mostrarPreguntaActual() {
    const pregunta = preguntasActuales[indicePregunta];
    const contenedor = document.getElementById('preguntas-serie');

    contenedor.innerHTML = `
        <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
        ${pregunta.opciones.map(op => `
            <label>
                <input type="radio" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                ${op.descripcionTerman}
            </label>
        `).join('<br>')}
        <br><button id="siguiente-pregunta">Siguiente</button>
    `;

    tiempoInicio = Date.now();

    document.getElementById('siguiente-pregunta').addEventListener('click', () => {
        const seleccion = document.querySelector(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
        const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

        if (seleccion) {
            tiemposRespuestas.push({
                idPregunta: pregunta.idPreguntaTerman,
                opcion: seleccion.value,
                tiempo: tiempoRespuesta
            });
        } else {
            // No contestó => guardamos opcion=0
            tiemposRespuestas.push({
                idPregunta: pregunta.idPreguntaTerman,
                opcion: 0,
                tiempo: tiempoRespuesta
            });
        }

        indicePregunta++;
        if (indicePregunta < preguntasActuales.length) {
            mostrarPreguntaActual();
        } else {
            finalizarSerie();
        }
    });
}

// --------------------------------
// MOSTRAR PREGUNTAS SERIE 4 (2 OPC)
// --------------------------------
function mostrarPreguntaActualSerie4() {
    const pregunta = preguntasActuales[indicePregunta];
    const contenedor = document.getElementById('preguntas-serie');
    const maxSelections = 2;

    contenedor.innerHTML = `
        <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
        ${pregunta.opciones.map(op => `
            <label>
                <input type="checkbox" name="respuesta_${pregunta.idPreguntaTerman}" value="${op.opcionTerman}">
                ${op.descripcionTerman}
            </label>
        `).join('<br>')}
        <br>
        <button id="siguiente-pregunta">Siguiente</button>
        <p id="error-seleccion" style="color: red;"></p>
    `;

    tiempoInicio = Date.now();

    // Restringir al usuario a máximo 2 checkboxes
    const checkboxes = contenedor.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]`);
    const errorSeleccion = contenedor.querySelector('#error-seleccion');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const seleccionados = contenedor.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
            if (seleccionados.length > maxSelections) {
                this.checked = false; 
                errorSeleccion.textContent = `Solo puedes seleccionar un máximo de ${maxSelections} opciones.`;
            } else {
                errorSeleccion.textContent = '';
            }
        });
    });

    document.getElementById('siguiente-pregunta').addEventListener('click', () => {
        const seleccionados = contenedor.querySelectorAll(`input[name="respuesta_${pregunta.idPreguntaTerman}"]:checked`);
        const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

        if (seleccionados.length > 0) {
            // Cada checkbox se empuja como una respuesta aparte con el mismo idPregunta
            seleccionados.forEach(cb => {
                tiemposRespuestas.push({
                    idPregunta: pregunta.idPreguntaTerman,
                    opcion: parseInt(cb.value, 10),
                    tiempo: tiempoRespuesta
                });
            });
        } else {
            // No seleccionó nada => enviamos 1 registro con opcion=0
            tiemposRespuestas.push({
                idPregunta: pregunta.idPreguntaTerman,
                opcion: 0,
                tiempo: tiempoRespuesta
            });
        }

        indicePregunta++;
        if (indicePregunta < preguntasActuales.length) {
            mostrarPreguntaActualSerie4();
        } else {
            finalizarSerie();
        }
    });
}

// ---------------------------------------------
// MOSTRAR PREGUNTAS SERIE 5 (CUADRO DE TEXTO)
// ---------------------------------------------
function mostrarPreguntaActualTexto() {
    const pregunta = preguntasActuales[indicePregunta];
    const contenedor = document.getElementById('preguntas-serie');

    contenedor.innerHTML = `
        <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
        <input type="text" id="respuestaTexto" placeholder="Escribe tu respuesta...">
        <br><button id="siguiente-pregunta">Siguiente</button>
    `;

    tiempoInicio = Date.now();

    document.getElementById('siguiente-pregunta').addEventListener('click', () => {
        const textInput = document.getElementById('respuestaTexto');
        const textoIngresado = textInput.value.trim();
        const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

        if (textoIngresado) {
            tiemposRespuestas.push({
                idPregunta: pregunta.idPreguntaTerman,
                opcion: textoIngresado,   
                tiempo: tiempoRespuesta
            });
        } else {
            // No ingresó nada => opcion = 0
            tiemposRespuestas.push({
                idPregunta: pregunta.idPreguntaTerman,
                opcion: 0,
                tiempo: tiempoRespuesta
            });
        }

        indicePregunta++;
        if (indicePregunta < preguntasActuales.length) {
            mostrarPreguntaActualTexto();
        } else {
            finalizarSerie();
        }
    });
}

// ---------------------------------------------
// SERIE 10: DOS CUADROS DE TEXTO
// ---------------------------------------------
function mostrarPreguntaActualDobleTexto() {
    const pregunta = preguntasActuales[indicePregunta];
    const contenedor = document.getElementById('preguntas-serie');

    // Aquí pedimos dos inputs
    contenedor.innerHTML = `
        <p>${pregunta.numeroPregunta}. ${pregunta.preguntaTerman}</p>
        <input type="text" id="respuestaTextoA" placeholder="[ número 1 ]">
        <input type="text" id="respuestaTextoB" placeholder="[ número 2 ]">
        <br><button id="siguiente-pregunta">Siguiente</button>
    `;

    tiempoInicio = Date.now();

    document.getElementById('siguiente-pregunta').addEventListener('click', () => {
        const textInputA = document.getElementById('respuestaTextoA');
        const textInputB = document.getElementById('respuestaTextoB');

        const textoA = textInputA.value.trim();
        const textoB = textInputB.value.trim();
        const tiempoRespuesta = Math.floor((Date.now() - tiempoInicio) / 1000);

        let textoFinal;
        if (textoA || textoB) {
            // Concatena los dos valores con un separador
            textoFinal = `${textoA || '0'} - ${textoB || '0'}`;
        } else {
            // No ingresó nada => opcion = 0
            textoFinal = '0 - 0';
        }

        tiemposRespuestas.push({
            idPregunta: pregunta.idPreguntaTerman,
            opcion: textoFinal,
            tiempo: tiempoRespuesta
        });

        indicePregunta++;
        if (indicePregunta < preguntasActuales.length) {
            mostrarPreguntaActualDobleTexto();
        } else {
            finalizarSerie();
        }
    });
}


// ------------------------------------
// FINALIZAR SERIE: ENVÍA RESPUESTAS
// ------------------------------------
function finalizarSerie() {
    clearInterval(intervalo);
    enviarRespuestas(tiemposRespuestas)
        .then(() => {
            serieActual++;
            if (serieActual <= totalSeries) {
                // Limpia contenedores
                document.getElementById('preguntas-serie').innerHTML = '';
                document.getElementById('instrucciones-serie').innerHTML = '';
                // Oculta cronómetro
                document.getElementById('cronometro').innerText = '';
                document.getElementById('cronometro').style.display = 'none';

                // Muestra instrucciones de la siguiente serie
                mostrarInstruccionesSiguienteSerie(serieActual);
            } else {
                alert("¡Has terminado la prueba!");
                window.location.href = "/inicio/aspirante";
            }
        })
        .catch(error => {
            console.error("Error al enviar respuestas:", error);
            alert("Hubo un error al guardar tus respuestas.");
        });
}

// -----------------------------------------------------
// MOSTRAR INSTRUCCIONES DE LA SIGUIENTE SERIE (FETCH)
// -----------------------------------------------------
function mostrarInstruccionesSiguienteSerie(idSerie) {
    fetch(`/aspirante/pruebas/responder/terman/serie/${idSerie}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const instruccionesElem = document.getElementById('instrucciones-serie');
        const cronometroElem = document.getElementById('cronometro');
        cronometroElem.innerText = '';
        cronometroElem.style.display = 'none';
        
        instruccionesElem.innerHTML = `
            <h3>Serie ${data.id}: ${data.nombreSeccion}</h3>
            <p>${data.instruccion}</p>
            <p><strong>Tiempo para esta serie: ${data.duracion} segundos</strong></p>
            <button id="comenzar-serie">Comenzar serie</button>
        `;
        document.getElementById('comenzar-serie').addEventListener('click', () => {
            instruccionesElem.innerHTML = '';
            tiempoSerie = data.duracion;
            iniciarPreguntas(data.preguntas);
        });
        
    })
    .catch(error => {
        console.error("Error al traer instrucciones de la siguiente serie:", error);
    });
}

// ----------------------------------
// EVENTOS INICIALES AL CARGAR LA VISTA
// ----------------------------------
document.getElementById('iniciar-prueba').addEventListener('click', () => {
    document.getElementById('adverencia-inicial').style.display = 'none';
    document.getElementById('contenedor-serie').style.display = 'block';
    traerSerie(serieActual);
});


document.getElementById('siguiente-serie') &&
document.getElementById('siguiente-serie').addEventListener('click', () => {
    const respuestas = []; 
    enviarRespuestas(respuestas)
        .then(() => {
            serieActual++;
            if (serieActual <= totalSeries) {
                traerSerie(serieActual);
            } else {
                alert("¡Has terminado la prueba!");
                window.location.href = "/inicio/aspirante";
            }
        })
        .catch(error => {
            console.error("Error al enviar respuestas:", error);
            alert("Hubo un error al guardar tus respuestas.");
        });
});
