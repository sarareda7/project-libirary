const productDataFiles = {
    'school-tools.html': 'data/school-tools.json',
    'gifts-toys.html': 'data/gifts-toys.json',
    'party.html': 'data/party.json',
    'files.html': 'data/files.json',
    'books.html': 'data/books.json',
    'handmade.html': 'data/handmade.json'
};

const productsContainer = document.getElementById('productsContainer');

if (productsContainer) {
    const currentPage = window.location.pathname;
    const pageFile = Object.entries(productDataFiles).find(([page]) => currentPage.includes(page) || currentPage.includes(page.replace('.html', '')))?.[1];
    console.log('Current page:', currentPage);
    console.log('Data file for this page:', pageFile);

    if (pageFile) {
        fetch(pageFile)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${pageFile}`);
                return response.json();
            })
            .then(products => {
                products.forEach(product => {
                    const card = document.createElement('div');
                    card.classList.add('product-card');
                    card.dataset.productId = product.id;
                    card.innerHTML = `
                     <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async">
                     <h3>${product.title}</h3>
                     <p class="product-desc">${product.description}</p>
                     <span class="price">${product.price}</span>
                     <button class="add-to-cart">أضف الى السلة</button>
                    `;
                    productsContainer.appendChild(card);
                });
            })
            .catch(error => console.error(error));
    }
}
