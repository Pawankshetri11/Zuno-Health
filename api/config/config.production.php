<?php
// config.php - PRODUCTION CONFIGURATION
// RENAME THIS FILE TO config.php BEFORE UPLOADING TO THE SERVER

// 1. Database Configuration (ENTER YOUR HOSTINGER/LIVE DETAILS HERE)
define('DB_HOST', 'localhost');
define('DB_NAME', 'zunodb');
define('DB_USER', 'u132027053_Zuno');
define('DB_PASS', '4Amtech@1@');
define('DB_CHARSET', 'utf8mb4');

// 2. OpenAI Configuration
define('OPENAI_API_KEY', getenv('OPENAI_API_KEY') ?: 'YOUR_OPENAI_API_KEY_HERE');

// 3. Google Auth Configuration
define('GOOGLE_CLIENT_ID', '785889991022-6jfg7dqe45cfecf1n0e3kubor89lof3p.apps.googleusercontent.com');

// 4. Cashfree Payment Configuration
define('CASHFREE_APP_ID', getenv('CASHFREE_APP_ID') ?: 'YOUR_CASHFREE_APP_ID_HERE');
define('CASHFREE_SECRET_KEY', getenv('CASHFREE_SECRET_KEY') ?: 'YOUR_CASHFREE_SECRET_KEY_HERE');

define('CASHFREE_API_VERSION', '2022-09-01');
define('CASHFREE_ENV', 'PROD'); // Set to PROD for live payments

// Derived Configurations
define('CASHFREE_BASE_URL', (CASHFREE_ENV === 'PROD') 
    ? 'https://api.cashfree.com/pg' 
    : 'https://sandbox.cashfree.com/pg');

?>
