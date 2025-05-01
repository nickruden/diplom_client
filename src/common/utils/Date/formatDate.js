export function formatDate(dateString, useMonthNames = false, noYear = false, locale = 'ru-RU', separator = ' ') {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const day = date.getDate();
    
    let monthPart;
    if (useMonthNames) {
        if (locale === 'ru-RU') {
            // Специальная обработка для русского склонения
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
    
    const parts = [day, monthPart];
    if (!noYear) parts.push(year);
    
    return parts.join(separator);
}