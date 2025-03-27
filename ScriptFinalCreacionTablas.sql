CREATE DATABASE testInsight;
USE testInsight;

CREATE TABLE `permisos` (
  `idPermiso` int(11) NOT NULL,
  `permiso` varchar(80) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tienePermiso` (
  `idRol` int(11) NOT NULL,
  `idPermiso` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `roles` (
  `idRol` int(11) NOT NULL,
  `nombreRol` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `usuarios` (
  `idUsuario` varchar(36) NOT NULL,
  `usuario` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `contraseña` varchar(250) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idRol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `aspirantes` (
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idUsuario` varchar(36) DEFAULT NULL,
  `nombres` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `apellidoPaterno` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `apellidoMaterno` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `numTelefono` bigint(20) NOT NULL,
  `lugarOrigen` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `correo` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `universidadOrigen` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `psicologas` (
  `idPsicologa` varchar(36) NOT NULL,
  `idUsuario` varchar(36) DEFAULT NULL,
  `nombrePsicologa` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `fechaDisponibilidad` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `perteneceGrupo` (

  `idUsuario` varchar(36) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `fechaZoomIndividual` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `grupos` (
  `idGrupo` varchar(36) NOT NULL,
  `posgrado` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `generacion` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tienePruebas` (
  `idGrupo` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `fechaLimitePrueba` datetime(3) NOT NULL,
  `fechaPruebaGrupal` datetime(3) NOT NULL,
  `enlaceZoom` varchar(100) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `pruebas` (
  `idPrueba` int(11) NOT NULL,
  `duracion` int(5) NOT NULL,
  `instrucciones` text CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `nombrePrueba` varchar(50) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntasKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `numeroPreguntaKostick` int(11) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opcionesKostick` (
  `idOpcionKostick` varchar(36) NOT NULL,
  `opcionKostick` varchar(1) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `descripcionOpcionKostick` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPreguntaKostick` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tieneKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `respondeKostick` (
  `idPreguntaKostick` varchar(36) NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idOpcionKostick` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `preguntas16PF` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `pregunta16PF` varchar(150) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL,
  `idPrueba` int(11) NOT NULL,
  `numeroPregunta16PF` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `opciones16pf` (
  `idOpcion16PF` int(11) NOT NULL,
  `opcion16PF` varchar(5) NOT NULL,
  `descripcionOpcion16PF` varchar(250) NOT NULL,
  `idPregunta16PF` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `tiene16PF` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `idPrueba` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `responde16pf` (
  `idPregunta16PF` varchar(36) NOT NULL,
  `idGrupo` varchar(36) NOT NULL,
  `codigoIdentidad` varchar(25) CHARACTER SET utf8 COLLATE utf8_spanish2_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `aspirantes`
  ADD PRIMARY KEY (`codigoIdentidad`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);
  
  ALTER TABLE `grupos`
  ADD PRIMARY KEY (`idGrupo`);
  
  ALTER TABLE `opciones16PF`
  ADD PRIMARY KEY (`idOpcion16PF`),
  ADD KEY `opciones16PF_ibfk_1` (`idPregunta16PF`);
  
  ALTER TABLE `opcionesKostick`
  ADD PRIMARY KEY (`idOpcionKostick`),
  ADD KEY `opcionesKostick_ibfk_1` (`idPreguntaKostick`);
  
  ALTER TABLE `permisos`
  ADD PRIMARY KEY (`idPermiso`);
  
  ALTER TABLE `perteneceGrupo`
  ADD PRIMARY KEY (`idUsuario`,`idGrupo`),
  ADD KEY `perteneceGrupo_ibfk_2` (`idGrupo`);
  
  ALTER TABLE `preguntas16PF`
  ADD PRIMARY KEY (`idPregunta16PF`),
  ADD KEY `preguntas16PF_ibfk_1` (`idPrueba`);
  
  ALTER TABLE `preguntasKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`),
  ADD KEY `preguntasKostick_ibfk_1` (`idPrueba`);
  
  ALTER TABLE `pruebas`
  ADD PRIMARY KEY (`idPrueba`);
  
  ALTER TABLE `psicologas`
  ADD PRIMARY KEY (`idPsicologa`),
  ADD UNIQUE KEY `idUsuario` (`idUsuario`);
  
  ALTER TABLE `responde16PF`
  ADD PRIMARY KEY (`idPregunta16PF`,`idGrupo`,`codigoIdentidad`),
  ADD KEY `responde16PF_ibfk_1` (`idGrupo`),
  ADD KEY `responde16PF_ibfk_2` (`codigoIdentidad`);
  
  ALTER TABLE `respondeKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idGrupo`,`codigoIdentidad`),
  ADD KEY `respondeKostick_ibfk_1` (`idGrupo`),
  ADD KEY `respondeKostick_ibfk_2` (`codigoIdentidad`),
  ADD KEY `respondeKostick_ibfk_4` (`idOpcionKostick`);
  
  ALTER TABLE `roles`
  ADD PRIMARY KEY (`idRol`);
  
  ALTER TABLE `tiene16PF`
  ADD PRIMARY KEY (`idPregunta16PF`,`idPrueba`);
  
  ALTER TABLE `tieneKostick`
  ADD PRIMARY KEY (`idPreguntaKostick`,`idPrueba`);
  
ALTER TABLE `tienePermiso`
  ADD PRIMARY KEY (`idRol`,`idPermiso`),
  ADD KEY `tienePermiso_ibfk_2` (`idPermiso`);
  
  ALTER TABLE `tienePruebas`
  ADD KEY `tienePruebas_ibfk_2` (`idPrueba`),
  ADD KEY `tienePruebas_ibfk_1` (`idGrupo`);
  
  ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`idRol`) REFERENCES `roles` (`idRol`);