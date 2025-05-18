import { formatDate } from "../../../common/utils/Date/formatDate";

export const downloadCSV = (eventPuchasesData, eventData) => {
  if (!eventPuchasesData || eventPuchasesData.length === 0) {
    message.warning("Нет данных для сохранения");
    return;
  }

  const header = ['Номер покупки', 'Покупатель', 'Билет', 'Сумма', 'Дата'];
  const rows = eventPuchasesData.map(order => [
    order.id,
    `${order.user.firstName} ${order.user.lastName}`,
    order.ticket.name,
    `${order.ticket.price} ₽`,
    formatDate(order.purchaseTime),
  ]);

const csvContent = '\uFEFF' + [header, ...rows]
  .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  .join('\n');

const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Покупки_событие_${eventData?.name || id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
