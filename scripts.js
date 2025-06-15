// ====================
// TELEGRAM BOT CONFIG
// ====================

// ВАЖНО: Замените эти значения на свои!
// 1. Создайте бота через @BotFather в Telegram
// 2. Получите токен бота и ID чата
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '7672901413:AAHd0SfBJC3HmwwYxhU_Dwtjzch-cl8GwgE', // Замените на токен вашего бота
    CHAT_ID: '-1002568274832'      // Замените на ID вашего чата/канала
};

// Функция отправки сообщения в Telegram
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    const data = {
        chat_id: TELEGRAM_CONFIG.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        return result.ok;
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        return false;
    }
}

// Форматирование сообщения для Telegram
function formatTelegramMessage(formData) {
    const timestamp = new Date().toLocaleString('ru-RU');
    
    return `
🎯 <b>НОВАЯ ЗАЯВКА - НейроКлуб</b>

👤 <b>Имя:</b> ${formData.name}
📱 <b>Телефон:</b> ${formData.phone}
💰 <b>Тариф:</b> ${formData.tariff || 'Не указан'}
🗓 <b>Дата:</b> ${timestamp}

💡 <b>Дополнительная информация:</b>
${formData.additional || 'Нет дополнительной информации'}

#заявка #неироклуб #новыйклиент
    `.trim();
}

// ====================
// ОБРАБОТКА ФОРМ
// ====================

// Обработка основной формы
document.addEventListener('DOMContentLoaded', function() {
    const finalForm = document.getElementById('final-cta-form');
    
    if (finalForm) {
        finalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitButton = finalForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Показываем загрузку
            submitButton.textContent = 'Отправляем...';
            submitButton.disabled = true;
            
            // Собираем данные формы
            const formData = {
                name: finalForm.querySelector('input[type="text"]').value,
                phone: finalForm.querySelector('input[type="tel"]').value,
                tariff: 'Основной тариф',
                additional: 'Заявка с главной страницы'
            };
            
            // Отправляем в Telegram
            const message = formatTelegramMessage(formData);
            const success = await sendToTelegram(message);
            
            if (success) {
                // Успешная отправка
                submitButton.textContent = '✅ Заявка отправлена!';
                submitButton.style.backgroundColor = '#10B981';
                
                // Показываем сообщение пользователю
                showSuccessMessage('Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 15 минут.');
                
                // Очищаем форму
                finalForm.reset();
                
                // Возвращаем кнопку через 3 секунды
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
                
            } else {
                // Ошибка отправки
                submitButton.textContent = '❌ Ошибка отправки';
                submitButton.style.backgroundColor = '#EF4444';
                
                showErrorMessage('Произошла ошибка. Попробуйте позже или свяжитесь с нами напрямую.');
                
                // Возвращаем кнопку через 3 секунды
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
    
    // Обработка всех остальных кнопок "Вступить"
    const ctaButtons = document.querySelectorAll('.btn--primary');
    ctaButtons.forEach(button => {
        if (button.type !== 'submit' && button.textContent.includes('Вступить')) {
            button.addEventListener('click', function() {
                // Прокручиваем к форме
                const finalForm = document.getElementById('final-cta-form');
                if (finalForm) {
                    finalForm.scrollIntoView({ behavior: 'smooth' });
                    // Подсвечиваем форму
                    finalForm.classList.add('highlight');
                    setTimeout(() => {
                        finalForm.classList.remove('highlight');
                    }, 2000);
                }
            });
        }
    });
    
    // Обработка плавающей кнопки
    const floatingCTA = document.getElementById('floatingCTA');
    if (floatingCTA) {
        floatingCTA.addEventListener('click', function() {
            const finalForm = document.getElementById('final-cta-form');
            if (finalForm) {
                finalForm.scrollIntoView({ behavior: 'smooth' });
                finalForm.classList.add('highlight');
                setTimeout(() => {
                    finalForm.classList.remove('highlight');
                }, 2000);
            }
        });
    }
});

// ====================
// УВЕДОМЛЕНИЯ
// ====================

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L20 7" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Убираем через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function showErrorMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6L18 18M6 18L18 6" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Убираем через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ====================
// КАЛЬКУЛЯТОР ЭКОНОМИИ
// ====================

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const businessSelect = document.getElementById('business-sphere');
    const tasksCheckboxes = document.querySelectorAll('input[name="ai-tasks"]');
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValue = document.querySelector('.budget-value');
    const calculatorResult = document.querySelector('.calculator-result');
    
    // Обновление значения слайдера
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', function() {
            budgetValue.textContent = parseInt(this.value).toLocaleString('ru-RU') + '₽';
        });
    }
    
    // Расчет экономии
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const selectedBusiness = businessSelect?.value;
            const selectedTasks = Array.from(tasksCheckboxes).filter(cb => cb.checked);
            const budget = budgetSlider?.value || 5000;
            
            if (!selectedBusiness || selectedTasks.length === 0) {
                showErrorMessage('Пожалуйста, выберите сферу бизнеса и задачи для расчета');
                return;
            }
            
            // Коэффициенты экономии для разных сфер
            const economyCoefficients = {
                'marketing': 0.6,
                'development': 0.7,
                'design': 0.65,
                'video': 0.55,
                '3d': 0.6,
                'consulting': 0.5,
                'construction': 0.45,
                'flowers': 0.4,
                'realestate': 0.5,
                'legal': 0.55,
                'ecommerce': 0.6
            };
            
            const coefficient = economyCoefficients[selectedBusiness] || 0.5;
            const tasksMultiplier = Math.min(selectedTasks.length * 0.1 + 0.3, 0.8);
            
            const monthlyEconomy = budget * coefficient * tasksMultiplier;
            const yearlyEconomy = monthlyEconomy * 12;
            const timeSaved = selectedTasks.length * 2; // часов в день
            
            // Показываем результат
            if (calculatorResult) {
                calculatorResult.innerHTML = `
                    <div class="result-animation">
                        <h3>Ваш потенциал экономии:</h3>
                        <div class="economy-stats">
                            <div class="stat">
                                <div class="stat-number">${monthlyEconomy.toLocaleString('ru-RU')}₽</div>
                                <div class="stat-label">экономия в месяц</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">${yearlyEconomy.toLocaleString('ru-RU')}₽</div>
                                <div class="stat-label">экономия в год</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">${timeSaved}ч</div>
                                <div class="stat-label">времени в день</div>
                            </div>
                        </div>
                        <p class="result-note">
                            При стоимости НейроКлуба 18,900₽ окупаемость составит всего 
                            <strong>${Math.ceil(18900 / monthlyEconomy)} дня</strong>!
                        </p>
                        <button class="btn btn--primary btn--large">
                            Получить эту экономию сейчас
                        </button>
                    </div>
                `;
                
                calculatorResult.style.display = 'block';
                calculatorResult.scrollIntoView({ behavior: 'smooth' });
                
                // Добавляем обработчик на новую кнопку
                const newBtn = calculatorResult.querySelector('.btn');
                newBtn.addEventListener('click', function() {
                    const finalForm = document.getElementById('final-cta-form');
                    if (finalForm) {
                        finalForm.scrollIntoView({ behavior: 'smooth' });
                        finalForm.classList.add('highlight');
                        setTimeout(() => {
                            finalForm.classList.remove('highlight');
                        }, 2000);
                    }
                });
            }
        });
    }
});

