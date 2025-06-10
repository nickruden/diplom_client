function getHourWord(hours) {
  if (hours === 0) return 'часов'; // 0 часов
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'часов';
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
}

function getMinuteWord(minutes) {
  if (minutes === 0) return 'минут';
  const lastDigit = minutes % 10;
  const lastTwoDigits = minutes % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'минут';
  if (lastDigit === 1) return 'минута';
  if (lastDigit >= 2 && lastDigit <= 4) return 'минуты';
  return 'минут';
}

function getDayWord(days) {
  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
}

export function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  const totalMinutes = Math.round(diffMs / (1000 * 60));
  
  // Если больше 48 часов — показываем дни
  if (totalMinutes >= 48 * 60) {
    const days = Math.round(totalMinutes / (60 * 24));
    return `${days} ${getDayWord(days)}`;
  }
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  // Если меньше 1 часа — показываем только минуты
  if (hours === 0) {
    return `${minutes} ${getMinuteWord(minutes)}`;
  }
  
  // Иначе — часы и минуты (если минуты не нулевые)
  if (minutes === 0) {
    return `${hours} ${getHourWord(hours)}`;
  } else {
    return `${hours} ${getHourWord(hours)} ${minutes} ${getMinuteWord(minutes)}`;
  }
}