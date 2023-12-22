<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    $method = $_SERVER["REQUEST_METHOD"];
    $path_info = $_SERVER["REQUEST_URI"];

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    
    // 배달
    if(!strcmp($method, "POST") && strpos($path_info, "/deliver.php") !== false){
        // request body 받음
        header('Content-type: application/json;charset=utf-8');
        $json_data = json_decode(file_get_contents('php://input'), true);
        if($json_data !== null){
            $user_id = $json_data["user_id"];
            $product_id = $json_data["product_id"];
            $quantity = $json_data["quantity"];
            $address = $json_data["address"];
            $ret = array("delivery" => true);
            echo product_id_check($product_id);
            if(!user_id_check($user_id) || !product_id_check($product_id)){
                $ret["delivery"] = false;
            } else{
                if(!create_delivery($user_id, $product_id, $quantity, $address)) $ret["delivery"] = false;
            }
            echo json_encode($ret);
        } else{
            header('Content-type: text/plain;charset=utf-8');
            echo "Invalid JSON";
        }
    }
    
    // 배달 조회
    if(!strcmp($method, "GET") && strpos($path_info, "/deliver.php") !== false){
        
        header('Content-type: application/json;charset=utf-8');
        if(isset($_GET["user_id"])){
            $user_id = $_GET["user_id"];
            $ret = get_delivery($user_id);
            echo json_encode($ret);
        }
        else{
            $ret = get_all_delivery();
            echo json_encode($ret);
        }
    }

    // 배달 상태 변경
    if(!strcmp($method, "PATCH") && strpos($path_info, "/deliver.php/change") !== false){
        
        header('Content-type: application/json;charset=utf-8');
        $ret = array("change" => true);
        if(isset($_GET["delivery_id"])){
            $delivery_id = $_GET["delivery_id"];
            $json_data = json_decode(file_get_contents('php://input'), true);
            if($json_data !== null){
                $status = $json_data["status"];
                change_delivery_status($delivery_id, $status);
            }
        } else{
            $ret = false;
        }
        echo json_encode($ret);

    }

    function mysqli_connection(){
        $server = "localhost";
        $user = "root";
        $db_password = "";
        $db_name = "talent_donation_project";
        $connection = mysqli_connect($server, $user, $db_password, $db_name);
        if (!$connection) {
            // die() 함수는 인수로 전달받은 메시지를 출력하고, 현재 실행 중인 PHP 스크립트를 종료시키는 함수입니다.
            die("서버와의 연결 실패! : ". mysqli_connect_error());
         }
        return $connection;     
    }
    
    // 사용자 존재 여부 확인
    function user_id_check($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT * FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return (mysqli_num_rows($result) > 0);
        }
    }

    // 상품 존재 여부 확인
    function product_id_check($product_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT * FROM Product WHERE product_id = ?");
            mysqli_stmt_bind_param($stmt, "i", $product_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return (mysqli_num_rows($result) > 0);
        }
    }

    // 배달하기
    function create_delivery($user_id, $product_id, $quantity, $address){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "INSERT INTO Delivery(user_id, product_id, quantity, status, address) VALUES(?, ?, ?, ?, ?)");
            $status = "결제 대기";
            mysqli_stmt_bind_param($stmt, "siiss", $user_id, $product_id, $quantity, $status, $address);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return true;
        }
    }

    // 특정 사용자 배달 조회
    function get_delivery($user_id){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT D.delivery_id, U.name, P.product_name, P.product_id, D.quantity, P.price, D.address, D.status
                                                 FROM Delivery D, User U, Product P 
                                                 WHERE D.user_id = U.user_id and P.product_id = D.product_id and D.user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $data[] = $row;
                }    
            }
        }
        mysqli_stmt_close($stmt);
        mysqli_close($connection);
        return $data;
    }

    // 전체 배달 조회
    function get_all_delivery(){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT D.delivery_id, U.name, P.product_name, P.product_id, D.quantity, P.price, D.address, D.status
                                                 FROM Delivery D, User U, Product P 
                                                 WHERE D.user_id = U.user_id and P.product_id = D.product_id");
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    $data[] = $row;
                }      
            }
        }
        mysqli_stmt_close($stmt);
        mysqli_close($connection);
        return $data;
    }

    // 배달 상태 변경
    function change_delivery_status($delivery_id, $status){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "UPDATE Delivery SET status = ? WHERE delivery_id = ?");
            mysqli_stmt_bind_param($stmt, "si",$status, $delivery_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
        }
    }

?>