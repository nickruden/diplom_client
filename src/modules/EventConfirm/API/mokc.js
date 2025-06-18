export const mockEvent = {
    id: 1,
    name: 'Летний фестиваль музыки',
    description: 'Самое жаркое событие этого лета с участием топовых исполнителей и атмосферой свободы.',
    startTime: '2025-08-15T18:00:00.000Z',
    endTime: '2025-08-15T23:00:00.000Z',
    location: 'Москва, Парк Горького',
    isActual: 1,
    isPrime: 0,
    createdAt: '2025-04-28T10:00:00.000Z',
    categoryId: 3,
    organizerId: 7,
    images: [
      {
        imageUrl: 'https://fastly.picsum.photos/id/319/400/300.jpg?hmac=PubN45p34RXGxZ5yksbSPgt_bmh3Qhrd4eh9Jn6rltk',
        isMain: true,
      },
    ],
    category: {
      id: 3,
      slug: 'music',
      name: "Музыка"
    },
    tickets: [
      {
        title: 'Стандарт',
        price: 1500,
        count: 300,
        isSoldOut: '0',
      },
      {
        title: 'VIP',
        price: 5000,
        count: 50,
        isSoldOut: '0',
      },
    ],
    totalTickets: 350,
  };
  