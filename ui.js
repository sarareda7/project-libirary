document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.product-slider');

    sliders.forEach(slider => {
        const images = slider.querySelectorAll('.slider-images img');
        const dots = slider.querySelectorAll('.slider-dots .dot');
        let currentIndex = 0;
        let interval = null;

        function showImage(index) {
            images.forEach(img => img.classList.remove('active-img'));
            dots.forEach(dot => dot.classList.remove('active-dot'));

            images[index].classList.add('active-img');
            dots[index].classList.add('active-dot');
            currentIndex = index;
        }

        slider.addEventListener('mouseenter', () => {
            interval = setInterval(() => {
                const nextIndex = (currentIndex + 1) % images.length;
                showImage(nextIndex);
            }, 1500);
        });

        slider.addEventListener('mouseleave', () => {
            clearInterval(interval);
            showImage(0);
        });
    });
});

document.addEventListener('click', event => {
    const target = event.target;
    if (!target || !target.classList || typeof target.classList.contains !== 'function') {
        return;
    }

    if (target.classList.contains('add-to-cart')) {
        addToCart(target.closest('.product-card'));
        const originalText = target.textContent;

        target.textContent = 'تمت الأضافة';
        target.style.backgroundColor = '#27ae60';

        setTimeout(() => {
            target.textContent = originalText;
            target.style.backgroundColor = '';
        }, 1500);
    }

    if (target.dataset.cartAction) {
        updateCartItem(Number(target.dataset.cartIndex), target.dataset.cartAction);
    }

    if (target.id === 'cart-button') {
        document.getElementById('cart-panel')?.classList.add('open');
    }

    if (target.id === 'close-cart') {
        document.getElementById('cart-panel')?.classList.remove('open');
    }

    if (target.id === 'checkout-button') {
        checkoutOnWhatsApp();
    }

    if (target.classList.contains('chat-us') || target.id === 'whatsapp-btn') {
        const message = 'مرحبا أريد الأستفسار عن منتجات مكتبة أولاد أبو ليلة';
        const whatsappUrl = `https://wa.me/201205256789?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    if (target.classList.contains('discover-btn') || target.id === 'discover-btn') {
        window.location.href = 'school-tools.html';
    }
});
