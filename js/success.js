document.addEventListener('DOMContentLoaded', function() {
    // Получаем параметры URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipAmount = urlParams.get('tip') || 0;
    const productPrice = urlParams.get('price') || 1999;
    
    // Рассчитываем итоговую сумму
    const totalAmount = parseInt(productPrice) + parseInt(tipAmount);
    
    // Обновляем данные на странице
    document.getElementById('tip-amount').textContent = tipAmount + ' ₽';
    document.getElementById('total-paid').textContent = totalAmount + ' ₽';
    
    // Устанавливаем текущую дату
    const now = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('payment-date').textContent = now.toLocaleDateString('ru-RU', options);
    
    // Анимация появления элементов
    const elements = document.querySelectorAll('.receipt-container > *');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300 * index);
    });
});