-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tiempo de generación: 23-08-2013 a las 13:45:23
-- Versión del servidor: 5.5.31
-- Versión de PHP: 5.4.4-14+deb7u3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `spinsetter`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `blogs`
--

CREATE TABLE IF NOT EXISTS `blogs` (
  `IdBlog` int(11) NOT NULL AUTO_INCREMENT,
  `NameBlog` varchar(255) NOT NULL,
  `UrlBlog` varchar(2083) NOT NULL,
  `FeedBlog` varchar(2083) DEFAULT NULL,
  PRIMARY KEY (`IdBlog`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=98 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `followings`
--

CREATE TABLE IF NOT EXISTS `followings` (
  `IdFollower` int(11) NOT NULL,
  `IdFollowed` int(11) NOT NULL,
  `TypeFollowed` varchar(45) NOT NULL,
  PRIMARY KEY (`IdFollower`,`TypeFollowed`,`IdFollowed`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `songs`
--

CREATE TABLE IF NOT EXISTS `songs` (
  `IdSong` int(11) NOT NULL AUTO_INCREMENT,
  `UrlSong` varchar(2083) NOT NULL,
  `TypeSong` varchar(45) NOT NULL,
  `TypeSource` varchar(45) NOT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Author` varchar(255) DEFAULT NULL,
  `Description` text,
  `Duration` varchar(45) DEFAULT NULL,
  `Genres` varchar(255) DEFAULT NULL,
  `Artwork` varchar(2083) DEFAULT NULL,
  `IdSource` varchar(255) DEFAULT NULL,
  `PubDate` datetime DEFAULT NULL,
  PRIMARY KEY (`IdSong`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6017 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `songsblogs`
--

CREATE TABLE IF NOT EXISTS `songsblogs` (
  `IdSong` int(11) NOT NULL,
  `IdBlog` int(11) NOT NULL,
  PRIMARY KEY (`IdSong`,`IdBlog`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `songsusers`
--

CREATE TABLE IF NOT EXISTS `songsusers` (
  `IdSong` int(11) NOT NULL,
  `IdUser` int(11) NOT NULL,
  `PubDate` datetime DEFAULT NULL,
  PRIMARY KEY (`IdSong`,`IdUser`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `IdUser` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(255) NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Token` varchar(255) DEFAULT NULL,
  `TimeToken` datetime DEFAULT NULL,
  PRIMARY KEY (`IdUser`),
  UNIQUE KEY `Username_UNIQUE` (`Username`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
