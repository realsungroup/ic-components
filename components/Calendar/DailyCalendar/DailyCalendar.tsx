import React from 'react';
import classnames from 'classnames';
import memoizeOne from 'memoize-one';
import moment from 'moment';
import { getDatesBetween, getWeekDayName, monthDayHasher } from '../../utils/dateUtil';
import { allocateDailyEvents, isTotalDayEvent } from '../../utils/eventUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import MonthDayView from '../MonthDayView';

function allDayEventsFilter(event) {
  return isTotalDayEvent(event);
}

// 不是全天事件
function notAllDayEventsFilter(event) {
  return !isTotalDayEvent(event);
}

export default class DailyCalendar extends React.PureComponent<any, any> {
  static defaultProps = {
    activeDate: new Date(),
  };

  isFirstDayOfSection = (date: Date) => {
    const { startDate } = this.props;
    return date.getDate() === startDate.getDate();
  };

  getDaysToLastDayOfSection = (date: Date) => {
    const { endDate } = this.props;
    const end = moment(endDate);
    const start = moment(date);
    end
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    start
      .hour(0)
      .minute(0)
      .second(0)
      .millisecond(0);
    return end.diff(start, 'days');
  };

  getSingleDayWidth = (containerWidth, days) => {
    return Math.floor(containerWidth / days);
  };

  getTitleRowRenderer = memoizeOne((dates, activeDate) => containerWidth => {
    const days = dates.length;
    const singleDayWidth = this.getSingleDayWidth(containerWidth, days);

    return (
      <div className="ic-daily-calendar__top-right">
        {dates.map(date => (
          <div
            key={date.valueOf()}
            className={classnames('ic-daily-calendar__day-title', {
              ['ic-daily-calendar__day-title-active']: days > 1 && date.getDate() === activeDate.getDate(),
            })}
            style={{ width: singleDayWidth }}
          >
            <div className="ic-daily-calendar__day-title-week">{getWeekDayName(date)}</div>
            <div className="ic-daily-calendar__day-title-date">{`${date.getMonth() + 1}月${date.getDate()}日`}</div>
          </div>
        ))}
      </div>
    );
  });

  getEventRowRenderer = memoizeOne((dates, events) => containerWidth => {
    const eventsMap = allocateDailyEvents(events);
    const singleDayWidth = this.getSingleDayWidth(containerWidth, dates.length);

    return (
      <div className="ic-daily-calendar__top-right">
        {dates.map(date => (
          <div
            key={date.valueOf()}
            className="ic-daily-calendar__all-day-event-container"
            style={{ width: singleDayWidth }}
          >
            <MonthDayView
              params={eventsMap}
              eventsFilter={allDayEventsFilter}
              date={date}
              dayElementWidth={singleDayWidth}
              dateVisible={false}
              dotVisible={false}
              eventsLimit={null}
              isFirstDayOfSection={this.isFirstDayOfSection}
              getDaysToLastDayOfSection={this.getDaysToLastDayOfSection}
              style={{ height: 'auto', width: singleDayWidth }}
            />
          </div>
        ))}
      </div>
    );
  });

  getMainViewRenderer = memoizeOne((dates, events) => containerWidth => {
    const eventsMap = allocateDailyEvents(events);
    const singleDayWidth = this.getSingleDayWidth(containerWidth, dates.length);

    return (
      <ChildrenWithProps className="ic-daily-calendar__day-views">
        {dates.map(date => (
          <SingleDayView
            key={date.valueOf()}
            events={eventsMap.get(monthDayHasher(date))}
            eventsFilter={notAllDayEventsFilter}
            date={date}
            style={{ width: singleDayWidth }}
          />
        ))}
      </ChildrenWithProps>
    );
  });

  render() {
    const { height, events, startDate, endDate, activeDate } = this.props;
    const dates = getDatesBetween(startDate, endDate);

    return (
      <div className="ic-daily-calendar">
        <DayTimeLine
          height={height}
          renderTitleRow={this.getTitleRowRenderer(dates, activeDate)}
          renderEventRow={this.getEventRowRenderer(dates, events)}
          renderMainView={this.getMainViewRenderer(dates, events)}
        />
      </div>
    );
  }
}
