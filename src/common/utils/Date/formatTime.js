export function formatTime(timeString, options = {}) {
    const { showDate = false, showYear = true, locale = 'ru-RU' } = options;
    const date = new Date(timeString);
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const timePart = `${hours}:${minutes}`;
    
    if (!showDate) return timePart;
    
    const day = date.getDate();
    const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year} ${timePart}`;
}


export function formatTimeRange(startTime, endTime, locale = 'ru-RU') {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    // Проверяем, переходит ли событие на следующий день
    const isSameDay = startDate.getDate() === endDate.getDate() &&
                     startDate.getMonth() === endDate.getMonth() &&
                     startDate.getFullYear() === endDate.getFullYear();
    
    const startStr = formatTime(startTime, { 
        showDate: true, 
        locale 
    });
    
    const endStr = formatTime(endTime, {
        showDate: !isSameDay,
        locale
    });
    
    return `${startStr} — ${endStr}`;
}
