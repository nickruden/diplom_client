import React from 'react';
import { DatePicker, TimePicker, ConfigProvider } from 'antd';
import locale from 'antd/es/locale/ru_RU';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

import './MyDatePicker.scss';

const MyDateTimePicker = ({ label, value, onChange, placeholder, type = 'date', ...props }) => {
  const now = dayjs();
  const today = now.startOf('day');

  const disabledDate = (current) => {
    return current && current < today;
  };

  return (
    <ConfigProvider locale={locale}>
      <div>
        {type === 'date' ? (
          <DatePicker
            placeholder={placeholder}
            value={value ?? null}
            onChange={(date) => onChange(date ?? null)}
            format="DD.MM.YYYY"
            inputReadOnly
            disabledDate={disabledDate}
            {...props}
          />
        ) : type === 'range' ? (
          <RangePicker
            placeholder={placeholder}
            value={value?.[0] && value?.[1] ? value : []} // пустой массив если нет данных
            onChange={(dates) => onChange(dates?.[0] && dates?.[1] ? dates : [null, null])}
            format="DD.MM.YYYY"
            disabled={[props.disableStartDate, false]}
            disabledDate={disabledDate}
            {...props}
          />
        ) : (
          <TimePicker
            placeholder={placeholder}
            value={value ?? null}
            onChange={(time) => onChange(time ?? null)}
            format="HH:mm"
            {...props}
          />
        )}
      </div>
    </ConfigProvider>
  );
};

export default MyDateTimePicker;