// ====================
// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
// ====================

// Прогресс-бар прокрутки
window.addEventListener('scroll', function() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    }
});

// Показ/скрытие плавающей кнопки
window.addEventListener('scroll', function() {
    const floatingCTA = document.getElementById('floatingCTA');
    if (floatingCTA) {
        if (window.pageYOffset > 800) {
            floatingCTA.classList.add('show');
        } else {
            floatingCTA.classList.remove('show');
        }
    }
});

// FAQ аккордеон
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Закрываем все остальные
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.parentElement.classList.remove('active');
                }
            });
            
            // Переключаем текущий
            faqItem.classList.toggle('active');
        });
    });
});

// Социальные уведомления
document.addEventListener('DOMContentLoaded', function() {
    const socialProof = document.getElementById('socialProof');
    const closeBtn = socialProof?.querySelector('.social-proof__close');
    
    const names = [
        'Анна из Москвы', 'Сергей из СПб', 'Мария из Екатеринбурга',
        'Алексей из Новосибирска', 'Елена из Казани', 'Дмитрий из Ростова',
        'Ольга из Нижнего Новгорода', 'Игорь из Самары', 'Наталья из Омска'
    ];
    
    const actions = [
        'только что присоединился к НейроКлубу',
        'получил доступ к базе промптов',
        'начал экономить время с ИИ',
        'увеличил доход на 40% за месяц'
    ];
    
    function showSocialProof() {
        if (!socialProof) return;
        
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const nameElement = socialProof.querySelector('strong');
        const actionElement = socialProof.querySelector('span');
        
        if (nameElement && actionElement) {
            nameElement.textContent = randomName;
            actionElement.textContent = randomAction;
        }
        
        socialProof.classList.add('show');
        
        setTimeout(() => {
            socialProof.classList.remove('show');
        }, 4000);
    }
    
    // Показываем уведомления каждые 15-30 секунд
    setInterval(showSocialProof, Math.random() * 15000 + 15000);
    
    // Закрытие уведомления
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            socialProof.classList.remove('show');
        });
    }
});

// Обратный отсчет
document.addEventListener('DOMContentLoaded', function() {
    const countdownElement = document.getElementById('price-countdown');
    
    if (countdownElement) {
        // Устанавливаем дату окончания (например, через 3 дня)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            if (distance > 0) {
                countdownElement.textContent = `${days} дня ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                countdownElement.textContent = 'Предложение истекло!';
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
});

// ====================
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ
// ====================

console.log(`
🤖 НАСТРОЙКА TELEGRAM BOT:

1. Откройте Telegram и найдите @BotFather
2. Отправьте команду /newbot
3. Следуйте инструкциям для создания бота
4. Получите токен бота (например: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)
5. Добавьте бота в ваш канал/чат как администратора
6. Получите ID чата:
   - Отправьте сообщение в чат с ботом
   - Перейдите по ссылке: https://api.telegram.org/bot[ВАШ_ТОКЕН]/getUpdates
   - Найдите "chat":{"id": в ответе
7. Замените YOUR_BOT_TOKEN_HERE и YOUR_CHAT_ID_HERE в коде

📝 Пример настройки:
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',
    CHAT_ID: '-1001234567890'
};

❗ ВАЖНО: Не публикуйте токен бота в открытом доступе!
`); 