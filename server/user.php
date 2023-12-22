<?php
    error_reporting(E_ALL);
    ini_set("display_errors", 1);

    $method = $_SERVER["REQUEST_METHOD"];
    $path_info = $_SERVER["REQUEST_URI"];
    
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    // 회원 가입
    if(!strcmp($method, "POST") && !strcmp($path_info, "/user.php") && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false)){
        // request body 받음
        header('Content-type: application/json;charset=utf-8');
        $json_data = json_decode(file_get_contents('php://input'), true);
        if($json_data !== null){
            $user_id = $json_data["user_id"];
            $name = $json_data["name"];
            $salt = bin2hex(random_bytes(32));
            $passwd = password_hash($json_data["passwd"] . $salt, PASSWORD_DEFAULT);
            $phone_number = $json_data["phone_number"];
            $authority = "user";
            $ret = array(
                "user_id" => $user_id,
                "passwd" => $passwd,
                "name" => $name,
                "phone_number" => $phone_number,
                "salt" => $salt,
                "authority" => $authority
            );
            if(id_check($user_id)){
                header('Content-type: text/plain;charset=utf-8');
                echo "The same id already exists";
                return;
            }
            insert_user($user_id, $passwd, $name, $phone_number, $salt, $authority);
            echo json_encode($ret);
        } else{
            header('Content-type: text/plain;charset=utf-8');
            echo "Invalid JSON";
        }
    }

    // 로그인
    if(!strcmp($method, "POST") && !strcmp($path_info, "/user.php/login")){
        $json_data = json_decode(file_get_contents('php://input'), true);
        header('Content-type: application/json;charset=utf-8');
        $ret = array("login" => true);
        if($json_data !== null){
            $user_id = $json_data["user_id"];

            if(id_check($user_id)){
                $salt = get_salt($user_id);
                $passwd = $json_data["passwd"] . $salt;
                $hashed_passwd = get_hashed_passwd($user_id);
                if(!password_verify($passwd, $hashed_passwd)){
                    $ret["login"] = false;
                }
            } else{
                $ret["login"] = false;
            }
            
            if($ret["login"]){
                $ret["name"] = get_name($user_id);
                $ret["phone_number"] = get_phone_number($user_id);
                $ret["user_id"] = $user_id;
                $ret["authority"] = get_authority($user_id);
            }

            echo json_encode($ret);
            
        } else{
            header('Content-type: text/plain;charset=utf-8');
            echo "Invalid JSON";
        }
    }

    function mysqli_connection(){
        $server = "localhost";
        $user = "root";
        $db_password = "";
        $db_name = "talent_donation_project";
        $connection = mysqli_connect($server, $user, $db_password, $db_name);
        if (!$connection) {
            die("서버와의 연결 실패! : ". mysqli_connect_error());
        }
        return $connection;     
    }

    function insert_user($user_id, $passwd, $name, $phone_number, $salt, $authority){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "INSERT INTO User VALUES(?, ?, ?, ?, ?, ? )");
            mysqli_stmt_bind_param($stmt, "ssssss", $user_id, $passwd, $name, $salt, $phone_number, $authority);
            mysqli_stmt_execute($stmt);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
        }
        
    }

    function id_check($user_id){
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

    function get_hashed_passwd($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT passwd FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return $row["passwd"];
        }
    }

    function get_salt($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT salt FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return $row["salt"];
        }
    }

    function get_name($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT name FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return $row["name"];
        }
    }

    function get_phone_number($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT phone_number FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return $row["phone_number"];
        }
    }

    function get_authority($user_id){
        $connection = mysqli_connection();
        if($connection){
            $stmt = mysqli_prepare($connection, "SELECT authority FROM User WHERE user_id = ?");
            mysqli_stmt_bind_param($stmt, "s", $user_id);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            $row = mysqli_fetch_assoc($result);
            mysqli_stmt_close($stmt);
            mysqli_close($connection);
            return $row["authority"];
        }
    }
?>