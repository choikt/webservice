document.addEventListener('DOMContentLoaded', function() {
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
        const response = await fetch(`http://3.34.102.219/deliver.php`);
        const delivery = await response.json();
        displaydelivery(delivery);
    } catch (error) {
        console.error('배송 정보를 불러오는 데 실패했습니다:', error);
    }
}
function displaydelivery(delivery) {
    const authority = sessionStorage.getItem("authority");
    const listElement = document.getElementById('deliveryList');
    listElement.innerHTML = ''; // 목록 초기화

    delivery.forEach(deliveryItem => {
        const itemElement = document.createElement('div');
        itemElement.className = 'delivery-item';

        let itemHTML = `
            <h3>${deliveryItem.product_name}</h3>
            <p>예약자: ${deliveryItem.name}</p>
            <p>수량: ${deliveryItem.quantity}</p>
            <p>가격: ${deliveryItem.price}원</p>
        `;

        if(authority === 'admin') {
            itemHTML += `
                <select class="deliveryStatus" data-delivery-id="${deliveryItem.id}">
                    <option value="결제 대기" ${deliveryItem.status === '결제 대기' ? 'selected' : ''}>결제 대기</option>
                    <option value="결제 확인" ${deliveryItem.status === '결제 확인' ? 'selected' : ''}>결제 확인</option>
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
            if (event.target && event.target.classList.contains('deliveryStatus')) {
                const deliveryId = event.target.getAttribute('data-delivery-id');
                console.log(deliveryId);
                const newStatus = event.target.value;
                updateDeliveryStatus(deliveryId, newStatus);
            }
        });
    }

}

function updateDeliveryStatus(deliveryId, newStatus) {

    const new_status = {
        status:newStatus
    };
    console.log(deliveryId);
    console.log(JSON.stringify(new_status));
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(new_status)
    };

    fetch(`http://3.34.102.219/deliver.php/change?delivery_id=${deliveryId}`, requestOptions)
        .then(response => response.json())

        .then(data => {
            // Handle any data returned from the server
            if (data.change !== false) {
                alert('Product updated successfully!');
            } else {

                alert('Failed to update product.');
            }
            // Close the modal
            closeModal();
        })
        .catch(error => {
            // Handle any errors
            console.error('Error updating product:', error);
            alert('Error updating product.');
        });
}