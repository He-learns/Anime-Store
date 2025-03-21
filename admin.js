// تخزين الطلبات في Local Storage
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let products = JSON.parse(localStorage.getItem('products')) || [];

// تبديل بين الأقسام
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');

        if (button.dataset.tab === 'orders') {
            displayOrders();
        } else if (button.dataset.tab === 'products') {
            displayProducts();
        } else if (button.dataset.tab === 'stats') {
            updateStats();
        }
    });
});

// عرض الطلبات
function displayOrders() {
    const ordersList = document.querySelector('.orders-list');
    if (!ordersList) return;

    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">لا توجد طلبات حالياً</div>';
        return;
    }

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-info">
                <h3>طلب #${order.id}</h3>
                <p>العميل: ${order.customerName}</p>
                <p>الهاتف: ${order.phone}</p>
                <p>العنوان: ${order.address} - ${order.state}</p>
                <p>المنتج: ${order.productName} (${order.size}) × ${order.quantity}</p>
                <p>السعر: ${order.totalPrice} دج</p>
                <p>رسوم التوصيل: ${order.deliveryFee} دج</p>
                <p>الإجمالي: ${order.finalTotal} دج</p>
            </div>
            <div class="order-status ${order.status}">
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>جديد</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد المعالجة</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                </select>
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// تحديث حالة الطلب
function updateOrderStatus(orderId, newStatus) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        displayOrders();
        updateStats();
        showNotification('تم تحديث حالة الطلب بنجاح', 'success');
    }
}

// عرض المنتجات
function displayProducts() {
    const productsList = document.querySelector('.products-list');
    if (!productsList) return;

    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<div class="no-products">لا توجد منتجات حالياً</div>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card-admin';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p>${product.price} دج</p>
            <p>المقاسات المتوفرة: ${product.sizes.join(', ')}</p>
            <div class="product-actions">
                <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// تحديث الإحصائيات
function updateStats() {
    const totalOrders = document.getElementById('totalOrders');
    const totalSales = document.getElementById('totalSales');
    const totalCustomers = document.getElementById('totalCustomers');
    const totalProducts = document.getElementById('totalProducts');

    if (totalOrders) totalOrders.textContent = orders.length;
    if (totalProducts) totalProducts.textContent = products.length;
    
    if (totalSales) {
        const sales = orders
            .filter(order => order.status === 'delivered')
            .reduce((sum, order) => sum + order.finalTotal, 0);
        totalSales.textContent = `${sales} دج`;
    }
    
    if (totalCustomers) {
        const uniqueCustomers = new Set(orders.map(order => order.phone)).size;
        totalCustomers.textContent = uniqueCustomers;
    }
}

// تسجيل الخروج
document.getElementById('logoutBtn').addEventListener('click', () => {
    // يمكن إضافة منطق تسجيل الخروج هنا
    window.location.href = 'index.html';
});

// تصفية الطلبات
document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
    const status = e.target.value;
    const filteredOrders = status === 'all' ? 
        orders : 
        orders.filter(order => order.status === status);
    displayFilteredOrders(filteredOrders);
});

document.getElementById('orderDateFilter').addEventListener('change', (e) => {
    const date = new Date(e.target.value);
    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toDateString() === date.toDateString();
    });
    displayFilteredOrders(filteredOrders);
});

