CREATE TABLE `pruebas` (
  `idPrueba` int(11) NOT NULL,
  `duracion` int NOT NULL,
  `instrucciones` text CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `tienekostick` (
  `idPreguntaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respondekostick` (
`idRespuestaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL, -- primary key
  `idPreguntaKostick` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcionKostick` varchar(36) NOT NULL,
  `tiempo` DECIMAL(6, 3) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntas16pf` (
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `pregunta16PF` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `numeroPregunta16PF` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opciones16pf` (
  `idOpcion16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `opcion16PF` varchar(5) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcionOpcion16PF` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tiene16pf` (
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responde16pf` (
  `idRespuesta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL, -- primary key
  `idPregunta16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcion16PF` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `tiempo` DECIMAL(6, 3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

  ALTER TABLE `tiene16pf`


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
