<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/config.php';

error_reporting(E_ALL);
ini_set('display_errors', 1);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if ($action === 'verify_google') {
        $credential = $data['credential'] ?? '';

        // Verify the ID token with Google's API
        $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $credential;
        $response = file_get_contents($url);

        if ($response === FALSE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid Google Token']);
            exit;
        }

        $payload = json_decode($response, true);

        if (isset($payload['error_description'])) {
            http_response_code(400);
            echo json_encode(['error' => $payload['error_description']]);
            exit;
        }

        $googleId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'];
        $picture = $payload['picture'];

        // Check if user exists by google_id
        $stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $user = $stmt->fetch();

        if (!$user) {
            // Check if email exists (link account)
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $existingUser = $stmt->fetch();

            if ($existingUser) {
                // Link account
                $stmt = $pdo->prepare("UPDATE users SET google_id = ? WHERE id = ?");
                $stmt->execute([$googleId, $existingUser['id']]);
                $user = $existingUser;
                $user['google_id'] = $googleId;
            }
            else {
                // Create new user (Google)
                $stmt = $pdo->prepare("INSERT INTO users (email, google_id, name) VALUES (?, ?, ?)");
                $stmt->execute([$email, $googleId, $name]);
                $userId = $pdo->lastInsertId();
                $user = [
                    'id' => $userId,
                    'email' => $email,
                    'name' => $name,
                    'is_new' => true,
                    'is_admin' => 0,
                ];
            }
        }

        echo json_encode([
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'is_admin' => (int)$user['is_admin'],
            ],
            'token' => 'mock_token_' . $user['id']
        ]);

    }
    elseif ($action === 'verify_google_manual') {
        $googleId = $data['google_id'] ?? '';
        $email = $data['email'] ?? '';
        $name = $data['name'] ?? '';

        if (!$googleId || !$email) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            exit;
        }

        // Check if user exists by google_id
        $stmt = $pdo->prepare("SELECT * FROM users WHERE google_id = ?");
        $stmt->execute([$googleId]);
        $user = $stmt->fetch();

        if (!$user) {
            // Check if email exists (link account)
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $existingUser = $stmt->fetch();

            if ($existingUser) {
                // Link account
                $stmt = $pdo->prepare("UPDATE users SET google_id = ? WHERE id = ?");
                $stmt->execute([$googleId, $existingUser['id']]);
                $user = $existingUser;
                $user['google_id'] = $googleId;
            }
            else {
                // Create new user (Manual Google Signup)
                $stmt = $pdo->prepare("INSERT INTO users (email, google_id, name) VALUES (?, ?, ?)");
                $stmt->execute([$email, $googleId, $name]);
                $userId = $pdo->lastInsertId();
                $user = [
                    'id' => $userId,
                    'email' => $email,
                    'name' => $name,
                    'is_new' => true,
                    'is_admin' => 0,
                ];
            }
        }

        echo json_encode([
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'is_admin' => (int)($user['is_admin'] ?? 0),
            ],
            'token' => 'mock_token_' . $user['id']
        ]);

    }
    elseif ($action === 'signup') {
        error_log("Signup attempt: " . json_encode($data));
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $name = $data['data']['name'] ?? ''; // Matching Supabase structure

        if (!$email || !$password) {
            error_log("Signup failed: Missing email or password");
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        // Check if user exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            error_log("Signup failed: Email already registered: " . $email);
            http_response_code(400);
            echo json_encode(['message' => 'Email already registered']); // Matching Supabase error somewhat
            exit;
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");

        try {
            $stmt->execute([$email, $hashedPassword, $name]);
            $userId = $pdo->lastInsertId();

            echo json_encode([
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'name' => $name,
                    'is_admin' => 0,
                ],
                'session' => ['access_token' => 'mock_token_' . $userId] // Mock token
            ]);
        }
        catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }

    }
    elseif ($action === 'login') {
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        if (!$email || !$password) {
            http_response_code(400);
            echo json_encode(['error' => 'Email and password required']);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            $verify = password_verify($password, $user['password']);

            if ($verify) {
                echo json_encode([
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['name'],
                        'is_admin' => (int)$user['is_admin'],
                    ],
                    'session' => ['access_token' => 'mock_token_' . $user['id']]
                ]);
            }
            else {
                http_response_code(401);
                echo json_encode(['message' => 'Invalid email or password']);
            }
        }
        else {
            http_response_code(401);
            echo json_encode(['message' => 'Invalid email or password']);
        }
    }
    else {
        http_response_code(404);
        echo json_encode(['error' => 'Invalid action']);
    }
}
?>
