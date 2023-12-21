document.addEventListener('DOMContentLoaded', (event) => {
    fetchProducts();
    showAdminOptions();
});


async function fetchProducts() {
    try {
        const response = await fetch('http://3.34.102.219/product.php');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('상품 정보를 불러오는 데 실패했습니다:', error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('menu-container');
    container.innerHTML = ''; // 컨테이너 초기화

    products.forEach(product => {
        // sale이 "1"인 상품만 표시
        if (product.sale === "1") {
            const productDiv = document.createElement('div');
            productDiv.className = 'product-item';
            // const price = product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");

            productDiv.innerHTML = `
                <a href="reserve.html?productId=${product.product_id}">
                    <img src="./images/${product.product_id}.jpg" alt="${product.product_name}">
                    <p id="semi">${product.product_semi_info}</p>
                    <h4 id ="name">${product.product_name}</h3>
                    <p>
                        <span class = "price">${product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} 원</span>
                        <span class = "gram">/ ${product.gram} </span>
                    </p>
                </a>
            `;
            container.appendChild(productDiv);
        }
    });
}
function showAdminOptions() {
    const authority = sessionStorage.getItem("authority");

    // authority가 'admin'인 경우에만 관리자 옵션을 표시합니다.
    if (authority === 'admin') {
        // menu_bar_inside div를 찾아 관리자 옵션을 추가합니다.
        const menuBarInside = document.querySelector('.menu_bar_inside');

        // 관리자 전용 링크 생성
        const adminLink = document.createElement('a');
        adminLink.href = "#"; // 관리자 페이지의 URL로 변경 필요
        adminLink.textContent = "상품 관리"; // 링크 텍스트
        adminLink.onclick = function() {
            location.href = 'admin.html'; // 관리자 페이지로 이동
        };

        // 메뉴 바에 관리자 링크 추가
        menuBarInside.appendChild(adminLink);
    }
}