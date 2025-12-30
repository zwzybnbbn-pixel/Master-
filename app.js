import { supabase } from './supabase-config.js';

const productsContainer = document.getElementById('products-container');

async function fetchProducts() {
    const { data: products, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    // تنظيف الحاوية قبل الإضافة
    productsContainer.textContent = '';

    products.forEach(product => {
        // إنشاء العناصر برمجياً (طريقة آمنة 100%)
        const card = document.createElement('div');
        card.className = 'product-card';

        const img = document.createElement('img');
        img.src = product.image_url;
        img.alt = product.name;

        const title = document.createElement('h3');
        title.textContent = product.name; // نص نقي لا يقبل كود HTML

        const price = document.createElement('p');
        price.textContent = `${product.price} ر.س`;
        price.style.color = '#fff';

        const button = document.createElement('button');
        button.className = 'gold-btn';
        button.textContent = 'أضف للسلة';
        button.onclick = () => addToCart(product);

        // تجميع العناصر داخل البطاقة
        card.append(img, title, price, button);
        
        // إضافة البطاقة للحاوية الرئيسية
        productsContainer.appendChild(card);
    });
}

// نظام سلة بسيط (تخزين في الذاكرة)
let cart = [];
function addToCart(product) {
    cart.push(product);
    document.getElementById('cart-count').textContent = cart.length;
    alert(`تمت إضافة ${product.name} إلى سلتك`);
}

fetchProducts();
