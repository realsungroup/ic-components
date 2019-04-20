import React from 'react';
import memoizeOne from 'memoize-one';
import classnames from 'classnames';
import { getWeekDayName, monthDayHasher } from '../../utils/dateUtil';
import { allocateDailyEvents, isTotalDayEvent, getEventsTimeRange } from '../../utils/eventUtil';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';
import MonthDayView from '../MonthDayView';
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

    /**
     * 时间轴范围
     * 默认值：['08:00', '18:00']
     */
    timeLineRange: PropTypes.arrayOf(PropTypes.string),
  };

  state = {
    timeLineRefreshKey: false,
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { events, selectedDate } = this.props;
    if (events !== nextProps.events || selectedDate !== nextProps.selectedDate) {
      this.setState(({ timeLineRefreshKey}) => ({ timeLineRefreshKey: !timeLineRefreshKey }));
    }
  }

  isFirstDayOfSection = (date: Date) => {
    const { selectedDate } = this.props;
    return date.getDate() === selectedDate.getDate();
  };

  getDaysToLastDayOfSection = () => {
    const result = 0;
    return result;
  };

  getClassifyRowRenderer = memoizeOne(events => containerWidth => {
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

    return (
      <div className="ic-daily-calendar__top-right">
        {eventsWithEventsMap.map(event => (
          <div key={event.type} className="ic-daily-calendar__all-day-event-container" style={{ width }}>
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
        ))}
      </div>
    )
  });

  getMainViewRenderer = memoizeOne((date, events) => containerWidth => {
    const eventsWithEventsMap = this.getEventsMap(events);
    const width = containerWidth / eventsWithEventsMap.length;
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

  getEvents = memoizeOne(events => {
    let retEvents = [];
    events.map(event => event.original).forEach(event => {
      const index = retEvents.findIndex(item => item.type === event.category_name);
      if (index !== -1) {
        retEvents[index].events.push(event);
      } else {
        retEvents.push({ type: event.category_name, events: [event] });
      }
    });
    return retEvents;
  });

  getEventsMap = memoizeOne(events => {
    return events.map(event => ({
      ...event,
      eventsMap: allocateDailyEvents(event.events),
    }));
  });

  render() {
    const { events: propEvents, selectedDate, timeLineRange, height } = this.props;
    const { timeLineRefreshKey } = this.state;
    const events = this.getEvents(propEvents);
    const [startHHmm, endHHmm] = getEventsTimeRange(propEvents, timeLineRange);

    return (
      <div className="ic-daily-calendar">
        <div className={classnames('ic-daily-calendar__day-title', 'ic-plan__title-row')}>
          <div className="ic-daily-calendar__day-title-week">{getWeekDayName(selectedDate)}</div>
          <div className="ic-daily-calendar__day-title-date">{`${selectedDate.getMonth() +
            1}月${selectedDate.getDate()}日`}</div>
        </div>
        <DayTimeLine
          key={`${timeLineRefreshKey}`}
          height={height && height - 56}
          startHHmm={startHHmm}
          endHHmm={endHHmm}
          titleRowHeight={28}
          renderEventRow={this.getEventRowRenderer(selectedDate, events)}
          renderMainView={this.getMainViewRenderer(selectedDate, events)}
          renderTitleRow={this.getClassifyRowRenderer(events)}
        />
      </div>
    );
  }
}
