<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS con credenciales
header('Content-Type: application/json');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Origin: http://nexustech.gal");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener datos JSON recibidos
$input = json_decode(file_get_contents("php://input"), true);

$gmail = $input['gmail'] ?? null;
$estrellas = $input['estrellas'] ?? null;
$opinion = $input['opinion'] ?? null;
$fecha = date("Y-m-d");

// Validar datos obligatorios
if (empty($gmail) || empty($estrellas) || empty($opinion)) {
    echo json_encode([
        "success" => false,
        "error" => "Faltan datos obligatorios."
    ]);
    exit;
}

// Validar que gmail es un email válido
if (!filter_var($gmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "success" => false,
        "error" => "Email inválido."
    ]);
    exit;
}

// Validar que estrellas es un número entre 1 y 5
$estrellas = (int)$estrellas;
if ($estrellas < 1 || $estrellas > 5) {
    echo json_encode([
        "success" => false,
        "error" => "El número de estrellas debe estar entre 1 y 5."
    ]);
    exit;
}

// Conectar a la base de datos
$dbhost = "qamy010.nexustech.gal";
$dbuser = "qamy010";
$dbpass = "Ivxn231103";
$dbname = "qamy010";

$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión a la base de datos: " . $conn->connect_error
    ]);
    exit;
}
$conn->set_charset("utf8mb4");

// Preparar la consulta
$stmt = $conn->prepare("INSERT INTO valoraciones (gmail, estrellas, opinion, fecha) VALUES (?, ?, ?, ?)");
if (!$stmt) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error en la preparación de la consulta: " . $conn->error
    ]);
    exit;
}

// Bind params y ejecutar
$stmt->bind_param("siss", $gmail, $estrellas, $opinion, $fecha);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Valoración insertada correctamente."
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error al insertar la valoración: " . $stmt->error
    ]);
}

$stmt->close();
$conn->close();
