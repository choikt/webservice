






document.addEventListener('DOMContentLoaded', (event) => {
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            // 이벤트 버블링 방지
            event.stopPropagation();

            // 모달 숨기기
            document.getElementById('product-detail-modal').style.display = 'none';
        });
    }
    // 모든 'product-item' 클래스를 가진 요소에 대해 이벤트 리스너 설정
    document.querySelectorAll('.product-item').forEach(item => {
        item.addEventListener('click', event => {
            // 이벤트 버블링 방지
            event.stopPropagation();

            // 클릭된 상품의 ID 가져오기
            const productId = item.getAttribute('data-product-id');
            showModalWithProductInfo(productId);
        });
    });
});

