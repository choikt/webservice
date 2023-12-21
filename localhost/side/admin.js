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
    container.innerHTML = ''; // Clear the container

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.onclick = function() { showModal(product); }; // 클릭 이벤트를 할당합니다.
        productDiv.innerHTML = `
                    <img src="./images/${product.product_id}.jpg" alt="${product.product_name}">
                    <p id="semi">${product.product_semi_info}</p>
                    <h4 id ="name">${product.product_name}</h3>
                    <p>
                        <span class = "price">${product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} 원</span>
                        <span class = "gram">/ ${product.gram} </span>
                    </p>

            `;
        container.appendChild(productDiv);
    });
}
function showModal(product) {
    // Populate the modal with the current product details
    // You'd fetch the current product details and populate the fields
    // For now, we'll simulate with placeholders

    document.getElementById('modalProductId').value = product.product_id;
    document.getElementById('modalPrice').value = product.price; // Placeholder
    document.getElementById('modalGram').value = product.gram; // Placeholder
    document.getElementById('modalSale').value = product.sale; // Placeholder

    document.getElementById('adminModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('adminModal').style.display = 'none';
}
function updateProduct() {
    const productId = document.getElementById('modalProductId').value;
    const price = document.getElementById('modalPrice').value;
    const gram = document.getElementById('modalGram').value;
    const sale = document.getElementById('modalSale').value;

    // Construct the product data to be sent in the request
    const productData = {
        price: price,
        gram: gram,
        sale: sale
    };
    // Setup the request options for the PATCH request
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
    };

    // Send the PATCH request to the server
    fetch(`http://3.34.102.219/product.php?product_id=${productId}`, requestOptions)
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