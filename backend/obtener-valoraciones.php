<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header("Access-Control-Allow-Origin: http://nexustech.gal"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


$dbhost = 'qamy010.nexustech.gal';
$dbuser = 'qamy010';
$dbpass = 'Ivxn231103';
$dbname = 'qamy010';


$conn = new mysqli($dbhost, $dbuser, $dbpass, $dbname);


if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error de conexión: " . $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");


$sql = "SELECT * FROM valoraciones";
$result = $conn->query($sql);


if (!$result) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Error ejecutando la consulta: " . $conn->error
    ]);
    $conn->close();
    exit;
}


$valoraciones = [];
while ($row = $result->fetch_assoc()) {
    $valoraciones[] = $row;
}


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


$conn->close();
?>
