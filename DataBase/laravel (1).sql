-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3307
-- Thời gian đã tạo: Th1 07, 2026 lúc 11:50 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `laravel`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `street` varchar(255) NOT NULL,
  `recipient_name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `district` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart_item`
--

CREATE TABLE `cart_item` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cart_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `color` text NOT NULL,
  `storage` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `icon`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'iPhone', 'iphone', NULL, 0, NULL, NULL),
(2, 'iPad', 'ipad', NULL, 0, NULL, NULL),
(3, 'Mac', 'mac', NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `coupon`
--

CREATE TABLE `coupon` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `value` int(11) NOT NULL,
  `min_order_amount` int(11) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '2024_01_01_000000_create_category_table', 1),
(3, '2024_01_01_000001_create_coupon_table', 1),
(4, '2025_01_01_185800_create_product', 1),
(5, '2025_01_01_190645_create_product_coupon', 1),
(6, '2025_12_31_160642_create_product_color_table', 1),
(7, '2026_01_01_143349_create__product_spec', 1),
(8, '2026_01_01_150021_create__product_image', 1),
(9, '2026_01_01_151806_create__product_storage', 1),
(10, '2026_01_03_110725_create_review', 1),
(11, '2026_01_04_115945_create__cart', 1),
(12, '2026_01_04_135245_create__cart_item', 1),
(13, '2026_01_04_140638_add_google_id_to_users_table', 1),
(14, '2026_01_04_142106_create__address', 1),
(15, '2026_01_04_144157_add_verify_to_user', 1),
(16, '2026_01_04_161618_create_personal_access_tokens_table', 1),
(17, '2026_01_04_163816_add_role_to_users_table', 1),
(18, '2026_01_04_165428_create__order', 1),
(19, '2026_01_04_170339_create__order_item', 1),
(20, '2026_01_06_044415_create_cache_table', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `address_id` bigint(20) UNSIGNED NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(255) NOT NULL,
  `shipping_fee` decimal(10,2) NOT NULL,
  `tracking_number` text DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_item`
--

CREATE TABLE `order_item` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(10) UNSIGNED NOT NULL,
  `price_at_purchase` decimal(10,2) UNSIGNED NOT NULL,
  `color` text NOT NULL,
  `storage` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `original_price` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 1,
  `is_new` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `rating` double NOT NULL DEFAULT 0,
  `review_count` int(11) NOT NULL DEFAULT 0,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` varchar(255) DEFAULT NULL,
  `is_delete` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `category_id`, `name`, `description`, `price`, `original_price`, `status`, `is_new`, `is_featured`, `rating`, `review_count`, `seo_title`, `seo_description`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 1, 'iPhone 15 Pro Max', 'iPhone 15 Pro Max với chip A17 Pro, camera 48MP và khung Titanium cao cấp.', 34990000, 36990000, 1, 1, 1, 4.9, 2840, NULL, NULL, 0, '2026-01-07 04:49:15', '2026-01-07 04:49:15'),
