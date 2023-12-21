document.addEventListener('DOMContentLoaded', function() {
    const userId = sessionStorage.getItem('user_id'); // 세션에서 user_id 가져오기
    const authority = sessionStorage.getItem('authority'); // 세션에서 authority 가져오기

    if (authority === 'user') {
        fetchDeliver(userId);
    } else if(authority === 'admin'){
        fetchDelivers_admin();
    }
});

function fetchDeliver(userId) {
    $.ajax({
        url: `http://3.34.102.219/deliver.php?user_id=${userId}`,
        type: 'GET',
        dataType: 'json',
        success: function(delivery) {
            console.log(delivery);
            displaydelivery(delivery);
        },
        error: function(xhr, status, error) {
            console.error('배송 정보를 불러오는 데 실패했습니다:', error);
        }
    });
}

function fetchDelivers_admin() {
    $.ajax({
        url: 'http://3.34.102.219/deliver.php',
        type: 'GET',
        dataType: 'json',
        success: function(delivery) {
            displaydelivery(delivery);
        },
        error: function(xhr, status, error) {
            console.error('배송 정보를 불러오는 데 실패했습니다:', error);
        }
    });
}

function displaydelivery(delivery) {
    const authority = sessionStorage.getItem("authority");
    const listElement = document.getElementById('deliveryList');
    listElement.innerHTML = ''; // 목록 초기화

    delivery.forEach(deliveryItem => {
        const itemElement = document.createElement('div');
        var total =deliveryItem.price * deliveryItem.quantity;
        itemElement.className = 'delivery-item';
        let itemHTML = `<img src="./images/${deliveryItem.product_id}.jpg" alt="${deliveryItem.product_name}" style="width: 100px; height: auto; float: left; margin-right: 10px;">`;

        itemHTML += `
            <h3>${deliveryItem.product_name}</h3>
            <p>예약자: ${deliveryItem.name}</p>
            <p>수량: ${deliveryItem.quantity}</p>
            <p>가격: ${total}원</p>
            <p>주소: ${deliveryItem.address}</p>
        `;

        if(authority === 'admin') {

            itemHTML += `
                <select class="deliveryStatus" name="${deliveryItem.delivery_id}">
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
                // <select> 요소의 name 속성으로부터 deliveryId를 가져옴
                const deliveryId = event.target.name;
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
        })
        .catch(error => {
            // Handle any errors
            console.error('Error updating product:', error);
            alert('Error updating product.');
        });
}