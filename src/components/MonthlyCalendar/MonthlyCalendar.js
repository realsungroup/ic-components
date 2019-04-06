import React from 'react';
import MonthlyCalendarHeader from '../MonthlyCalendarHeader';
import MonthlyCalendarBody from '../MonthlyCalendarBody';
import styles from './MonthlyCalendar.module.css';

export default class MonthlyCalendar extends React.PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <MonthlyCalendarHeader />
        <MonthlyCalendarBody {...this.props} />
      </div>
    );
  }
}
