import dayjs from "dayjs";
import { formatDate, formatTime, normalizeToUtcWithoutOffset } from "../../../common/utils/Date/formatDate";

export const groupTicketsByValidity = (tickets) => {
  const now = dayjs();
  const groups = {};

  tickets.forEach((ticket) => {
    const fromDate = dayjs(ticket.validFrom);
    const toEndSalesDate = normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd));
    const toDate = dayjs(ticket.validTo);

    if (toEndSalesDate.isBefore(now) || toDate.isBefore(now)) {
      return;
    }

    const isSameDay = fromDate.isSame(toDate, "day");

    let key;

    if (isSameDay) {
      const dateStr = formatDate(fromDate, { showWeekday: false });
      const timeFrom = formatTime(fromDate);
      const timeTo = formatTime(toDate);
      key = `${dateStr} ${timeFrom} — ${timeTo}`;
    } else {
      const fromStr = formatTime(fromDate, { showDate: true, showYear: true });
      const toStr = formatTime(toDate, { showDate: true, showYear: true });
      key = `${fromStr} — ${toStr}`;
    }

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(ticket);
  });

  // Преобразуем объект в массив пар [ключ, значение] для сортировки
  const sortedEntries = Object.entries(groups).sort((a, b) => {
    // Берем первый билет из группы для сравнения дат
    const dateA = dayjs(a[1][0].validFrom);
    const dateB = dayjs(b[1][0].validFrom);
    return dateA.diff(dateB);
  });

  // Преобразуем отсортированный массив обратно в объект
  const sortedGroups = {};
  sortedEntries.forEach(([key, value]) => {
    sortedGroups[key] = value;
  });

  return sortedGroups;
};