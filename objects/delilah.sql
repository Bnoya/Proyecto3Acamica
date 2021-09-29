-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-09-2021 a las 04:55:11
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `carts`
--

INSERT INTO `carts` (`id`, `user_id`, `created_at`, `active`) VALUES
(2, 2, '2021-08-31 21:00:51', 0),
(4, 2, '2021-08-31 21:19:49', 0),
(5, 3, '2021-08-31 21:21:05', 0),
(6, 5, '2021-08-31 21:22:48', 0),
(7, 3, '2021-08-31 21:22:53', 1),
(8, 5, '2021-08-31 21:52:58', 0),
(9, 1, '2021-09-27 20:40:32', 1),
(10, 6, '2021-09-29 02:09:23', 0),
(11, 6, '2021-09-29 02:21:28', 1),
(12, 5, '2021-09-29 02:23:02', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cart_details`
--

CREATE TABLE `cart_details` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cart_details`
--

INSERT INTO `cart_details` (`id`, `cart_id`, `product_id`, `quantity`) VALUES
(1, 2, 1, 1),
(3, 2, 5, 2),
(4, 4, 6, 1),
(5, 4, 4, 1),
(6, 5, 4, 1),
(7, 6, 2, 2),
(8, 8, 2, 2),
(9, 8, 2, 2),
(10, 9, 5, 4),
(11, 10, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `payment_method_id` int(11) DEFAULT NULL,
  `order_status_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `total` float DEFAULT NULL,
  `order_desc` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `cart_id`, `payment_method_id`, `order_status_id`, `order_date`, `total`, `order_desc`) VALUES
(1, 2, 2, 1, 5, '2021-08-31 21:22:00', 950, '1xHamburguesa Clasica2xFocaccia'),
(3, 3, 5, 1, 4, '2021-08-31 21:23:26', 340, '1xEnsalada Veggie'),
(4, 5, 6, 1, 2, '2021-08-31 21:23:06', 850, '2xBagel de Salmon'),
(5, 5, 8, 2, 2, '2021-08-31 21:53:32', 1700, '4xBagel de Salmon');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_status`
--

CREATE TABLE `order_status` (
  `id` int(11) NOT NULL,
  `order_status_name` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `order_status`
--

INSERT INTO `order_status` (`id`, `order_status_name`) VALUES
(2, 'Nuevo'),
(3, 'Preparando'),
(4, 'Enviando'),
(5, 'Entregado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(11) NOT NULL,
  `payment_method_name` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `payment_method_name`) VALUES
(1, 'Cash'),
(2, 'Credit Card');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `price` int(11) NOT NULL,
  `img_url` varchar(45) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `img_url`, `active`) VALUES
(1, 'Hamburguesa Clasica', 350, 'google.com', 1),
(2, 'Sandwich de Palta', 500, 'https://via.placeholder.com/150', 1),
(3, 'Sandwich de Rucula', 425, 'https://via.placeholder.com/150', 1),
(4, 'Matambre a la Pizza', 1200, 'https://via.placeholder.com/150', 1),
(5, 'Noquis de papa', 600, 'https://via.placeholder.com/150', 1),
(6, 'Sandwich de Bondiola', 750, 'https://via.placeholder.com/150', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(45) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(150) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `shipping_address` varchar(45) DEFAULT NULL,
  `user_role_id` int(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `email`, `password`, `phone`, `shipping_address`, `user_role_id`) VALUES
(1, 'cust1', 'Freddie', 'Mercury', 'test@test.com', '$2b$10$nh5/3dIPBedH4letaA/noeJr2gL3xyESenEwlQhNaApW7WX6AOzJy', '12345', 'Calle s/n', 2),
(2, 'cust2', 'John', 'Smith', 'test@test.com', '$2b$10$H3Ln0dGqGqc3AnXZodWMuuOI.qvBNv84UNCEeFhFEwi8qbkwBGYKm', '12345', 'Calle s/n', 2),
(3, 'cust3', 'Brian', 'May', 'test@test.com', '$2b$10$IwTC/iU9WrIu1moehcG/6OSftKN3NWUKvcsvumg09PAFVLdORhrgm', '12345', 'Calle s/n', 2),
(5, 'cust4', 'Jordana', 'Kitchener', 'test@test.com', '$2b$10$yoPh8mMYn0x9MU5Z2p58gOPfHScV6Q6Qm0XOr2vuJaYg7YIE8fzbm', '12345', 'Calle s/n', 2),
(6, 'admin1', NULL, NULL, 'test@test.com', '$2b$10$rb8GViZ39xvs/.nW0pAl3.WhDacykq773/sTzaw66t3Vmk0NNC0QC', NULL, NULL, 1),
(7, 'admin2', NULL, NULL, 'test@test.com', '$2b$10$p4gQW5N61kjBq5TnHKUxMeZTPMoV67F2ljmn6uz28Be8bJHJ4qHuG', NULL, NULL, 1),
(8, 'admin3', NULL, NULL, 'test@test.com', '$2b$10$qxStbokUFYfK3c5etUwSoeOJHNgwr7iwOhKugB8KcqGFbVAMJvJMW', NULL, NULL, 1),
(11, 'Custumer5', 'Peter', 'Parker', 'test@test.com', '$2b$10$Jf5lhRXPkeq1sfY/HSjMbu0HYNXL9QGIbNhToxJXtWbEwm9pp0PaS', '12345', 'Calle s/n', 2),
(12, 'admin4', NULL, NULL, 'try@try.com', '$2b$10$0Sc1WdPlzpvl6AHJWRPMjORuWTDNCdCXsp.PraG8XvLXIJiarOgq6', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `user_roles`
--

INSERT INTO `user_roles` (`id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Cust');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `cart_details`
--
ALTER TABLE `cart_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `payment_method_id` (`payment_method_id`),
  ADD KEY `order_status_id` (`order_status_id`);

--
-- Indices de la tabla `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `user_role_id` (`user_role_id`);

--
-- Indices de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `cart_details`
--
ALTER TABLE `cart_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `cart_details`
--
ALTER TABLE `cart_details`
  ADD CONSTRAINT `cart_details_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `cart_details_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

--
-- Filtros para la tabla `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `orders_ibfk_4` FOREIGN KEY (`order_status_id`) REFERENCES `order_status` (`id`);

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
