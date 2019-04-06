import React from 'react';
import classnames from 'classnames';
import { monthDayHasher, isSameMonthDay, isFirstDateOfWeek, isLastDateOfWeek } from '../../utils/dateUtil';
import { getEventDuration } from '../../utils/eventUtil';
import styles from './MonthDayView.module.css';

const dayElementPadding = {
  top: 1,
  bottom: 1,
  left: 6,
  right: 6,
};

const constructPadding = ({ top, bottom, left, right }) =>
  `${top}px ${right || 0}px ${bottom || top}px ${left || right}px`;

export default class MonthDayView extends React.PureComponent {
  getEventElementWidth(event) {
    const { dayElementWidth } = this.props;
    if (isLastDateOfWeek(event.startTime) || !dayElementWidth) {
      return undefined;
    }

    const eventDurationByDay = getEventDuration(event, 'day');
    const { left, right } = dayElementPadding;
    return dayElementWidth * eventDurationByDay - left - right;
  }

  isVisible(event) {
    const { alreadyBegun, startTime } = event;
    return !alreadyBegun || isFirstDateOfWeek(startTime);
  }

  isTotalDayEvent(event) {
    const { event_time, event_endtime } = event.original;
    return event_time === '00:00:00' && event_endtime === '23:59:59';
  }

  handleEventClick = event => {
    console.log(event);
    alert(event.original.event_title);
  };

  render() {
    const { date, calendarActiveDate, params: eventsMap } = this.props;
    const eventKey = monthDayHasher(date);
    const eventsOfToday = eventsMap.get(eventKey) || [];
    const monthDay = date.getDate();
    const isActive = isSameMonthDay(date, calendarActiveDate);
    const isDateOfOtherMonth = date.getMonth() !== calendarActiveDate.getMonth();
    const weekDay = date.getDay();
    const isWeekend = weekDay === 0 || weekDay === 6;

    return (
      <div className={styles.container} style={{ padding: constructPadding(dayElementPadding) }}>
        <div
          className={classnames(styles.monthDay, {
            [styles.monthDayActive]: isActive,
            [styles.otherMonthDay]: isDateOfOtherMonth,
            [styles.weekend]: isWeekend,
          })}
        >
          {monthDay}
        </div>
        <div>
          {eventsOfToday.slice(0, 3).map(event => {
            const {
              original: { event_title, occur_id, category_color, event_hostheadurl },
            } = event;
            const eventElementWidth = this.getEventElementWidth(event);
            const eventElementStyle = eventElementWidth ? { width: eventElementWidth } : {};
            return (
              <div
                key={occur_id}
                className={classnames(styles.event, { [styles.eventHidden]: !this.isVisible(event) })}
                style={eventElementStyle}
              >
                <img src={event_hostheadurl} />
                <div
                  className={styles.eventBar}
                  style={{ background: category_color }}
                  onClick={() => {
                    this.handleEventClick(event);
                  }}
                >
                  <span>{event_title}</span>
                  {this.isTotalDayEvent(event) && <span className={styles.dot} />}
                </div>
              </div>
            );
          })}
          {eventsOfToday.length > 3 && <div className={styles.ellipse}>...</div>}
        </div>
      </div>
    );
  }
}
