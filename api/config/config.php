<?php
// config.php - Local XAMPP configuration

// 1. Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'zunodb');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// 2. OpenAI Configuration
define('OPENAI_API_KEY', getenv('OPENAI_API_KEY') ?: 'YOUR_OPENAI_API_KEY_HERE');

// 3. Google Auth Configuration
define('GOOGLE_CLIENT_ID', '785889991022-6jfg7dqe45cfecf1n0e3kubor89lof3p.apps.googleusercontent.com');

// 4. Cashfree Payment Configuration (fallback values; runtime reads from DB `settings` table)
define('CASHFREE_APP_ID', getenv('CASHFREE_APP_ID') ?: 'YOUR_CASHFREE_APP_ID_HERE');
define('CASHFREE_SECRET_KEY', getenv('CASHFREE_SECRET_KEY') ?: 'YOUR_CASHFREE_SECRET_KEY_HERE');
define('CASHFREE_API_VERSION', '2022-09-01');
define('CASHFREE_ENV', 'PROD'); // Use 'PROD' even on local as the provided keys are production keys

// Derived Configurations
define('CASHFREE_BASE_URL', (CASHFREE_ENV === 'PROD')
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg');

// 4b. Razorpay Payment Configuration (fallback; runtime reads from DB `settings` table)
define('RAZORPAY_KEY_ID', '');
define('RAZORPAY_KEY_SECRET', '');
define('RAZORPAY_BASE_URL', 'https://api.razorpay.com/v1');

// 5. Global CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Cache-Control, Pragma, Expires");

// Handle preflight OPTIONS requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
