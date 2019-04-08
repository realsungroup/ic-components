import React from 'react';
import { getWeekDaysInfo } from '../utils/dateUtil';
// import styles from './MonthlyCalendarHeader.module.css';

export default class MonthlyCalendarHeader extends React.PureComponent {
  render() {
    return (
      <div className="ic-monthly-calendar-header">
        {getWeekDaysInfo().map(weekDay => (
          <div key={weekDay.id} className="ic-monthly-calendar-header__week-day">
            {weekDay.label}
          </div>
        ))}
      </div>
    );
  }
}
