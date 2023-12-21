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
        const response = await fetch(`http://3.34.102.219/reserve.php?user_id=${userId}`);
        const reservations = await response.json();
        displayReservations(reservations);
    } catch (error) {
        console.error('예약 정보를 불러오는 데 실패했습니다:', error);
    }
}
async function fetchReservations_admin() {
    try {
        const response = await fetch(`http://3.34.102.219/reserve.php`);
        const reservations = await response.json();
        displayReservations(reservations);
    } catch (error) {
        console.error('예약 정보를 불러오는 데 실패했습니다:', error);
    }
}

function displayReservations(reservations) {
    const authority = sessionStorage.getItem("authority");
    const listElement = document.getElementById('reservationList');
    listElement.innerHTML = ''; // 목록 초기화

    reservations.forEach(reservation => {
        const itemElement = document.createElement('div');
        itemElement.className = 'reservation-item';
        let itemHTML = `
            <h3>${reservation.product_name}</h3>
            <p>예약자: ${reservation.name}</p>
            <p>수량: ${reservation.quantity}</p>
            <p>가격: ${reservation.price}원</p>
            <p>예약 시간: ${reservation.time}</p>
        `;

        if(authority === 'admin') {

            itemHTML += `
                <select class="reserveyStatus" name="${reservation.reservation_id}">
                    <option value="예약 대기" ${reservation.status === '예약 대기' ? 'selected' : ''}>예약 대기</option>
                    <option value="예약 확인" ${reservation.status === '예약 확인' ? 'selected' : ''}>예약 확인</option>
                </select>
            `;

        }


        itemElement.innerHTML = itemHTML;
        listElement.appendChild(itemElement);


    });
    if (authority === 'admin') {
        // 상위 요소인 listElement에 이벤트 리스너를 추가
        listElement.addEventListener('change', function(event) {
            // 이벤트가 발생한 요소가 <select>인지 확인
            if (event.target && event.target.classList.contains('reserveyStatus')) {

                const reserve_id = event.target.name;
                const newStatus = event.target.value;
                updateDeliveryStatus(reserve_id, newStatus);
            }
        });
    }
}

function updateDeliveryStatus(reserve_id, newStatus) {

    const new_status = {
        status:newStatus
    };
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(new_status)
    };

    fetch(`http://3.34.102.219/reserve.php/change?reservation_id=${reserve_id}`, requestOptions)
        .then(response => response.json())

        .then(data => {
            // Handle any data returned from the server
            if (data.change !== false) {
                alert('Product updated successfully!');
            } else {

                alert('Failed to update product.');
            }
        })
        .catch(error => {
            // Handle any errors
            console.error('Error updating product:', error);
            alert('Error updating product.');
        });
}