function displayFilteredOrders(filteredOrders) {
    const ordersList = document.querySelector('.orders-list');
    ordersList.innerHTML = '';

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders">لا توجد طلبات تطابق المعايير</div>';
        return;
    }

    filteredOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-info">
                <h3>طلب #${order.id}</h3>
                <p>العميل: ${order.customerName}</p>
                <p>الهاتف: ${order.phone}</p>
                <p>العنوان: ${order.address} - ${order.state}</p>
                <p>المنتج: ${order.productName} (${order.size}) × ${order.quantity}</p>
                <p>السعر: ${order.totalPrice} دج</p>
                <p>رسوم التوصيل: ${order.deliveryFee} دج</p>
                <p>الإجمالي: ${order.finalTotal} دج</p>
            </div>
            <div class="order-status ${order.status}">
                <select onchange="updateOrderStatus(${order.id}, this.value)">
                    <option value="new" ${order.status === 'new' ? 'selected' : ''}>جديد</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>قيد المعالجة</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>ملغي</option>
                </select>
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// تحديث الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // بيانات تسجيل الدخول
    const adminEmail = 'topayred@gmail.com';
    const adminPassword = 'admin123';

    // العناصر
    const loginForm = document.getElementById('adminLoginForm');
    const dashboard = document.querySelector('.admin-dashboard');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('adminPassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // التحقق من تسجيل الدخول
    function checkAuth() {
        if (localStorage.getItem('adminLoggedIn') === 'true') {
            loginForm.style.display = 'none';
            dashboard.style.display = 'block';
            loadDashboardData();
        }
    }

    // تحميل بيانات لوحة التحكم
    function loadDashboardData() {
        displayOrders();
        displayProducts();
        updateStats();
        setupNavigation();
    }

    // إعداد التنقل بين الأقسام
    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.dashboard-section');

        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                // إزالة الفئة النشطة من جميع الأزرار والأقسام
                navButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active'));

                // إضافة الفئة النشطة للزر والقسم المحدد
                button.classList.add('active');
                const targetSection = document.getElementById(`${button.dataset.section}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    // إظهار/إخفاء كلمة المرور
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // تسجيل الدخول
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // إخفاء رسائل الخطأ السابقة
        emailError.classList.remove('show');
        passwordError.classList.remove('show');
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        // التحقق من صحة البريد الإلكتروني
        if (email !== adminEmail) {
            emailError.textContent = 'البريد الإلكتروني غير صحيح';
            emailError.classList.add('show');
            return;
        }
        
        // التحقق من صحة كلمة المرور
        if (password !== adminPassword) {
            passwordError.textContent = 'كلمة المرور غير صحيحة';
            passwordError.classList.add('show');
            return;
        }
        
        // تسجيل الدخول بنجاح
        localStorage.setItem('adminLoggedIn', 'true');
        loginForm.style.display = 'none';
        dashboard.style.display = 'block';
        showNotification('تم تسجيل الدخول بنجاح', 'success');
        loadDashboardData();
    });

    // تسجيل الخروج
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            loginForm.style.display = 'block';
            dashboard.style.display = 'none';
            showNotification('تم تسجيل الخروج بنجاح', 'success');
        });
    }

    // عرض الإشعارات
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    checkAuth();
});

// إضافة منتج جديد
function addProduct() {
    const productName = prompt('أدخل اسم المنتج:');
    if (!productName) return;

    const productPrice = prompt('أدخل سعر المنتج (بالدينار الجزائري):');
    if (!productPrice || isNaN(productPrice)) {
        showNotification('الرجاء إدخال سعر صحيح', 'error');
        return;
    }

    const productImage = prompt('أدخل رابط صورة المنتج:');
    if (!productImage) {
        showNotification('الرجاء إدخال رابط صورة المنتج', 'error');
        return;
    }

    const productSizes = prompt('أدخل المقاسات المتوفرة (مفصولة بفواصل):');
    if (!productSizes) {
        showNotification('الرجاء إدخال المقاسات المتوفرة', 'error');
        return;
    }

    const newProduct = {
        id: Date.now(), // استخدام الطابع الزمني كمعرف فريد
        name: productName,
        price: parseFloat(productPrice),
        image: productImage,
        sizes: productSizes.split(',').map(size => size.trim()),
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
    updateStats();
    showNotification('تم إضافة المنتج بنجاح', 'success');
}

// تعديل منتج
function editProduct(productId) {
    showNotification('سيتم إضافة هذه الميزة قريباً', 'info');
}

// حذف منتج
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
        updateStats();
        showNotification('تم حذف المنتج بنجاح', 'success');
    }
}

// تصفية الطلبات
function filterOrders(status) {
    const filteredOrders = status === 'all' ? 
        orders : 
        orders.filter(order => order.status === status);
    displayFilteredOrders(filteredOrders);
} 