import React from 'react';
import ChildrenWithProps from '../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import styles from './DailyCalendar.module.css';

export default class DailyCalendar extends React.PureComponent {
  render() {
    const { events } = this.props;

    return (
      <div className={styles.container}>
        <div style={{ height: 40 }}>未完成</div>
        <DayTimeLine>
          <ChildrenWithProps className={styles.dayViews}>
            <SingleDayView events={events} />
            {/* <SingleDayView index={2} /> */}
          </ChildrenWithProps>
        </DayTimeLine>
      </div>
    );
  }
}