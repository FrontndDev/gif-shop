document.addEventListener('DOMContentLoaded', function() {
    // Исходная цена товара
    const basePrice = 1999;
    let totalAmount = basePrice;
    let tipAmount = 0;
    
    // Элементы DOM
    const totalAmountEl = document.querySelector('.total-amount');
    const finalAmountEl = document.getElementById('final-amount');
    const tipOptions = document.querySelectorAll('.tip-option');
    
    // Обработка кнопок "на чай"
    tipOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Убираем выделение у всех кнопок
            tipOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Выделяем выбранную кнопку
            this.classList.add('selected');
            
            // Обновляем сумму чаевых
            tipAmount = parseInt(this.dataset.amount);
            
            // Пересчитываем итоговую сумму
            updateTotalAmount();
        });
    });
    
    // Функция обновления суммы
    function updateTotalAmount() {
        totalAmount = basePrice + tipAmount;
        totalAmountEl.textContent = totalAmount + ' ₽';
        finalAmountEl.textContent = totalAmount;
    }
    
    // Обработка формы оплаты
    const paymentForm = document.querySelector('.payment-form');
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('payment-email').value;
        
        // Простая валидация email
        if (!validateEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        // Здесь должна быть логика оплаты
        alert('Оплата прошла успешно! Спасибо за покупку.');
        // window.location.href = 'success.html';
    });
    
    // Функция валидации email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Инициализация
    updateTotalAmount();
});