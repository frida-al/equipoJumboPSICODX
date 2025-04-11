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
  ADD PRIMARY KEY (`idPregunta16PF`,`idPrueba`);
  
  ALTER TABLE `tienekostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idPrueba`);
