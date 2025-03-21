// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "تيشيرت ناروتو",
        price: 2500,
        category: "tshirts",
        image: "images/naruto-tshirt.jpg",
        description: "تيشيرت قطن 100% مع طباعة عالية الجودة لشخصية ناروتو",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 2,
        name: "هودي ون بيس",
        price: 3500,
        category: "hoodies",
        image: "images/onepiece-hoodie.jpg",
        description: "هودي سميك مع طباعة لوفي من ون بيس",
        sizes: ["M", "L", "XL"],
        inStock: true
    },
    {
        id: 3,
        name: "تيشيرت ديث نوت",
        price: 2300,
        category: "tshirts",
        image: "images/deathnote-tshirt.jpg",
        description: "تيشيرت أسود مع تصميم L من ديث نوت",
        sizes: ["S", "M", "L"],
        inStock: true
    },
    {
        id: 4,
        name: "هودي اتاك اون تايتن",
        price: 4000,
        category: "hoodies",
        image: "images/aot-hoodie.jpg",
        description: "هودي رمادي مع شعار فيلق الاستطلاع",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: 5,
        name: "تيشيرت دراغون بول",
        price: 2800,
        category: "tshirts",
        image: "images/dragonball-tshirt.jpg",
        description: "تيشيرت مع تصميم غوكو سوبر سايان",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    }
];

// رسوم التوصيل حسب الولاية
const deliveryFees = {
    'tipaza': 0, // مقر الشركة
    'algiers': 250,
    'blida': 250,
    'boumerdes': 250,
    'tizi': 400,
    'bouira': 400,
    'medea': 400,
    'ain-defla': 400,
    'chlef': 400,
    'bejaia': 500,
    'bordj': 500,
    'msila': 500,
    'setif': 500,
    'djelfa': 500,
    'tiaret': 500,
    'relizane': 500,
    'mascara': 600,
    'saida': 600,
    'sba': 600,
    'tissemsilt': 600,
    'oran': 600,
    'mostaganem': 600,
    'tlemcen': 700,
    'adrar': 1000,
    'bechar': 1000,
    'ouargla': 1000,
    'ghardaia': 1000,
    'laghouat': 1000,
    'biskra': 1000,
    'batna': 1000,
    'tebessa': 1000,
    'khenchela': 1000,
    'souk-ahras': 1000,
    'oum': 1000,
    'el-bayadh': 1000,
    'naama': 1000,
    'illizi': 1000,
    'tamanrasset': 1000,
    'tindouf': 1000,
    'el-oued': 1000,
    'annaba': 1000,
    'skikda': 1000,
    'jijel': 1000,
    'mila': 1000,
    'constantine': 1000,
    'guelma': 1000
};

let currentModalProduct = null;

// تحسين الأداء باستخدام التخزين المؤقت
const CACHE = {
    products: null,
    orders: null,
    categories: null
};

// تحميل البيانات من التخزين المحلي مع التخزين المؤقت
function loadFromStorage(key) {
    if (CACHE[key] === null) {
        CACHE[key] = JSON.parse(localStorage.getItem(key)) || [];
    }
    return CACHE[key];
}

// حفظ البيانات في التخزين المحلي
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    CACHE[key] = data;
}

// عرض المنتجات في الصفحة الرئيسية
function displayProducts(products = null) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const productsToShow = products || loadFromStorage('products');
    productsGrid.innerHTML = '';

    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">لا توجد منتجات متاحة حالياً</p>';
        return;
    }

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} دج</p>
                <button class="buy-btn" onclick="addToCart(${product.id})">شراء</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// عرض نافذة الشراء
function openPurchaseModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentModalProduct = product;
    const modal = document.getElementById('purchaseModal');
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalPrice = document.getElementById('modalProductPrice');
    const sizeSelect = document.getElementById('sizeSelect');
    const quantityInput = document.getElementById('quantityInput');

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalName.textContent = product.name;
    modalPrice.textContent = `${product.price} دج`;
    quantityInput.value = 1;

    // إضافة المقاسات المتوفرة
    sizeSelect.innerHTML = '';
    product.sizes.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });

    updateModalTotalPrice();
    modal.style.display = 'block';
    document.body.classList.add('no-scroll');
}

function updateModalQuantity(change) {
    const quantityInput = document.getElementById('quantityInput');
    let newQuantity = parseInt(quantityInput.value) + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
        quantityInput.value = newQuantity;
        updateModalTotalPrice();
    }
}

function updateModalTotalPrice() {
    if (!currentModalProduct) return;
    
    const quantity = parseInt(document.getElementById('quantityInput').value);
    const selectedState = document.getElementById('stateSelect').value;
    const productTotal = currentModalProduct.price * quantity;
    const modalTotalPrice = document.getElementById('modalTotalPrice');

    modalTotalPrice.textContent = `${productTotal} دج`;
}

