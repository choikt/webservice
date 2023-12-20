async function signin() {
     var phone = document.getElementById("IDphone");
     var pass = document.getElementById("pass");
     var id = document.getElementById("ID");
     var name = document.getElementById("name");
     // 콘솔 로그에서는 element 객체 대신 value를 출력하도록 수정했습니다.

     const url = `http://3.34.102.219/user.php`;

     const details = {
          'user_id': id.value,
          'passwd': pass.value,
          'phone_number': phone.value,
          'name': name.value
     };

     fetch(url, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(details)
     })
         .then((response) => {
              if (!response.ok) {
                   throw new Error('Network response was not ok');
              }
              return response.json();
         })
         .then((data) => {
              console.log(data);
              alert('회원 가입이 완료되었습니다.');
         })
         .catch((error) => {
              console.error('There has been a problem with your fetch operation:', error);
         });
}



function Check(){
               
     var idCheck = document.getElementById("ID");
     var idphoneCheck = document.getElementById("IDphone");
     var passCheck = document.getElementById("pass");
     var passCheckch = document.getElementById("passch");
     var nameCheck = document.getElementById("name");
     

          


     
     var id= RegExp(/^[0-9]{11}$/)
     var pass= RegExp(/^[a-zA-Z0-9]{4,12}$/)
     var named= RegExp(/^[가-힣]+$/)




     //이름 공백 검사
     if(nameCheck.value == ""){
          alert("이름을 입력해주세요");
          nameCheck.focus();
          return false;
     }

     //이름 유효성 검사
     if(!named.test(nameCheck.value)){
          alert("이름은 한글로만 가능합니다.")
          nameCheck.value= "";
          nameCheck.focus();
          return false;
     }

     // //휴대폰번호 공백 확인
     // if(idphoneCheck.value == ""){
     //      alert("휴대폰번호를 입력해주세요.");
     //      idphoneCheck.focus();
     //      return false;
     //      }
     //
     //      //휴대폰번호 유효성검사
     // if(!id.test(idphoneCheck.value)){
     //      alert("휴대폰번호 11자를 010부터 입력해주세요.");
     //      idphoneCheck.value = "";
     //      idphoneCheck.focus();
     //      return false;
     // }
     if (!/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(idphoneCheck.value)) {
          alert('휴대폰 번호는 xxx-xxxx-xxxx 형식이어야 합니다.');
          return;
     }



     //아이디 공백 확인
     if(idCheck.value == ""){
          alert("아이디를 입력해주세요.");
          idCheck.focus();
          return false;
     }
     // //아이디 유효성검사
     // if(!id.test(idCheck.value)){
     //      alert("휴대폰번호 11자를 010부터 입력해주세요.");
     //      idCheck.value = "";
     //      idCheck.focus();
     //      return false;
     // }
     //

     // //휴대폰번호와 아이디가 같은지 확인
     // if(idphoneCheck.value != idCheck.value){
     //      alert("아이디와 휴대폰번호가 다릅니다.");
     //      idphoneCheck.value = "";
     //      idCheck.value = "";
     //      idphoneCheck.focus();
     //      return false;
     // }




     //비밀번호 공백 확인
     if(passCheck.value == ""){
          alert("비밀번호 입력해주세요.");
          passCheck.focus();
          return false;
     }

     // //아이디 비밀번호 같음 확인. 같으면 안됨
     // if(idCheck.value == passCheck.value){
     //      alert("아이디와 비밀번호를 다르게 설정해주세요.");
     //      passCheck.value= "";
     //      passCheck.focus();
     //           return false;
     // }

          //비밀번호 유효성검사
     if(!pass.test(passCheck.value)){
          alert("4~12자 숫자,알파벳으로만 입력해주세요");
          passCheck.value= "";
          passCheck.focus();
               return false;
     }

     //비밀번호 확인란 공백 확인
     if(passCheckch.value == ""){
          alert("비밀번호 확인란을 입력해주세요.");
          passCheckch.focus();
          return false;
     }
     //비밀번호가 같은지 확인
     if(passCheck.value != passCheckch.value){
          alert("비밀번호가 다릅니다.");
          passCheck.value = "";
          passCheckch.value = "";
          passCheck.focus();
          return false;
     }

     //api 통신 시도
     if(window.confirm("회원가입을 하시겠습니까?")) {
          signin();
     }
}

function Confirm(){
     window.confirm("로그아웃을 하시겠습니까?");
     }
     
function resizeApply() {
     var minWidth = 1500;
     var body = document.getElementsByTagName('body')[0];
     if (window.innerWidth < minWidth) { body.style.zoom = (window.innerWidth / minWidth); }
     else body.style.zoom = 1;
     }
     
     window.onload = function() {
     window.addEventListener('resize', function() {
          resizeApply();
     });
     }



          