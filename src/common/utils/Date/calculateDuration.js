function getHourWord(hours) {
  const lastDigit = hours % 10;
  const lastTwoDigits = hours % 100;
  
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'часов';
  if (lastDigit === 1) return 'час';
  if (lastDigit >= 2 && lastDigit <= 4) return 'часа';
  return 'часов';
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
  
  // Разница в миллисекундах
  const diffMs = end.getTime() - start.getTime();
  
  // Преобразуем в часы
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  
  // Если больше 48 часов - преобразуем в дни
  if (hours > 48) {
      const days = Math.round(hours / 24);
      return `${days} ${getDayWord(days)}`;
  }
  
  return `${hours} ${getHourWord(hours)}`;
}