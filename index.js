let cart = [];

const loadProductBySearch = (searchTerm) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
        .then(res => res.json())
        .then(data => {
            if (data.drinks) {
                displayProduct(data.drinks);
            } else {
                document.getElementById("product-container").innerHTML = '<h1 class="text-center">No drinks found</h1>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
};

const displayProduct = (products) => {
    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = '';

    products.forEach((product, index) => {
        const div = document.createElement("div");
        div.classList.add("card");

        const isInCart = cart.some(item => item.name === product.strDrink);
        const buttonClass = isInCart ? 'btn-secondary' : 'btn-primary bg-dark';
        const buttonText = isInCart ? 'Already Added' : 'Add To Cart';
        const buttonDisabled = isInCart ? 'disabled' : '';

        div.innerHTML = `
            <img src="${product.strDrinkThumb}" class="card-img-top" alt="${product.strDrink}">
            <div class="card-body text-center">
                <h5 class="card-title">${product.strDrink}</h5>
                <p class="card-text">${product.strCategory || "No category available"}</p>
                <div class="button-container d-flex gap-2 justify-content-between">
                    <button class="btn ${buttonClass} w-100" onclick="addToCart('${product.strDrink}', '${product.strDrinkThumb}', ${index})" ${buttonDisabled}>${buttonText}</button>
                    <button class="btn btn-primary bg-dark w-100" onclick="viewDetails('${product.idDrink}')">View Details</button>
                </div>
            </div>
        `;
        productContainer.appendChild(div);
    });
};

const addToCart = (name, image, index) => {
    if (!cart.some(item => item.name === name)) {
        const cartItem = { name, image, index };
        cart.push(cartItem);
        updateCart();
        updateProductButtons();

        if (cart.length === 7) {
            alert("Congratulations! You've added 7 items to your cart!");
        }
    }
};

const updateCart = () => {
    const cartContainer = document.getElementById("cart-items");
    const cartLength = document.getElementById("cart-length");

    cartLength.textContent = `(${cart.length})`;
    cartContainer.innerHTML = '';

    cart.forEach((item, i) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item", "d-flex", "align-items-center", "mb-2", "border-bottom", "pb-2");

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img me-2" style="width: 30px; height: 30px; object-fit: cover;">
            <span class="cart-item-name flex-grow-1 text-truncate">${item.name}</span>
            <span class="cart-item-index ms-2">#${item.index + 1}</span>
        `;
        cartContainer.appendChild(cartItem);
    });
};

const updateProductButtons = () => {
    const productContainer = document.getElementById("product-container");
    const buttons = productContainer.querySelectorAll('.button-container .btn:first-child');
    buttons.forEach(button => {
        const drinkName = button.closest('.card-body').querySelector('.card-title').textContent;
        if (cart.some(item => item.name === drinkName)) {
            button.textContent = 'Already Added';
            button.classList.remove('btn-primary', 'bg-dark');
            button.classList.add('btn-secondary');
            button.disabled = true;
        }
    });
};

const viewDetails = (drinkId) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`)
        .then(res => res.json())
        .then(data => {
            const product = data.drinks[0];
            const modalBody = document.getElementById("modal-body");
            modalBody.innerHTML = `
                <img src="${product.strDrinkThumb}" class="img-fluid mb-3" alt="${product.strDrink}">
                <h5>${product.strDrink}</h5>
                <p><strong>Category:</strong> ${product.strCategory}</p>
                <p><strong>Instructions:</strong> ${product.strInstructions}</p>
                <p><strong>Ingredients:</strong> ${product.strIngredient1}, ${product.strIngredient2}, ${product.strIngredient3}</p>
                <p><strong>Glass:</strong> ${product.strGlass}</p>
            `;
            const modal = new bootstrap.Modal(document.getElementById('drinkModal'));
            modal.show();
        })
        .catch(error => console.error('Error fetching details:', error));
};

document.getElementById("search-btn").addEventListener("click", () => {
    const searchTerm = document.getElementById("search-input").value;
    if (searchTerm.trim()) {
        loadProductBySearch(searchTerm);
    } else {
        alert("Please enter a drink name to search.");
    }
});

document.getElementById("search-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-btn").click();
    }
});

loadProductBySearch('margarita');
