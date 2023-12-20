document.addEventListener('DOMContentLoaded', function() {
    // URL에서 productId 추출
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    // productId를 사용하여 상품 정보 로드
    // 예시로는 단순히 하드코딩된 정보를 사용
    // 실제로는 서버나 데이터베이스에서 정보를 가져와야 함
    const productInfo = {
        1: {
            name: "두부 무침",
            description: "맛있는 두부 요리",
            price: "10,000원",
            imageUrl: "./images/menu_dubu.jpg"
        }
        // 나머지 상품 정보 추가
    };

    const product = productInfo[productId];
    if (product) {
        document.getElementById('productImage').src = product.imageUrl;
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productDescription').textContent = product.description;
        document.getElementById('productPrice').textContent = product.price;
    }

    // 예약 폼 처리 로직 추가
});

function incrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value, 10);
    quantityInput.value = currentQuantity + 1;
}

function decrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value, 10);
    if (currentQuantity > 1) { // Prevents the quantity from going below 1
        quantityInput.value = currentQuantity - 1;
    }
}
function checkLoginAndRedirect(action) {
    // 여기서 사용자의 로그인 상태를 확인합니다.
    var is_login = sessionStorage.getItem('is_login');

    // 사용자가 로그인 상태일 경우
    if (is_login === 'true') {
        // 예약하기 또는 배달하기 모달을 열어줍니다.
        if (action === 'reserve') {
            openModal('reserve');
        } else if (action === 'deliver') {
            openModal('deliver');
        }
    } else {
        // 로그인 상태가 아닐 때 로그인 페이지로 리다이렉트
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = 'login.html';
    }
}

function openModal(type) {

    // 타입에 따라 모달 오픈
    if (type === 'reserve') {
        document.getElementById('reserveModal').style.display = 'block';
    } else if (type === 'deliver') {
        document.getElementById('deliveryModal').style.display = 'block';
    }
}

function closeModal(type) {
    // 타입에 따라 모달 클로즈
    if (type === 'reserve') {
        document.getElementById('reserveModal').style.display = 'none';
    } else if (type === 'deliver') {
        document.getElementById('deliveryModal').style.display = 'none';
    }
}

function reserve() {
    // 예약 관련 로직 처리
    closeModal('reserve');
    alert('예약이 완료되었습니다.');
}

function deliver() {
    // 배달 관련 로직 처리
    closeModal('deliver');
    alert('배달 주문이 완료되었습니다.');
}


function sendReservation() {
    const dateControl = document.getElementById('datetime');
    const dateTimeValue = dateControl.value; // 'yyyy-mm-ddThh:mm' 형태의 값
    var user_id = sessionStorage.getItem('user_id');
    var quantityInput = document.getElementById('quantity');
    // 날짜와 시간을 'yyyy-mm-dd hh:mm:ss' 형태로 변환
    const formattedDateTime = formatDateTime(dateTimeValue);

    // 예약 데이터 객체를 생성합니다.
    const reservationData = {
        'user_id': user_id, // 이 값은 세션 또는 로그인 상태에서 가져와야 합니다.
        'product_id': 1, // 선택된 상품의 ID
        'quantity': parseInt(quantityInput.value, 10), // 선택된 수량
        'time': formattedDateTime
    };
    console.log(reservationData);
    const url = `http://3.34.102.219/reserve.php`;
    // 서버로 예약 정보를 전송합니다.
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.reservation !== false) {
                alert('예약이 성공적으로 완료되었습니다.');
                closeModal('reserve');
            } else {
                alert('예약에 실패했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('예약 중 오류가 발생했습니다:', error);
            alert('예약에 실패했습니다. 다시 시도해주세요.');
        });
}

function formatDateTime(dateTimeValue) {
    if (!dateTimeValue) return ''; // 값이 없으면 빈 문자열 반환
    return dateTimeValue.replace('T', ' ') + ':00'; // 'yyyy-mm-ddThh:mm'을 'yyyy-mm-dd hh:mm:ss'로 변환
}

function sendDeliver() {
    const dateControl = document.getElementById('datetime');
    const dateTimeValue = dateControl.value; // 'yyyy-mm-ddThh:mm' 형태의 값
    var user_id = sessionStorage.getItem('user_id');
    var quantityInput = document.getElementById('quantity');
    // 날짜와 시간을 'yyyy-mm-dd hh:mm:ss' 형태로 변환
    const formattedDateTime = formatDateTime(dateTimeValue);

    // 예약 데이터 객체를 생성합니다.
    const reservationData = {
        'user_id': user_id, // 이 값은 세션 또는 로그인 상태에서 가져와야 합니다.
        'product_id': 1, // 선택된 상품의 ID
        'quantity': parseInt(quantityInput.value, 10), // 선택된 수량
        'time': formattedDateTime
    };
    console.log(reservationData);
    const url = `http://3.34.102.219/deliver.php`;
    // 서버로 예약 정보를 전송합니다.
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.reservation !== false) {
                alert('예약이 성공적으로 완료되었습니다.');
                closeModal('reserve');
            } else {
                alert('예약에 실패했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('예약 중 오류가 발생했습니다:', error);
            alert('예약에 실패했습니다. 다시 시도해주세요.');
        });
}
