function logout() {
    var confirmLogout = window.confirm("로그아웃을 하시겠습니까?");
    if (confirmLogout) {
        sessionStorage.removeItem('is_login'); // 로그인 상태 삭제
        location.href = 'login.html'; // 로그인 페이지로 이동
    }
}

