import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import { getDatesBetween, getWeekDayName, monthDayHasher } from '../../utils/dateUtil';
import { allocateDailyEvents, isTotalDayEvent } from '../../utils/eventUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import MonthDayView from '../MonthDayView';
import memoizeOne from 'memoize-one';
import PropTypes from 'prop-types';

function allDayEventsFilter(event) {
  return isTotalDayEvent(event);
}

function notAllDayEventsFilter(event) {
  return !isTotalDayEvent(event);
}

export default class Plan extends React.PureComponent<any, any> {
  static propTypes = {
    /**
     * 选择的日期
     */
    selectedDate: PropTypes.object,

    /**
     * 分类的日历事件
     */
    events: PropTypes.array,
  };

  isFirstDayOfSection = (date: Date) => {
    const { selectedDate } = this.props;
    return date.getDate() === selectedDate.getDate();
  };

  getDaysToLastDayOfSection = () => {
    const result = 0;
    return result;
  };

  getClassifyRowRenderer = memoizeOne((events) => containerWidth => {
    const singleClassifyWidth = containerWidth;

    return (
      <div className="ic-plan__classify" style={{ width: containerWidth }}>
        {events.map(eventItem => (
          <div
            key={eventItem.type}
            className="ic-plan__classify-item"
            style={{ width: singleClassifyWidth / events.length }}
          >
            {eventItem.type}
          </div>
        ))}
      </div>
    );
  });

  getEventRowRenderer = memoizeOne((date, events) => containerWidth => {
    const eventsWithEventsMap = this.getEventsMap(events);
    const width = containerWidth / eventsWithEventsMap.length;

    return eventsWithEventsMap.map(event => (
      <div key={event.type} className="ic-daily-calendar__all-day-event-container" style={{ width, float: 'left' }}>
        <MonthDayView
          params={event.eventsMap}
          eventsFilter={allDayEventsFilter}
          date={date}
          dayElementWidth={width}
          dateVisible={false}
          dotVisible={false}
          eventsLimit={null}
          isFirstDayOfSection={this.isFirstDayOfSection}
          getDaysToLastDayOfSection={this.getDaysToLastDayOfSection}
          style={{ height: 'auto', width }}
        />
      </div>
    ));
  });

  getMainViewRenderer = memoizeOne((date, events) => containerWidth => {
    const eventsWithEventsMap = this.getEventsMap(events);
    const width = containerWidth / eventsWithEventsMap.length;
    console.log(events)
    console.log(eventsWithEventsMap)
    return (
      <ChildrenWithProps className="ic-plan__single-classify-wrap">
        {eventsWithEventsMap.map(event => (
          <SingleDayView
            key={event.type}
            events={event.eventsMap.get(monthDayHasher(date))}
            eventsFilter={notAllDayEventsFilter}
            date={date}
            style={{ width }}
          />
        ))}
      </ChildrenWithProps>
    );
  });

  getEventsMap = events => {
    return events.map(event => ({
      ...event,
      eventsMap: allocateDailyEvents(event.events),
    }));
  };

  render() {
    const { events, selectedDate } = this.props;
    const dates = getDatesBetween(selectedDate, selectedDate);
    return (
      <div className="ic-daily-calendar">
        <div className={classnames('ic-daily-calendar__day-title', 'ic-plan__title-row')}>
          <div className="ic-daily-calendar__day-title-week">{getWeekDayName(selectedDate)}</div>
          <div className="ic-daily-calendar__day-title-date">{`${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`}</div>
        </div>
        <DayTimeLine
          titleRowHeight={28}
          renderEventRow={this.getEventRowRenderer(selectedDate, events)}
          renderMainView={this.getMainViewRenderer(selectedDate, events)}
          renderTitleRow={this.getClassifyRowRenderer(events)}
        />
      </div>
    );
  }
}
