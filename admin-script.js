// بيانات المنتجات
let products = [];

// بيانات الطلبات
let orders = [];

// تحديث إحصائيات لوحة التحكم
function updateDashboardStats() {
    const newOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    }).length;

    const newCustomers = new Set(orders.map(order => order.customer)).size;
    const totalProducts = products.length;
    const dailySales = orders.filter(order => {
        const orderDate = new Date(order.date);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    }).reduce((sum, order) => sum + order.amount, 0);

    document.getElementById('newOrders').textContent = newOrders;
    document.getElementById('newCustomers').textContent = newCustomers;
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('dailySales').textContent = `${dailySales} دج`;
}

// عرض الطلبات
function displayOrders() {
    const ordersTable = document.querySelector('.orders-table tbody');
    ordersTable.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.amount} دج</td>
            <td>${order.status}</td>
            <td>${order.date}</td>
            <td>
                <button onclick="viewOrder(${order.id})" class="view-btn">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editOrder(${order.id})" class="edit-btn">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        ordersTable.appendChild(row);
    });
}

// عرض المنتجات
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">${product.price} دج</p>
                <p class="quantity">الكمية: ${product.quantity}</p>
                <div class="product-actions">
                    <button onclick="editProduct(${product.id})" class="edit-btn">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// عرض نافذة إضافة/تعديل منتج
function showProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.querySelector('.modal h2');

    if (product) {
        title.textContent = 'تعديل منتج';
        form.elements['name'].value = product.name;
        form.elements['price'].value = product.price;
        form.elements['quantity'].value = product.quantity;
        form.elements['description'].value = product.description;
        form.dataset.productId = product.id;
    } else {
        title.textContent = 'إضافة منتج جديد';
        form.reset();
        delete form.dataset.productId;
    }

    modal.style.display = 'block';
}

// إغلاق النافذة المنبثقة
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// معالجة إرسال نموذج المنتج
document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const productId = form.dataset.productId;

    const productData = {
        id: productId ? parseInt(productId) : products.length + 1,
        name: form.elements['name'].value,
        price: parseFloat(form.elements['price'].value),
        quantity: parseInt(form.elements['quantity'].value),
        description: form.elements['description'].value,
        image: form.elements['image'].value
    };

    if (productId) {
        const index = products.findIndex(p => p.id === parseInt(productId));
        products[index] = productData;
    } else {
        products.push(productData);
    }

    displayProducts();
    document.getElementById('productModal').style.display = 'none';
});

// عرض تفاصيل الطلب
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        alert(`تفاصيل الطلب #${order.id}\nالعميل: ${order.customer}\nالمبلغ: ${order.amount} دج\nالحالة: ${order.status}\nالتاريخ: ${order.date}`);
    }
}

// تعديل الطلب
function editOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const newStatus = prompt('تحديث حالة الطلب:', order.status);
        if (newStatus) {
            order.status = newStatus;
            displayOrders();
        }
    }
}

// تعديل منتج
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showProductModal(product);
    }
}

// حذف منتج
function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
        products = products.filter(p => p.id !== productId);
        displayProducts();
    }
}

// تحديث الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    displayOrders();
    displayProducts();
}); 