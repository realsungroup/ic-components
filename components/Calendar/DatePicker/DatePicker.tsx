import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';

export default function DatePicker(props) {
  return (
    <div className="ic-date-picker">
      <AntdDatePicker {...props} />
    </div>
  );
}
