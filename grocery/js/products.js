// Initialize variables
let editingProduct = null; // To track the product being edited
const products = []; // Array to store product objects

// Open Modal
document.getElementById('openModalBtn').addEventListener('click', function() {
    // Display the product modal and reset the form
    document.getElementById('productModal').style.display = 'block';
    document.querySelector('.product-form').reset();
    editingProduct = null; // Reset editing product
});

// Close Modal
document.querySelector('.close').addEventListener('click', function() {
    // Hide the product modal
    document.getElementById('productModal').style.display = 'none';
});

// Render Products
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear previous product list

    // Show or hide the delete all button based on products length
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    deleteAllBtn.style.display = products.length > 0 ? 'block' : 'none';

    // Get selected category and sort option
    const selectedCategory = document.querySelector('.category-btn.active').getAttribute('data-value');
    const sortOption = document.getElementById('sortOptions').value;

    // Filter products based on selected category
    let filteredProducts = products.filter(product => {
        return selectedCategory === '' || product.category === selectedCategory;
    });

    // Sort filtered products based on selected option
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

    // Create and append product elements to the product list
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        // Apply favorite style if product is favorited
        if (product.isFavorited) {
            productItem.style.backgroundColor = 'pink';
        }

        // Create product image container
        const productImageContainer = document.createElement('div');
        productImageContainer.className = 'product-image-container';
        
        const productImage = document.createElement('img');
        productImage.src = product.image || 'default-image-url.png'; 
        productImage.alt = product.name;

        // Heart icon for marking favorites
        const heartIcon = document.createElement('i');
        heartIcon.className = 'fas fa-heart heart-icon'; 
        
        // Set color based on favorite status
        heartIcon.style.color = product.isFavorited ? '#FF0000' : 'white';
        
        // Toggle favorite status on heart icon click
        heartIcon.addEventListener('click', function() {
            const productItem = this.closest('.product-item'); 
            product.isFavorited = !product.isFavorited; // Toggle favorite status
            productItem.style.backgroundColor = product.isFavorited ? 'pink' : ''; 
            heartIcon.style.color = product.isFavorited ? '#FF0000' : 'white'; 

            // Animation class for heart icon
            heartIcon.classList.add('favorited');

            // Remove animation class after animation ends
            heartIcon.addEventListener('animationend', () => {
                heartIcon.classList.remove('favorited');
            }, { once: true });
        });

        // Append image and heart icon to the product image container
        productImageContainer.appendChild(productImage);
        productImageContainer.appendChild(heartIcon); 
        productItem.appendChild(productImageContainer);
        
        // Create product info section
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';

        const productName = document.createElement('strong');
        productName.className = 'product-name';
        productName.innerText = product.name;

        productInfo.appendChild(productName);
        productInfo.appendChild(document.createElement('br')); 

        // Create product details section
        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';
        productDetails.innerHTML = `
            <span class="product-brand"><strong>Brand Name:</strong> ${product.brand}</span><br>
            <span class="product-price"><strong>Price:</strong> ₱${product.price}</span><br>
            <span class="product-weight"><strong>Weight:</strong> ${product.weight}</span><br> 
            <span class="product-quantity"><strong>Quantity:</strong> ${product.quantity}</span><br>
            <span class="product-store"><strong>Store:</strong> ${product.store}</span><br><br>
            <span class="product-category">${product.category}</span>
        `;

        productItem.appendChild(productInfo);
        productItem.appendChild(productDetails);
        
        // Create checkbox for products
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'product-checkbox';
        checkbox.checked = product.isChecked; // Set checkbox state

        // Update product state on checkbox change
        checkbox.addEventListener('change', function() {
            product.isChecked = this.checked; // Update checkbox state in product
            if (this.checked) {
                productItem.classList.add('folded');
            } else {
                productItem.classList.remove('folded');
            }
        });

        // Maintain checkbox state
        if (product.isChecked) {
            productItem.classList.add('folded');
        }

        productItem.appendChild(checkbox); 

        // Create button container for edit and remove buttons
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

        // Remove product on button click
        removeBtn.addEventListener('click', function() {
            productItem.classList.add('fade-out');

            setTimeout(() => {
                products.splice(products.indexOf(product), 1); 
                renderProducts(); 
            }, 500);
        });

        // Edit product on button click
        editBtn.addEventListener('click', function() {
            productItem.classList.add('editing');

            // Populate the form with product details for editing
            setTimeout(() => {
                document.getElementById('productName').value = product.name;
                document.getElementById('brand').value = product.brand;
                document.getElementById('price').value = product.price;
                document.getElementById('weight').value = product.weight.replace(' kg', ''); 
                document.getElementById('quantity').value = product.quantity;
                document.getElementById('store').value = product.store;
                document.getElementById('category').value = product.category; 
                editingProduct = product; // Set the product being edited
                document.getElementById('productModal').style.display = 'block'; 
            }, 500);
        });
    });
}

