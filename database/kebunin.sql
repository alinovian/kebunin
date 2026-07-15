-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 10:29 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.4.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kebunin`
--

-- --------------------------------------------------------

--
-- Table structure for table `plant_suggestions`
--

DROP TABLE IF EXISTS `plant_suggestions`;
CREATE TABLE `plant_suggestions` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `suggested_plant` varchar(255) NOT NULL,
  `suggestion_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plant_suggestions`
--

INSERT INTO `plant_suggestions` (`id`, `user_id`, `suggested_plant`, `suggestion_text`, `created_at`) VALUES
('317de97e-6f15-11f1-a2f5-005056c00001', '1d173d21-1fae-48f3-8197-cb443a4ad3ea', 'Cabai', 'Saya menyarankan menanam wortel dan stroberi', '2026-06-23 15:07:04');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `coin` int(11) NOT NULL,
  `image_url` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admin_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `coin`, `image_url`, `description`, `created_at`, `admin_id`) VALUES
('cfc03ac1-6f16-11f1-a2f5-005056c00001', 'Obat Ulat Cabai Berkah', 18500, 20, NULL, 'Sangat ampuh membasmi ulat grayak pada daun cabai dan tomat.', '2026-06-23 15:18:39', '1d173d21-1fae-48f3-8197-cb443a4ad3ea'),
('d6ab481a-742a-11f1-bae0-005056c00001', 'Pupuk Urea 1kg', 15000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784078130977_657.jpg\",\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784103360024_236.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Pupuk Urea kemasan 1kg \\n\\nCocok untuk berkebun di lingkungan rumah anda\"}]}', '2026-06-30 02:24:36', '7f4ae13a-e37e-4fad-adb5-e07c228e0746'),
('inj-p1', 'Pestisida Nabati Tomat (Minyak Nimba)', 35000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784102290488_963.jpg\",\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1782847715793_972.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Sangat efektif membasmi Kutu Kebul, Kutu Daun, dan Hama Thrips pada tanaman tomat secara alami.\"}]}', '2026-06-30 20:45:19', '7f4ae13a-e37e-4fad-adb5-e07c228e0746'),
('inj-p2', 'Fungisida Daun Tomat - Antracol', 45000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\",\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784096173247_459.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Obat jamur/fungisida kontak berbentuk tepung untuk mengatasi Bercak Daun Bakteri dan Busuk Phytophthora pada daun tomat.\"}]}', '2026-06-30 20:45:19', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a'),
('inj-p3', 'Pupuk Kalsium Anti Rontok Tomat', 28000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784078116639_372.jpg\",\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1782847715793_972.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Mencegah pembusukan ujung pantat buah tomat (Blossom End Rot) dan memperkuat imun tanaman tomat dari serangan bakteri layu.\"}]}', '2026-06-30 20:45:20', '7f4ae13a-e37e-4fad-adb5-e07c228e0746'),
('inj-p4', 'Bakterisida Agrimycin - Obat Layu Tomat', 55000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"heading\",\"text\":\"Bakterisida Agrimycin - Obat Layu Tomat\"},{\"type\":\"paragraph\",\"text\":\"Formulasi khusus antibiotik tanaman/bakterisida untuk mengobati penyakit Layu Bakteri (Ralstonia) dan penyakit busuk batang tomat.\"}]}', '2026-06-30 20:45:20', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a'),
('inj-p5', 'Perangkap Kuning Serangga Lem Lalat', 15000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784102322738_0.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Perangkap lem kuning untuk memantau dan meminimalkan populasi kutu kebul dewasa pembawa virus kuning pada tanaman tomat.\"}]}', '2026-06-30 20:45:20', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a'),
('p1', 'Bibit Cabai Rawit', 15000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784102348469_204.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Bibit cabai rawit unggulan, cepat tumbuh dan berbuah lebat.\"}]}', '2026-06-16 16:58:03', NULL),
('p2', 'Pupuk Organik 1kg', 25000, 50, NULL, 'Pupuk organik penyubur tanah, aman dan ramah lingkungan.', '2026-06-16 16:58:03', NULL),
('p3', 'Pot Tanah Liat', 18000, 35, NULL, 'Pot tanah liat estetis untuk tanaman hias atau sayur.', '2026-06-16 16:58:03', NULL),
('p4', 'Sekam Bakar', 12000, 24, NULL, 'Media tanam gembur untuk sirkulasi air yang baik.', '2026-06-16 16:58:03', NULL),
('p5', 'Semprotan Mist', 22000, 45, NULL, 'Semprotan air halus cocok untuk persemaian bibit.', '2026-06-16 16:58:03', NULL),
('p6', 'Obat Semprot Hama Tomat - Obat Jamur Buah Tomat', 50000, 0, '[\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\"]', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Obat Semprot Hama Tomat - Obat Jamur Buah Tomat\"}]}', '2026-06-16 16:58:03', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles` (
  `id` varchar(255) NOT NULL,
  `display_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `avatar_url` mediumtext DEFAULT NULL,
  `coins` int(11) NOT NULL DEFAULT 0,
  `streak` int(11) NOT NULL DEFAULT 0,
  `level` int(11) NOT NULL DEFAULT 1,
  `xp` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `shop_description` text DEFAULT NULL,
  `shop_address` text DEFAULT NULL,
  `shop_whatsapp` varchar(50) DEFAULT NULL,
  `shop_latitude` decimal(10,8) DEFAULT NULL,
  `shop_longitude` decimal(11,8) DEFAULT NULL,
  `shop_active` tinyint(4) NOT NULL DEFAULT 1,
  `shop_desa` varchar(255) DEFAULT NULL,
  `shop_kecamatan` varchar(255) DEFAULT NULL,
  `shop_kabupaten` varchar(255) DEFAULT NULL,
  `user_desa` varchar(255) DEFAULT NULL,
  `user_kecamatan` varchar(255) DEFAULT NULL,
  `user_kabupaten` varchar(255) DEFAULT NULL,
  `user_latitude` decimal(10,8) DEFAULT NULL,
  `user_longitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`id`, `display_name`, `email`, `password_hash`, `avatar_url`, `coins`, `streak`, `level`, `xp`, `created_at`, `updated_at`, `shop_description`, `shop_address`, `shop_whatsapp`, `shop_latitude`, `shop_longitude`, `shop_active`, `shop_desa`, `shop_kecamatan`, `shop_kabupaten`, `user_desa`, `user_kecamatan`, `user_kabupaten`, `user_latitude`, `user_longitude`) VALUES
