<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    $method = $_SERVER["REQUEST_METHOD"];
    $path_info = $_SERVER["REQUEST_URI"];

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    // 상품 조회
    if(!strcmp($method, "GET") && strpos($path_info, "/product.php") !== false){
        // request body 받음
        header('Content-type: application/json;charset=utf-8');

        if(isset($_GET["id"])){
            $id = $_GET["id"];
            $ret = get_product($id);
            echo json_encode($ret);
        }
        else{
            $ret = get_all_products();
            echo json_encode($ret);
        }
    }

    // 상품 정보 변경
    if(!strcmp($method, "PATCH") && strpos($path_info, "/product.php") !== false){
        // request body 받음
        header('Content-type: application/json;charset=utf-8');
        $ret = array("change" => true);

        if(isset($_GET["product_id"])){
            $product_id = $_GET["product_id"];
            $json_data = json_decode(file_get_contents('php://input'), true);
            if($json_data !== null){
                $price = $json_data["price"];
                $gram = $json_data["gram"];
                $sale = $json_data["sale"];
                change_product($product_id, $price, $gram, $sale);
            }

        } else{
            $ret["change"] = false;
        }
        echo json_encode($ret);
    }

    function mysqli_connection(){
        $server = "localhost";
        $user = "root";
        $db_password = "kau1234!";
        $db_name = "talent_donation_project";
        $connection = mysqli_connect($server, $user, $db_password, $db_name);
        if (!$connection) {
            // die() 함수는 인수로 전달받은 메시지를 출력하고, 현재 실행 중인 PHP 스크립트를 종료시키는 함수입니다.
            die("서버와의 연결 실패! : ". mysqli_connect_error());
         }
        return $connection;     
    }

    // 특정 상품 조회
    function get_product($id){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $sql = "SELECT * FROM Product WHERE product_id = $id";
            $result = mysqli_query($connection, $sql);
            if (mysqli_num_rows($result) > 0) {
                $data = mysqli_fetch_assoc($result);
            }
        }
        mysqli_close($connection);
        return $data;
    }

    // 전체 상품 조회    
    function get_all_products(){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $sql = "SELECT * FROM Product";
            $result = mysqli_query($connection, $sql);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $data[] = $row;
                }         
            }
        }
        mysqli_close($connection);
        return $data;
    }

    // 상품 정보 변경
    function change_product($product_id, $price, $gram, $sale){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $sql = "UPDATE Product SET price = $price, gram = \"$gram\", sale = $sale WHERE product_id = $product_id";
            $result = mysqli_query($connection, $sql);
        }
        mysqli_close($connection);
        return $data;
    }

?>