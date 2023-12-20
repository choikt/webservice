document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('user_id'); // 세션에서 user_id 가져오기
    const authority = sessionStorage.getItem('authority'); // 세션에서 authority 가져오기

    if (authority === 'user') {
        fetchReservations(userId);
    } else if(authority === 'admin'){
        fetchReservations_admin();
    }
});

async function fetchReservations(userId) {
    try {
        const response = await fetch(`http://3.34.102.219/deliver.php?user_id=${userId}`);
        const reservations = await response.json();
        displayReservations(reservations);
    } catch (error) {
        console.error('배송 정보를 불러오는 데 실패했습니다:', error);
    }
}
async function fetchReservations_admin() {
    try {
        const response = await fetch(`http://3.34.102.219/deliver.php`);
        const reservations = await response.json();
        displayReservations(reservations);
    } catch (error) {
        console.error('배송 정보를 불러오는 데 실패했습니다:', error);
    }
}
function displayReservations(reservations) {
    const listElement = document.getElementById('reservationList');
    listElement.innerHTML = ''; // 목록 초기화

    reservations.forEach(reservation => {
        const itemElement = document.createElement('div');
        itemElement.className = 'reservation-item';
        itemElement.innerHTML = `
            <h3>${reservation.product_name}</h3>
            <p>수량: ${reservation.quantity}</p>
            <p>가격: ${reservation.price}원</p>
            <p>예약 시간: ${reservation.time}</p>
        `;
        listElement.appendChild(itemElement);
    });
}