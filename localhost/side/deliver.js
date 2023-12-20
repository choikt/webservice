document.addEventListener('DOMContentLoaded', function() {
    console.log("dfsdf");
    const userId = sessionStorage.getItem('user_id'); // 세션에서 user_id 가져오기
    const authority = sessionStorage.getItem('authority'); // 세션에서 authority 가져오기

    if (authority === 'user') {
        fetchDeliver(userId);
    } else if(authority === 'admin'){
        fetchDelivers_admin();
    }
});

async function fetchDeliver(userId) {
    try {
        console.log("dfasdfa");
        const response = await fetch(`http://3.34.102.219/deliver.php?user_id=${userId}`);
        const delivery = await response.json();
        console.log(delivery);
        displaydelivery(delivery);
    } catch (error) {
        console.error('배송 정보를 불러오는 데 실패했습니다:', error);
    }
}
async function fetchDelivers_admin() {
    try {
        console.log("ddddddddd");
        const response = await fetch(`http://3.34.102.219/deliver.php`);
        const delivery = await response.json();
        console.log(delivery);
        displaydelivery(delivery);
    } catch (error) {
        console.error('배송 정보를 불러오는 데 실패했습니다:', error);
    }
}
function displaydelivery(delivery) {
    const listElement = document.getElementById('deliveryList');
    listElement.innerHTML = ''; // 목록 초기화

    delivery.forEach(delivery => {
        const itemElement = document.createElement('div');
        itemElement.className = 'delivery-item';
        itemElement.innerHTML = `
            <h3>${delivery.product_name}</h3>
            <p>수량: ${delivery.quantity}</p>
            <p>가격: ${delivery.price}원</p>
            <p>주소: ${delivery.address}</p>
        `;
        listElement.appendChild(itemElement);
    });
}