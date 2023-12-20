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
function handleButtonClick(action) {
    // Check if the user is logged in. This is a placeholder for your actual login check.
    var isLoggedIn = localStorage.getItem('isLoggedIn'); // 'true' or 'false' as a string

    if (isLoggedIn === 'true') {
        // User is logged in - perform action
        if (action === 'reserve') {
            // Redirect to reservation page or perform reservation action
            console.log('Reserve action');
        } else if (action === 'deliver') {
            // Redirect to delivery page or perform delivery action
            console.log('Deliver action');
        }
    } else {
        // User is not logged in - redirect to login page
        window.location.href = 'login.html';
    }
}