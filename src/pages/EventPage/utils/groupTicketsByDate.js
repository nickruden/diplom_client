import dayjs from "dayjs";
import { formatDate, formatTime, normalizeToUtcWithoutOffset } from "../../../common/utils/Date/formatDate";

export const groupTicketsByValidity = (tickets) => {
  const now = dayjs();
  const groups = {};

  tickets.forEach((ticket) => {
    const fromDate = dayjs(ticket.validFrom);
    const toEndSalesDate = normalizeToUtcWithoutOffset(dayjs(ticket.salesEnd));
    const toDate = dayjs(ticket.validTo);

    if (toEndSalesDate.isBefore(now)) {
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

  return groups;
};
