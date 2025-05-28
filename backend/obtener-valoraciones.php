<?php
// MOSTRAR ERRORES EN DESARROLLO (quitar en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CABECERAS PARA CORS Y JSON
header("Access-Control-Allow-Origin: http://nexustech.gal"); // Ajusta al dominio real en producción
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Manejo de preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// CREDENCIALES DE CONEXIÓN (ajusta estos datos)
$dbhost = 'qamy010.nexustech.gal';
$dbuser = 'qamy010';
$dbpass = 'Ivxn231103';
$dbname = 'qamy010';

// CONEXIÓN A LA BASE DE DATOS
$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);

// VERIFICAR CONEXIÓN
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

// CONSULTA SQL
$sql = "SELECT * FROM valoraciones";
$result = $conn->query($sql);

// VERIFICAR RESULTADO
if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error ejecutando la consulta: " . $conn->error
    ]);
    $conn->close();
    exit;
}

// RECOPILAR RESULTADOS
$valoraciones = [];
while ($row = $result->fetch_assoc()) {
    $valoraciones[] = $row;
}

// RESPUESTA JSON
$json = json_encode([
    "success" => true,
    "valoraciones" => $valoraciones
]);

if ($json === false) {
    echo json_encode([
        "success" => false,
        "error" => json_last_error_msg()
    ]);
} else {
    echo $json;
}

// CERRAR CONEXIÓN
$conn->close();
?>
