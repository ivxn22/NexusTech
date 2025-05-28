<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Método no permitido: " . $_SERVER['REQUEST_METHOD']]);
    exit;
}
header("Content-Type: application/json");
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
    echo json_encode(["success" => false, "error" => "Conexión fallida: " . $conn->connect_error]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data['nombre'] ?? '';
$apellidos = $data['apellidos'] ?? '';
$email = $data['email'] ?? '';
$password = trim($data['password'] ?? '');
$direccion = $data['direccion'] ?? '';
$tlfn = $data['telefono'] ?? ''; // Cambiar a "tlfn" abajo
$localidad = $data['localidad'] ?? '';

if (!$nombre || !$email || !$password || !$direccion) {
    echo json_encode(["success" => false, "error" => "Faltan campos obligatorios."]);
    exit;
}

// Validar si ya existe el usuario
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error SELECT: " . $conn->error]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "error" => "El email ya está registrado."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();


$rol = 'basico'; // Asegúrate de que "basico" sea válido
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellidos, email, contrasena, direccion, tlfn, localidad, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

if (!$stmt) {
    echo json_encode(["success" => false, "error" => "Error INSERT: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssssssss", $nombre, $apellidos, $email, $password, $direccion, $tlfn, $localidad, $rol);


if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente."]);
} else {
    echo json_encode(["success" => false, "error" => "Error al insertar: " . $stmt->error]);
}



$stmt->close();
$conn->close();
