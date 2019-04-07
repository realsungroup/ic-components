import React from 'react';
import { DatePicker } from 'antd';
import styles from './RangePicker.module.css';

export default function RangePicker(props) {
  return <div className={styles.container}><DatePicker.RangePicker {...props} /></div>;
}
