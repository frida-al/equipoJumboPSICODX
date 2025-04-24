/*
    Actualización importante de unos registros de opcionesterman
    ---------------------------------------------------
*/

/*
	Actualización de las opciones de la pregunta 3
*/
UPDATE opcionesterman SET esCorrecta = TRUE WHERE idPreguntaTerman = 3 AND opcionTerman = 2;
UPDATE opcionesterman SET esCorrecta = FALSE WHERE idPreguntaTerman = 3 AND opcionTerman = 4;
/*
	Actualización de las opciones de la pregunta 37
*/
UPDATE opcionesterman SET esCorrecta = FALSE WHERE idPreguntaTerman = 37 AND opcionTerman = 1;
UPDATE opcionesterman SET esCorrecta = TRUE WHERE idPreguntaTerman = 37 AND opcionTerman = 2;
/*
	Actualización de las opciones de la pregunta 106
*/
UPDATE opcionesterman SET esCorrecta = TRUE WHERE idPreguntaTerman = 106 AND opcionTerman = 1;
UPDATE opcionesterman SET esCorrecta = FALSE WHERE idPreguntaTerman = 106 AND opcionTerman = 2;
/*
	Actualización de las opciones de la pregunta 109
*/
UPDATE opcionesterman SET esCorrecta = TRUE WHERE idPreguntaTerman = 109 AND opcionTerman = 1;

/*
    Creación de calificacionesSerieTerman
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

/*
    Creación de resultadosHartman
    ---------------------------------------------------
*/

CREATE TABLE `resultadoshartman` (
  `idAspirante` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  `fraseDimI` float(11) NOT NULL,
  `fraseDimE` float(11) NOT NULL,
  `fraseDimS` float(11) NOT NULL,
  `fraseDif` float(11) NOT NULL,
  `fraseDimGeneral` float(11) NOT NULL,
  `fraseDimPorcentaje` float(11) NOT NULL,
  `fraseIntI` float(11) NOT NULL,
  `fraseIntE` float(11) NOT NULL,
  `fraseIntS` float(11) NOT NULL,
  `fraseIntGeneral` float(11) NOT NULL,
  `fraseIntPorcentaje` float(11) NOT NULL,
  `fraseDi` float(11) NOT NULL,
  `fraseDIS` float(11) NOT NULL,
  `fraseAiPorcentaje` float (11) NOT NULL,
  `fraseVQ1` float(11) NOT NULL,
  `fraseVQ2` float(11) NOT NULL,
  `citaDimI` float(11) NOT NULL,
  `citaDimE` float(11) NOT NULL,
  `citaDimS` float(11) NOT NULL,
  `citaDif` float(11) NOT NULL,
  `citaDimGeneral` float(11) NOT NULL,
  `citaDimPorcentaje` float(11) NOT NULL,
  `citaIntI` float(11) NOT NULL,
  `citaIntE` float(11) NOT NULL,
  `citaIntS` float(11) NOT NULL,
  `citaIntGeneral` float(11) NOT NULL,
  `citaIntPorcentaje` float(11) NOT NULL,
  `citaDi` float(11) NOT NULL,
  `citaDIS` float(11) NOT NULL,
  `citaAiPorcentaje` float (11) NOT NULL,
  `citaSQ1` float(11) NOT NULL,
  `citaSQ2` float(11) NOT NULL,
  `BQr1` float(11) NOT NULL,
  `BQa1` float(11) NOT NULL,
  `BQr2` float(11) NOT NULL,
  `BQa2` float(11) NOT NULL,
  `CQ1` float(11) NOT NULL,
  `CQ2` float(11) NOT NULL,
  FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
  FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
