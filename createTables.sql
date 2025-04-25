CREATE TABLE `pruebas` (
  `idPrueba` int(11) NOT NULL,
  `duracion` int NOT NULL,
  `instrucciones` text CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


/*
    Equipo: SoftSync
    Pruebas: 1 Kostick y 2 16PF 
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/


CREATE TABLE `preguntaskostick` (
  `idPreguntaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `numeroPreguntaKostick` int(11) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opcioneskostick` (
  `idOpcionKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `opcionKostick` varchar(1) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcionOpcionKostick` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPreguntaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respondekostick` (
`idRespuestaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPreguntaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcionKostick` varchar(36) NOT NULL,
  `tiempo` DECIMAL(12, 3) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE resultadoskostick (
	idGrupo varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    idUsuario varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    G int(2) NOT NULL,
    L int(2) NOT NULL,
	I int(2) NOT NULL,
	T int(2) NOT NULL,
	V int(2) NOT NULL,
	S int(2) NOT NULL,
	R int(2) NOT NULL,
	D int(2) NOT NULL,
	C int(2) NOT NULL,
	E int(2) NOT NULL,
	W int(2) NOT NULL,
	F int(2) NOT NULL,
	K int(2) NOT NULL,
	Z int(2) NOT NULL,
	O int(2) NOT NULL,
	B int(2) NOT NULL,
	X int(2) NOT NULL,
	P int(2) NOT NULL,
	A int(2) NOT NULL,
	N int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntas16pf` (
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `pregunta16PF` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `numeroPregunta16PF` int(5) NOT NULL,
  `letraAporte` varchar(3) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE opciones16PF (
  idOpcion16PF varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  opcion16PF varchar(5) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  descripcionOpcion16PF varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  idPregunta16PF varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  valor16PF int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responde16pf` (
  `idRespuesta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcion16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `tiempo` DECIMAL(12, 3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE parametros16pf(
	idUsuario varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    idGrupo varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    A INT(5) NOT NULL DEFAULT 0,
    B INT(5) NOT NULL DEFAULT 0,
    C INT(5) NOT NULL DEFAULT 0,
    E INT(5) NOT NULL DEFAULT 0,
    F INT(5) NOT NULL DEFAULT 0,
    G INT(5) NOT NULL DEFAULT 0,
    H INT(5) NOT NULL DEFAULT 0,
    I INT(5) NOT NULL DEFAULT 0,
    L INT(5) NOT NULL DEFAULT 0,
    M INT(5) NOT NULL DEFAULT 0,
    N INT(5) NOT NULL DEFAULT 0,
    O INT(5) NOT NULL DEFAULT 0,
    Q1 INT(5) NOT NULL DEFAULT 0,
    Q2 INT(5) NOT NULL DEFAULT 0,
    Q3 INT(5) NOT NULL DEFAULT 0,
    Q4 INT(5) NOT NULL DEFAULT 0,
    IM INT(5) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-------------------------------------------------------------------------------------------------------------NUEVA-------------------------------------------------------
CREATE TABLE interpretaciones16PF (
	parametro varchar(5) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
	nivel1 varchar(350) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    nivel2 varchar(350) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
    nivel3 varchar(350) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ALTER TABLE `opciones16pf`
  ADD PRIMARY KEY (`idOpcion16PF`),
  ADD KEY `opciones16PF_ibfk_1` (`idPregunta16PF`);
  
  ALTER TABLE `opcioneskostick`
  ADD PRIMARY KEY (`idOpcionKostick`),
  ADD KEY `opcionesKostick_ibfk_1` (`idPreguntaKostick`);

  ALTER TABLE `preguntas16pf`
  ADD PRIMARY KEY (`idPregunta16PF`),
  ADD KEY `preguntas16PF_ibfk_1` (`idPrueba`);
  
  ALTER TABLE `preguntaskostick`
  ADD PRIMARY KEY (`idPreguntaKostick`),
  ADD KEY `preguntasKostick_ibfk_1` (`idPrueba`);

  ALTER TABLE `pruebas`
  ADD PRIMARY KEY (`idPrueba`);

  ALTER TABLE `responde16pf`
  ADD PRIMARY KEY (`idPregunta16PF`,`idGrupo`,`idUsuario`),
  ADD KEY `responde16PF_ibfk_1` (`idGrupo`),
  ADD KEY `responde16PF_ibfk_2` (`idUsuario`),
  ADD KEY `responde16PF_ibfk_3` (`idOpcion16PF`);
  
  ALTER TABLE `respondekostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idGrupo`,`idUsuario`),
  ADD KEY `respondeKostick_ibfk_1` (`idGrupo`),
  ADD KEY `respondeKostick_ibfk_2` (`idUsuario`),
  ADD KEY `respondeKostick_ibfk_3` (`idOpcionKostick`);

  ALTER TABLE `parametros16pf`
  ADD PRIMARY KEY (idUsuario, idGrupo),
  ADD KEY parametros16pf_ibfk_1 (idUsuario),
  ADD KEY parametros16pf_ibfk_2 (idGrupo);


CREATE TABLE areasotis (
    idAreaOtis INT,
    nombreAreaOtis VARCHAR(30)
);

CREATE TABLE preguntasotis (
    idPreguntaOtis VARCHAR(36) PRIMARY KEY not NULL, 
    idPrueba VARCHAR(36),
    numeroPregunta INT,
    preguntaOtis VARCHAR(255),
    idAreaOtis INT,
    FOREIGN KEY (idPrueba) REFERENCES pruebas(idPrueba),
    FOREIGN KEY (idAreaOtis) REFERENCES areasotis(idAreaOtis)
);

CREATE TABLE opcionesotis (
    idOpcionOtis VARCHAR(36) PRIMARY KEY,
    idPreguntaOtis VARCHAR(36),
    opcionOtis INT,
    descripcionOpcion TEXT,
    esCorrecta BOOLEAN,
    FOREIGN KEY (idPreguntaOtis) REFERENCES preguntasotis(idPreguntaOtis)
);

CREATE TABLE respuestaotisaspirante (
    idRespuestaOtis VARCHAR(36) PRIMARY KEY not NULL,
    idAspirante VARCHAR(36),
    idGrupo VARCHAR(36),
    idPreguntaOtis VARCHAR(36),
    idOpcionOtis VARCHAR(36),  -- Solo si es opción múltiple
    idPrueba VARCHAR(36),
    tiempoRespuesta INT,  -- En segundos
    FOREIGN KEY (idAspirante) REFERENCES aspirantes(idAspirante),
    FOREIGN KEY (idPreguntaOtis) REFERENCES preguntasotis(idPreguntaOtis),
    FOREIGN KEY (idOpcionOtis) REFERENCES opcionesotis(idOpcionOtis),
    FOREIGN KEY (idPrueba) REFERENCES pruebas(idPrueba),
    FOREIGN KEY (idGrupo) REFERENCES grupos(idGrupo)
);

CREATE TABLE colores(
    idColor INT AUTO_INCREMENT PRIMARY KEY, -- INT AUTO_INCREMENT
    nombreColor VARCHAR(50),
    numeroColor INT,
    significado VARCHAR(50),
    hexColor VARCHAR(7)
);

CREATE TABLE seleccionescolores(
    idSeleccionColores VARCHAR(36) PRIMARY KEY NOT NULL, -- UUID
    idPrueba VARCHAR(36), -- UUID
    idAspirante VARCHAR(36), -- UUID
    idGrupo VARCHAR(36),
    idColor INT, -- INT AUTO_INCREMENT
    posicion INT CHECK (posicion <= 7 AND posicion >= 0),
    fase INT CHECK (fase = 1 OR fase = 2),
    FOREIGN KEY (idPrueba) REFERENCES pruebas(idPrueba),
    FOREIGN KEY (idAspirante) REFERENCES aspirantes(idAspirante),
    FOREIGN KEY (idColor) REFERENCES colores(idColor),
    FOREIGN KEY (idGrupo) REFERENCES grupos(idGrupo)
);
  ADD PRIMARY KEY (`idPregunta16PF`,`idPrueba`);
  
  ALTER TABLE `tienekostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idPrueba`);

/*
    Equipo: Monarch Systems
    Pruebas: 3 Hartman y 4 Terman
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/

-- HARTMAN 

CREATE TABLE `preguntashartman` (
  `idPreguntaHartman` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `idPrueba` int(11) NOT NULL,
  `fasePregunta` int(11) NOT NULL,
  `numeroPregunta` int(11) NOT NULL,
  `preguntaHartman` varchar(500) NOT NULL,
  `valorHartman` varchar(5) NOT NULL,
  FOREIGN KEY (`idPrueba`) REFERENCES `pruebas`(`idPrueba`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TERMAN

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

CREATE TABLE `respuestashartman` (
  `idRespuestaHartman` int(11) PRIMARY KEY AUTO_INCREMENT,
  `idAspirante` int(11) NOT NULL,
  `idGrupo` int(11) NOT NULL,
  `idPreguntaHartman` int(11) NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `respuestaAbierta` varchar(500) NOT NULL,
  `tiempoRespuesta` int NOT NULL,
  FOREIGN KEY (`idAspirante`) REFERENCES `usuarios`(`idUsuario`),
  FOREIGN KEY (`idGrupo`) REFERENCES `grupos`(`idGrupo`),
  FOREIGN KEY (`idPreguntaHartman`) REFERENCES `preguntashartman`(`idPreguntaHartman`),
  FOREIGN KEY (`idPrueba`) REFERENCES `pruebas`(`idPrueba`)
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
  `fraseD.I` float(11) NOT NULL,
  `fraseDIS` float(11) NOT NULL,
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
  `citaD.I` float(11) NOT NULL,
  `citaDIS` float(11) NOT NULL,
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

/*
    Equipo: VaulTech
    Pruebas: Otis y Colores
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
*/
