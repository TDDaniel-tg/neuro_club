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
// НАВИГАЦИЯ
// ====================

function scrollToCalculator() {
    const calculator = document.getElementById('calculator');
    if (calculator) {
        calculator.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToPricing() {
    const pricing = document.getElementById('pricing');
    if (pricing) {
        pricing.scrollIntoView({ behavior: 'smooth' });
    }
}

// ====================
// ТАРИФЫ И ССЫЛКИ
// ====================

// Ссылки для тарифов (замените на свои)
const TARIFF_LINKS = {
    'profi': 'https://your-payment-link-profi.com',
    'business': 'https://your-payment-link-business.com', 
    'vip': 'https://your-payment-link-vip.com'
};

// Обработка кликов по кнопкам тарифов
document.addEventListener('DOMContentLoaded', function() {
    const tariffButtons = document.querySelectorAll('[data-tariff]');
    
    tariffButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const tariff = this.dataset.tariff;
            const link = TARIFF_LINKS[tariff];
            
            if (link && link !== '#') {
                // Если ссылка настроена, переходим по ней
                window.open(link, '_blank');
            } else {
                // Если ссылка не настроена, показываем форму
                const finalForm = document.getElementById('final-cta-form');
                if (finalForm) {
                    finalForm.scrollIntoView({ behavior: 'smooth' });
                    finalForm.classList.add('highlight');
                    setTimeout(() => {
                        finalForm.classList.remove('highlight');
                    }, 2000);
                }
            }
        });
    });
});

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
        if (button.type !== 'submit' && button.textContent.includes('Вступить') && !button.dataset.tariff) {
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
        setTimeout(() => document.body.removeChild(notification), 300);
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
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

// ====================
// КАЛЬКУЛЯТОР
// ====================

// База задач для каждой сферы
const sphereTasks = {
    'marketing': [
        { name: 'Создание рекламных текстов', hours: 3, savings: 0.85 },
        { name: 'Анализ целевой аудитории', hours: 4, savings: 0.8 },
        { name: 'Исследование конкурентов', hours: 2, savings: 0.9 },
        { name: 'Создание контент-планов', hours: 3, savings: 0.75 },
        { name: 'A/B тестирование креативов', hours: 2, savings: 0.85 }
    ],
    'development': [
        { name: 'Написание кода', hours: 6, savings: 0.7 },
        { name: 'Отладка и тестирование', hours: 4, savings: 0.8 },
        { name: 'Создание документации', hours: 2, savings: 0.9 },
        { name: 'Рефакторинг кода', hours: 3, savings: 0.75 },
        { name: 'Поиск решений проблем', hours: 2, savings: 0.85 }
    ],
    'design': [
        { name: 'Создание логотипов', hours: 4, savings: 0.8 },
        { name: 'Дизайн баннеров', hours: 2, savings: 0.85 },
        { name: 'Обработка фотографий', hours: 3, savings: 0.9 },
        { name: 'Создание иллюстраций', hours: 5, savings: 0.75 },
        { name: 'UI/UX дизайн', hours: 6, savings: 0.7 }
    ],
    'video': [
        { name: 'Написание сценариев', hours: 3, savings: 0.8 },
        { name: 'Создание монтажных листов', hours: 2, savings: 0.85 },
        { name: 'Генерация идей для роликов', hours: 2, savings: 0.9 },
        { name: 'Подбор музыки и звуков', hours: 1, savings: 0.75 },
        { name: 'Создание субтитров', hours: 2, savings: 0.95 }
    ],
    '3d': [
        { name: '3D моделирование', hours: 8, savings: 0.7 },
        { name: 'Создание прототипов', hours: 4, savings: 0.75 },
        { name: 'Визуализация проектов', hours: 6, savings: 0.8 },
        { name: 'Рендеринг', hours: 3, savings: 0.85 },
        { name: 'Анимация объектов', hours: 5, savings: 0.7 }
    ],
    'chatbots': [
        { name: 'Создание сценариев диалогов', hours: 4, savings: 0.85 },
        { name: 'Настройка автоответов', hours: 2, savings: 0.9 },
        { name: 'Квалификация лидов', hours: 3, savings: 0.8 },
        { name: 'Обработка заявок', hours: 4, savings: 0.95 },
        { name: 'Аналитика диалогов', hours: 2, savings: 0.75 }
    ],
    'construction': [
        { name: 'Составление смет', hours: 4, savings: 0.8 },
        { name: 'Контроль подрядчиков', hours: 3, savings: 0.6 },
        { name: 'Подбор материалов', hours: 2, savings: 0.85 },
        { name: 'Планирование работ', hours: 3, savings: 0.7 },
        { name: 'Документооборот', hours: 2, savings: 0.9 }
    ],
    'flowers': [
        { name: 'Обработка заказов', hours: 3, savings: 0.8 },
        { name: 'Подбор композиций', hours: 2, savings: 0.75 },
        { name: 'Управление доставкой', hours: 2, savings: 0.85 },
        { name: 'Работа с поставщиками', hours: 2, savings: 0.7 },
        { name: 'Ведение соцсетей', hours: 2, savings: 0.9 }
    ],
    'realestate': [
        { name: 'Написание объявлений', hours: 2, savings: 0.85 },
        { name: 'Анализ рынка', hours: 3, savings: 0.8 },
        { name: 'Создание виртуальных туров', hours: 4, savings: 0.7 },
        { name: 'Работа с клиентами', hours: 4, savings: 0.6 },
        { name: 'Подготовка документов', hours: 2, savings: 0.9 }
    ],
    'legal': [
        { name: 'Создание документов', hours: 4, savings: 0.8 },
        { name: 'Анализ договоров', hours: 3, savings: 0.85 },
        { name: 'Юридические консультации', hours: 2, savings: 0.6 },
        { name: 'Исследование прецедентов', hours: 3, savings: 0.9 },
        { name: 'Подготовка отчетов', hours: 2, savings: 0.85 }
    ],
    'ecommerce': [
        { name: 'Написание описаний товаров', hours: 3, savings: 0.9 },
        { name: 'Работа с отзывами', hours: 2, savings: 0.85 },
        { name: 'SEO-оптимизация', hours: 3, savings: 0.8 },
        { name: 'Управление складом', hours: 2, savings: 0.7 },
        { name: 'Аналитика продаж', hours: 2, savings: 0.85 }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const businessSelect = document.getElementById('business-sphere');
    const tasksGroup = document.getElementById('tasks-group');
    const hourlyRateSlider = document.getElementById('hourly-rate');
    const hourlyRateValue = document.getElementById('hourly-rate-value');
    const calculatorResults = document.getElementById('calculator-results');
    
    // Обновление значения слайдера
    if (hourlyRateSlider && hourlyRateValue) {
        hourlyRateSlider.addEventListener('input', function() {
            hourlyRateValue.textContent = parseInt(this.value).toLocaleString('ru-RU');
        });
    }
    
    // Загрузка задач при выборе сферы
    if (businessSelect && tasksGroup) {
        businessSelect.addEventListener('change', function() {
            const sphere = this.value;
            tasksGroup.innerHTML = '';
            
            if (sphere && sphereTasks[sphere]) {
                sphereTasks[sphere].forEach((task, index) => {
                    const checkbox = document.createElement('label');
                    checkbox.className = 'checkbox';
                    checkbox.innerHTML = `
                        <input type="checkbox" name="ai-tasks" value="${sphere}-${index}" data-hours="${task.hours}" data-savings="${task.savings}">
                        <span class="checkbox__box"></span>
                        <span class="checkbox__label">${task.name} (${task.hours}ч/день, экономия ${Math.round(task.savings * 100)}%)</span>
                    `;
                    tasksGroup.appendChild(checkbox);
                });
            }
        });
    }
    
    // Расчет экономии
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function() {
            const selectedBusiness = businessSelect?.value;
            const selectedTasks = Array.from(document.querySelectorAll('input[name="ai-tasks"]:checked'));
            const hourlyRate = parseInt(hourlyRateSlider?.value) || 2000;
            
            if (!selectedBusiness || selectedTasks.length === 0) {
                showErrorMessage('Пожалуйста, выберите сферу бизнеса и отметьте задачи для расчета');
                return;
            }
            
            // Расчет экономии
            let totalHoursPerDay = 0;
            let averageSavings = 0;
            
            selectedTasks.forEach(task => {
                const hours = parseFloat(task.dataset.hours);
                const savings = parseFloat(task.dataset.savings);
                totalHoursPerDay += hours * savings;
                averageSavings += savings;
            });
            
            averageSavings = averageSavings / selectedTasks.length;
            
            // Расчеты
            const hoursPerMonth = totalHoursPerDay * 22; // рабочих дней в месяце
            const timeSaved3Months = hoursPerMonth * 3;
            const moneySaved3Months = timeSaved3Months * hourlyRate;
            const additionalIncome = moneySaved3Months * 0.5; // 50% от экономии как доп. доход
            const clubCost = 18900;
            const roi = Math.round((moneySaved3Months / clubCost) * 100);
            const paybackDays = Math.ceil(clubCost / (totalHoursPerDay * hourlyRate));
            
            // Обновляем результаты
            const timeSavedElement = document.getElementById('time-saved-3months');
            const daysSavedElement = document.getElementById('days-saved');
            const moneySavedElement = document.getElementById('money-saved');
            const additionalIncomeElement = document.getElementById('additional-income');
            const roiElement = document.getElementById('roi-percentage');
            const paybackElement = document.getElementById('payback-days');
            const hoursPerMonthElement = document.getElementById('hours-per-month');
            
            if (timeSavedElement) timeSavedElement.textContent = Math.round(timeSaved3Months);
            if (daysSavedElement) daysSavedElement.textContent = Math.round(timeSaved3Months / 8);
            if (moneySavedElement) moneySavedElement.textContent = Math.round(moneySaved3Months).toLocaleString('ru-RU');
            if (additionalIncomeElement) additionalIncomeElement.textContent = Math.round(additionalIncome).toLocaleString('ru-RU');
            if (roiElement) roiElement.textContent = roi;
            if (paybackElement) paybackElement.textContent = paybackDays;
            if (hoursPerMonthElement) hoursPerMonthElement.textContent = Math.round(hoursPerMonth);
            
            // Показываем результаты
            if (calculatorResults) {
                calculatorResults.style.display = 'block';
                calculatorResults.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// ====================
// ТАБЫ НАПРАВЛЕНИЙ
// ====================

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Убираем активный класс со всех кнопок и панелей
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Добавляем активный класс к текущей кнопке
            this.classList.add('active');
            
            // Показываем соответствующую панель
            const targetPane = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
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
    
    const avatars = [
        'image/user1.jpg', 'image/user2.jpg', 'image/user3.jpg',
        'image/user4.jpg', 'image/user5.jpg', 'image/user6.jpg',
        'image/user7.jpg', 'image/user8.jpg', 'image/user9.jpg'
    ];
    
    const actions = [
        'только что присоединился к НейроКлубу',
        'получил доступ к базе промптов',
        'начал экономить время с ИИ',
        'увеличил доход на 40% за месяц'
    ];
    
    function showSocialProof() {
        if (!socialProof) return;
        
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomName = names[randomIndex];
        const randomAvatar = avatars[randomIndex];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        
        const nameElement = socialProof.querySelector('strong');
        const actionElement = socialProof.querySelector('span');
        const avatarElement = socialProof.querySelector('.social-proof__avatar');
        
        if (nameElement && actionElement && avatarElement) {
            nameElement.textContent = randomName;
            actionElement.textContent = randomAction;
            avatarElement.src = randomAvatar;
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
            nav.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                nav.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            }
        });
    }
});

// ====================
// ИНСТРУКЦИЯ ПО НАСТРОЙКЕ
// ====================

console.log(`
🔗 НАСТРОЙКА ССЫЛОК НА ОПЛАТУ:

Чтобы добавить ссылки на оплату тарифов, замените значения в объекте TARIFF_LINKS:

const TARIFF_LINKS = {
    'profi': 'https://your-payment-link-profi.com',      // Ссылка на оплату тарифа "Профи"
    'business': 'https://your-payment-link-business.com', // Ссылка на оплату тарифа "Бизнес"
    'vip': 'https://your-payment-link-vip.com'           // Ссылка на оплату тарифа "VIP"
};

💡 Примеры платежных систем:
- Robokassa: https://auth.robokassa.ru/Merchant/Index.aspx
- YooKassa: https://yookassa.ru/
- Tinkoff: https://business.tinkoff.ru/
- PayPal: https://www.paypal.com/

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
7. Замените значения в TELEGRAM_CONFIG

✅ ИСПРАВЛЕНО:
- Удален тариф за 990₽
- Добавлена возможность вставки ссылок в кнопки тарифов
- Исправлено бургер-меню (теперь работает корректно)
- Исправлен калькулятор (добавлены проверки элементов)
- Добавлены табы для направлений

❗ ВАЖНО: Не публикуйте токен бота в открытом доступе!
`); 