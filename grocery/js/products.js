let editingProduct = null;
const products = []; 

document.getElementById('openModalBtn').addEventListener('click', function() {
    document.getElementById('productModal').style.display = 'block';
    document.querySelector('.product-form').reset();
    editingProduct = null; 
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('productModal').style.display = 'none';
});

function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; 

    // Show the "Delete All" button only if there are products in the list
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    if (products.length > 0) {
        deleteAllBtn.style.display = 'block';
    } else {
        deleteAllBtn.style.display = 'none';
    }

    const selectedCategory = document.getElementById('categoryFilter').value;
    const sortOption = document.getElementById('sortOptions').value;

    let filteredProducts = products.filter(product => {
        return selectedCategory === '' || product.category === selectedCategory;
    });

    filteredProducts.sort((a, b) => {
        if (sortOption === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'price') {
            return a.price - b.price;
        } else if (sortOption === 'weight') {
            return parseFloat(a.weight) - parseFloat(b.weight); 
        }
        return 0;
    });

    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'product-checkbox';
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                productItem.classList.add('folded'); // Add folded class
            } else {
                productItem.classList.remove('folded'); // Remove folded class
            }
        });

        const productImage = document.createElement('img');
        productImage.src = product.image || 'default-image-url.png'; 
        productImage.alt = product.name;

        productItem.appendChild(productImage);

        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';

        const productName = document.createElement('strong');
        productName.className = 'product-name';
        productName.innerText = product.name;

        const productBrand = document.createElement('span');
        productBrand.className = 'product-brand';
        productBrand.innerText = product.brand;

        productInfo.appendChild(productName);
        productInfo.appendChild(document.createElement('br')); 
        productInfo.appendChild(productBrand); 

        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';
        productDetails.innerHTML = `
            <span class="product-price">₱${product.price}</span><br>
            <span class="product-weight">${product.weight}</span><br> 
            <span class="product-quantity">${product.quantity}</span><br>
            <span class="product-store">${product.store}</span><br><br>
            <span class="product-category">${product.category}</span>
        `;

        productItem.appendChild(productInfo);
        productItem.appendChild(productDetails);
        productItem.appendChild(checkbox); 

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerText = 'Edit';
        buttonContainer.appendChild(editBtn);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.innerText = 'Remove';
        buttonContainer.appendChild(removeBtn);

        productItem.appendChild(buttonContainer);
        productList.appendChild(productItem);

        removeBtn.addEventListener('click', function() {
            productItem.classList.add('fade-out'); // Add fade-out class

            // Wait for the animation to finish before removing the product
            setTimeout(() => {
                products.splice(products.indexOf(product), 1); 
                renderProducts(); 
            }, 500); // Match the timeout with the animation duration
        });

        editBtn.addEventListener('click', function() {
            productItem.classList.add('editing'); // Add editing class

            // Wait for a short duration before opening the modal
            setTimeout(() => {
                document.getElementById('productName').value = product.name;
                document.getElementById('brand').value = product.brand;
                document.getElementById('price').value = product.price;
                document.getElementById('weight').value = product.weight.replace(' kg', ''); 
                document.getElementById('quantity').value = product.quantity;
                document.getElementById('store').value = product.store;
                document.getElementById('category').value = product.category; 
                editingProduct = product;
                document.getElementById('productModal').style.display = 'block'; 
            }, 500); // Match the timeout with the animation duration
        });
    });
}

document.getElementById('addProductBtn').addEventListener('click', function() {
    const productName = document.getElementById('productName').value;
    const brand = document.getElementById('brand').value;
    const price = parseFloat(document.getElementById('price').value);
    const weight = document.getElementById('weight').value + ' kg'; 
    const quantity = parseInt(document.getElementById('quantity').value);
    const store = document.getElementById('store').value;
    const category = document.getElementById('category').value;
    const productImage = document.getElementById('productImage').files[0];

    if (productName && brand && !isNaN(price) && weight && quantity && store && category) {
        const newProduct = {
            name: productName,
            brand: brand,
            price: price,
            weight: weight, 
            quantity: quantity,
            store: store,
            category: category,
            image: productImage ? URL.createObjectURL(productImage) : null 
        };

        if (editingProduct) {
            Object.assign(editingProduct, newProduct);
        } else {
            products.push(newProduct);
        }

        renderProducts(); 
        document.getElementById('productModal').style.display = 'none'; 
    } else {
        alert('Please fill in all fields correctly.'); 
    }
});

document.getElementById('categoryFilter').addEventListener('change', function() {
    renderProducts(); 
});

document.getElementById('sortOptions').addEventListener('change', function() {
    renderProducts(); 
});

document.getElementById('logout-btn').addEventListener('click', function() {
    window.location.href = '../index.html';
});

// Delete All Products Functionality
document.getElementById('deleteAllBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#405d72',
        cancelButtonColor: '#405d72',
        confirmButtonText: 'Yes, delete all!'
    }).then((result) => {
        if (result.isConfirmed) {
            products.length = 0; // Clear the products array
            renderProducts(); // Re-render the product list
            Swal.fire(
                'Deleted!',
                'All products have been deleted.',
                'success'
            );
        }
    });
});
