import React from 'react';
import classnames from 'classnames';
import { monthDayHasher, isSameMonthDay, isFirstDateOfWeek, getDaysToLastDayOfWeek } from '../../utils/dateUtil';
import { getEventDuration, isTotalDayEvent } from '../../utils/eventUtil';

const dayElementPadding = {
  top: 1,
  bottom: 1,
  left: 6,
  right: 6,
};

const constructPadding = ({ top, bottom, left, right }) =>
  `${top}px ${right || 0}px ${bottom || top}px ${left || right}px`;

export default class MonthDayView extends React.PureComponent<any, any> {
  static defaultProps = {
    grayDayOfOtherMonths: true,
    dateVisible: true,
    dotVisible: true,
    hostAvatarVisible: true,
    eventsLimit: 3,
    calendarActiveDate: new Date(),
    isFirstDayOfSection: isFirstDateOfWeek,
    getDaysToLastDayOfSection: getDaysToLastDayOfWeek,
    eventsFilter: () => true,
    paddingConfig: dayElementPadding,
  }

  getEventElementWidth(event) {
    const { dayElementWidth, getDaysToLastDayOfSection, paddingConfig } = this.props;
    if (!dayElementWidth) {
      return undefined;
    }

    const { left, right } = paddingConfig;
    const daysToLastDayOfSection = getDaysToLastDayOfSection(event.startTime);
    const maxDurationByDay = daysToLastDayOfSection + 1
    const eventDurationByDay = getEventDuration(event, 'day');
    const realDurationByDay = maxDurationByDay > eventDurationByDay ? eventDurationByDay : maxDurationByDay
    return dayElementWidth * realDurationByDay - left - right;
  }

  isVisible(event) {
    const { isFirstDayOfSection } = this.props;
    const { alreadyBegun, startTime } = event;
    return !alreadyBegun || isFirstDayOfSection(startTime);
  }

  handleEventClick = event => {
    console.log(event);
    alert(event.original.event_title);
  };

  render() {
    const {
      grayDayOfOtherMonths,
      date,
      calendarActiveDate,
      params: eventsMap,
      dateVisible,
      dotVisible,
      hostAvatarVisible,
      eventsLimit: propEventsLimit,
      eventsFilter,
      style,
      paddingConfig,
    } = this.props;

    const eventKey = monthDayHasher(date);
    const eventsOfToday = eventsMap.get(eventKey) || [];
    const monthDay = date.getDate();
    const isActive = isSameMonthDay(date, calendarActiveDate);
    const isDateOfOtherMonth = date.getMonth() !== calendarActiveDate.getMonth();
    const weekDay = date.getDay();
    const isWeekend = weekDay === 0 || weekDay === 6;
    const eventsLimit = propEventsLimit || eventsOfToday.length;

    return (
      <div className="ic-month-day-view" style={{ padding: constructPadding(paddingConfig), ...style }}>
        {dateVisible && <div
          className={classnames('ic-month-day-view__month-day', {
            [`ic-month-day-view__month-day-active`]: isActive,
            [`ic-month-day-view__other-month-day`]: isDateOfOtherMonth && grayDayOfOtherMonths,
            [`ic-month-day-view__weekend`]: isWeekend,
          })}
        >
          {monthDay}
        </div>}
        <div>
          {eventsOfToday.slice(0, eventsLimit).filter(eventsFilter).map(event => {
            const {
              original: { event_title, occur_id, category_color, event_hostheadurl },
            } = event;
            const eventElementWidth = this.getEventElementWidth(event);
            const eventElementStyle = eventElementWidth ? { width: eventElementWidth } : {};
            return (
              <div
                key={occur_id}
                className={classnames('ic-month-day-view__event', {
                  [`ic-month-day-view__event-hidden`]: !this.isVisible(event),
                })}
                style={eventElementStyle}
              >
                {hostAvatarVisible && <img src={event_hostheadurl} />}
                <div
                  className="ic-month-day-view__event-bar"
                  style={{ background: category_color }}
                  onClick={() => {
                    this.handleEventClick(event);
                  }}
                >
                  <div className="ic-month-day-view__event-title">{event_title}</div>
                  {dotVisible && isTotalDayEvent(event) && <div className="ic-month-day-view__dot" />}
                </div>
              </div>
            );
          })}
          {eventsOfToday.length > eventsLimit && <div className="ic-month-day-view__ellipse">...</div>}
        </div>
      </div>
    );
  }
}
