<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    $method = $_SERVER["REQUEST_METHOD"];
    $path_info = $_SERVER["REQUEST_URI"];

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
    
    // 예약
    if(!strcmp($method, "POST") && strpos($path_info, "/reserve.php") !== false){
        // request body 받음
        header('Content-type: application/json;charset=utf-8');
        $json_data = json_decode(file_get_contents('php://input'), true);
        if($json_data !== null){
            $user_id = $json_data["user_id"];
            $product_id = $json_data["product_id"];
            $quantity = $json_data["quantity"];
            $time = $json_data["time"];
            $ret = array("reservation" => true);
            if(!user_id_check($user_id) || !product_id_check($product_id)){
                $ret["reservation"] = false;
            } else{
                if(!create_reservation($user_id, $product_id, $quantity, $time)) $ret["reservation"] = false;
            }
            echo json_encode($ret);
        } else{
            header('Content-type: text/plain;charset=utf-8');
            echo "Invalid JSON";
        }
    }
    
    // 예약 조회
    if(!strcmp($method, "GET") && strpos($path_info, "/reserve.php") !== false){
        
        header('Content-type: application/json;charset=utf-8');
        if(isset($_GET["user_id"])){
            $user_id = $_GET["user_id"];
            $ret = get_reservation($user_id);
            echo json_encode($ret);
        }
        else{
            $ret = get_all_reservation();
            echo json_encode($ret);
        }
    }

    // 예약 상태 변경
    if(!strcmp($method, "PATCH") && strpos($path_info, "/reserve.php/change") !== false){
        
        header('Content-type: application/json;charset=utf-8');
        $ret = array("change" => true);
        if(isset($_GET["reservation_id"])){
            $reservation_id = $_GET["reservation_id"];
            $json_data = json_decode(file_get_contents('php://input'), true);
            if($json_data !== null){
                $status = $json_data["status"];
                change_reservation_status($reservation_id, $status);
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
    
    // 사용자 존재 여부 확인
    function user_id_check($user_id){
        $connection = mysqli_connection();
        if($connection){
            $sql = "SELECT * FROM User WHERE user_id = \"$user_id\"";
            $result = mysqli_query($connection, $sql);
            mysqli_close($connection);
            return (mysqli_num_rows($result) > 0);
        }
    }

    // 상품 존재 여부 확인
    function product_id_check($product_id){
        $connection = mysqli_connection();
        if($connection){
            $sql = "SELECT * FROM Product WHERE product_id = \"$product_id\"";
            $result = mysqli_query($connection, $sql);
            mysqli_close($connection);
            return (mysqli_num_rows($result) > 0);
        }
    }

    // 예약하기
    function create_reservation($user_id, $product_id, $quantity, $time){
        $connection = mysqli_connection();
        if($connection){
            $sql = "INSERT INTO Reservation(user_id, product_id, quantity, status, time) VALUES('$user_id', '$product_id', '$quantity', '예약 대기', '$time');";
            if (mysqli_query($connection, $sql)) {
                mysqli_close($connection);
                return true;
            } else {
                mysqli_close($connection);
                return false;
            }
        }
    }

    // 특정 예약 조회
    function get_reservation($user_id){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $sql = "SELECT R.reservation_id, U.name, P.product_name, R.quantity, P.price, R.time
                    FROM Reservation R, User U, Product P 
                    WHERE R.user_id =  U.user_id and P.product_id = R.product_id and R.user_id = \"$user_id\";";
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

    // 전체 예약 조회
    function get_all_reservation(){
        $connection = mysqli_connection();
        $data = array();
        if($connection){
            $sql = "SELECT R.reservation_id, U.name, P.product_name, R.quantity, P.price, R.time
                    FROM Reservation R, User U, Product P 
                    WHERE R.user_id =  U.user_id and P.product_id = R.product_id";
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

    // 예약 상태 변경
    function change_reservation_status($reservation_id, $status){
        $connection = mysqli_connection();
        if($connection){
            $sql = "UPDATE Reservation SET status = \"$status\" WHERE reservation_id = $reservation_id";
            $result = mysqli_query($connection, $sql);
            mysqli_close($connection);
        }
    }

?>