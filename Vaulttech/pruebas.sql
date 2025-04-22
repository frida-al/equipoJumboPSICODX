-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-04-2025 a las 01:49:25
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `psytech`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pruebas`
--

CREATE TABLE `pruebas` (
  `idPrueba` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `instrucciones` text DEFAULT NULL,
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pruebas`
--

INSERT INTO `pruebas` (`idPrueba`, `nombre`, `descripcion`, `instrucciones`, `duracion`) VALUES
(1, 'KOSTICK', 'Prueba proyectiva que analiza rasgos de personalidad y comportamiento.', 'instruccionesKostick.txt', 0),
(2, 'PRUEBA DE 16PF', 'Inventario de personalidad que mide 16 factores primarios de la personalidad.', 'instrucciones16PF.txt', 0),
(3, 'HARTMAN', 'Evaluación psicológica utilizada en diversos contextos de diagnóstico.', 'instruccionesHartman.txt', 0),
(4, 'TERMAN', 'Prueba para medir el coeficiente intelectual y evaluar habilidades cognitivas.', 'instruccionesTerman.txt', 0),
(5, 'OTIS', 'Prueba de inteligencia que mide la capacidad de razonamiento lógico y abstracto.', 'instruccionesOtis.txt', 30),
(6, 'Colores de Luscher', 'Evaluación basada en la selección de colores para analizar el estado emocional.', 'instruccionesColores.txt', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pruebas`
--
ALTER TABLE `pruebas`
  ADD PRIMARY KEY (`idPrueba`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pruebas`
--
ALTER TABLE `pruebas`
  MODIFY `idPrueba` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
