const cartStorageKey = 'library-cart';
let cart = loadCart();

function loadCart() {
    try {
        const storedCart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
        return Array.isArray(storedCart) ? storedCart : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
}

function setupMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navSections = document.getElementById('nav-sections');

    if (mobileMenu && navSections && !mobileMenu.dataset.menuReady) {
        mobileMenu.addEventListener('click', () => {
            navSections.classList.toggle('active');
        });
        mobileMenu.dataset.menuReady = 'true';
    }

    setupCart();
}

function setupCart() {
    if (!document.getElementById('cart-panel')) {
        const panel = document.createElement('aside');
        panel.id = 'cart-panel';
        panel.className = 'cart-panel';
        panel.innerHTML = `
            <div class="cart-header">
                <h2>سلة المشتريات</h2>
                <button id="close-cart" type="button" aria-label="إغلاق السلة">×</button>
            </div>
            <div id="cart-items"></div>
            <div class="cart-total" id="cart-total"></div>
            <button id="checkout-button" class="checkout-button" type="button">إتمام الطلب عبر واتساب</button>
        `;
        document.body.appendChild(panel);
    }
    renderCart();
}

function renderCart() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cart-count');
    const itemsElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');

    if (countElement) countElement.textContent = count;
    if (!itemsElement) return;

    itemsElement.innerHTML = cart.length
        ? cart.map((item, index) => `
            <div class="cart-item">
                <div>
                    <strong>${item.title}</strong>
                    <span>${item.price}</span>
                </div>
                <div class="cart-item-actions">
                    <button type="button" class="quantity-button" data-cart-action="decrease" data-cart-index="${index}" aria-label="تقليل الكمية">-</button>
                    <span>${item.quantity}</span>
                    <button type="button" class="quantity-button" data-cart-action="increase" data-cart-index="${index}" aria-label="زيادة الكمية">+</button>
                    <button type="button" class="remove-item" data-cart-action="remove" data-cart-index="${index}">حذف</button>
                </div>
            </div>`).join('')
        : '<p class="empty-cart">السلة فارغة</p>';
    if (totalElement) totalElement.textContent = `إجمالي المنتجات: ${count}`;
    if (checkoutButton) checkoutButton.disabled = cart.length === 0;
}

function addToCart(card) {
    const id = card.dataset.productId;
    const title = card.querySelector('h3')?.textContent.trim() || `منتج رقم ${id}`;
    const price = card.querySelector('.price')?.textContent.trim();
    const image = card.querySelector('img')?.src;
    if (!id) return;

    const existingItem = cart.find(item => String(item.id) === String(id));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price: price || 'السعر غير محدد', image, quantity: 1 });
    }
    saveCart();
    renderCart();
}

function checkoutOnWhatsApp() {
    if (!cart.length) return;
    const items = cart.map(item => {
        const imageLink = item.image ? `\n  صورة المنتج: ${item.image}` : '';
        return `- ${item.title} (${item.quantity} × ${item.price})${imageLink}`;
    }).join('\n');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const message = `مرحبا، أريد طلب المنتجات التالية:\n${items}\n\nعدد المنتجات: ${count}`;
    window.open(`https://wa.me/201205256789?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
}

function updateCartItem(index, action) {
    const item = cart[index];
    if (!item) return;

    if (action === 'increase') item.quantity += 1;
    if (action === 'decrease') item.quantity -= 1;
    if (action === 'remove' || item.quantity < 1) cart.splice(index, 1);

    saveCart();
    renderCart();
}

const headerPlaceholder = document.getElementById('header-placeholder');

if (headerPlaceholder) {
    const headerObserver = new MutationObserver(setupMenu);
    headerObserver.observe(headerPlaceholder, { childList: true });
}

setupMenu();
