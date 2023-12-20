

function slideShow() {
    var i;
    var x = document.getElementsByClassName("slide1");  //slide1에 대한 dom 참조
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";   //처음에 전부 display를 none으로 한다.
    }
    index++;
    if (index > x.length) {
        index = 1;  //인덱스가 초과되면 1로 변경
    }   
    x[index-1].style.display = "block";  //해당 인덱스는 block으로
    setTimeout(slideShow, 3000);   //함수를 4초마다 호출 
    
}

var index = 0;   //이미지에 접근하는 인덱스
    window.onload = function(){
        slideShow();
    }


function Confirm(){
    window.confirm("로그아웃을 하시겠습니까?");
}









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

// 상품 정보에 따라 모달을 표시하는 함수
function showModalWithProductInfo(productId) {
    // 예시 상품 정보
    const products = {
        '1': { name: '두부 무침', description: '맛있는 두부 요리입니다.', price: '10,000원', imgUrl: './images/menu_dubu.jpg' },
        '2': { name: '콩나물 무침', description: '신선한 콩나물 요리입니다.', price: '12,000원', imgUrl: './images/menu_kongnamul.jpg' },
        '3': { name: '시금치 무침', description: '건강한 시금치 요리입니다.', price: '15,000원', imgUrl: './images/menu_spinach.jpg' }
    };

    // 선택된 상품 정보
    const product = products[productId];

    // 모달 요소 찾기 및 정보 업데이트
    const modal = document.getElementById('product-detail-modal');
    document.getElementById('product-image').src = product.imgUrl;
    document.getElementById('product-name').innerText = product.name;
    document.getElementById('product-description').innerText = product.description;
    document.getElementById('product-price').innerText = product.price;

    // 모달 표시
    modal.style.display = 'block';
}

// 모달 닫기 버튼 이벤트 리스너
document.querySelector('.close-button').addEventListener('click', () => {
    document.getElementById('product-detail-modal').style.display = 'none';
});
function makeReservation() {
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    // 추가적인 예약 정보

    console.log('예약 정보:', customerName, customerPhone);
    // 실제 예약 로직 구현 필요
}
// function resizeApply() {
//     var minWidth = 1500;
//     var body = document.getElementsByTagName('body')[0];
//     if (window.innerWidth < minWidth) { body.style.zoom = (window.innerWidth / minWidth); }
//     else body.style.zoom = 1;
//   }
  
//   window.onload = function() {
//     window.addEventListener('resize', function() {
//       resizeApply();
//     });
//   }

