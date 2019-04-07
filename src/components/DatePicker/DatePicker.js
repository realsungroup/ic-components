import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import styles from './DatePicker.module.css';

export default function DatePicker(props) {
  return <div className={styles.container}><AntdDatePicker {...props} /></div>;
}
