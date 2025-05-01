export function calculateDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // Разница в миллисекундах
    const diffMs = end.getTime() - start.getTime();
    
    // Преобразуем в часы и округляем
    return Math.round(diffMs / (1000 * 60 * 60));
  }