// إغلاق نافذة الشراء
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('purchaseModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

window.onclick = function(event) {
    const modal = document.getElementById('purchaseModal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// معالجة إرسال نموذج الشراء
document.querySelector('.purchase-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const termsCheckbox = document.getElementById('terms');
    const selectedState = document.getElementById('stateSelect').value;
    
    if (!selectedState) {
        showNotification('يرجى اختيار الولاية');
        return;
    }
    
    if (!termsCheckbox.checked) {
        showNotification('يرجى الموافقة على شروط الدفع عند الاستلام');
        return;
    }

    const quantity = parseInt(document.getElementById('quantityInput').value);
    const size = document.getElementById('sizeSelect').value;
    const productTotal = currentModalProduct ? currentModalProduct.price * quantity : 0;
    const deliveryFee = deliveryFees[selectedState];
    const finalTotal = productTotal + deliveryFee;

    // إنشاء كائن الطلب
    const order = {
        id: Date.now(),
        date: new Date().toISOString(),
        customerName: e.target.querySelector('input[type="text"]').value,
        phone: e.target.querySelector('input[type="tel"]').value,
        address: e.target.querySelector('textarea').value,
        state: selectedState,
        productId: currentModalProduct.id,
        productName: currentModalProduct.name,
        size: size,
        quantity: quantity,
        totalPrice: productTotal,
        deliveryFee: deliveryFee,
        finalTotal: finalTotal,
        status: 'new'
    };

    // حفظ الطلب في Local Storage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // إظهار رسالة نجاح مع تفاصيل الطلب
    showNotification(`تم استلام طلبك بنجاح! رقم الطلب: #${order.id}
        الكمية: ${quantity}، المقاس: ${size}
        السعر: ${productTotal} دج + ${deliveryFee} دج رسوم التوصيل = ${finalTotal} دج`);
    
    document.getElementById('purchaseModal').style.display = 'none';
    document.body.classList.remove('no-scroll');
    e.target.reset();
    currentModalProduct = null;
});

// عرض إشعار
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// تحديث دالة تصفية المنتجات
function filterProducts(category) {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayFilteredProducts(filteredProducts);
}

// عرض المنتجات المصفاة
function displayFilteredProducts(filteredProducts) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>لا توجد منتجات متاحة في هذا التصنيف</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} دج</p>
                <button class="buy-btn" onclick="openPurchaseModal(${product.id})">
                    شراء الآن <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// البحث عن المنتجات
function searchProducts(query) {
    const searchQuery = query.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
    displayFilteredProducts(filteredProducts);
}

// عرض المنتجات في صفحة المنتجات
function displayProductsPage() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    let filteredProducts = products;
    if (category) {
        filteredProducts = products.filter(product => product.category === category);
    }

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>لا توجد منتجات متاحة في هذا التصنيف</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} دج</p>
                <button class="buy-btn" onclick="openPurchaseModal(${product.id})">
                    شراء الآن <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// بيانات تسجيل الدخول المشفرة
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'AnimeStore2024Admin@Secure'
};

// التحقق من حالة تسجيل الدخول
function checkAdminLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    const loginForm = document.getElementById('loginForm');
    const adminDashboard = document.getElementById('adminDashboard');

    if (isLoggedIn) {
        loginForm.style.display = 'none';
        adminDashboard.style.display = 'block';
        updateAdminStats();
    } else {
        loginForm.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
}

// تحديث إحصائيات لوحة التحكم
function updateAdminStats() {
    const orders = loadFromStorage('orders');
    const products = loadFromStorage('products');
    
    document.getElementById('ordersCount').textContent = orders.length;
    document.getElementById('productsCount').textContent = products.length;
    
    const uniqueCustomers = new Set(orders.map(order => order.customerName)).size;
    document.getElementById('customersCount').textContent = uniqueCustomers;
    
    const totalSales = orders.reduce((sum, order) => sum + order.finalTotal, 0);
    document.getElementById('salesCount').textContent = `${totalSales} دج`;
}

// معالجة تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    // تهيئة التخزين المؤقت
    CACHE.products = loadFromStorage('products');
    CACHE.orders = loadFromStorage('orders');
    CACHE.categories = loadFromStorage('categories');

    // التحقق من تسجيل الدخول
    checkAdminLogin();

    // إعداد نموذج تسجيل الدخول
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;

            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                checkAdminLogin();
                showNotification('تم تسجيل الدخول بنجاح');
            } else {
                showNotification('اسم المستخدم أو كلمة المرور غير صحيحة');
            }
        });
    }

    // إعداد زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('adminLoggedIn');
            checkAdminLogin();
            showNotification('تم تسجيل الخروج بنجاح');
        });
    }

    // عرض المنتجات والسلة
    displayProducts();
    displayCart();

    // عناصر القائمة المنسدلة
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

    // فتح القائمة
    function openMenu() {
        if (mobileMenu && overlay) {
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // إغلاق القائمة
    function closeMenuHandler() {
        if (mobileMenu && overlay) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // إضافة مستمعي الأحداث للقائمة
    if (menuToggle) {
        menuToggle.addEventListener('click', openMenu);
    }
    
    if (closeMenu) {
        closeMenu.addEventListener('click', closeMenuHandler);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeMenuHandler);
    }

    // إغلاق القائمة عند النقر على أي رابط
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMenuHandler);
    });

    // البحث عن المنتجات
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    // معالجة نموذج الاتصال
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            contactForm.reset();
        });
    }

    // عرض المنتجات في الصفحة الرئيسية
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        displayProducts();
    }

    // تصفية المنتجات
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(button.dataset.category);
        });
    });

    // عرض نافذة الشراء
    const modal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');
    if (modal && closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // عرض إشعار
    window.showNotification = function(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}); 