(2, 2, 'iPad Pro M4', 'iPad Pro với chip M4 mới nhất, màn hình Ultra Retina XDR và Apple Pencil Pro.', 28990000, 31990000, 1, 1, 1, 4.9, 1567, NULL, NULL, 0, '2026-01-07 04:49:15', '2026-01-07 04:49:15'),
(3, 3, 'MacBook Pro 16\" M3 Max', 'MacBook Pro 16\" với chip M3 Max cực mạnh, màn hình Liquid Retina XDR.', 89990000, 95990000, 1, 1, 1, 4.9, 987, NULL, NULL, 0, '2026-01-07 04:49:15', '2026-01-07 04:49:15'),
(4, 3, 'MacBook Air M3', 'MacBook Air siêu mỏng với chip M3, thiết kế không quạt.', 27990000, NULL, 1, 0, 1, 4.8, 2456, NULL, NULL, 0, '2026-01-07 04:49:15', '2026-01-07 04:49:15'),
(5, 1, 'iPhone 15 Pro', 'iPhone 15 Pro với thiết kế Titanium siêu nhẹ và chip A17 Pro mạnh mẽ.', 28990000, 30990000, 1, 1, 0, 4.8, 1923, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(6, 1, 'iPhone 15', 'iPhone 15 với Dynamic Island, camera 48MP và cổng USB-C tiện lợi.', 22990000, NULL, 1, 0, 0, 4.7, 3421, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(7, 2, 'iPad Air M2', 'iPad Air với chip M2 mạnh mẽ, thiết kế siêu mỏng và màn hình Liquid Retina.', 18990000, NULL, 1, 0, 0, 4.8, 2134, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(8, 2, 'iPad (Gen 10)', 'iPad thế hệ mới với thiết kế tràn viền, chip A14 Bionic và USB-C.', 12990000, NULL, 1, 0, 0, 4.6, 1876, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(9, 3, 'MacBook Pro 14\" M3 Pro', 'MacBook Pro 14\" với chip M3 Pro, hiệu năng chuyên nghiệp.', 49990000, NULL, 1, 0, 0, 4.8, 1234, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(10, 3, 'MacBook Air M3', 'MacBook Air siêu mỏng với chip M3, thiết kế không quạt.', 27990000, NULL, 1, 0, 1, 4.8, 2456, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(11, 1, 'Apple Watch Series 9', 'Đồng hồ thông minh mới nhất với chip S9, đo oxy máu và tính năng cử chỉ chạm hai lần.', 10990000, 12000000, 1, 1, 0, 4.7, 550, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(12, 1, 'AirPods Pro (Gen 2) USB-C', 'Tai nghe chống ồn chủ động tốt nhất với chip H2, âm thanh không gian.', 6490000, 7500000, 1, 0, 1, 4.9, 6800, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(13, 2, 'iPad mini 6', 'iPad nhỏ gọn với chip A15 Bionic và thiết kế toàn màn hình.', 14990000, NULL, 1, 0, 0, 4.5, 920, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(14, 3, 'iMac 24 inch M3', 'Máy tính để bàn All-in-one mỏng nhẹ với chip M3 mạnh mẽ.', 34990000, NULL, 1, 1, 0, 4.7, 710, NULL, NULL, 0, '2026-01-07 05:03:32', '2026-01-07 05:03:32'),
(15, 1, 'iPhone 14 Pro Max', 'Phiên bản tiền nhiệm mạnh mẽ, chip A16 Bionic.', 24990000, 27990000, 1, 0, 0, 4.6, 5120, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(16, 1, 'iPhone 13', 'Chiếc iPhone tiêu chuẩn với hiệu năng ổn định.', 16990000, 19990000, 1, 0, 0, 4.4, 7800, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(17, 2, 'iPad Pro 12.9 inch (Gen 6)', 'Phiên bản màn hình lớn, chip M2, lý tưởng cho đồ họa.', 35990000, 39990000, 1, 0, 1, 4.7, 1150, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(18, 3, 'MacBook Air 15\" M2', 'Màn hình lớn, hiệu năng M2 siêu mỏng nhẹ.', 32990000, 34990000, 1, 0, 1, 4.8, 1400, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(19, 3, 'Mac mini M2', 'Máy tính để bàn nhỏ gọn với chip M2.', 17990000, 19990000, 1, 0, 0, 4.5, 800, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(20, 1, 'Apple Pencil Pro', 'Bút cảm ứng thế hệ mới với các tính năng chuyên nghiệp.', 3890000, NULL, 1, 1, 0, 4.9, 450, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(21, 2, 'Magic Keyboard cho iPad', 'Bàn phím và trackpad cao cấp cho iPad Pro.', 8990000, 9500000, 1, 0, 0, 4.6, 620, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(22, 3, 'Studio Display', 'Màn hình 27 inch 5K Retina chất lượng studio.', 49990000, NULL, 1, 0, 1, 4.7, 300, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(23, 1, 'HomePod (Gen 2)', 'Loa thông minh với âm thanh độ trung thực cao.', 8490000, 8990000, 1, 0, 0, 4.5, 250, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19'),
(24, 1, 'Apple Watch Ultra 2', 'Đồng hồ thể thao bền bỉ, màn hình sáng nhất.', 21990000, 23500000, 1, 1, 1, 4.9, 780, NULL, NULL, 0, '2026-01-07 06:39:19', '2026-01-07 06:39:19');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productcoupon`
--

CREATE TABLE `productcoupon` (
  `coupon_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_color`
--

CREATE TABLE `product_color` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `hex_code` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_color`
--

INSERT INTO `product_color` (`id`, `product_id`, `name`, `hex_code`, `created_at`, `updated_at`) VALUES
(1, 1, 'Titan Tự nhiên', '#8F8A81', '2026-01-07 04:52:33', '2026-01-07 04:52:33'),
(2, 1, 'Titan Xanh', '#394C5A', '2026-01-07 04:52:33', '2026-01-07 04:52:33'),
(3, 1, 'Titan Trắng', '#F0F0EB', '2026-01-07 04:52:33', '2026-01-07 04:52:33'),
(4, 1, 'Titan Đen', '#3C3C3D', '2026-01-07 04:52:33', '2026-01-07 04:52:33'),
(9, 5, 'Titan Tự nhiên', '#8F8A81', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(10, 5, 'Titan Xanh', '#394C5A', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(11, 5, 'Titan Trắng', '#F0F0EB', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(12, 5, 'Titan Đen', '#3C3C3D', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(13, 6, 'Hồng', '#FADDD4', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(14, 6, 'Vàng', '#F9E5C9', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(15, 6, 'Xanh lá', '#CAD4C5', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(16, 6, 'Xanh dương', '#D4E4ED', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(17, 6, 'Đen', '#3C3C3D', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(18, 7, 'Xám không gian', '#1D1D1F', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(19, 7, 'Ánh sao', '#F0E4D3', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(20, 7, 'Tím', '#B9B8D1', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(21, 7, 'Xanh dương', '#88AECE', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(22, 8, 'Bạc', '#E3E4E5', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(23, 8, 'Xanh dương', '#6EB5FF', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(24, 8, 'Hồng', '#F9D1C7', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(25, 8, 'Vàng', '#F5E6A3', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(26, 9, 'Bạc', '#E3E4E5', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(27, 9, 'Xám không gian', '#1D1D1F', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(28, 10, 'Midnight', '#2E3642', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(29, 10, 'Starlight', '#F0E4D3', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(30, 10, 'Xám không gian', '#1D1D1F', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(31, 10, 'Bạc', '#E3E4E5', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(32, 11, 'Đen', '#000000', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(33, 12, 'Đen', '#000000', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(34, 13, 'Đen', '#000000', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(35, 14, 'Đen', '#000000', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(39, 11, 'Trắng', '#FFFFFF', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(40, 12, 'Trắng', '#FFFFFF', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(41, 13, 'Trắng', '#FFFFFF', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(42, 14, 'Trắng', '#FFFFFF', '2026-01-07 06:36:39', '2026-01-07 06:36:39'),
(46, 11, 'Bạc', '#E3E4E5', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(47, 11, 'Xám không gian', '#1D1D1F', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(48, 12, 'Trắng tinh khôi', '#FFFFFF', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(49, 12, 'Đen huyền bí', '#3C3C3D', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(50, 13, 'Xanh dương', '#4E4CED', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(51, 14, 'Tím', '#B9B8D1', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(52, 15, 'Trắng', '#FFFFFF', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(53, 16, 'Xanh lá', '#3D6B57', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(54, 17, 'Xám không gian', '#1D1D1F', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(55, 18, 'Đen', '#3C3C3D', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(56, 19, 'Bạc', '#E3E4E5', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(57, 20, 'Trắng', '#FFFFFF', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(58, 21, 'Đen', '#3C3C3D', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(59, 22, 'Trắng', '#FFFFFF', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(60, 23, 'Đen', '#3C3C3D', '2026-01-07 10:41:23', '2026-01-07 10:41:23'),
(61, 24, 'Xanh dương', '#4E4CED', '2026-01-07 10:41:23', '2026-01-07 10:41:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_image`
--

CREATE TABLE `product_image` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_main` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_image`
--

INSERT INTO `product_image` (`id`, `product_id`, `image_url`, `is_main`, `created_at`, `updated_at`) VALUES
(1, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=60', '1', '2026-01-07 04:53:48', '2026-01-07 04:53:48'),
(2, 1, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/42/305658/iphone-15-pro-max-titan-xanh-2-638629415445427350-750x500.jpg', '0', '2026-01-07 04:53:48', '2026-01-07 04:53:48'),
(3, 5, 'https://cdn.tgdd.vn/Products/Images/42/305660/iphone-15-pro-max-gold-thumbnew-600x600.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(4, 5, 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg', '0', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(5, 6, 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-xanh-thumb-600x600.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(6, 7, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/1363/331585/mieng-dan-man-hinh-ipad-air-11-inch-2024-jcpal-papertech-thumb-638659926944729631-600x600.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(7, 8, 'https://cdn.tgdd.vn/Products/Images/522/295452/ipad-10-wifi-cellular-sliver-thumb-600x600.jpeg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(8, 9, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/1363/327860/bo-dan-macbook-pro-16-inch-6-in-1-innostyle-iscs2485-thumb-638942205116010300-600x600.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(9, 10, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/1363/327354/mieng-dan-man-hinh-macbook-m2-15-inch-innostyle-thumb-1-638840481135214719-600x600.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(10, 11, 'https://cdnv2.tgdd.vn/mwg-static/common/News/Thumb/1582472/apple-watch-s-11638931866382960302.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(11, 12, 'https://cdn.tgdd.vn/Files/2022/01/07/1409694/apple-airpod-pro-2-thumb-tgdd_1280x720-300x200.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(12, 13, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1572767/ipad-mini-7-t638689025427719659.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(13, 14, 'https://cdn.tgdd.vn/Files/2023/11/07/1554261/thumbnailreview2021copy-071123-144917-300x200.jpg', '1', '2026-01-07 06:38:30', '2026-01-07 06:38:30'),
(17, 15, 'https://cdn.tgdd.vn/Products/Images/42/289700/s16/iphone-14-pro-max-black-1-2-650x650.png', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(18, 16, 'https://cdn.tgdd.vn/Products/Images/42/240259/s16/iphone-14-blue-1-2-650x650.png', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(19, 17, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1587772/esr-t639025297541079698.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(20, 18, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1579152/2638859279368676900.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(21, 19, 'https://cdn.tgdd.vn/Files/2023/01/23/1504597/tren-tay-mac-mini-m2-2023-thumb_800x450-300x200.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(22, 20, 'https://cdn.tgdd.vn/Products/Images/1882/325539/apple-pencil-pro-600x600.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(23, 21, 'https://cdn.tgdd.vn/Products/Images/4547/325540/magic-keyboard-cho-ipad-pro-m4-11-inch-600x600.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(24, 22, 'https://cdn.tgdd.vn/Products/Images/5697/274150/apple-studio-display-27-5k-retina-thumb-600x600.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(25, 23, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/13358/330441/goi-bao-hanh-applecare-cho-apple-studio-display-011024-020642-265-600x600.jpg', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(26, 24, 'https://cdn.tgdd.vn/Products/Images/7077/329719/apple-watch-ultra-2-gps-cellular-49mm-vien-titanium-day-alpine-xanh-den-600x600.png', '1', '2026-01-07 10:31:02', '2026-01-07 10:31:02'),
(27, 2, 'https://cdn.tgdd.vn/Products/Images/522/358082/ipad-pro-m5-wifi-11-inch-black-thumb-600x600.jpg', '1', '2026-01-07 10:35:39', '2026-01-07 10:35:39'),
(28, 3, 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Banner/e0/a7/e0a750c90a088fe723f121a07a5aac26.png', '1', '2026-01-07 10:35:39', '2026-01-07 10:35:39'),
(29, 4, 'https://cdn.tgdd.vn/Products/Images/44/335369/macbook-air-13-inch-m4-xanh-da-troi-600x600.jpg', '1', '2026-01-07 10:35:39', '2026-01-07 10:35:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_spec`
--

CREATE TABLE `product_spec` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `label` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_spec`
--

INSERT INTO `product_spec` (`id`, `product_id`, `label`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 'Màn hình', '6.7\" Super Retina XDR', '2026-01-07 04:53:21', '2026-01-07 04:53:21'),
(2, 1, 'Chip', 'A17 Pro', '2026-01-07 04:53:21', '2026-01-07 04:53:21'),
(3, 1, 'Camera', '48MP + 12MP + 12MP', '2026-01-07 04:53:21', '2026-01-07 04:53:21'),
(4, 1, 'Pin', '4422 mAh', '2026-01-07 04:53:21', '2026-01-07 04:53:21'),
(5, 5, 'Màn hình', '6.1\" Super Retina XDR', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(6, 5, 'Chip', 'A17 Pro', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(7, 5, 'Camera', '48MP + 12MP + 12MP', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(8, 5, 'Pin', '3274 mAh', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(9, 6, 'Màn hình', '6.1\" Super Retina XDR', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(10, 6, 'Chip', 'A16 Bionic', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(11, 6, 'Camera', '48MP + 12MP', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(12, 6, 'Pin', '3349 mAh', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(13, 7, 'Màn hình', '10.9\" Liquid Retina', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(14, 7, 'Chip', 'Apple M2', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(15, 7, 'Camera', '12MP Wide', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(16, 7, 'Touch ID', 'Có', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(17, 8, 'Màn hình', '10.9\" Liquid Retina', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(18, 8, 'Chip', 'A14 Bionic', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(19, 8, 'Camera', '12MP Wide', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(20, 8, 'Touch ID', 'Có', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(21, 9, 'Màn hình', '14.2\" Liquid Retina XDR', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(22, 9, 'Chip', 'Apple M3 Pro', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(23, 9, 'RAM', '18GB', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(24, 9, 'Pin', 'Lên đến 17 giờ', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(25, 10, 'Màn hình', '13.6\" Liquid Retina', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(26, 10, 'Chip', 'Apple M3', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(27, 10, 'RAM', '8GB', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(28, 10, 'Pin', 'Lên đến 18 giờ', '2026-01-07 06:37:42', '2026-01-07 06:37:42'),
(29, 11, 'Chip', 'S9 SiP', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(30, 11, 'Tính năng', 'Double Tap', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(31, 11, 'Độ sáng màn hình', '2000 nits', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(32, 11, 'Chống nước', '50m', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(33, 12, 'Chip', 'H2', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(34, 12, 'Tính năng chính', 'Khử tiếng ồn chủ động (ANC)', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(35, 12, 'Cổng sạc', 'USB-C', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(36, 13, 'Chip', 'A15 Bionic', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(37, 13, 'Màn hình', '8.3 inch Liquid Retina', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(38, 13, 'Camera trước', '12MP Siêu rộng', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(39, 13, 'Touch ID', 'Tích hợp nút nguồn', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(40, 14, 'Chip', 'Apple M3', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(41, 14, 'Màn hình', '24 inch 4.5K Retina', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(42, 14, 'RAM', '8GB/16GB/24GB', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(43, 14, 'Thiết kế', '7 màu sắc', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(44, 15, 'Chip', 'A16 Bionic', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(45, 15, 'Màn hình', '6.7 inch Super Retina XDR', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(46, 15, 'Tính năng', 'Dynamic Island', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(47, 16, 'Chip', 'A15 Bionic', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(48, 16, 'Màn hình', '6.1 inch Super Retina XDR', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(49, 16, 'Camera chính', '12MP + 12MP', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(50, 17, 'Chip', 'Apple M2', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(51, 17, 'Công nghệ màn hình', 'Liquid Retina XDR', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(52, 17, 'Tương thích', 'Apple Pencil 2, Magic Keyboard', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(53, 18, 'Chip', 'Apple M2', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(54, 18, 'Kích thước', '15.3 inch', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(55, 18, 'Độ dày', '11.5mm', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(56, 19, 'Chip', 'Apple M2', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(57, 19, 'Cổng kết nối', 'Thunderbolt 4, HDMI', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(58, 19, 'Loại', 'Máy tính để bàn mini', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(59, 20, 'Tính năng', 'Squash, Barrel Roll, Haptic Feedback', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(60, 20, 'Tương thích', 'iPad Pro M4', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(61, 21, 'Tính năng', 'Trackpad đa điểm, Phím có đèn nền', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(62, 21, 'Kết nối', 'Smart Connector', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(63, 22, 'Độ phân giải', '5K Retina', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(64, 22, 'Kích thước', '27 inch', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(65, 22, 'Camera', '12MP với Center Stage', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(66, 23, 'Chip', 'S7', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(67, 23, 'Âm thanh', 'Độ trung thực cao 360 độ', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(68, 23, 'Cảm biến', 'Nhiệt độ và độ ẩm', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(69, 24, 'Chip', 'S9 SiP', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(70, 24, 'Độ sáng màn hình', '3000 nits', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(71, 24, 'Tính năng', 'Nút Action tùy chỉnh', '2026-01-07 10:47:50', '2026-01-07 10:47:50'),
(72, 24, 'Chống nước', '100m', '2026-01-07 10:47:50', '2026-01-07 10:47:50');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_storage`
--

CREATE TABLE `product_storage` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `value` varchar(255) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_storage`
--

INSERT INTO `product_storage` (`id`, `product_id`, `value`, `stock_quantity`, `created_at`, `updated_at`) VALUES
(1, 1, '256GB', 50, '2026-01-07 04:52:58', '2026-01-07 04:52:58'),
(2, 1, '512GB', 30, '2026-01-07 04:52:58', '2026-01-07 04:52:58'),
(3, 1, '1TB', 10, '2026-01-07 04:52:58', '2026-01-07 04:52:58'),
(4, 5, '128GB', 50, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(5, 5, '256GB', 40, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(6, 5, '512GB', 25, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(7, 5, '1TB', 10, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(8, 6, '128GB', 70, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(9, 6, '256GB', 55, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(10, 6, '512GB', 30, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(11, 7, '128GB', 65, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(12, 7, '256GB', 40, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(13, 7, '512GB', 20, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(14, 7, '1TB', 10, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(15, 8, '64GB', 80, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(16, 8, '256GB', 50, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(17, 9, '512GB', 40, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(18, 9, '1TB', 25, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(19, 9, '2TB', 10, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(20, 10, '256GB', 60, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(21, 10, '512GB', 40, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(22, 10, '1TB', 15, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(23, 11, '256GB', 30, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(24, 12, '256GB', 30, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(25, 13, '256GB', 30, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(26, 14, '256GB', 30, '2026-01-07 06:37:20', '2026-01-07 06:37:20'),
(30, 11, '64GB', 75, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(31, 11, '128GB', 35, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(32, 12, 'Hộp sạc', 120, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(33, 13, '64GB', 50, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(34, 13, '256GB', 25, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(35, 14, '256GB SSD', 40, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(36, 14, '512GB SSD', 20, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(37, 15, '256GB', 60, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(38, 15, '512GB', 30, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(39, 15, '1TB', 10, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(40, 16, '128GB', 90, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(41, 16, '256GB', 45, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(42, 17, '512GB', 20, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(43, 17, '1TB', 8, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(44, 18, '512GB SSD', 35, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(45, 18, '1TB SSD', 15, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(46, 19, '256GB SSD', 50, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(47, 19, '512GB SSD', 25, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(48, 20, '1', 150, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(49, 21, '1', 90, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(50, 22, '1', 15, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(51, 23, '1', 60, '2026-01-07 10:50:02', '2026-01-07 10:50:02'),
(52, 24, '64GB', 40, '2026-01-07 10:50:02', '2026-01-07 10:50:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review`
--

CREATE TABLE `review` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('dBrtdVf0a1ZRmmbmEUvUjOjeVHgn14JCJIReIn9z', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoic1daRDlNc012N1lQSm1zUVZFSk1rYmxUYmczSFM5MXNuZFZ4aFF6YyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767779497),
('vDyvUpupe2JBEJmb7GTXQC73YKlbIe1JfySmXaUV', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiN0FaZDVVb1BjMWI3UXRBT1hGYUdRM0xlVTcxUHh0U1UxeVBPZVN2QSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9sb2dpbiI7czo1OiJyb3V0ZSI7czo1OiJsb2dpbiI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1767761874);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `current_team_id` bigint(20) UNSIGNED DEFAULT NULL,
  `profile_photo_path` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `code` varchar(255) DEFAULT NULL,
  `code_expires_at` timestamp NULL DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `email_verified_at`, `password`, `remember_token`, `current_team_id`, `profile_photo_path`, `created_at`, `updated_at`, `is_verified`, `code`, `code_expires_at`, `role`) VALUES
(1, 'Test User', 'test@example.com', NULL, '2026-01-06 21:28:06', '$2y$12$jVS/YOfOEAd1H2zNTCZfveBe38bp8XlTS4/L2dMJUraZ3oj7LBuiu', 'Ap41ph4SRL', NULL, NULL, '2026-01-06 21:28:07', '2026-01-06 21:28:07', 0, NULL, NULL, 'user');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `_cart`
--

CREATE TABLE `_cart` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `address_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Chỉ mục cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_item_cart_id_foreign` (`cart_id`),
  ADD KEY `cart_item_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `category_slug_unique` (`slug`);

--
-- Chỉ mục cho bảng `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `coupon_code_unique` (`code`);

--
-- Chỉ mục cho bảng `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_user_id_foreign` (`user_id`),
  ADD KEY `order_address_id_foreign` (`address_id`);

--
-- Chỉ mục cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_order_id_foreign` (`order_id`),
  ADD KEY `order_item_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_category_id_foreign` (`category_id`);

--
-- Chỉ mục cho bảng `productcoupon`
--
ALTER TABLE `productcoupon`
  ADD PRIMARY KEY (`coupon_id`,`product_id`),
  ADD KEY `productcoupon_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `product_color`
--
ALTER TABLE `product_color`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_color_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `product_image`
--
ALTER TABLE `product_image`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_image_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `product_spec`
--
ALTER TABLE `product_spec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_spec_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `product_storage`
--
ALTER TABLE `product_storage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_storage_product_id_foreign` (`product_id`);

--
-- Chỉ mục cho bảng `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `review_product_id_foreign` (`product_id`),
  ADD KEY `review_user_id_foreign` (`user_id`);

--
-- Chỉ mục cho bảng `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_google_id_unique` (`google_id`);

--
-- Chỉ mục cho bảng `_cart`
--
ALTER TABLE `_cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `_cart_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT cho bảng `product_color`
--
ALTER TABLE `product_color`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT cho bảng `product_image`
--
ALTER TABLE `product_image`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `product_spec`
--
ALTER TABLE `product_spec`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- AUTO_INCREMENT cho bảng `product_storage`
--
ALTER TABLE `product_storage`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT cho bảng `review`
--
ALTER TABLE `review`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `_cart`
--
ALTER TABLE `_cart`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `_cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_item_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_address_id_foreign` FOREIGN KEY (`address_id`) REFERENCES `address` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_item_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `productcoupon`
--
ALTER TABLE `productcoupon`
  ADD CONSTRAINT `productcoupon_coupon_id_foreign` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `productcoupon_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_color`
--
ALTER TABLE `product_color`
  ADD CONSTRAINT `product_color_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_image`
--
ALTER TABLE `product_image`
  ADD CONSTRAINT `product_image_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_spec`
--
ALTER TABLE `product_spec`
  ADD CONSTRAINT `product_spec_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `product_storage`
--
ALTER TABLE `product_storage`
  ADD CONSTRAINT `product_storage_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `review_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `_cart`
--
ALTER TABLE `_cart`
  ADD CONSTRAINT `_cart_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