// Add Product
document.getElementById('addProductBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather product details from the form
    const productName = document.getElementById('productName').value;
    const brand = document.getElementById('brand').value;
    const price = parseFloat(document.getElementById('price').value);
    const weight = document.getElementById('weight').value + ' kg'; 
    const quantity = parseInt(document.getElementById('quantity').value);
    const store = document.getElementById('store').value;
    const category = document.getElementById('category').value;
    const productImage = document.getElementById('productImage').files[0];

    // Validate product details
    if (productName && brand && !isNaN(price) && weight && quantity && store && category) {
        const newProduct = {
            name: productName,
            brand: brand,
            price: price,
            weight: weight, 
            quantity: quantity,
            store: store,
            category: category,
            image: productImage ? URL.createObjectURL(productImage) : null,
            isFavorited: false, // New property
            isChecked: false // New property
        };

        // If editing, update the existing product; otherwise, add new product
        if (editingProduct) {
            Object.assign(editingProduct, newProduct);
            editingProduct = null; // Reset editingProduct after editing
        } else {
            products.push(newProduct);
        }

        renderProducts(); 
        document.getElementById('productModal').style.display = 'none'; 
    } else {
        alert('Please fill in all fields correctly.'); // Alert if validation fails
    }
});

// Sort Products
document.getElementById('sortOptions').addEventListener('change', function() {
    renderProducts(); // Re-render products when sort option changes
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    window.location.href = '../grocery/index.html'; // Redirect to login page
});

// Delete All Products Functionality
document.getElementById('deleteAllBtn').addEventListener('click', function() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#c0392b',
        cancelButtonColor: '#508D4E',
        confirmButtonText: 'Yes, remove all!'
    }).then((result) => {
        if (result.isConfirmed) {
            products.length = 0; // Clear all products
            renderProducts(); 
            Swal.fire(
                'Removed!',
                'All products have been removed.',
                'success'
            );
        }
    });
});

// Category Button Functionality
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons and add to the clicked button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        renderProducts(); // Re-render products based on selected category
    });
});

// Toggle Search Input Visibility
document.getElementById('searchBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput');
    searchInput.classList.toggle('visible'); // Toggle visibility of search input
    searchInput.focus(); // Focus on the search input
});

// Optional: Close the search input if the user clicks outside of it
document.addEventListener('click', function(event) {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer.contains(event.target)) {
        const searchInput = document.getElementById('searchInput');
        searchInput.classList.remove('visible'); // Hide search input when clicking outside
    }
});

// Search Functionality
document.getElementById('searchInput').addEventListener('input', function() {
    const searchValue = this.value.toLowerCase(); 
    const productList = document.getElementById('productList');
    
    const selectedCategory = document.querySelector('.category-btn.active').getAttribute('data-value');

    // Filter products based on search input
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchValue);
        return matchesCategory && matchesSearch;
    });

    renderFilteredProducts(filteredProducts); // Render filtered products
}); 

