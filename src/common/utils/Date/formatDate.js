import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

/**
 * Удаляет смещение из dayjs объекта и возвращает Date без timezone-сдвига.
 * То есть, "15:00+03:00" -> Date("1970-01-01T15:00:00.000Z") — 15:00 сохраняется.
 */
function normalizeToLocalDate(dateInput) {
  if (!dateInput) return null;

  const d = dayjs.isDayjs(dateInput)
    ? dateInput
    : dayjs(dateInput);

  if (!d.isValid()) return null;

  const normalized = d.subtract(d.utcOffset(), 'minute');
  return normalized.toDate();
}


export function formatDate(dateInput, options = {}) {
  const {
    useMonthNames = true,
    noYear = false,
    locale = 'ru-RU',
    separator = ' ',
    showWeekday = false,
    showWeekdayFull = false,
    noNormalize = false,
  } = options;

  const date = noNormalize ? new Date(dateInput) : normalizeToLocalDate(dateInput);
  if (!date) return '';

  const year = date.getFullYear();
  const day = date.getDate();

  const parts = [];

  if (showWeekday || showWeekdayFull) {
    const weekdayNames = {
      'ru-RU': {
        short: ['Пн,', 'Вт,', 'Ср,', 'Чт,', 'Пт,', 'Сб,', 'Вс,'],
        full: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
      }
    };

    const weekdayType = showWeekdayFull ? 'full' : 'short';
    const weekdayIndex = (date.getDay() + 6) % 7; // чтобы Пн был 0
    const weekday = weekdayNames[locale]?.[weekdayType][weekdayIndex] ||
      date.toLocaleDateString(locale, { weekday: weekdayType });

    parts.push(weekday);
  }

  let monthPart;
  if (useMonthNames) {
    if (locale === 'ru-RU') {
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

  parts.push(day, monthPart);
  if (!noYear) parts.push(year);

  return parts.join(separator);
}

export function formatTime(timeInput, options = {}) {
  const {
    showDate = false,
    showYear = false,
    showWeekday = false,
    locale = 'ru-RU',
    noNormalize = false,
  } = options;

  const date = noNormalize ? new Date(timeInput) : normalizeToLocalDate(timeInput);
  if (!date) return '';

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timePart = `${hours}:${minutes}`;

  if (!showDate) return timePart;

  return `${formatDate(date, {
    showWeekday,
    useMonthNames: true,
    noYear: !showYear,
    locale,
    noNormalize,
  })} ${timePart}`;
}

export function formatTimeRange(startInput, endInput, options = {}) {
  const {
    locale = 'ru-RU',
    showWeekday = false,
    showYear = true,
    noNormalize = false,
  } = options;

  const startDate = noNormalize ? new Date(startInput) : normalizeToLocalDate(startInput);
  const endDate = noNormalize ? new Date(endInput) : normalizeToLocalDate(endInput);

  if (!startDate || !endDate) return '';

  const isSameDay = startDate.getDate() === endDate.getDate() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  const startStr = formatTime(startDate, {
    showDate: true,
    showYear,
    showWeekday,
    locale,
  });

  const endStr = formatTime(endDate, {
    showDate: !isSameDay,
    showWeekday: !isSameDay && showWeekday,
    locale,
  });

  return `${startStr} — ${endStr}`;
}

export const normalizeToUtcWithoutOffset = (val) => {
  if (!val || !dayjs.isDayjs(val)) return null;
  return val.subtract(val.utcOffset(), 'minute');
};

export const formatNormalizeDate = (date) => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm:ss[Z]");
};