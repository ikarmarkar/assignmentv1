document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const loadingIndicator = document.getElementById('loading-indicator'); // Loading indicator element
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    const filterOptions = document.querySelector('.filter-options');
    const closeButton = document.querySelector('.close-btn');
    const screenWidth = window.innerWidth;

    let products = [];
    let startIndex = 0;
    const batchSize = 10;

    const fetchProducts = async () => {
        try {
            loadingIndicator.style.display = 'block'; // Show loading indicator
            const response = await fetch('https://fakestoreapi.com/products');
            products = await response.json();
            renderProducts();
            populateFilters();
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            loadingIndicator.style.display = 'none'; // Hide loading indicator
        }
    };

    const renderProducts = () => {
        const filteredProducts = filterProducts(products);
        const sortedProducts = sortProducts(filteredProducts);

        const endIndex = Math.min(startIndex + batchSize, sortedProducts.length);
        productList.innerHTML = ''; // Clear previous products

        for (let i = startIndex; i < endIndex; i++) {
            const product = sortedProducts[i];
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            const productName = document.createElement('h2');
            productName.classList.add('product-card__name');
            productName.textContent = product.title;

            const productImage = document.createElement('img');
            productImage.classList.add('product-card__image');
            productImage.src = product.image;
            productImage.alt = product.title;

            const productPrice = document.createElement('p');
            productPrice.classList.add('product-card__price');
            productPrice.textContent = `Price: $${product.price}`;

            const productDescription = document.createElement('p');
            productDescription.classList.add('product-card__description');
            productDescription.textContent = product.description;

            productCard.appendChild(productName);
            productCard.appendChild(productImage);
            productCard.appendChild(productPrice);
            productCard.appendChild(productDescription);

            productList.appendChild(productCard);
        }

        // If all products are loaded, hide the load more button
        if (endIndex === sortedProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    };

    const populateFilters = () => {
        const categories = new Set();
        products.forEach(product => categories.add(product.category));

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    };

    const filterProducts = (products) => {
        let filteredProducts = [...products];

        if (categoryFilter.value !== '') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter.value);
        }

        if (priceFilter.value !== '') {
            const [minPrice, maxPrice] = priceFilter.value.split('-').map(Number);
            filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
        }

        if (availabilityFilter.value !== '') {
            filteredProducts = filteredProducts.filter(product => product.inStock === (availabilityFilter.value === 'true'));
        }

        if (searchInput.value.trim() !== '') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }

        return filteredProducts;
    };

    const sortProducts = (products) => {
        const sortByValue = sortBy.value;
        let sortedProducts = [...products];

        if (sortByValue === 'price-low-to-high') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortByValue === 'price-high-to-low') {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        return sortedProducts;
    };

    const chekMobileFilters = () => {
        if(screenWidth < 993 && filterOptions.style.display === 'block') {
            filterOptions.style.display = 'none'
        }
    }

    // Add click event listener to the hamburger icon
    hamburgerIcon.addEventListener('click', function() {
        filterOptions.style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        filterOptions.style.display = 'none';
    });

    loadMoreBtn.addEventListener('click', () => {
        startIndex += batchSize;
        renderProducts();
    });

    categoryFilter.addEventListener('change', () => {
        startIndex = 0;
        renderProducts();
        chekMobileFilters();
    });

    priceFilter.addEventListener('change', () => {
        startIndex = 0;
        renderProducts();
        chekMobileFilters();
    });

    availabilityFilter.addEventListener('change', () => {
        startIndex = 0;
        renderProducts();
        chekMobileFilters();
    });

    sortBy.addEventListener('change', () => {
        startIndex = 0;
        renderProducts();
        chekMobileFilters();
    });

    searchBtn.addEventListener('click', () => {
        startIndex = 0;
        renderProducts();
        chekMobileFilters();
    });

    fetchProducts();
});
