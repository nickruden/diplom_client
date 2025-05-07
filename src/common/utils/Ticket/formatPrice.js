export function getEventPrice(tickets) {
    // Конвертируем строки 'false'/'true' в boolean и фильтруем доступные билеты
    const availableTickets = tickets.filter(ticket => ticket.isSoldOut !== 1);
  
    // Получаем уникальные цены доступных билетов (конвертируем в число)
    const uniquePrices = [...new Set(
      availableTickets.map(ticket => Number(ticket.price)))
    ];
  
    // 1. Если есть и 0 и другие цены
    if (uniquePrices.includes(0) && uniquePrices.length > 1) {
      const maxPrice = Math.max(...uniquePrices);
      return { display: `от 0-${maxPrice}`, value: maxPrice };
    }
  
    // 2. Если только 0
    if (uniquePrices.length === 1 && uniquePrices[0] === 0) {
      return { display: 'Бесплатно', value: 0 };
    }
  
    // 3. Если только платные билеты
    const minPrice = Math.min(...uniquePrices);
    return { display: `от ${minPrice}`, value: minPrice };
  }