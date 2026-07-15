-- 1. Buat Database
CREATE DATABASE IF NOT EXISTS `kebunin_v2` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kebunin_v2`;

-- 2. Buat Tabel `profiles`
CREATE TABLE IF NOT EXISTS `profiles` (
  `id` VARCHAR(255) NOT NULL,
  `display_name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL UNIQUE,
  `password_hash` VARCHAR(255) NULL,
  `avatar_url` TEXT NULL,
  `coins` INT NOT NULL DEFAULT 0,
  `streak` INT NOT NULL DEFAULT 0,
  `level` INT NOT NULL DEFAULT 1,
  `xp` INT NOT NULL DEFAULT 0,
  `shop_description` TEXT NULL,
  `shop_address` TEXT NULL,
  `shop_whatsapp` VARCHAR(50) NULL,
  `shop_latitude` DECIMAL(10, 8) NULL,
  `shop_longitude` DECIMAL(11, 8) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Buat Tabel `user_roles`
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'user') NOT NULL DEFAULT 'user',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_role` (`user_id`, `role`),
  CONSTRAINT `fk_user_roles_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Buat Tabel `products`
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` INT NOT NULL,
  `coin` INT NOT NULL,
  `image_url` TEXT NULL,
  `description` TEXT NULL,
  `admin_id` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_products_admin` FOREIGN KEY (`admin_id`) REFERENCES `profiles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Buat Tabel `user_plants`
CREATE TABLE IF NOT EXISTS `user_plants` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Sehat',
  `days` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_plants_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Buat Tabel `user_tasks`
CREATE TABLE IF NOT EXISTS `user_tasks` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `time` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `curative` BOOLEAN NOT NULL DEFAULT FALSE,
  `is_done` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_tasks_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Buat Tabel `scan_history`
CREATE TABLE IF NOT EXISTS `scan_history` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `image_url` MEDIUMTEXT NULL,
  `disease` VARCHAR(255) NOT NULL,
  `confidence` FLOAT NOT NULL,
  `summary` TEXT NOT NULL,
  `steps` TEXT NOT NULL,
  `recommended_products` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_scan_history_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Buat Tabel `plant_suggestions`
CREATE TABLE IF NOT EXISTS `plant_suggestions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `suggested_plant` VARCHAR(255) NOT NULL,
  `suggestion_text` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_plant_suggestions_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed default products
INSERT INTO `products` (`id`, `name`, `price`, `coin`, `image_url`, `description`)
VALUES 
('p1', 'Bibit Cabai Rawit', 15000, 30, NULL, 'Bibit cabai rawit unggulan, cepat tumbuh dan berbuah lebat.'),
('p2', 'Pupuk Organik 1kg', 25000, 50, NULL, 'Pupuk organik penyubur tanah, aman dan ramah lingkungan.'),
('p3', 'Pot Tanah Liat', 18000, 35, NULL, 'Pot tanah liat estetis untuk tanaman hias atau sayur.'),
('p4', 'Sekam Bakar', 12000, 24, NULL, 'Media tanam gembur untuk sirkulasi air yang baik.'),
('p5', 'Semprotan Mist', 22000, 45, NULL, 'Semprotan air halus cocok untuk persemaian bibit.'),
('p6', 'Bibit Mint', 10000, 20, NULL, 'Bibit daun mint segar, wangi dan cocok untuk teh.')
ON DUPLICATE KEY UPDATE 
`name` = VALUES(`name`), 
`price` = VALUES(`price`), 
`coin` = VALUES(`coin`);

-- 9. Buat Tabel `wishlist_categories`
CREATE TABLE IF NOT EXISTS `wishlist_categories` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_wishlist_categories_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Buat Tabel `wishlist_items`
CREATE TABLE IF NOT EXISTS `wishlist_items` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(255) NOT NULL,
  `product_id` VARCHAR(255) NOT NULL,
  `category_id` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_wishlist_items_profile` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_items_category` FOREIGN KEY (`category_id`) REFERENCES `wishlist_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

