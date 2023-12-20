async function login(user_id, passwd) {
    const url = `http://3.34.102.219/user.php/login`;

    var details = {
        "user_id" : user_id,
        "passwd" : passwd
    }

    const options = {
        method: 'POST', // *GET, POST, PUT, DELETE 등
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(details)
    }

    let res = await fetch(url, options);
    let data = await res.json();

    if(data["login"]){
        console.log(data);
        sessionStorage.setItem("is_login",true);
        sessionStorage.setItem("name", data.name);
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("phone_number", data.phone_number);
        sessionStorage.setItem("authority", data.authority);

        location.href="./main.html";
    } else{
        alert("로그인에 실패하였습니다.\n 아이디 또는 비밀번호를 확인해주세요.");
    }
}

function check(){
    const id = document.getElementById("userid").value
    const userpassword = document.getElementById("userpassword").value

    if(id == null || id == "" || userpassword == null || userpassword == ""){
        alert("아이디, 비밀번호를 확인해주세요. ");
    }
    else login(id, userpassword)
}

function Confirm(){
    window.confirm("로그아웃을 하시겠습니까?");
}