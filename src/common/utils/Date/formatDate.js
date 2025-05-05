export function formatDate(dateString, options = {}) {
    const {
        useMonthNames = true,
        noYear = false,
        locale = 'ru-RU',
        separator = ' ',
        showWeekday = false,
        showWeekdayFull = false
    } = options;
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const day = date.getDate();
    
    // Формируем части даты
    const parts = [];
    
    // Добавляем день недели если нужно
    if (showWeekday || showWeekdayFull) {
        const weekdayNames = {
            'ru-RU': {
                short: ['Пн,', 'Вт,', 'Ср,', 'Чт,', 'Пт,', 'Сб,', 'Вс,'],
                full: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
            }
        };
        
        const weekdayType = showWeekdayFull ? 'full' : 'short';
        const weekday = weekdayNames[locale]?.[weekdayType][date.getDay()] || 
                        date.toLocaleDateString(locale, { weekday: weekdayType });
        
        parts.push(weekday);
    }
    
    // Формируем месяц
    let monthPart;
    if (useMonthNames) {
        if (locale === 'ru-RU') {
            const monthNames = [
                'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
            ];
            monthPart = monthNames[date.getMonth()];
        } else {
            monthPart = date.toLocaleDateString(locale, { month: 'long' });
        }
    } else {
        monthPart = String(date.getMonth() + 1).padStart(2, '0');
    }
    
    // Добавляем основные части даты
    parts.push(day, monthPart);
    if (!noYear) parts.push(year);
    
    return parts.join(separator);
}


export function formatTime(timeString, options = {}) {
    const { showDate = false, showYear = true, showWeekday = false, locale = 'ru-RU' } = options;
    const date = new Date(timeString);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timePart = `${hours}:${minutes}`;
    
    if (!showDate) return timePart;
    
    return `${formatDate(date, { 
        showWeekday,
        useMonthNames: true, 
        noYear: !showYear, 
        locale 
    })} ${timePart}`;
}


export function formatTimeRange(startTime, endTime, options = {}) {
    const { locale = 'ru-RU', showWeekday = false, showYear = true } = options;
    
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const isSameDay = startDate.getDate() === endDate.getDate() &&
                     startDate.getMonth() === endDate.getMonth() &&
                     startDate.getFullYear() === endDate.getFullYear();
    
    const startStr = formatTime(startTime, { 
        showDate: true,
        showYear,
        showWeekday,
        locale 
    });
    
    const endStr = formatTime(endTime, {
        showDate: !isSameDay,
        showWeekday: !isSameDay && showWeekday,
        locale
    });
    
    return `${startStr} — ${endStr}`;
}
