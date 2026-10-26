-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: zunodb
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `checkins`
--

DROP TABLE IF EXISTS `checkins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `checkins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` int(11) DEFAULT NULL,
  `day_number` int(11) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `mood` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `subscription_id` (`subscription_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `checkins`
--

LOCK TABLES `checkins` WRITE;
/*!40000 ALTER TABLE `checkins` DISABLE KEYS */;
/*!40000 ALTER TABLE `checkins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percent','fixed') NOT NULL DEFAULT 'percent',
  `discount_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_uses` int(11) DEFAULT NULL,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `min_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `applies_to` varchar(50) NOT NULL DEFAULT 'all',
  `valid_from` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
INSERT INTO `coupons` VALUES (5,'MR20','percent',20.00,NULL,2,0.00,'monthly','2026-05-10 08:22:00',NULL,1,'2026-05-10 08:21:51');
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_diet_plans`
--

DROP TABLE IF EXISTS `daily_diet_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `daily_diet_plans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `plan_date` date NOT NULL,
  `meal_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meal_json`)),
  `is_unlocked` tinyint(1) DEFAULT 0,
  `unlocked_at` datetime DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `meal_changes_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_day_plan` (`subscription_id`,`day_number`),
  CONSTRAINT `fk_diet_subscription` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_diet_plans`
--

LOCK TABLES `daily_diet_plans` WRITE;
/*!40000 ALTER TABLE `daily_diet_plans` DISABLE KEYS */;
INSERT INTO `daily_diet_plans` VALUES (174,12,1,'2026-10-25',NULL,0,NULL,'Admin',0),(175,13,1,'2026-10-26','{\"day_title\":\"Day 1: Anabolic Kickstart & Digestive Priming\",\"daily_objectives\":[\"Metabolic Surplus: Achieve target 2,650 kcal with nutrient-dense clean foods\",\"Protein Target: Reach 135g+ complete bioavailable protein for muscle synthesis\",\"Digestive Priming: Hydrate and stimulate digestive enzymes with warm cumin-ginger infusion\",\"Glycogen Saturation: Fuel energy levels with complex carbohydrates (oats, brown rice, bananas)\",\"Recovery & Growth: Night-time casein-rich milk with ashwagandha and crushed almonds\"],\"day_summary\":\"Today kickstarts your muscle-building and weight gain transformation. We focus on clean caloric surplus paired with high biological value proteins and slow-digesting complex carbs to keep your muscles fueled and prevent catabolism throughout the day.\",\"target_stats\":{\"calories\":2650,\"protein\":135,\"carbs\":340,\"fat\":80,\"fiber\":38},\"water_intake\":{\"total_liters\":3.5,\"schedule\":[\"6:30 AM - 500ml warm water with soaked chia seeds & lemon\",\"8:30 AM - 250ml water 30 minutes after breakfast\",\"11:00 AM - 500ml fresh coconut water or infused water\",\"1:00 PM - 250ml water before lunch\",\"3:30 PM - 500ml hydrating lemon mint water\",\"5:30 PM - 500ml during / after workout or snack\",\"8:30 PM - 250ml water after dinner\",\"10:00 PM - 250ml warm turmeric milk before sleep\"],\"tips\":[\"Never drink chilled water immediately with meals as it dilutes digestive juices\",\"Keep water sip-by-sip between meals to maintain steady cellular hydration\",\"Add a pinch of pink Himalayan salt to morning water for essential electrolytes\"]},\"timeline\":[{\"time\":\"6:30 AM\",\"title\":\"Wake-Up Ritual\",\"type\":\"ritual\",\"items\":[{\"name\":\"Warm Jeera-Adrak Infusion with Soaked Almonds & Walnuts\",\"quantity\":\"300ml warm infusion + 6 soaked almonds & 2 walnut halves\",\"instruction\":\"Boil 1 tsp cumin seeds and grated ginger in 300ml water for 3 mins. Strain, add 1 tsp organic honey. Peel almonds and eat alongside.\",\"benefit\":[\"Awakens sluggish digestive fire (Agni) for high-calorie absorption\",\"Supplies vital Omega-3 fatty acids and zinc for testosterone and growth\",\"Reduces morning cortisol levels to promote anabolic state\"]}]},{\"time\":\"8:00 AM\",\"title\":\"Power Breakfast\",\"type\":\"meal\",\"name\":\"High-Calorie Morning Fuel\",\"option_1\":{\"name\":\"Peanut Butter Banana Oats Bowl with Whey & Chia Seeds\",\"calories\":620,\"protein\":34,\"carbs\":82,\"fat\":18,\"fiber\":10,\"ingredients\":[\"60g rolled whole grain oats\",\"250ml whole milk (full cream)\",\"1 large robusta banana (sliced)\",\"2 tbsp (32g) natural creamy peanut butter\",\"1 scoop (30g) whey protein (or 100g sattu flour)\",\"1 tbsp soaked chia seeds\"],\"preparation_steps\":[\"Cook oats in whole milk on low flame for 4-5 minutes until thick and creamy.\",\"Turn off flame and let it cool for 1 minute before whisking in peanut butter and whey.\",\"Top with sliced banana and soaked chia seeds. Drizzle 1 tsp honey if desired and serve warm.\"],\"benefits\":[\"Delivers 34g of high biological value protein for muscle repair\",\"Rich in potassium and complex carbohydrates for sustained morning stamina\",\"Healthy monounsaturated fats support healthy hormone balance and weight gain\"]},\"option_2\":{\"name\":\"Paneer Stuffed Multigrain Parathas with Spiced Curd & Mint Chutney\",\"calories\":610,\"protein\":30,\"carbs\":78,\"fat\":20,\"fiber\":9,\"ingredients\":[\"2 multigrain rotis/parathas (100g dough total)\",\"120g fresh grated low-salt paneer\",\"1 cup (200g) thick fresh curd/dahi\",\"1 tbsp chopped coriander, green chili, ajwain and jeera powder\",\"1 tsp pure desi cow ghee for roasting\"],\"preparation_steps\":[\"Mix grated paneer with ajwain, chopped coriander, chili, pinch of salt and amchur.\",\"Roll whole wheat dough, stuff generous paneer filling, roll gently into thick paratha.\",\"Cook on hot tawa with 1 tsp ghee until golden brown crispy spots appear.\",\"Serve hot with seasoned thick homemade curd and mint coriander chutney.\"],\"benefits\":[\"Dense source of slow-digesting casein protein and bioavailable calcium\",\"Ajwain and curd prevent digestive heaviness and support gut microbiome\",\"Healthy desi ghee provides butyric acid for gut health and calorie density\"]},\"suggestions\":\"Chew slowly. If feeling too full, sip a cup of warm water 30 minutes after breakfast.\"},{\"time\":\"11:00 AM\",\"title\":\"Mid-Morning Fuel\",\"type\":\"meal\",\"name\":\"Metabolic Booster\",\"calories\":280,\"protein\":14,\"carbs\":36,\"fat\":9,\"fiber\":4,\"ingredients\":[\"1 glass (300ml) rich roasted sattu buttermilk (namkeen lassi)\",\"30g roasted chana (Bengal gram)\",\"2 Medjool soft dates\"],\"preparation_steps\":[\"Blend 2 tbsp roasted sattu flour with cold curd/buttermilk, roasted cumin, black salt, and chilled water.\",\"Serve chilled in a tall glass alongside crunchy roasted chana and naturally sweet dates.\"],\"benefits\":[\"Sattu provides plant-based protein with low glycemic index\",\"Dates provide natural fructose and glucose for glycogen replenishment\",\"Curd base cools the internal system and aids in nutrient absorption\"]},{\"time\":\"1:30 PM\",\"title\":\"Anabolic Lunch\",\"type\":\"meal\",\"name\":\"Complete Balanced Feast\",\"option_1\":{\"name\":\"Punjabi Rajma Masala with Steamed Basmati Rice & Paneer Bhurji\",\"calories\":780,\"protein\":38,\"carbs\":105,\"fat\":22,\"fiber\":12,\"ingredients\":[\"1.5 katori (200g) slow-cooked red kidney beans (rajma) in onion-tomato gravy\",\"1.5 katori (180g) fragrant steamed basmati rice\",\"80g fresh paneer scrambled with cumin and turmeric (paneer bhurji)\",\"1 bowl fresh cucumber, carrot, and beetroot salad with lemon\",\"1 tsp homemade desi ghee over rice\"],\"preparation_steps\":[\"Pressure-cook soaked rajma until tender. Prepare gravy using mustard oil, hing, ginger-garlic, tomato puree, and spices.\",\"Simmer rajma in gravy for 15 minutes on low flame to bring rich consistency.\",\"Lightly toss paneer with turmeric and jeera in a pan for 2 minutes.\",\"Serve piping hot rajma over basmati rice topped with a spoonful of aromatic cow ghee.\"],\"benefits\":[\"Rajma and rice combine to form a complete essential amino acid profile\",\"Paneer bhurji adds quick bioavailable dairy protein to boost total count to 38g\",\"Beetroot and carrot provide dietary nitrates for enhanced blood circulation\"]},\"option_2\":{\"name\":\"Dal Makhani with Whole Wheat Tawa Rotis & Soya Matar Bhurji\",\"calories\":760,\"protein\":36,\"carbs\":98,\"fat\":24,\"fiber\":11,\"ingredients\":[\"1.5 katori (200g) home-style dal makhani (black urad dal with light cream)\",\"3 soft whole wheat rotis brushed with ghee\",\"1 bowl (100g) soya granules cooked with green peas (matar)\",\"1 bowl cucumber onion raita with roasted jeera\"],\"preparation_steps\":[\"Boil black urad dal and rajma overnight, slow simmer with tomato purée and mild spices.\",\"Rehydrate soya granules, sauté with green peas, onions, and garam masala.\",\"Puff hot phulkas on open flame and brush with ghee.\",\"Plate together with cool cucumber raita.\"],\"benefits\":[\"Black gram (urad dal) is an Ayurvedic powerhouse for muscle mass and vigor\",\"Soya granules provide dense vegetarian protein with complete amino profile\",\"Raita aids smooth digestion of rich legumes\"]},\"suggestions\":\"Take a 10-minute relaxed stroll after lunch to aid gastric emptying.\"},{\"time\":\"5:00 PM\",\"title\":\"Evening Pre-Workout / Power Snack\",\"type\":\"meal\",\"name\":\"High-Energy Fuel\",\"calories\":360,\"protein\":16,\"carbs\":52,\"fat\":10,\"fiber\":6,\"ingredients\":[\"2 slices 100% whole grain brown bread\",\"1.5 tbsp peanut butter\",\"1 ripe banana (sliced)\",\"1 cup (200ml) green tea or herbal cardamom tea\"],\"preparation_steps\":[\"Toast bread slices until crisp and golden.\",\"Spread peanut butter evenly and top with banana slices with a sprinkle of cinnamon powder.\",\"Pair with hot steeped green tea without refined sugar.\"],\"benefits\":[\"Provides rapid and sustained carbohydrates for evening physical energy\",\"Cinnamon helps regulate insulin sensitivity and shuttles glucose into muscle cells\",\"Protects muscle tissue from breaking down during evening activities\"]},{\"time\":\"8:00 PM\",\"title\":\"Nutrient-Dense Dinner\",\"type\":\"meal\",\"name\":\"Rebuilding Supper\",\"option_1\":{\"name\":\"Palak Paneer with Jeera Rice & Moong Dal Tadka\",\"calories\":610,\"protein\":33,\"carbs\":65,\"fat\":22,\"fiber\":7,\"ingredients\":[\"150g firm paneer cubes simmered in spiced spinach (palak) gravy\",\"1 katori (120g) steamed jeera rice\",\"1 katori (150g) yellow moong dal with garlic tadka\",\"2 soft warm rotis\"],\"preparation_steps\":[\"Blanch fresh palak leaves, ice-shock to retain chlorophyll green color, purée with green chilies.\",\"Sauté garlic, onions, tomatoes in 1 tsp oil, add palak purée and simmer.\",\"Fold in fresh paneer cubes and a pinch of garam masala.\",\"Serve with light moong dal and freshly cooked warm jeera rice.\"],\"benefits\":[\"Spinach delivers iron and magnesium to promote deep cellular repair during sleep\",\"Paneer delivers nocturnal amino acids preventing overnight muscle loss\",\"Yellow moong dal is gentle on the stomach for night digestion\"]},\"option_2\":{\"name\":\"Chole Masala with Vegetable Pulao & Cucumber Boondi Raita\",\"calories\":620,\"protein\":31,\"carbs\":72,\"fat\":20,\"fiber\":8,\"ingredients\":[\"1.5 katori (200g) Amritsari chickpea (chole) curry\",\"1.5 katori (180g) vegetable pulao (rice with carrots, peas, beans)\",\"1 bowl chilled cucumber boondi raita\"],\"preparation_steps\":[\"Soak chickpeas overnight with tea bag for dark authentic color, pressure-cook with cloves.\",\"Simmer in aromatic onion-tomato ginger gravy with roasted anardana (pomegranate seed powder).\",\"Serve with vegetable-studded pulao and refreshing raita.\"],\"benefits\":[\"Chickpeas provide dense prebiotic fiber and plant protein\",\"Antioxidants from whole spices reduce exercise-induced inflammation\",\"Complex carbs promote serotonin release for quality deep sleep\"]},\"suggestions\":\"Finish dinner at least 2 hours before bedtime for optimal sleep quality and growth hormone release.\"},{\"time\":\"10:00 PM\",\"title\":\"Bedtime Anabolic Ritual\",\"type\":\"ritual\",\"items\":[{\"name\":\"Warm Ashwagandha Golden Milk with Crushed Pistachios\",\"quantity\":\"250ml warm whole milk + 1/2 tsp ashwagandha + pinch nutmeg\",\"instruction\":\"Gently warm whole milk with half tsp ashwagandha powder, a pinch of turmeric and nutmeg. Garnish with crushed pistachios. Drink lukewarm 30 mins before sleeping.\",\"benefit\":[\"Supplies slow-release casein protein to nourish muscle tissue all night\",\"Ashwagandha reduces cortisol and elevates natural testosterone & growth hormone\",\"Nutmeg and warm milk enhance deep restorative REM sleep\"]}]}],\"daily_dos\":[\"Eat every 3 to 3.5 hours consistently to keep your body in an anabolic growth state\",\"Maintain total water intake of 3.5 liters evenly distributed through the daytime\",\"Prioritize 7.5 to 8 hours of uninterrupted sleep for optimal muscle protein synthesis\",\"Focus on progressive overload movements (squats, pushups, pullups) if training today\"],\"daily_donts\":[\"Do not skip meals or let more than 4 hours pass without protein intake\",\"Avoid filling up on empty calories like sodas, sugary sweets, or refined deep-fried junk\",\"Do not chug large quantities of water right with heavy meals\",\"Avoid intense cardio right before meals which may suppress appetite\"],\"summary_table\":{\"total_calories\":2650,\"focus\":\"Clean Caloric Surplus & Lean Muscle Synthesis\",\"expected_result\":\"Positive nitrogen balance, elevated daily energy, zero digestive bloat\",\"key_nutrients\":\"Complete Casein & Whey Protein, Complex Starches, Ashwagandha & Zinc\"}}',1,'2026-10-26 13:29:48','Admin',0),(176,13,2,'2026-10-27',NULL,0,NULL,'Admin',0),(177,13,3,'2026-10-28',NULL,0,NULL,'Admin',0),(178,13,4,'2026-10-29',NULL,0,NULL,'Admin',0),(179,13,5,'2026-10-30',NULL,0,NULL,'Admin',0),(180,13,6,'2026-10-31',NULL,0,NULL,'Admin',0),(181,13,7,'2026-11-01',NULL,0,NULL,'Admin',0),(182,13,8,'2026-11-02',NULL,0,NULL,'Admin',0),(183,13,9,'2026-11-03',NULL,0,NULL,'Admin',0),(184,13,10,'2026-11-04',NULL,0,NULL,'Admin',0),(185,13,11,'2026-11-05',NULL,0,NULL,'Admin',0),(186,13,12,'2026-11-06',NULL,0,NULL,'Admin',0),(187,13,13,'2026-11-07',NULL,0,NULL,'Admin',0),(188,13,14,'2026-11-08',NULL,0,NULL,'Admin',0),(189,13,15,'2026-11-09',NULL,0,NULL,'Admin',0),(190,13,16,'2026-11-10',NULL,0,NULL,'Admin',0),(191,13,17,'2026-11-11',NULL,0,NULL,'Admin',0),(192,13,18,'2026-11-12',NULL,0,NULL,'Admin',0),(193,13,19,'2026-11-13',NULL,0,NULL,'Admin',0),(194,13,20,'2026-11-14',NULL,0,NULL,'Admin',0),(195,13,21,'2026-11-15',NULL,0,NULL,'Admin',0),(196,13,22,'2026-11-16',NULL,0,NULL,'Admin',0),(197,13,23,'2026-11-17',NULL,0,NULL,'Admin',0),(198,13,24,'2026-11-18',NULL,0,NULL,'Admin',0),(199,13,25,'2026-11-19',NULL,0,NULL,'Admin',0),(200,13,26,'2026-11-20',NULL,0,NULL,'Admin',0),(201,13,27,'2026-11-21',NULL,0,NULL,'Admin',0),(202,13,28,'2026-11-22',NULL,0,NULL,'Admin',0),(203,13,29,'2026-11-23',NULL,0,NULL,'Admin',0),(204,13,30,'2026-11-24',NULL,0,NULL,'Admin',0);
/*!40000 ALTER TABLE `daily_diet_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_logs`
--

DROP TABLE IF EXISTS `daily_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `daily_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `weight_log` decimal(5,2) DEFAULT NULL,
  `mood_log` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_day_log` (`subscription_id`,`day_number`),
  CONSTRAINT `fk_log_subscription` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_logs`
--

LOCK TABLES `daily_logs` WRITE;
/*!40000 ALTER TABLE `daily_logs` DISABLE KEYS */;
INSERT INTO `daily_logs` VALUES (5,13,1,NULL,NULL,'','2026-10-26 07:58:53');
/*!40000 ALTER TABLE `daily_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generation_timers`
--

DROP TABLE IF EXISTS `generation_timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `generation_timers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` int(11) NOT NULL,
  `day_number` int(11) NOT NULL,
  `unlock_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `sub_day` (`subscription_id`,`day_number`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generation_timers`
--

LOCK TABLES `generation_timers` WRITE;
/*!40000 ALTER TABLE `generation_timers` DISABLE KEYS */;
/*!40000 ALTER TABLE `generation_timers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_metrics`
--

DROP TABLE IF EXISTS `health_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `health_metrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_id` int(11) NOT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `target_calories` int(11) DEFAULT NULL,
  `calculated_bmi` decimal(5,2) DEFAULT NULL,
  `calculated_calories` int(11) DEFAULT NULL,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_by_admin` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profile_id` (`profile_id`),
  CONSTRAINT `fk_health_metrics_profile` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_metrics`
--

LOCK TABLES `health_metrics` WRITE;
/*!40000 ALTER TABLE `health_metrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `health_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_logs`
--

DROP TABLE IF EXISTS `notification_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `sent_date` date NOT NULL,
  `sent_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_type_date` (`user_id`,`type`,`sent_date`),
  CONSTRAINT `notification_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_logs`
--

LOCK TABLES `notification_logs` WRITE;
/*!40000 ALTER TABLE `notification_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_preferences`
--

DROP TABLE IF EXISTS `notification_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_preferences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `onesignal_player_id` varchar(255) DEFAULT NULL,
  `water_reminder_enabled` tinyint(1) DEFAULT 0,
  `water_reminder_interval` int(11) DEFAULT 60,
  `water_reminder_start` time DEFAULT '08:00:00',
  `water_reminder_end` time DEFAULT '22:00:00',
  `meal_reminder_enabled` tinyint(1) DEFAULT 0,
  `breakfast_time` time DEFAULT '08:00:00',
  `lunch_time` time DEFAULT '12:30:00',
  `dinner_time` time DEFAULT '19:00:00',
  `period_reminder_enabled` tinyint(1) DEFAULT 0,
  `period_reminder_days_before` int(11) DEFAULT 2,
  `notifications_paused` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user` (`user_id`),
  CONSTRAINT `notification_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_preferences`
--

LOCK TABLES `notification_preferences` WRITE;
/*!40000 ALTER TABLE `notification_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `period_logs`
--

DROP TABLE IF EXISTS `period_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `period_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `is_period_day` tinyint(1) DEFAULT 0,
  `flow_level` varchar(20) DEFAULT NULL,
  `symptoms` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`symptoms`)),
  `mood` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_date` (`user_id`,`log_date`),
  KEY `profile_id` (`profile_id`),
  KEY `idx_user_log_date` (`user_id`,`log_date`),
  CONSTRAINT `period_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `period_logs_ibfk_2` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `period_logs`
--

LOCK TABLES `period_logs` WRITE;
/*!40000 ALTER TABLE `period_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `period_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `goal` varchar(255) NOT NULL,
  `activity_level` varchar(255) NOT NULL,
  `dietary_restrictions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`dietary_restrictions`)),
  `allergies` varchar(255) DEFAULT NULL,
  `meal_preference` varchar(255) DEFAULT NULL,
  `extended_data` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `bmi` decimal(5,2) DEFAULT NULL,
  `cycle_length` int(11) DEFAULT 28,
  `period_duration` int(11) DEFAULT 5,
  `last_period_start` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (29,1,'Admin','4amtech.in@gmail.com',20,'men',355.60,48.00,'Weight Gain','','[]','',', ','{\"name\":\"Admin\",\"email\":\"4amtech.in@gmail.com\",\"phone\":\"06395068415\",\"age\":\"20\",\"gender\":\"men\",\"heightFt\":\"11\",\"heightIn\":\"8\",\"weight\":\"48\",\"city\":\"\",\"occupation\":\"\",\"workingHours\":\"\",\"maritalStatus\":\"\",\"children\":\"\",\"livingSituation\":\"\",\"hormonalGoals\":[],\"primaryFitnessGoals\":[\"Weight Gain\"],\"targetTimeline\":\"60 days (2 months)\",\"expectedWeight\":\"70\",\"motivationLevel\":\"\",\"lifestyleMetabolic\":[],\"digestiveHealth\":[],\"hormonalMaleSpecific\":[],\"hormonalFemaleSpecific\":[],\"otherConditions\":[],\"menstrualRegularity\":\"\",\"averageCycleLength\":\"\",\"periodDuration\":\"\",\"menstrualFlow\":\"\",\"periodSymptoms\":[],\"pcos\":\"\",\"pregnancyStatus\":\"\",\"currentSupplements\":[],\"pastSurgeries\":\"\",\"digestiveHealthOverall\":\"\",\"alcoholConsumption\":\"\",\"smokingHabit\":\"\",\"wakeUpTime\":\"\",\"sleepTime\":\"\",\"sleepDuration\":\"\",\"sleepQuality\":\"\",\"dailyMovementLevel\":\"\",\"stressLevel\":\"\",\"waterIntake\":\"\",\"currentlyExercise\":\"\",\"exerciseTypes\":[],\"exerciseFrequency\":\"\",\"dietType\":[],\"foodsDislike\":\"\",\"foodAllergies\":[],\"foodAllergiesOther\":\"\",\"teaCoffeeIntake\":\"\",\"outsideFood\":\"\",\"spiceTolerance\":\"\",\"breakfastTime\":\"\",\"midMorningSnackTime\":\"\",\"lunchTime\":\"\",\"eveningSnackTime\":\"\",\"dinnerTime\":\"\",\"lateNightEating\":\"\",\"whoCooksMeals\":\"\",\"kitchenAppliances\":[],\"budgetForFood\":\"\",\"specialInstructions\":\"\"}','2026-10-25 10:24:09',NULL,28,5,NULL);
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referral_earnings`
--

DROP TABLE IF EXISTS `referral_earnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `referral_earnings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `referred_user_id` int(11) DEFAULT NULL,
  `subscription_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed') DEFAULT 'completed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL,
  `adjusted_by_admin_id` int(11) DEFAULT NULL,
  `is_admin_adjustment` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_earning_user` (`user_id`),
  KEY `fk_earning_referred` (`referred_user_id`),
  KEY `fk_earning_sub` (`subscription_id`),
  CONSTRAINT `fk_earning_referred` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_earning_sub` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_earning_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referral_earnings`
--

LOCK TABLES `referral_earnings` WRITE;
/*!40000 ALTER TABLE `referral_earnings` DISABLE KEYS */;
/*!40000 ALTER TABLE `referral_earnings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(255) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=232 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'enableRegenerate','0','2026-01-24 09:06:42','2026-05-10 02:30:17'),(2,'enableGenerationTimer','0','2026-01-24 09:06:42','2026-05-10 02:30:17'),(3,'timerMinHours','','2026-01-24 09:06:42','2026-05-10 12:47:07'),(4,'timerMaxHours','','2026-01-24 09:06:42','2026-05-10 12:47:07'),(6,'minWithdrawalAmount','2000','2026-01-24 09:37:56','2026-03-31 05:50:31'),(8,'cashfree_app_id','TEST10864570d10054a0bf4b276fa96d07546801','2026-01-25 11:01:26','2026-03-31 05:50:31'),(9,'cashfree_secret_key','YOUR_CASHFREE_SECRET_KEY','2026-01-25 11:01:26','2026-03-31 05:50:31'),(10,'default_theme','light','2026-01-25 11:01:26','2026-03-31 05:50:31'),(11,'color_primary','','2026-01-26 04:09:21','2026-03-31 05:50:31'),(12,'enableDummyData','0','2026-03-26 04:38:39','2026-05-10 02:30:17'),(13,'enable_cashfree','1','2026-03-26 05:32:25','2026-03-31 05:50:31'),(14,'openai_api_key','YOUR_OPENAI_API_KEY','2026-03-26 08:50:45','2026-05-10 02:30:39'),(15,'google_client_id','785889991022-6jfg7dqe45cfecf1n0e3kubor89lof3p.apps.googleusercontent.com','2026-03-26 08:50:50','2026-03-31 05:50:31'),(16,'priceDaily','21','2026-03-26 08:53:02','2026-03-31 05:50:31'),(17,'originalPriceDaily','199','2026-03-26 08:53:02','2026-03-31 05:50:31'),(18,'priceWeekly','121','2026-03-26 08:53:02','2026-03-31 05:50:31'),(19,'originalPriceWeekly','1399','2026-03-26 08:53:02','2026-03-31 05:50:31'),(20,'priceMonthly','401','2026-03-26 08:53:02','2026-03-31 05:50:31'),(21,'originalPriceMonthly','5999','2026-03-26 08:53:02','2026-03-31 05:50:31'),(25,'priceStarter','499','2026-03-28 18:02:02','2026-03-31 05:50:31'),(26,'originalPriceStarter','1499','2026-03-28 18:02:02','2026-03-31 05:50:31'),(27,'pricePremium','799','2026-03-28 18:02:02','2026-03-31 05:50:31'),(28,'originalPricePremium','1899','2026-03-28 18:02:02','2026-03-31 05:50:31'),(29,'priceElite','2499','2026-03-28 18:02:02','2026-03-31 05:50:31'),(30,'originalPriceElite','5999','2026-03-28 18:02:02','2026-03-31 05:50:31'),(35,'offerEnabled','1','2026-03-29 16:07:05','2026-03-31 05:50:31'),(36,'offerStartDate','2026-03-29T00:00:00','2026-03-29 16:07:05','2026-03-31 05:50:31'),(37,'offerDurationDays','5','2026-03-29 16:07:05','2026-03-31 05:50:31'),(118,'enable_razorpay','0','2026-05-10 04:02:53','2026-05-10 04:02:53'),(119,'enable_paypal','0','2026-05-10 04:02:53','2026-05-10 04:02:53'),(120,'razorpay_key_id','','2026-05-10 04:02:53','2026-05-10 04:02:53'),(121,'razorpay_key_secret','','2026-05-10 04:02:53','2026-05-10 04:02:53'),(122,'paypal_client_id','','2026-05-10 04:02:53','2026-05-10 04:02:53'),(123,'paypal_client_secret','','2026-05-10 04:02:53','2026-05-10 04:02:53');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  `plan_type` varchar(50) NOT NULL,
  `plan_days` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` varchar(50) DEFAULT 'pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `profile_id` (`profile_id`),
  KEY `status` (`status`),
  CONSTRAINT `fk_sub_profile` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sub_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (12,1,29,'daily',1,'2026-10-25 10:24:14','2026-10-26',21.00,'cashfree','pending',NULL,NULL,'active'),(13,1,29,'monthly',30,'2026-10-26 07:30:04','2026-11-25',401.00,'admin','completed','ADMIN-20261026083004-1','Plan assigned by admin #1 on 2026-10-26','active');
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timers`
--

DROP TABLE IF EXISTS `timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` int(11) DEFAULT NULL,
  `day_number` int(11) DEFAULT NULL,
  `unlock_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `subscription_id` (`subscription_id`,`day_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timers`
--

LOCK TABLES `timers` WRITE;
/*!40000 ALTER TABLE `timers` DISABLE KEYS */;
/*!40000 ALTER TABLE `timers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_admin` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'4amtech.in@gmail.com','$2y$10$7lEEwSv9OrCkRzY2V296xOVYCRCvpG9WSQ78baqJhGIl2TPV9sXz6','Admin',NULL,'2026-03-31 05:44:27',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawal_requests`
--

DROP TABLE IF EXISTS `withdrawal_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `withdrawal_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processed','rejected') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawal_requests`
--

LOCK TABLES `withdrawal_requests` WRITE;
/*!40000 ALTER TABLE `withdrawal_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawal_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `withdrawals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `screenshot_url` varchar(255) DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_withdrawal_user` (`user_id`),
  CONSTRAINT `fk_withdrawal_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-26 20:08:10