// Function to render filtered products
function renderFilteredProducts(filteredProducts) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Clear previous product list

    // Create and append filtered product elements to the product list
    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        // Apply favorite style if product is favorited
        if (product.isFavorited) {
            productItem.style.backgroundColor = 'pink';
        }

        const productImageContainer = document.createElement('div');
        productImageContainer.className = 'product-image-container';
        
        const productImage = document.createElement('img');
        productImage.src = product.image || 'default-image-url.png'; 
        productImage.alt = product.name;

        const heartIcon = document.createElement('i');
        heartIcon.className = 'fas fa-heart heart-icon'; 
        
        // Set color based on favorite status
        heartIcon.style.color = product.isFavorited ? '#FF0000' : 'white';
        
        // Toggle favorite status on heart icon click
        heartIcon.addEventListener('click', function() {
            const productItem = this.closest('.product-item'); 
            product.isFavorited = !product.isFavorited; // Toggle favorite status
            productItem.style.backgroundColor = product.isFavorited ? 'pink' : ''; 
            heartIcon.style.color = product.isFavorited ? '#FF0000' : 'white'; 

            // Animation class for heart icon
            heartIcon.classList.add('favorited');

            // Remove animation class after animation ends
            heartIcon.addEventListener('animationend', () => {
                heartIcon.classList.remove('favorited');
            }, { once: true });
        });

        // Append image and heart icon to the product image container
        productImageContainer.appendChild(productImage);
        productImageContainer.appendChild(heartIcon); 
        productItem.appendChild(productImageContainer);
        
        // Create product info section
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';

        const productName = document.createElement('strong');
        productName.className = 'product-name';
        productName.innerText = product.name;

        const productBrand = document.createElement('span');
        productBrand.className = 'product-brand';
        productBrand.innerText = `Brand Name: ${product.brand}`;

        productInfo.appendChild(productName);
        productInfo.appendChild(document.createElement('br'));
        productInfo.appendChild(productBrand); 

        // Create product details section
        const productDetails = document.createElement('div');
        productDetails.className = 'product-details';
        productDetails.innerHTML = `
            <span class="product-price">Price: ₱${product.price}</span><br>
            <span class="product-weight">Weight: ${product.weight}</span><br> 
            <span class="product-quantity">Quantity: ${product.quantity}</span><br>
            <span class="product-store">Store: ${product.store}</span><br><br>
            <span class="product-category">Category: ${product.category}</span>
        `;

        productItem.appendChild(productInfo);
        productItem.appendChild(productDetails);
        
        // Create checkbox for products
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'product-checkbox';
        checkbox.checked = product.isChecked; // Set checkbox state

        // Update product state on checkbox change
        checkbox.addEventListener('change', function() {
            product.isChecked = this.checked; // Update checkbox state in product
            if (this.checked) {
                productItem.classList.add('folded');
            } else {
                productItem.classList.remove('folded');
            }
        });

        // Maintain checkbox state
        if (product.isChecked) {
            productItem.classList.add('folded');
        }

        productItem.appendChild(checkbox); 

        // Create button container for edit and remove buttons
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

        // Remove product on button click
        removeBtn.addEventListener('click', function() {
            productItem.classList.add('fade-out');

            setTimeout(() => {
                products.splice(products.indexOf(product), 1); 
                renderProducts(); 
            }, 500);
        });

        // Edit product on button click
        editBtn.addEventListener('click', function() {
            productItem.classList.add('editing');

            // Populate the form with product details for editing
            setTimeout(() => {
                document.getElementById('productName').value = product.name;
                document.getElementById('brand').value = product.brand;
                document.getElementById('price').value = product.price;
                document.getElementById('weight').value = product.weight.replace(' kg', ''); 
                document.getElementById('quantity').value = product.quantity;
                document.getElementById('store').value = product.store;
                document.getElementById('category').value = product.category; 
                editingProduct = product; // Set the product being edited
                document.getElementById('productModal').style.display = 'block'; 
            }, 500);
        });
    });
}