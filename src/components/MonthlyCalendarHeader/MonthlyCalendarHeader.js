import React from 'react';
import { getWeekDaysInfo } from '../../utils/dateUtil';
import styles from './MonthlyCalendarHeader.module.css';

export default class MonthlyCalendarHeader extends React.PureComponent {
  render() {
    return (
      <div className={styles.header}>
        {getWeekDaysInfo().map(weekDay => (
          <div key={weekDay.id} className={styles.weekDay}>
            {weekDay.label}
          </div>
        ))}
      </div>
    );
  }
}
