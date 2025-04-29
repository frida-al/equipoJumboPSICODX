-- ========================================
-- Script de actualización de opciones para la prueba Terman
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- Descripción:
-- Este archivo elimina todos los registros existentes en la tabla `opcionesterman`
-- y los reemplaza con la versión actualizada que incluye letras en las descripciones
-- de cada opción (A), B), C), etc.), conforme a las nuevas instrucciones de formato.
--
-- Importante: Este script asume que la estructura de la tabla ya existe
-- y que únicamente se requiere limpiar e insertar los nuevos datos.
-- ========================================


-- Reiniciar las tablas completamente antes de insertar los nuevos datos
-- Esto elimina todos los registros y reinicia los contadores AUTO_INCREMENT

-- Borrar todo alv en orden de hijo a padre


DROP TABLE opcionesterman;
DROP TABLE respuestasterman;
DROP TABLE resultadosseriesterman;
DROP TABLE calificacionesterman;
-- DROP TABLE progresosterman; No tienen esta tabla.
DROP TABLE preguntasterman;
DROP TABLE seriesterman;

/*
    T E R M A N
    ---------------------------------------------------
*/
CREATE TABLE `seriesterman` (
  `idSerieTerman` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `idPrueba` int(11) NOT NULL,
  `duracion` int NOT NULL,
  `nombreSeccion` varchar(50) NOT NULL,
  `instruccion` longtext NOT NULL,
  FOREIGN KEY (`idPrueba`) REFERENCES `pruebas`(`idPrueba`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntasterman` (
  `idPreguntaTerman` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `idSerieTerman` int(11) NOT NULL,
  `numeroPregunta` int(11) NOT NULL,
  `preguntaTerman` varchar(500) NOT NULL,
  FOREIGN KEY (`idSerieTerman`) REFERENCES `seriesterman`(`idSerieTerman`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opcionesterman` (
  `idOpcionTerman` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `idPreguntaTerman` int(11) NOT NULL,
  `opcionTerman` int(11) NOT NULL,
  `descripcionTerman` varchar(100) NOT NULL,
  `esCorrecta` boolean NOT NULL,
  FOREIGN KEY (`idPreguntaTerman`) REFERENCES `preguntasterman`(`idPreguntaTerman`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respuestasterman` (
  `idRespuestaTerman` int(11) PRIMARY KEY AUTO_INCREMENT,
  `idAspirante` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  `idPreguntaTerman` int(11) NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `respuestaAbierta` varchar(500) NOT NULL,
  `tiempoRespuesta` int NOT NULL,
  FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
  FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`),
  FOREIGN KEY (`idPreguntaTerman`) REFERENCES `preguntasterman`(`idPreguntaTerman`),
  FOREIGN KEY (`idPrueba`) REFERENCES `pruebas`(`idPrueba`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

/*
    Creación de progresosTerman
    ---------------------------------------------------
*/

CREATE TABLE `progresosterman` (
  `idProgresoTerman` int(11) PRIMARY KEY AUTO_INCREMENT,
  `idAspirante` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  `idSerieTermanActual` int(11) NULL,
  `idPreguntaTerman` int(11) NULL,
  `tiempoRestante` int(11) NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
  FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`),
  FOREIGN KEY (`idSerieTermanActual`) REFERENCES `seriesterman`(`idSerieTerman`),
  FOREIGN KEY (`idPreguntaTerman`) REFERENCES `preguntasterman`(`idPreguntaTerman`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*
    Creación de calificacionesTerman
    ---------------------------------------------------
*/
CREATE TABLE `calificacionesterman` (
    `idCalificacionTerman` int(11) PRIMARY KEY AUTO_INCREMENT,
    `idAspirante` int(11) NOT NULL,
    `idGrupo` int(11) NOT NULL,
    `puntosTotales` int(11) NOT NULL,
    `rango` varchar(500) NOT NULL,
    `coeficienteIntelectual` int(11) NOT NULL,
    FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
    FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



/*
    Creación de resultadosSeriesTerman
    ---------------------------------------------------
*/

CREATE TABLE `resultadosseriesterman` (
  `idResultadoSerieTerman` int(11) PRIMARY KEY AUTO_INCREMENT,
  `idAspirante` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  `idSerieTerman` int(11) NOT NULL,
  `idCalificacionTerman` int(11) NOT NULL,
  `categoria` varchar(500) NOT NULL,
  `puntuacion` int NOT NULL,
  `rango` varchar(500) NOT NULL,
  FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
  FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`),
  FOREIGN KEY (`idSerieTerman`) REFERENCES `seriesterman`(`idSerieTerman`),
  FOREIGN KEY (`idCalificacionTerman`) REFERENCES `calificacionesterman`(`idCalificacionTerman`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Script Para cargar todo lo que tiene que ver con Terman

-- Archivo para introducir las series de Terman en el catálogo seriesTerman

INSERT INTO seriesterman( idSerieTerman, idPrueba, duracion, nombreSeccion, instruccion)
VALUES
-- Serie 1
(1, 4, 120, 'Información y conocimientos', 'Selecciona la letra correspondiente a la palabra que complete correctamente la oración.'),
-- Serie 2
(2, 4, 120, 'Comprensión', 'Lea cada cuestión y seleccione la letra correspondiente a la mejor respuesta.'),
-- Serie 3
(3, 4, 120, 'Significados verbales', 'Cuando las dos palabras signifiquen lo mismo, seleccione Igual, cuando signifique lo opuesto, seleccione Opuesto.'),
-- Serie 4
(4, 4, 180, 'Selección lógica', 'Seleccione dos letras correspondientes a las dos palabras que indican algo que siempre
tiene el sujeto, seleccione dos para cada renglón. No importa el orden.'),
-- Serie 5
(5, 4, 300, 'Aritmética', 'Encuentre las respuestas lo más pronto posible. Escriba en el espacio de respuesta. Solo acepta números.'),
-- Serie 6
(6, 4, 120, 'Juicio práctico', 'Anote la respuesta correcta.'),
-- Serie 7
(7, 4, 120, 'Analogías', 'Seleccione la letra correspondiente a la palabra que complete correctamente la oración.'),
-- Serie 8
(8, 4, 180, 'Ordenamiento de frases', 'Las palabras de cada una de las oraciones siguientes están mezcladas, ordene cada una de las oraciones si el
significado de la oración es verdadero, seleccione Verdadero; si el significado es falso, seleccione Falso.'),
-- Serie 9
(9, 4, 120, 'Clasificación', 'Ponga la letra que no corresponda con los demás del renglón.'),
-- Serie 10
(10, 4, 240, 'Seriación', 'En cada renglón procure encontrar como están hechas las series después escriba en los espacios de respuesta, los
dos números que deban seguir en cada serie. Solo acepta números.');  

-- Archivo para introducir las preguntas de Terman en el catálogo preguntasTerman

INSERT INTO preguntasterman(idPreguntaTerman,idSerieTerman, numeroPregunta, preguntaTerman)
VALUES

-- Serie 1:

(1, 1, 1, 'La gasolina se extrae de: '),
(2, 1, 2, 'Una tonelada tiene: '),
(3, 1, 3, 'La mayoría de nuestras exportaciones salen por: '),
(4, 1, 4, 'El nervio óptico sirve para: '),
(5, 1, 5, 'El café es una especie de: '),
(6, 1, 6, 'El jamón es carne de: '),
(7, 1, 7, 'La laringe está en: '),
(8, 1, 8, 'La guillotina causa la: '),
(9, 1, 9, 'La grúa se usa para: '),
(10, 1, 10, 'Un figura de seis lados se llama: '),
(11, 1, 11, 'El kilowatt mide:' ),
(12, 1, 12, 'La pauta se usa en: '),
(13, 1, 13, 'Las esmeraldas son: '),
(14, 1, 14, 'El metro es aproximadamente igual a: '),
(15, 1, 15, 'Las esponjas se obtienen de: '),
(16, 1, 16, 'Fraude es un término usado en: '),

-- Serie 2:

(17, 2, 1, 'Si la tierra estuviera más cerca del sol: '),
(18, 2, 2, 'Los rayos de una rueda están frecuentemente hechos de nogal porque: '),
(19, 2, 3, 'Un tren se detiene con más dificultad que un automóvil porque: '),
(20, 2, 4, 'El dicho "A golpecitos se derriba un roble", quiere decir: '),
(21, 2, 5, 'El dicho "Una olla vigilada nunca hierve", quiere decir: '),
(22, 2, 6, 'El dicho "Siembra pasto mientras haya sol", quiere decir: '),
(23, 2, 7, 'El dicho "Zapatero a tus zapatos", quiere decir: '),
(24, 2, 8, 'El dicho: "La cuña para que apriete debe de ser del mismo palo" quiere decir: '),
(25, 2, 9, 'Un acorazado de acero flota porque: '),
(26, 2, 10, 'Las plumas de las alas ayudan al pájaro a volar porque: '),
(27, 2, 11, 'El dicho: "Una golondrina no hace verano", quiere decir: '),

-- Serie 3:

(28, 3, 1,'Salado - Dulce'),
(29, 3, 2,'Alegrarse - Regocijarse'),
(30, 3, 3,'Mayor - Menor'),
(31, 3, 4,'Sentarse - Pararse'),
(32, 3, 5,'Desperdiciar - Aprovechar'),
(33, 3, 6,'Conceder - Negar'),
(34, 3, 7,'Tónico - Estimulante'),
(35, 3, 8,'Rebajar - Denigrar'),
(36, 3, 9,'Prohibir - Permitir'),
(37, 3, 10,'Osadía - Audaz'),
(38, 3, 11,'Arrebatado - Prudente'),
(39, 3, 12,'Obtuso - Agudo'),
(40, 3, 13,'Inepto - Experto'),
(41, 3, 14,'Esquivar - Rehuir'),
(42, 3, 15,'Rebelarse - Someterse'),
(43, 3, 16,'Monotonía - Variedad'),
(44, 3, 17,'Confrontar - Consolar'),
(45, 3, 18,'Expeler - Retener'),
(46, 3, 19,'Dócil - Sumiso'),
(47, 3, 20,'Transitorio - Permanente'),
(48, 3, 21,'Seguridad - Riesgo'),
(49, 3, 22,'Aprobar - Objetar'),
(50, 3, 23,'Expeler - Arrojar'),
(51, 3, 24,'Engaño - Impostura'),
(52, 3, 25,'Mitigar - Apaciguar'),
(53, 3, 26,'Incitar - Aplacar'),
(54, 3, 27,'Reverencia - Veneración'),
(55, 3, 28,'Sobriedad - Frugalidad'),
(56, 3, 29,'Aumentar - Menguar'),
(57, 3, 30,'Incitar - Instigar'),

-- Serie 4:

(58, 4, 1,'UN CIRCULO tiene siempre:'),
(59, 4, 2,'UN PAJARO tiene siempre:'),
(60, 4, 3,'LA MUSICA tiene siempre:'),
(61, 4, 4,'UN BANQUETE tiene siempre:'),
(62, 4, 5,'UN CABALLO tiene siempre:'),
(63, 4, 6,'UN JUEGO tiene siempre:'),
(64, 4, 7,'UN OBJETO tiene siempre:'),
(65, 4, 8,'UNA CONVERSACION tiene siempre:'),
(66, 4, 9,'UNA DEUDA tiene siempre:'),
(67, 4, 10,'UN CIUDADANO tiene siempre:'),
(68, 4, 11,'UN MUSEO tiene siempre:'),
(69, 4, 12,'UN COMPROMISO implica siempre:'),
(70, 4, 13,'UN BOSQUE tiene siempre:'),
(71, 4, 14,'LOS OBSTACULOS tienen siempre:'),
(72, 4, 15,'EL ABORRECIMIENTO tiene siempre:'),
(73, 4, 16,'UNA REVISTA tiene siempre:'),
(74, 4, 17,'LA CONTROVERSIA implica siempre:'),
(75, 4, 18,'UN BARCO tiene siempre:'),

-- Serie 5:

(76, 5, 1,'A 2 por 5 centavos, ¿Cuántos lápices pueden comprarse con 50 centavos?'),
(77, 5, 2,'¿Cuántas horas tardará un automóvil en recorrer 660 kilómetros a la velocidad de 60 kilómetros por hora?'),
(78, 5, 3,'Si un hombre gana $20.00 diarios y gasta $14.00 ¿cuántos días tardará en ahorrar $ 300.00?'),
(79, 5, 4,'Si dos pasteles cuestan $ 0.60, ¿cuántos centavos cuesta la sexta parte de un pastel?'),
(80, 5, 5,'¿Cuántas veces más es 2 X 3 X 4 X 5, que 3 X 4?'),
(81, 5, 6,'¿Cuánto es el 16 por ciento de 120?'),
(82, 5, 7,'El cuatro por ciento de $ 1,000 es igual al ocho por ciento de ¿qué cantidad?'),
(83, 5, 8,'La capacidad de un refrigerador rectangular es de 48 metros cúbicos. Si tiene seis metros de largo por cuatro de ancho, ¿cuál es su altura?'),
(84, 5, 9,'Si 7 hombres hacen un pozo de 40 metros en dos días, ¿cuántos hombres se necesitan para hacerlo en medio día?'),
(85, 5, 10,'A, tiene $180.00; B, tiene 2/3 de lo que tiene A; C 1/2 de lo que tiene B, ¿cuánto tienen todos juntos?'),
(86, 5, 11,'Si un hombre corre 100 metros en 10 segundos, ¿cuántos metros recorrerá como promedio en 1/5 de segundo?'),
(87, 5, 12,'Un hombre gasta ¼ de su sueldo en casa y alimentos y 4/8 en otros gastos, ¿qué tanto por ciento de su sueldo ahorra?'),

-- Serie 6:

(88, 6, 1,'La higiene, ¿es esencial para la salud?'),
(89, 6, 2,'Los taquígrafos, ¿usan el microscopio?'),
(90, 6, 3,'Los tiranos, ¿son justos con sus inferiores?'),
(91, 6, 4,'Las personas desamparadas, ¿están sujetas con frecuencia a la caridad?'),
(92, 6, 5,'Las personas venerables, ¿son por lo común respetadas?'),
(93, 6, 6,'Es el escorbuto, ¿un medicamento?'),
(94, 6, 7,'Es la amonestación, ¿una clase de instrumento musical?'),
(95, 6, 8,'Son los colores opacos, ¿preferidos por las banderas nacionales?'),
(96, 6, 9,'Las cosas misteriosas, ¿son, a veces, pavorosas?'),
(97, 6, 10,'Las personas conscientes, ¿cometen alguna vez errores?'),
(98, 6, 11,'¿Son carnívoros los carneros?'),
(99, 6, 12,'¿Se dan asignaturas a los caballos?'),
(100, 6, 13,'Las cartas anónimas, ¿llevan alguna vez firma de quien las escribe?'),
(101, 6, 14,'¿Son discontinuos los sonidos intermitentes?'),
(102, 6, 15,'Las enfermedades, ¿estimulan el buen juicio?'),
(103, 6, 16,'¿Son siempre perversos los hechos premeditados?'),
(104, 6, 17,'El contacto social, ¿tiende a reducir la timidez?'),
(105, 6, 18,'¿Son enfermas las personas que tienen mal carácter?'),
(106, 6, 19,'Se caracteriza generalmente el rencor, ¿por la persistencia?'),
(107, 6, 20,'Meticuloso ¿quiere decir lo mismo que cuidadoso?'),

-- Serie 7:

(108, 7, 1,'ABRIGO es a USAR como el PAN es a:'),
(109, 7, 2,'SEMANA es a MES como MES es a:'),
(110, 7, 3,'LEON es a ANIMAL como ROSA es a:'),
(111, 7, 4,'LIBERTAD es a INDEPENDENCIA como CAUTIVERIO es a:'),
(112, 7, 5,'DECIR es a DIJO como ESTAR es a: '),
(113, 7, 6,'LUNES es a MARTES como VIERNES es a:'),
(114, 7, 7,'PLOMO es a PESADO como CORCHO es a:'),
(115, 7, 8,'EXITO es a ALEGRIA como FRACASO es a:'),
(116, 7, 9,'GATO es a TIGRE como PERRO es a:'),
(117, 7, 10,'4 es a 16 como 5 es a:'),
(118, 7, 11,'LLORAR es a REIR como TRISTE es a:'),
(119, 7, 12,'VENENO es a MUERTE como ALIMENTO es a:'),
(120, 7, 13,'1 es a 3 como 9 es a:'),
(121, 7, 14,'ALIMENTO es a HAMBRE como AGUA es a:'),
(122, 7, 15,'AQUI es a ALLI como ESTE es a:'),
(123, 7, 16,'TIGRE es a PELO como TRUCHA es a:'),
(124, 7, 17,'PERVERTIDO es a DEPRAVADO como INCORRUPTO es a:'),
(125, 7, 18,'B es a D como SEGUNDO es a:'),
(126, 7, 19,'ESTADO es a GOBERNADOR como EJERCITO es a:'),
(127, 7, 20,'SUJETO es a PREDICADO como NOMBRE es a:'),

-- Serie 8:

(128, 8, 1,'con crecen los niños edad la'),
(129, 8, 2,'buena mar beber el para agua de es'),
(130, 8, 3,'lo es paz la guerra opuesta la a'),
(131, 8, 4,'caballos automóvil un que caminan los despacio más'),
(132, 8, 5,'consejo a veces es buen seguir un difícil'),
(133, 8, 6,'cuatrocientos todas páginas contienen libros los'),
(134, 8, 7,'crecen las que fresas el roble más'),
(135, 8, 8,'verdadera la comparada no puede amistad ser'),
(136, 8, 9,'envidia la perjudicial gula son y la'),
(137, 8, 10,'nunca acciones premiadas las deben buenas ser'),
(138, 8, 11,'exteriores engañan nunca apariencias las nos'),
(139, 8, 12,'nunca es hombre las que acciones demuestran un lo'),
(140, 8, 13,'ciertas siempre muerte de causan clases enfermedades'),
(141, 8, 14,'odio indeseables aversión sentimientos el son y la'),
(142, 8, 15,'frecuentemente por juzgar podemos acciones hombres nosotros sus a los'),
(143, 8, 16,'una es sábana sarapes tan nunca los caliente como'),
(144, 8, 17,'nunca que descuidados los tropiezan son'),

-- Serie 9:

(145, 9, 1,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(146, 9, 2,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(147, 9, 3,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(148, 9, 4,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(149, 9, 5,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(150, 9, 6,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(151, 9, 7,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(152, 9, 8,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(153, 9, 9,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(154, 9, 10,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(155, 9, 11,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(156, 9, 12,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(157, 9, 13,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(158, 9, 14,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(159, 9, 15,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(160, 9, 16,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(161, 9, 17,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),
(162, 9, 18,'Ponga la letra de la palabra que no corresponda con las demás del renglón'),

-- Serie 10:

(163, 10, 1,'Serie: 8  -  7  -  6  -  5  -  4  -  3'),
(164, 10, 2,'Serie: 3  -  8  -  13  -  18  -  23  -  28'),
(165, 10, 3,'Serie: 1  -  2  -  4  -  8  -  16  -  32'),
(166, 10, 4,'Serie: 8  -  8  -  6  -  6  -  4  -  4'),
(167, 10, 5,'Serie: 11.3/4  -  12  -  12.1/4  -  12.1/2  -  12.3/4'),
(168, 10, 6,'Serie: 8  -  9  -  12  -  13  -  16  -  17'),
(169, 10, 7,'Serie: 16  -  8  -  4  -  2  -  1  -  1/2'),
(170, 10, 8,'Serie: 31.3  -  40.3  -  49.3  -  58.3  -  67.3  -  76.3'),
(171, 10, 9,'Serie: 3  -  5  -  4  -  6  -  5  -  7'),
(172, 10, 10,'Serie: 7  -  11  -  15  -  16  -  20  -  24  -  25  -  29'),
(173, 10, 11,'Serie: 1/25  -  1/5  -  1  -  5');

-- Archivo para introducir las opciones de las preguntas en el catálogo opcionesTerman

-- ========================================
-- Actualización completa de opcionesTerman - SERIE 1
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- ========================================
-- Requiere que se haya hecho DROP e INSERT limpio de la tabla
-- ========================================

INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(1, 1, 'A) Granos', FALSE),
(1, 2, 'B) Petróleo', TRUE),
(1, 3, 'C) Trementina', FALSE),
(1, 4, 'D) Semillas', FALSE),

(2, 1, 'A) 1,000 kgs.', TRUE),
(2, 2, 'B) 2,000 kgs.', FALSE),
(2, 3, 'C) 3,000 kgs.', FALSE),
(2, 4, 'D) 4,000 kgs.', FALSE),

(3, 1, 'A) Mazatlán', FALSE),
(3, 2, 'B) Acapulco', TRUE),
(3, 3, 'C) Progreso', FALSE),
(3, 4, 'D) Veracruz', FALSE),

(4, 1, 'A) Ver', TRUE),
(4, 2, 'B) Oír', FALSE),
(4, 3, 'C) Probar', FALSE),
(4, 4, 'D) Sentir', FALSE),

(5, 1, 'A) Corteza', FALSE),
(5, 2, 'B) Fruto', TRUE),
(5, 3, 'C) Hojas', FALSE),
(5, 4, 'D) Raíz', FALSE),

(6, 1, 'A) Carnero', FALSE),
(6, 2, 'B) Vaca', FALSE),
(6, 3, 'C) Gallina', FALSE),
(6, 4, 'D) Cerdo', TRUE),

(7, 1, 'A) Abdomen', FALSE),
(7, 2, 'B) Cabeza', FALSE),
(7, 3, 'C) Garganta', TRUE),
(7, 4, 'D) Espalda', FALSE),

(8, 1, 'A) Muerte', TRUE),
(8, 2, 'B) Enfermedad', FALSE),
(8, 3, 'C) Fiebre', FALSE),
(8, 4, 'D) Malestar', FALSE),

(9, 1, 'A) Perforar', FALSE),
(9, 2, 'B) Cortar', FALSE),
(9, 3, 'C) Levantar', TRUE),
(9, 4, 'D) Exprimir', FALSE),

(10, 1, 'A) Pentágono', FALSE),
(10, 2, 'B) Paralelogramo', FALSE),
(10, 3, 'C) Hexágono', TRUE),
(10, 4, 'D) Trapecio', FALSE),

(11, 1, 'A) Lluvia', FALSE),
(11, 2, 'B) Viento', FALSE),
(11, 3, 'C) Electricidad', TRUE),
(11, 4, 'D) Presión', FALSE),

(12, 1, 'A) Agricultura', FALSE),
(12, 2, 'B) Música', TRUE),
(12, 3, 'C) Fotografía', FALSE),
(12, 4, 'D) Estenografía', FALSE),

(13, 1, 'A) Azules', FALSE),
(13, 2, 'B) Verdes', TRUE),
(13, 3, 'C) Rojas', FALSE),
(13, 4, 'D) Amarillas', FALSE),

(14, 1, 'A) Pie', FALSE),
(14, 2, 'B) Pulgada', FALSE),
(14, 3, 'C) Yarda', TRUE),
(14, 4, 'D) Milla', FALSE),

(15, 1, 'A) Animales', TRUE),
(15, 2, 'B) Yerbas', FALSE),
(15, 3, 'C) Bosques', FALSE),
(15, 4, 'D) Minas', FALSE),

(16, 1, 'A) Medicina', FALSE),
(16, 2, 'B) Teología', FALSE),
(16, 3, 'C) Leyes', TRUE),
(16, 4, 'D) Pedagogía', FALSE);

-- ========================================
-- Actualización completa de opcionesTerman - SERIE 2
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- ========================================

INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(17, 1, 'A) Las estrellas desaparecerían', FALSE),
(17, 2, 'B) Los meses serían más largos', FALSE),
(17, 3, 'C) La Tierra estaría más caliente', TRUE),

(18, 1, 'A) El nogal es fuerte', TRUE),
(18, 2, 'B) Se corta fácilmente', FALSE),
(18, 3, 'C) Sus frenos no son buenos', FALSE),

(19, 1, 'A) Tiene más rueda', FALSE),
(19, 2, 'B) Es más pesado', TRUE),
(19, 3, 'C) Sus frenos no son buenos', FALSE),

(20, 1, 'A) Que los robles son débiles', FALSE),
(20, 2, 'B) Que son mejores los golpes pequeños', FALSE),
(20, 3, 'C) Que el esfuerzo constante logra resultados sorprendentes', TRUE),

(21, 1, 'A) Que no debemos vigilarla, cuando este en el fuego', FALSE),
(21, 2, 'B) Que tarda en hervir', FALSE),
(21, 3, 'C) Que el tiempo se alarga cuando esperamos', TRUE),

(22, 1, 'A) Que el pasto se siembra en el verano', FALSE),
(22, 2, 'B) Que debemos aprovechar nuestras oportunidades', TRUE),
(22, 3, 'C) Que el pasto no debe cortarse esta noche', FALSE),

(23, 1, 'A) Que un zapatero no debe abandonar sus zapatos', FALSE),
(23, 2, 'B) Que los zapateros no deben estar ociosos', FALSE),
(23, 3, 'C) Que debemos trabajar en lo que podemos hacer mejor', TRUE),

(24, 1, 'A) Que el palo sirve para apretar', FALSE),
(24, 2, 'B) Que las cuñas siempre son de madera', FALSE),
(24, 3, 'C) Nos exigen más las personas que nos conocen', TRUE),

(25, 1, 'A) La máquina lo hace flotar', FALSE),
(25, 2, 'B) Porque tiene grandes espacios huecos', TRUE),
(25, 3, 'C) Contiene algo de madera', FALSE),

(26, 1, 'A) Las alas ofrecen una amplia superficie ligera', TRUE),
(26, 2, 'B) Mantien el aire fuera del cuerpo', FALSE),
(26, 3, 'C) Disminuyen su peso', FALSE),

(27, 1, 'A) Que las golondrinas regresan', FALSE),
(27, 2, 'B) Que un simple dato no es suficiente', TRUE),
(27, 3, 'C) Que los pájaros se agregan a nuestros planes de verano', FALSE);

-- SERIE 3 (Antónimos - todas tienen solo 2 opciones)
INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(28, 1, 'Opuesto', TRUE), (28, 2, 'Igual', FALSE),
(29, 1, 'Opuesto', FALSE), (29, 2, 'Igual', TRUE),
(30, 1, 'Opuesto', TRUE), (30, 2, 'Igual', FALSE),
(31, 1, 'Opuesto', TRUE), (31, 2, 'Igual', FALSE),
(32, 1, 'Opuesto', TRUE), (32, 2, 'Igual', FALSE),
(33, 1, 'Opuesto', TRUE), (33, 2, 'Igual', FALSE),
(34, 1, 'Opuesto', FALSE), (34, 2, 'Igual', TRUE),
(35, 1, 'Opuesto', FALSE), (35, 2, 'Igual', TRUE),
(36, 1, 'Opuesto', TRUE), (36, 2, 'Igual', FALSE),
(37, 1, 'Opuesto', FALSE), (37, 2, 'Igual', TRUE),
(38, 1, 'Opuesto', TRUE), (38, 2, 'Igual', FALSE),
(39, 1, 'Opuesto', TRUE), (39, 2, 'Igual', FALSE),
(40, 1, 'Opuesto', TRUE), (40, 2, 'Igual', FALSE),
(41, 1, 'Opuesto', FALSE), (41, 2, 'Igual', TRUE),
(42, 1, 'Opuesto', TRUE), (42, 2, 'Igual', FALSE),
(43, 1, 'Opuesto', TRUE), (43, 2, 'Igual', FALSE),
(44, 1, 'Opuesto', FALSE), (44, 2, 'Igual', TRUE),
(45, 1, 'Opuesto', TRUE), (45, 2, 'Igual', FALSE),
(46, 1, 'Opuesto', FALSE), (46, 2, 'Igual', TRUE),
(47, 1, 'Opuesto', TRUE), (47, 2, 'Igual', FALSE),
(48, 1, 'Opuesto', TRUE), (48, 2, 'Igual', FALSE),
(49, 1, 'Opuesto', TRUE), (49, 2, 'Igual', FALSE),
(50, 1, 'Opuesto', FALSE), (50, 2, 'Igual', TRUE),
(51, 1, 'Opuesto', FALSE), (51, 2, 'Igual', TRUE),
(52, 1, 'Opuesto', FALSE), (52, 2, 'Igual', TRUE),
(53, 1, 'Opuesto', TRUE), (53, 2, 'Igual', FALSE),
(54, 1, 'Opuesto', FALSE), (54, 2, 'Igual', TRUE),
(55, 1, 'Opuesto', FALSE), (55, 2, 'Igual', TRUE),
(56, 1, 'Opuesto', TRUE), (56, 2, 'Igual', FALSE),
(57, 1, 'Opuesto', FALSE), (57, 2, 'Igual', TRUE);

-- ========================================
-- Actualización completa de opcionesTerman - SERIE 4
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- Descripción: Selecciona las 2 palabras que sí corresponden
-- ========================================

INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(58, 1, 'A) Altura', FALSE),
(58, 2, 'B) Circunferencia', TRUE),
(58, 3, 'C) Latitud', FALSE),
(58, 4, 'D) Longitud', FALSE),
(58, 5, 'E) Radio', TRUE),

(59, 1, 'A) Huesos', TRUE),
(59, 2, 'B) Huevos', FALSE),
(59, 3, 'C) Pico', TRUE),
(59, 4, 'D) Nido', FALSE),
(59, 5, 'E) Canto', FALSE),

(60, 1, 'A) Oyente', FALSE),
(60, 2, 'B) Piano', FALSE),
(60, 3, 'C) Ritmo', TRUE),
(60, 4, 'D) Sonido', TRUE),
(60, 5, 'E) Violin', FALSE),

(61, 1, 'A) Alimentos', TRUE),
(61, 2, 'B) Música', FALSE),
(61, 3, 'C) Personas', TRUE),
(61, 4, 'D) Discursos', FALSE),
(61, 5, 'E) Anfitrión', FALSE),

(62, 1, 'A) Arnés', FALSE),
(62, 2, 'B) Cascos', TRUE),
(62, 3, 'C) Herraduras', FALSE),
(62, 4, 'D) Establo', FALSE),
(62, 5, 'E) Cola', TRUE),

(63, 1, 'A) Cartas', FALSE),
(63, 2, 'B) Multas', FALSE),
(63, 3, 'C) Jugadores', TRUE),
(63, 4, 'D) Castigos', FALSE),
(63, 5, 'E) Reglas', TRUE),

(64, 1, 'A) Calor', FALSE),
(64, 2, 'B) Tamaño', TRUE),
(64, 3, 'C) Sabor', FALSE),
(64, 4, 'D) Valor', FALSE),
(64, 5, 'E) Peso', TRUE),

(65, 1, 'A) Acuerdos', FALSE),
(65, 2, 'B) Personas', TRUE),
(65, 3, 'C) Preguntas', FALSE),
(65, 4, 'D) Ingenio', FALSE),
(65, 5, 'E) Palabras', TRUE),

(66, 1, 'A) Acreedor', TRUE),
(66, 2, 'B) Deudor', TRUE),
(66, 3, 'C) Interés', FALSE),
(66, 4, 'D) Hipoteca', FALSE),
(66, 5, 'E) Pago', FALSE),

(67, 1, 'A) País', TRUE),
(67, 2, 'B) Ocupación', FALSE),
(67, 3, 'C) Derechos', TRUE),
(67, 4, 'D) Propiedad', FALSE),
(67, 5, 'E) Voto', FALSE),

(68, 1, 'A) Animales', FALSE),
(68, 2, 'B) Orden', TRUE),
(68, 3, 'C) Colecciones', TRUE),
(68, 4, 'D) Minerales', FALSE),
(68, 5, 'E) Visitantes', FALSE),

(69, 1, 'A) Obligación', TRUE),
(69, 2, 'B) Acuerdo', TRUE),
(69, 3, 'C) Amistad', FALSE),
(69, 4, 'D) Respeto', FALSE),
(69, 5, 'E) Satisfacción', FALSE),

(70, 1, 'A) Animales', FALSE),
(70, 2, 'B) Flores', FALSE),
(70, 3, 'C) Sombra', TRUE),
(70, 4, 'D) Maleza', FALSE),
(70, 5, 'E) Árboles', TRUE),

(71, 1, 'A) Dificultad', TRUE),
(71, 2, 'B) Desaliento', FALSE),
(71, 3, 'C) Fracaso', FALSE),
(71, 4, 'D) Impedimento', TRUE),
(71, 5, 'E) Estímulo', FALSE),

(72, 1, 'A) Aversión', TRUE),
(72, 2, 'B) Desagrado', TRUE),
(72, 3, 'C) Temor', FALSE),
(72, 4, 'D) Ira', FALSE),
(72, 5, 'E) Timidez', FALSE),

(73, 1, 'A) Anuncios', FALSE),
(73, 2, 'B) Papel', TRUE),
(73, 3, 'C) Fotografías', FALSE),
(73, 4, 'D) Grabados', FALSE),
(73, 5, 'E) Impresión', TRUE),

(74, 1, 'A) Argumento', TRUE),
(74, 2, 'B) Desargumentos', TRUE),
(74, 3, 'C) Aversión', FALSE),
(74, 4, 'D) Público', FALSE),
(74, 5, 'E) Resúmen', FALSE),

(75, 1, 'A) Máquina', FALSE),
(75, 2, 'B) Cañones', FALSE),
(75, 3, 'C) Quilla', TRUE),
(75, 4, 'D) Timón', TRUE),
(75, 5, 'E) Velas', FALSE);

-- SERIE 5 (Problemas aritméticos - cada pregunta tiene solo 1 opción correcta)
INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(76, 1, '20', TRUE),
(77, 1, '11', TRUE),
(78, 1, '50', TRUE),
(79, 1, '50', TRUE),
(80, 1, '12', TRUE),
(81, 1, '18', TRUE),
(82, 1, '500', TRUE),
(83, 1, '2', TRUE),
(84, 1, '28', TRUE),
(85, 1, '360', TRUE),
(86, 1, '2', TRUE),
(87, 1, '25', TRUE);

-- SERIE 6 (Juicio - todas tienen solo 2 opciones Si/No)
INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(88, 1, 'Si', TRUE), (88, 2, 'No', FALSE),
(89, 1, 'Si', FALSE), (89, 2, 'No', TRUE),
(90, 1, 'Si', FALSE), (90, 2, 'No', TRUE),
(91, 1, 'Si', TRUE), (91, 2, 'No', FALSE),
(92, 1, 'Si', TRUE), (92, 2, 'No', FALSE),
(93, 1, 'Si', FALSE), (93, 2, 'No', TRUE),
(94, 1, 'Si', FALSE), (94, 2, 'No', TRUE),
(95, 1, 'Si', FALSE), (95, 2, 'No', TRUE),
(96, 1, 'Si', TRUE), (96, 2, 'No', FALSE),
(97, 1, 'Si', TRUE), (97, 2, 'No', FALSE),
(98, 1, 'Si', FALSE), (98, 2, 'No', TRUE),
(99, 1, 'Si', FALSE), (99, 2, 'No', TRUE),
(100, 1, 'Si', FALSE), (100, 2, 'No', TRUE),
(101, 1, 'Si', TRUE), (101, 2, 'No', FALSE),
(102, 1, 'Si', FALSE), (102, 2, 'No', TRUE),
(103, 1, 'Si', FALSE), (103, 2, 'No', TRUE),
(104, 1, 'Si', TRUE), (104, 2, 'No', FALSE),
(105, 1, 'Si', FALSE), (105, 2, 'No', TRUE),
(106, 1, 'Si', TRUE), (106, 2, 'No', FALSE),
(107, 1, 'Si', TRUE), (107, 2, 'No', FALSE);

-- ========================================
-- Actualización completa de opcionesTerman - SERIE 7
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- Descripción: Analogías
-- ========================================

INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(108, 1, 'A) comer', TRUE),
(108, 2, 'B) hambre', FALSE),
(108, 3, 'C) agua', FALSE),
(108, 4, 'D) cocinar', FALSE),

(109, 1, 'A) años', TRUE),
(109, 2, 'B) hora', FALSE),
(109, 3, 'C) minuto', FALSE),
(109, 4, 'D) siglo', FALSE),

(110, 1, 'A) olor', FALSE),
(110, 2, 'B) hoja', FALSE),
(110, 3, 'C) planta', TRUE),
(110, 4, 'D) espina', FALSE),

(111, 1, 'A) negro', FALSE),
(111, 2, 'B) esclavitud', TRUE),
(111, 3, 'C) libre', FALSE),
(111, 4, 'D) sufrir', FALSE),

(112, 1, 'A) canta', FALSE),
(112, 2, 'B) estuvo', TRUE),
(112, 3, 'C) hablando', FALSE),
(112, 4, 'D) cantó', FALSE),

(113, 1, 'A) semana', FALSE),
(113, 2, 'B) jueves', FALSE),
(113, 3, 'C) día', FALSE),
(113, 4, 'D) sábado', TRUE),

(114, 1, 'A) botella', FALSE),
(114, 2, 'B) peso', FALSE),
(114, 3, 'C) ligero', TRUE),
(114, 4, 'D) flotar', FALSE),

(115, 1, 'A) tristeza', TRUE),
(115, 2, 'B) suerte', FALSE),
(115, 3, 'C) fracasar', FALSE),
(115, 4, 'D) trabajo', FALSE),

(116, 1, 'A) lobo', TRUE),
(116, 2, 'B) ladrido', FALSE),
(116, 3, 'C) mordida', FALSE),
(116, 4, 'D) agarrar', FALSE),

(117, 1, 'A) Z', FALSE),
(117, 2, 'B) 45', FALSE),
(117, 3, 'C) 35', FALSE),
(117, 4, 'D) 25', TRUE),

(118, 1, 'A) muerte', FALSE),
(118, 2, 'B) alegría', TRUE),
(118, 3, 'C) mortaja', FALSE),
(118, 4, 'D) doctor', FALSE),

(119, 1, 'A) comer', FALSE),
(119, 2, 'B) pájaro', FALSE),
(119, 3, 'C) vida', TRUE),
(119, 4, 'D) malo', FALSE),

(120, 1, 'A) 18', FALSE),
(120, 2, 'B) 27', TRUE),
(120, 3, 'C) 36', FALSE),
(120, 4, 'D) 45', FALSE),

(121, 1, 'A) beber', FALSE),
(121, 2, 'B) claro', FALSE),
(121, 3, 'C) sed', TRUE),
(121, 4, 'D) puro', FALSE),

(122, 1, 'A) éstos', FALSE),
(122, 2, 'B) aquel', FALSE),
(122, 3, 'C) ése', TRUE),
(122, 4, 'D) entonces', FALSE),

(123, 1, 'A) agua', FALSE),
(123, 2, 'B) pez', FALSE),
(123, 3, 'C) escama', TRUE),
(123, 4, 'D) nadar', FALSE),

(124, 1, 'A) patria', FALSE),
(124, 2, 'B) honrado', TRUE),
(124, 3, 'C) canción', FALSE),
(124, 4, 'D) estudio', FALSE),

(125, 1, 'A) tercero', FALSE),
(125, 2, 'B) último', FALSE),
(125, 3, 'C) cuarto', TRUE),
(125, 4, 'D) poste', FALSE),

(126, 1, 'A) marina', FALSE),
(126, 2, 'B) soldado', FALSE),
(126, 3, 'C) general', TRUE),
(126, 4, 'D) sargento', FALSE),

(127, 1, 'A) pronombre', FALSE),
(127, 2, 'B) adverbio', FALSE),
(127, 3, 'C) verbo', TRUE),
(127, 4, 'D) adjetivo', FALSE);


-- SERIE 8 (Oraciones revueltas de verdad y falso)
INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
-- 1
(128, 1, 'Verdadero',TRUE),
(128, 2, 'Falso', FALSE),
-- 2
(129, 1, 'Verdadero',FALSE),
(129, 2, 'Falso',TRUE),
-- 3
(130, 1, 'Verdadero',TRUE),
(130, 2, 'Falso',FALSE),
-- 4
(131, 1, 'Verdadero',TRUE),
(131, 2, 'Falso',FALSE),
-- 5
(132, 1, 'Verdadero',TRUE),
(132, 2, 'Falso',FALSE),
-- 6
(133, 1, 'Verdadero',FALSE),
(133, 2, 'Falso',TRUE),
-- 7
(134, 1, 'Verdadero',FALSE),
(134, 2, 'Falso',TRUE),
-- 8
(135, 1, 'Verdadero',TRUE),
(135, 2, 'Falso',FALSE),
-- 9
(136, 1, 'Verdadero',TRUE),
(136, 2, 'Falso',FALSE),
-- 10
(137, 1, 'Verdadero',FALSE),
(137, 2, 'Falso',TRUE),
-- 11
(138, 1, 'Verdadero',FALSE),
(138, 2, 'Falso',TRUE),
-- 12
(139, 1, 'Verdadero',FALSE),
(139, 2, 'Falso',TRUE),
-- 13
(140, 1, 'Verdadero',TRUE),
(140, 2, 'Falso',FALSE),
-- 14
(141, 1, 'Verdadero',TRUE),
(141, 2, 'Falso',FALSE),
-- 15
(142, 1, 'Verdadero',TRUE),
(142, 2, 'Falso',FALSE),
-- 16
(143, 1, 'Verdadero',TRUE),
(143, 2, 'Falso',FALSE),
-- 17
(144, 1, 'Verdadero',FALSE),
(144, 2, 'Falso',TRUE);

-- ========================================
-- Actualización completa de opcionesTerman - SERIE 9
-- Fecha: 21 de abril de 2025
-- Autor: David Cu Sánchez
-- Descripción: Selección de palabra que no corresponde
-- ========================================

INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(145, 1, 'A) Saltar', FALSE),
(145, 2, 'B) Correr', FALSE),
(145, 3, 'C) Brincar', FALSE),
(145, 4, 'D) Pararse', TRUE),
(145, 5, 'E) Caminar', FALSE),

(146, 1, 'A) Monarquía', FALSE),
(146, 2, 'B) Comunista', FALSE),
(146, 3, 'C) Demócrata', FALSE),
(146, 4, 'D) Anarquista', FALSE),
(146, 5, 'E) Católico', TRUE),

(147, 1, 'A) Muerte', FALSE),
(147, 2, 'B) Duelo', FALSE),
(147, 3, 'C) Paseo', TRUE),
(147, 4, 'D) Pobreza', FALSE),
(147, 5, 'E) Tristeza', FALSE),

(148, 1, 'A) Carpintero', TRUE),
(148, 2, 'B) Doctor', FALSE),
(148, 3, 'C) Abogado', FALSE),
(148, 4, 'D) Ingeniero', FALSE),
(148, 5, 'E) Profesor', FALSE),

(149, 1, 'A) Cama', FALSE),
(149, 2, 'B) Silla', FALSE),
(149, 3, 'C) Plato', TRUE),
(149, 4, 'D) Sofá', FALSE),
(149, 5, 'E) Mesa', FALSE),

(150, 1, 'A) Francisco', FALSE),
(150, 2, 'B) Santiago', FALSE),
(150, 3, 'C) Juan', FALSE),
(150, 4, 'D) Sara', TRUE),
(150, 5, 'E) Guillermo', FALSE),

(151, 1, 'A) Duro', FALSE),
(151, 2, 'B) Áspero', FALSE),
(151, 3, 'C) Liso', FALSE),
(151, 4, 'D) Suave', FALSE),
(151, 5, 'E) Dulce', TRUE),

(152, 1, 'A) Digestión', TRUE),
(152, 2, 'B) Oído', FALSE),
(152, 3, 'C) Vista', FALSE),
(152, 4, 'D) Olfato', FALSE),
(152, 5, 'E) Tacto', FALSE),

(153, 1, 'A) Automóvil', FALSE),
(153, 2, 'B) Bicicleta', FALSE),
(153, 3, 'C) Guayín', FALSE),
(153, 4, 'D) Telégrafo', TRUE),
(153, 5, 'E) Tren', FALSE),

(154, 1, 'A) Abajo', FALSE),
(154, 2, 'B) Acá', FALSE),
(154, 3, 'C) Reciente', TRUE),
(154, 4, 'D) Arriba', FALSE),
(154, 5, 'E) Allá', FALSE),

(155, 1, 'A) Hidalgo', FALSE),
(155, 2, 'B) Morelos', FALSE),
(155, 3, 'C) Bravo', FALSE),
(155, 4, 'D) Matamoros', FALSE),
(155, 5, 'E) Bolívar', TRUE),

(156, 1, 'A) Danés', FALSE),
(156, 2, 'B) Galgo', FALSE),
(156, 3, 'C) Buldog', FALSE),
(156, 4, 'D) Pekinés', FALSE),
(156, 5, 'E) Longhorn', TRUE),

(157, 1, 'A) Tela', TRUE),
(157, 2, 'B) Algodón', FALSE),
(157, 3, 'C) Lino', FALSE),
(157, 4, 'D) Seda', FALSE),
(157, 5, 'E) Lana', FALSE),

(158, 1, 'A) Ira', FALSE),
(158, 2, 'B) Odio', FALSE),
(158, 3, 'C) Alegría', FALSE),
(158, 4, 'D) Piedad', FALSE),
(158, 5, 'E) Razonamiento', TRUE),

(159, 1, 'A) Edison', FALSE),
(159, 2, 'B) Franklin', FALSE),
(159, 3, 'C) Marconi', FALSE),
(159, 4, 'D) Fulton', FALSE),
(159, 5, 'E) Shakespeare', TRUE),

(160, 1, 'A) Mariposa', TRUE),
(160, 2, 'B) Halcón', FALSE),
(160, 3, 'C) Avestruz', FALSE),
(160, 4, 'D) Petirrojo', FALSE),
(160, 5, 'E) Golondrina', FALSE),

(161, 1, 'A) Dar', FALSE),
(161, 2, 'B) Prestar', FALSE),
(161, 3, 'C) Perder', FALSE),
(161, 4, 'D) Ahorrar', TRUE),
(161, 5, 'E) Derrochar', FALSE),

(162, 1, 'A) Australia', FALSE),
(162, 2, 'B) Cuba', FALSE),
(162, 3, 'C) Córcega', FALSE),
(162, 4, 'D) Irlanda', FALSE),
(162, 5, 'E) España', TRUE);

-- SERIE 10 (Series numéricas)
INSERT INTO `opcionesterman` (`idPreguntaTerman`, `opcionTerman`, `descripcionTerman`, `esCorrecta`) VALUES
(163, 1, '2 - 1', TRUE),
(164, 1, '33 - 38', TRUE),
(165, 1, '64 - 128', TRUE),
(166, 1, '2 - 2', TRUE),
(167, 1, '13 - 13.1/4', TRUE),
(168, 1, '20 - 21', TRUE),
(169, 1, '1/4 - 1/8', TRUE),
(170, 1, '85.3 - 94.3', TRUE),
(171, 1, '6 - 8', TRUE),
(172, 1, '33 - 34', TRUE),
(173, 1, '25 - 125', TRUE);