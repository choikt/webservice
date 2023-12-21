document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        document.getElementById('currentProductId').value = productId; // productId 저장
        fetchProductData(productId);
    } else {
        console.error('상품 ID가 URL에 없습니다.');
    }
});

async function fetchProductData(productId) {
    try {
        const response = await fetch(`http://3.34.102.219/product.php?id=${productId}`);
        const product = await response.json();
        displayProductData(product);
    } catch (error) {
        console.error('상품 정보를 불러오는 데 실패했습니다:', error);
    }
}

function displayProductData(product) {
    if (!product) return;
    document.getElementById('semi_info').textContent = product.product_semi_info;
    document.getElementById('productImage').src = `./images/${product.product_id}.jpg`; // 예시 이미지 경로
    document.getElementById('productName').textContent = product.product_name;
    const productGram = document.createElement('p');
    productGram.textContent = `${product.gram}`;
    productGram.style.fontSize = 'small'; // 작은 글씨 크기 설정
    const productInfoDiv = document.getElementById('productInfo');
    productInfoDiv.appendChild(productGram); // 제품 이름 바로 아래에 그램 정보 추가
    const divider = document.createElement('div');
    divider.style.borderBottom = '1px solid #ccc'; // 구분선 스타일 설정
    divider.style.marginTop = '5px'; // 위쪽 마진 설정
    divider.style.marginBottom = '50px'; // 아래쪽 마진 설정

// 생성한 구분선을 productInfoDiv에 추가
    productInfoDiv.appendChild(divider);
    document.getElementById('productDescription').textContent = product.product_info;
    document.getElementById('productPrice').textContent = `가격: ${product.price}원`;

    updateTotalPrice(product.price); // 초기 총 금액 설정
}

function updateTotalPrice(pricePerUnit) {
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const totalPrice = quantity * pricePerUnit;
    document.getElementById('totalPrice').textContent = `총 금액: ${totalPrice}원`;
}

function incrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value, 10);
    quantityInput.value = currentQuantity + 1;
    updateTotalPrice(parseInt(document.getElementById('productPrice').textContent.replace(/[^0-9]/g, ''), 10));
}

function decrementQuantity() {
    var quantityInput = document.getElementById('quantity');
    var currentQuantity = parseInt(quantityInput.value, 10);
    if (currentQuantity > 1) { // Prevents the quantity from going below 1
        quantityInput.value = currentQuantity - 1;
    }
    updateTotalPrice(parseInt(document.getElementById('productPrice').textContent.replace(/[^0-9]/g, ''), 10));
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
    var product_id = document.getElementById('currentProductId').value;

    console.log(product_id);
    // 예약 데이터 객체를 생성합니다.
    const reservationData = {
        'user_id': user_id, // 이 값은 세션 또는 로그인 상태에서 가져와야 합니다.
        'product_id': product_id, // 선택된 상품의 ID
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
    var userId = sessionStorage.getItem('user_id');

    var quantityInput = document.getElementById('quantity');
    var addressInput_road = document.getElementById('sample4_roadAddress');
    var addressInput_detail = document.getElementById('sample4_detailAddress');

    var addressInput = addressInput_road.value + ' ' + addressInput_detail.value;
    var product_id = document.getElementById('currentProductId').value;
    // 배달 데이터 객체 생성
    const deliverData = {
        'user_id': userId,
        'product_id': parseInt(product_id, 10),
        'quantity': parseInt(quantityInput.value, 10),
        'address': addressInput
    };

    console.log(deliverData);
    const url = `http://3.34.102.219/deliver.php`;

    // 서버로 배달 정보 전송
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deliverData)
    })
        .then(response => response.json())
        .then(data => {
            if (data.delivery !== false) {
                alert('배달 주문이 성공적으로 완료되었습니다.');
                closeModal('deliver');
            } else {
                alert('배달 주문에 실패했습니다. 다시 시도해주세요.');
            }
        })
        .catch(error => {
            console.error('배달 주문 중 오류가 발생했습니다:', error);
            alert('배달 주문에 실패했습니다. 다시 시도해주세요.');
        });
}







