import React from 'react';
import { allocateDailyEvents } from '../../utils/eventUtil';
import MonthlyCalendarHeader from '../MonthlyCalendarHeader';
import MonthlyCalendarBody from '../MonthlyCalendarBody';
import MonthDayView from '../MonthDayView';
import styles from './MonthlyCalendar.module.css';

export default class MonthlyCalendar extends React.PureComponent {
  render() {
    const { events } = this.props;
    return (
      <>
        <MonthlyCalendarHeader />
        <MonthlyCalendarBody
          className={styles.calendarBody}
          dayViewParams={allocateDailyEvents(events)}
          dayViewComponent={MonthDayView}
          {...this.props}
        />
      </>
    );
  }
}
