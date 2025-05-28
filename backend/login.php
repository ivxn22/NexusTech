<?php
session_start();

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? '';
$password = trim($data['password'] ?? '');

$response = [];

$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    if ($password === $user['contrasena']) {
        $_SESSION['id_usuario'] = $user['id_usuario'];
        $_SESSION['nombre'] = $user['nombre'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['rol'] = $user['rol'];

        $response = [
            "success" => true,
            "user" => [
                "id_usuario" => $user['id_usuario'],
                "nombre" => $user['nombre'],
                "apellidos" => $user['apellidos'],
                "email" => $user['email'],
                "rol" => $user['rol'],
                "direccion" => $user['direccion'],
                "localidad" => $user['localidad'],
                "telefono" => $user['tlfn']
            ]
        ];
    } else {
        $response = ["success" => false, "error" => "Contraseña incorrecta"];
    }
} else {
    $response = ["success" => false, "error" => "El email no está registrado"];
}

echo json_encode($response);
$conn->close();