('34b3a2bb-9248-4238-a541-c59fe991e0b8', 'Test User', 'testuser@gmail.com', '6fb0e3df9ef79fe26b2226d70348972e:a7b9965c287c6d8d2f3a4a2b3389f640a0a66ead13776dbe0919b5a83ab04d9bf8ea31b83fa4b97e2aaa6f3774dabbdc30db92c9fb160dec242087e91adad82c', NULL, 0, 0, 1, 0, '2026-06-23 14:34:23', '2026-06-23 14:34:23', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('7f4ae13a-e37e-4fad-adb5-e07c228e0746', 'Toko Pertanian Berkah Jaya', 'alinovian11@gmail.com', 'ca1e7660b41a9ee4e4f57d3ad0b60106:15df127e9c50d706bc3d754122d1eaab3175d8c43b77bcd1c2b5ef71dbfd68d23e353b5518f9325f41ac0a68a4786cd6be0d1ab2c79f9d7cd66826229a5bc7cd', 'https://lh3.googleusercontent.com/a/ACg8ocIlFZ9tWBmO4WCkArXyJeY-hENS4pgWzSn6N44gJitmdIC4ZA=s96-c', 0, 0, 1, 0, '2026-06-23 15:02:40', '2026-07-14 19:11:45', '{\"version\":1,\"blocks\":[{\"type\":\"paragraph\",\"text\":\"Jam operasional 08:00 - 17:00, sedia obat daun cabai dan tomat terlengkap.\"}]}', 'Gunung Sumbul, Purbalingga, Purbalingga', '08123456789', -7.38914150, 109.36160624, 1, 'Gunung Sumbul', 'Purbalingga', 'Purbalingga', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `profiles` (`id`, `display_name`, `email`, `password_hash`, `avatar_url`, `coins`, `streak`, `level`, `xp`, `created_at`, `updated_at`, `shop_description`, `shop_address`, `shop_whatsapp`, `shop_latitude`, `shop_longitude`, `shop_active`, `shop_desa`, `shop_kecamatan`, `shop_kabupaten`, `user_desa`, `user_kecamatan`, `user_kabupaten`, `user_latitude`, `user_longitude`) VALUES
('b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Ali Novian', 'alinovian1@gmail.com', '80a4acb65ef988bd19a5819f8d1487b3:92fa0a1d20e84a4f9a0359920acd3e3368a84c9e2973f26915407ee368a5a7263ffdad85b1c5415b93e76431246773bdedd0b2cefc1d055856b8ddcbe7a968fe', NULL, 30, 0, 1, 0, '2026-06-16 18:09:00', '2026-07-15 07:48:48', NULL, 'Jatisaba, Purbalingga', NULL, -7.40409008, 109.38417435, 1, 'Jatisaba', NULL, 'Purbalingga', 'Jatisaba', 'Purbalingga', 'Purbalingga', -7.39871470, 109.38789050);

-- --------------------------------------------------------

--
-- Table structure for table `scan_history`
--

DROP TABLE IF EXISTS `scan_history`;
CREATE TABLE `scan_history` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `image_url` mediumtext DEFAULT NULL,
  `disease` varchar(255) NOT NULL,
  `confidence` float NOT NULL,
  `summary` text NOT NULL,
  `steps` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `recommended_products` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scan_history`
--

INSERT INTO `scan_history` (`id`, `user_id`, `image_url`, `disease`, `confidence`, `summary`, `steps`, `created_at`, `recommended_products`) VALUES
('2dbbe1b4-6f13-11f1-a2f5-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Daun Bakteri', 0.87, 'Daun nunjukin bercak coklat berair, kayaknya kena bakteri Xanthomonas. Tenang, masih bisa diatasi kok!', 'Petik daun yang udah parah, jangan dibuang sembarang ya.\nSemprot larutan baking soda (1 sdt + 1 liter air) tiap 3 hari.\nKurangin nyiram dari atas, siram langsung ke tanah aja.\nPindahin ke tempat yang sirkulasi udaranya bagus.', '2026-06-23 14:52:38', NULL),
('4775eb4f-8006-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Awal (Early Blight)', 0.95, 'Bercak Awal pada tanaman tomat disebabkan oleh jamur Alternaria solani. Gejalanya ditandai dengan munculnya bercak-bercak bulat hingga tidak beraturan berwarna cokelat tua hingga hitam pada daun. Bercak-bercak ini sering menunjukkan pola cincin konsentris seperti mata sapi (bull\'s-eye), yang merupakan ciri khas penyakit ini. Seiring perkembangan penyakit, bercak dapat membesar, menyatu, dan menyebabkan daun menguning serta gugur, terutama pada daun bagian bawah tanaman.', 'Potong dan buang daun tomat yang terinfeksi parah (Hari ke-1/7)\nSemprot fungisida ke seluruh bagian daun (Hari ke-1/7)\nSemprot ulang fungisida (Hari ke-3/7)\nBerikan pupuk kalsium untuk memperkuat imunitas tanaman (Hari ke-5/7)\nSemprot ulang fungisida untuk perlindungan berkelanjutan (Hari ke-7/7)', '2026-07-15 04:33:08', '[{\"id\":\"inj-p2\",\"name\":\"Fungisida Daun Tomat - Antracol\",\"description\":\"{\\\"version\\\":1,\\\"blocks\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Obat jamur/fungisida kontak berbentuk tepung untuk mengatasi Bercak Daun Bakteri dan Busuk Phytophthora pada daun tomat.\\\"}]}\",\"price\":45000,\"image_url\":\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\",\"shop_name\":\"Ali Novian\",\"shop_address\":\"Jatisaba, Purbalingga\",\"shop_whatsapp\":null,\"shop_latitude\":\"-7.40409008\",\"shop_longitude\":\"109.38417435\",\"reason\":\"Fungisida Antracol adalah fungisida kontak yang efektif untuk mengendalikan penyakit bercak daun yang disebabkan oleh jamur, termasuk Bercak Awal pada tomat.\"},{\"id\":\"inj-p3\",\"name\":\"Pupuk Kalsium Anti Rontok Tomat\",\"description\":\"{\\\"version\\\":1,\\\"blocks\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Mencegah pembusukan ujung pantat buah tomat (Blossom End Rot) dan memperkuat imun tanaman tomat dari serangan bakteri layu.\\\"}]}\",\"price\":28000,\"image_url\":\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784078116639_372.jpg\",\"shop_name\":\"Toko Pertanian Berkah Jaya\",\"shop_address\":\"Gunung Sumbul, Purbalingga, Purbalingga\",\"shop_whatsapp\":\"08123456789\",\"shop_latitude\":\"-7.38914150\",\"shop_longitude\":\"109.36160624\",\"reason\":\"Pupuk Kalsium dapat membantu memperkuat dinding sel tanaman, meningkatkan ketahanan alami tanaman tomat terhadap serangan penyakit jamur.\"}]');
INSERT INTO `scan_history` (`id`, `user_id`, `image_url`, `disease`, `confidence`, `summary`, `steps`, `created_at`, `recommended_products`) VALUES
('52b23a9e-8003-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Penyakit Bercak Awal (Early Blight)', 0.9, 'Penyakit Bercak Awal (Early Blight) pada daun tomat disebabkan oleh jamur Alternaria solani. Gejala khasnya adalah munculnya bercak-bercak coklat gelap hingga hitam yang berbentuk melingkar dengan cincin konsentris (seperti mata banteng) pada daun. Bercak ini bisa membesar dan menyatu membentuk area nekrotik yang lebih luas, menyebabkan daun menguning dan rontok prematur, terutama pada daun bagian bawah dan tua. Kondisi lembab dan hangat mempercepat penyebaran penyakit ini.', 'Buang dan musnahkan daun tomat yang terinfeksi parah (Hari ke-1/5)\nSemprotkan fungisida kontak ke seluruh permukaan daun sesuai dosis (Hari ke-1/5)\nPeriksa kondisi daun baru, pastikan sirkulasi udara baik, dan hindari penyiraman berlebihan (Hari ke-3/5)\nLakukan penyemprotan fungisida kontak kedua untuk proteksi berkelanjutan (Hari ke-5/5)', '2026-07-15 04:11:58', NULL),
('67f792bc-7fab-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Hawar Awal (Early Blight)', 0.9, 'Gejala hawar awal pada daun tomat ditandai dengan munculnya bercak-bercak coklat gelap melingkar hingga tidak beraturan, seringkali dengan pola cincin konsentris (seperti mata sapi) yang khas. Bercak ini biasanya dimulai dari daun bagian bawah dan menyebar ke atas, menyebabkan jaringan daun di sekitarnya menguning dan akhirnya mengering, yang dapat diamati pada gambar daun ini.', 'Pangkas dan musnahkan daun terinfeksi parah (Hari ke-1/7)\nSemprot fungisida Antracol secara merata (Hari ke-1/7)\nSemprot ulang fungisida Antracol (Hari ke-3/7)\nBerikan pupuk kalsium untuk imunitas tanaman (Hari ke-5/7)\nSemprot fungisida Antracol terakhir dan pantau kondisi (Hari ke-7/7)', '2026-07-14 17:42:38', NULL),
('68a7096f-6f13-11f1-a2f5-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Daun Bakteri', 0.87, 'Daun nunjukin bercak coklat berair, kayaknya kena bakteri Xanthomonas. Tenang, masih bisa diatasi kok!', 'Petik daun yang udah parah, jangan dibuang sembarang ya.\nSemprot larutan baking soda (1 sdt + 1 liter air) tiap 3 hari.\nKurangin nyiram dari atas, siram langsung ke tanah aja.\nPindahin ke tempat yang sirkulasi udaranya bagus.', '2026-06-23 14:54:17', NULL),
('77d511e1-74c1-11f1-848c-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Penggerek Daun Tomat', 0.9, 'Penggerek Daun (Leaf Miner) adalah larva serangga yang membuat terowongan atau galeri di dalam jaringan daun, meninggalkan jejak putih atau keperakan yang tidak beraturan pada permukaan daun tomat. Gejala ini terlihat jelas pada beberapa daun di gambar, yang menunjukkan adanya alur atau pola seperti peta. Serangan parah dapat mengurangi efisiensi fotosintesis, menyebabkan daun menguning, mengering, dan pada akhirnya dapat melemahkan tanaman serta menurunkan hasil panen.', 'Potong daun yang terinfeksi parah dan musnahkan (Hari ke-1/7)\nSemprotkan insektisida nabati (misalnya minyak nimba) secara merata pada seluruh bagian daun (Hari ke-1/7)\nLakukan penyiraman yang cukup dan berikan pupuk daun organik untuk mendukung pemulihan tanaman (Hari ke-3/7)\nSemprot ulang insektisida nabati (minyak nimba) untuk memastikan eliminasi hama (Hari ke-5/7)\nPasang perangkap kuning perekat di sekitar tanaman untuk memantau dan mengurangi populasi serangga dewasa penyebab penggerek daun (Hari ke-7/7)', '2026-06-30 20:22:51', NULL);
INSERT INTO `scan_history` (`id`, `user_id`, `image_url`, `disease`, `confidence`, `summary`, `steps`, `created_at`, `recommended_products`) VALUES
('7caee98e-74c5-11f1-848c-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Daun Awal (Early Blight)', 0.9, 'Bercak Daun Awal (Early Blight) pada tanaman tomat disebabkan oleh jamur Alternaria solani. Gejalanya pada daun ditandai dengan munculnya bercak-bercak coklat gelap hingga hitam berbentuk bulat konsentris menyerupai \"mata sapi\" atau target spot, seringkali dikelilingi oleh halo kuning. Bercak ini awalnya kecil namun dapat membesar dan bergabung membentuk area nekrotik yang luas, menyebabkan daun menguning, layu, dan gugur sebelum waktunya, yang sangat mengurangi kapasitas fotosintesis tanaman.', 'Pangkas dan buang daun yang terinfeksi parah (Hari ke-1/7)\nSemprot fungisida (Antracol) secara merata pada seluruh permukaan daun (Hari ke-1/7)\nSemprot ulang fungisida (Antracol) untuk perlindungan berkelanjutan (Hari ke-3/7)\nBerikan pupuk Kalsium untuk memperkuat imun dan struktur sel tanaman (Hari ke-5/7)\nEvaluasi kondisi tanaman dan semprot fungisida kembali jika gejala masih parah atau sebagai tindakan pencegahan (Hari ke-7/7)', '2026-06-30 20:51:37', NULL),
('9da272de-8006-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Hawar Awal (Early Blight)', 0.9, 'Tanaman tomat menunjukkan gejala hawar awal yang disebabkan oleh jamur Alternaria solani. Gejala yang terlihat adalah bercak-bercak coklat kehitaman berbentuk bulat konsentris (seperti mata sapi atau target) pada daun. Bercak ini seringkali dikelilingi oleh halo kuning dan dapat menyatu membentuk area nekrotik yang lebih besar, menyebabkan daun mengering dan gugur secara prematur.', 'Buang daun yang terinfeksi parah untuk mengurangi sumber inokulum (Hari ke-1/7)\nSemprotkan fungisida kontak secara merata pada seluruh permukaan daun (Hari ke-1/7)\nPerbaiki sirkulasi udara di sekitar tanaman dan bersihkan sisa-sisa tanaman yang gugur (Hari ke-3/7)\nSemprotkan fungisida kontak kembali untuk perlindungan berkelanjutan (Hari ke-5/7)\nMonitor kondisi tanaman secara rutin, pastikan drainase baik, dan hindari penyiraman berlebihan pada daun (Hari ke-7/7)', '2026-07-15 04:35:32', '[{\"id\":\"inj-p2\",\"name\":\"Fungisida Daun Tomat - Antracol\",\"description\":\"{\\\"version\\\":1,\\\"blocks\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Obat jamur/fungisida kontak berbentuk tepung untuk mengatasi Bercak Daun Bakteri dan Busuk Phytophthora pada daun tomat.\\\"}]}\",\"price\":45000,\"image_url\":\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\",\"shop_name\":\"Ali Novian\",\"shop_address\":\"Jatisaba, Purbalingga\",\"shop_whatsapp\":null,\"shop_latitude\":\"-7.40409008\",\"shop_longitude\":\"109.38417435\",\"reason\":\"Antracol adalah fungisida kontak berspektrum luas yang sangat efektif untuk mengendalikan penyakit jamur seperti Hawar Awal pada tanaman tomat.\"}]'),
('a7121e8d-8007-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Daun Alternaria (Early Blight)', 0.92, 'Infeksi jamur pada daun tomat ditandai dengan lingkaran konsentris gelap.', 'Semprot larutan fungisida (Hari ke-1/3)\nPangkas daun yang terinfeksi parah (Hari ke-1/3)', '2026-07-15 04:42:58', '[{\"id\":\"inj-p2\",\"name\":\"Fungisida Daun Tomat - Antracol\",\"description\":\"{\\\"version\\\":1,\\\"blocks\\\":[{\\\"type\\\":\\\"paragraph\\\",\\\"text\\\":\\\"Obat jamur/fungisida kontak berbentuk tepung untuk mengatasi Bercak Daun Bakteri dan Busuk Phytophthora pada daun tomat.\\\"}]}\",\"price\":45000,\"image_url\":\"https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/product-photos/product_1784053090310_697.jpg\",\"shop_name\":\"Ali Novian\",\"shop_address\":\"Jatisaba, Purbalingga\",\"shop_whatsapp\":null,\"shop_latitude\":\"-7.40409008\",\"shop_longitude\":\"109.38417435\",\"reason\":\"Fungisida Antracol cocok untuk bercak daun.\"}]');
INSERT INTO `scan_history` (`id`, `user_id`, `image_url`, `disease`, `confidence`, `summary`, `steps`, `created_at`, `recommended_products`) VALUES
('eee882e2-74c0-11f1-848c-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Penyakit Daun Tomat', 0.9, 'Gagal menghubungi Gemini AI. Ini adalah diagnosis fallback untuk Tomat.', 'Semprot larutan perawatan (Hari ke-1/3)\nGunting daun berbercak (Hari ke-1/3)\nSemprot larutan perawatan (Hari ke-3/3)', '2026-06-30 20:19:01', NULL),
('f8f0e51e-74c2-11f1-848c-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Kering (Early Blight)', 0.9, 'Bercak Kering atau Early Blight, yang disebabkan oleh jamur Alternaria solani, adalah penyakit umum pada tanaman tomat. Gejala pada daun biasanya berupa bercak melingkar hingga tidak beraturan berwarna coklat tua hingga hitam, seringkali dengan pola cincin konsentris yang menyerupai \'target\' atau mata sapi. Bercak ini biasanya dikelilingi oleh zona kuning. Pada kasus parah, bercak dapat menyatu membentuk area nekrotik besar, menyebabkan daun menguning, layu, dan gugur prematur, seperti yang terlihat pada bagian bawah daun ini.', 'Potong dan buang daun serta bagian tanaman yang terinfeksi parah (sanitasi) (Hari ke-1/7)\nSemprotkan fungisida kontak atau sistemik yang mengandung bahan aktif seperti mancozeb atau chlorothalonil pada seluruh bagian tanaman (Hari ke-1/7)\nLakukan pemantauan intensif, pastikan sirkulasi udara baik, dan hindari penyiraman berlebihan pada daun (Hari ke-3/7)\nSemprotkan ulang fungisida sesuai dosis anjuran, fokus pada daun yang masih menunjukkan gejala awal (Hari ke-5/7)\nBerikan pupuk daun yang mengandung unsur hara mikro untuk membantu pemulihan dan penguatan tanaman (Hari ke-7/7)', '2026-06-30 20:33:37', NULL),
('fa901c5a-74c4-11f1-848c-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', NULL, 'Bercak Awal (Early Blight)', 0.95, 'Bercak Awal (Early Blight) adalah penyakit jamur umum pada tanaman tomat yang disebabkan oleh patogen Alternaria solani. Gejala khas pada daun meliputi munculnya bercak-bercak bulat hingga tidak beraturan berwarna cokelat gelap atau hitam, seringkali dengan pola cincin konsentris (seperti target) yang jelas. Bercak ini biasanya dimulai pada daun tua di bagian bawah tanaman, meluas, dan dapat menyebabkan penguningan serta defoliasi dini pada daun yang terinfeksi parah.', 'Potong dan buang daun tomat yang terinfeksi parah (Hari ke-1/7)\nSemprotkan fungisida kontak ke seluruh bagian tanaman, terutama daun yang masih sehat dan bagian bawah daun (Hari ke-1/7)\nLakukan pembersihan area sekitar tanaman untuk sanitasi yang baik dan mengurangi kelembaban (Hari ke-3/7)\nUlangi penyemprotan fungisida untuk perlindungan berkelanjutan (Hari ke-5/7)\nLakukan pemantauan gejala dan berikan pupuk peningkat kekebalan tanaman (Hari ke-7/7)', '2026-06-30 20:47:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_plants`
--

DROP TABLE IF EXISTS `user_plants`;
CREATE TABLE `user_plants` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Sehat',
  `days` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` text DEFAULT NULL,
  `planted_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_plants`
--

INSERT INTO `user_plants` (`id`, `user_id`, `name`, `status`, `days`, `created_at`, `image_url`, `planted_at`) VALUES
('44191769-6f15-11f1-a2f5-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Tomat', 'Sakit', 1, '2026-06-23 15:07:35', NULL, '2026-06-23'),
('67f0115d-69f5-11f1-b3df-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Tomat', 'Sehat', 1, '2026-06-17 02:36:55', 'https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/plant-photos/plant_1784101599205_999.jpg', '2026-06-01'),
('8b7ce865-8018-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Cabai', 'Sehat', 1, '2026-07-15 06:43:53', 'https://xxzntliinvjtpiaqpymu.supabase.co/storage/v1/object/public/plant-photos/plant_1784101524356_935.jpg', '2026-07-15');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `role` enum('super_admin','admin','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `user_id`, `role`, `created_at`) VALUES
('087f13ac-7fb7-11f1-98b1-005056c00001', '7f4ae13a-e37e-4fad-adb5-e07c228e0746', 'admin', '2026-07-14 19:05:52'),
('0e094d35-7fb1-11f1-98b1-005056c00001', '34b3a2bb-9248-4238-a541-c59fe991e0b8', 'user', '2026-07-14 18:23:04'),
('1', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'super_admin', '2026-06-16 18:11:01');

-- --------------------------------------------------------

--
-- Table structure for table `user_tasks`
--

DROP TABLE IF EXISTS `user_tasks`;
CREATE TABLE `user_tasks` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `title` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `curative` tinyint(1) NOT NULL DEFAULT 0,
  `is_done` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `plant_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_tasks`
--

INSERT INTO `user_tasks` (`id`, `user_id`, `time`, `title`, `type`, `curative`, `is_done`, `created_at`, `plant_id`) VALUES
('4764547b-8006-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', '16:00', 'Semprot ulang fungisida (Hari ke-2/7)', 'Air', 1, 0, '2026-07-15 04:33:08', '44191769-6f15-11f1-a2f5-005056c00001'),
('9d92da73-8006-11f1-98b1-005056c00001', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', '10:00', 'Perbaiki sirkulasi udara di sekitar tanaman dan bersihkan sisa-sisa tanaman yang gugur (Hari ke-1/7)', 'Umum', 1, 0, '2026-07-15 04:35:32', '44191769-6f15-11f1-a2f5-005056c00001');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_categories`
--

DROP TABLE IF EXISTS `wishlist_categories`;
CREATE TABLE `wishlist_categories` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist_categories`
--

INSERT INTO `wishlist_categories` (`id`, `user_id`, `name`, `created_at`) VALUES
('wc_1784096357015_w48rnj4dr', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Tomat', '2026-07-15 06:19:17'),
('wc_1784098197634_xpbpjuhhu', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'Cabai', '2026-07-15 06:49:57');

-- --------------------------------------------------------

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
CREATE TABLE `wishlist_items` (
  `id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `category_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist_items`
--

INSERT INTO `wishlist_items` (`id`, `user_id`, `product_id`, `category_id`, `created_at`) VALUES
('wi_1784097904379_07eh0vcfh', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'inj-p3', NULL, '2026-07-15 06:45:04'),
('wi_1784097953470_mg9z0g7kb', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'inj-p4', NULL, '2026-07-15 06:45:53'),
('wi_1784098203114_5j3wa73rc', 'b56f170c-3e39-4847-8df8-1e8c4cae2a6a', 'p1', 'wc_1784098197634_xpbpjuhhu', '2026-07-15 06:50:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `plant_suggestions`
--
ALTER TABLE `plant_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_plant_suggestions_profile` (`user_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_products_admin` (`admin_id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `scan_history`
--
ALTER TABLE `scan_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scan_history_profile` (`user_id`);

--
-- Indexes for table `user_plants`
--
ALTER TABLE `user_plants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_plants_profile` (`user_id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_role` (`user_id`,`role`);

--
-- Indexes for table `user_tasks`
--
ALTER TABLE `user_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_tasks_profile` (`user_id`),
  ADD KEY `fk_user_tasks_plant` (`plant_id`);

--
-- Indexes for table `wishlist_categories`
--
ALTER TABLE `wishlist_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_wishlist_categories_profile` (`user_id`);

--
-- Indexes for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_wishlist_items_profile` (`user_id`),
  ADD KEY `fk_wishlist_items_product` (`product_id`),
  ADD KEY `fk_wishlist_items_category` (`category_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `plant_suggestions`
--
ALTER TABLE `plant_suggestions`
  ADD CONSTRAINT `fk_plant_suggestions_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_admin` FOREIGN KEY (`admin_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `scan_history`
--
ALTER TABLE `scan_history`
  ADD CONSTRAINT `fk_scan_history_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_plants`
--
ALTER TABLE `user_plants`
  ADD CONSTRAINT `fk_user_plants_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_tasks`
--
ALTER TABLE `user_tasks`
  ADD CONSTRAINT `fk_user_tasks_plant` FOREIGN KEY (`plant_id`) REFERENCES `user_plants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_tasks_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_categories`
--
ALTER TABLE `wishlist_categories`
  ADD CONSTRAINT `fk_wishlist_categories_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `fk_wishlist_items_category` FOREIGN KEY (`category_id`) REFERENCES `wishlist_categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_wishlist_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_items_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE;
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
