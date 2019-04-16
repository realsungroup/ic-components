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

  state = {
    sideWidth: 0,
    sideHeight: 0,
    today: new Date(),
    rootWidth: 0,
  };

  rootRef: any = React.createRef();

  componentDidMount() {
    this.setState({ rootWidth: this.rootRef.current.offsetWidth });
  }

  handleGetSideElement = element => {
    this.setState({
      sideWidth: element.offsetWidth,
      sideHeight: element.offsetHeight,
    });
  };

  isFirstDayOfSection = (date: Date) => {
    const { selectedDate } = this.props;
    return date.getDate() === selectedDate.getDate();
  };

  getDaysToLastDayOfSection = (date: Date) => {
    // const { endDate } = this.props;
    // const end = moment(endDate);
    // const start = moment(date);
    // end
    //   .hour(0)
    //   .minute(0)
    //   .second(0)
    //   .millisecond(0);
    // start
    //   .hour(0)
    //   .minute(0)
    //   .second(0)
    //   .millisecond(0);
    // const result = end.diff(start, 'days');
    const result = 0;
    return result;
  };

  getSingleDayWidth = (containerWidth, days) => {
    return Math.floor(containerWidth / days);
  };

  getTitleRowRenderer = memoizeOne((dates, activeDate) => containerWidth => {
    const { events } = this.props;
    const days = dates.length;
    const singleDayWidth = events.length * containerWidth;

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

  getClassifyRowRenderer = (dates, events) => containerWidth => {
    const singleClassifyWidth = containerWidth;

    return (
      <div className="ic-plan__classify" style={{ width: containerWidth, overflowX: 'auto' }}>
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
  };

  getEventRowRenderer = memoizeOne((dates, events) => containerWidth => {
    const { events, selectedDate } = this.props;
    const eventsWithEventsMap = this.getEventsMap(events);
    const width = containerWidth / eventsWithEventsMap.length;

    return eventsWithEventsMap.map(event => (
      <div key={event.type} className="ic-daily-calendar__all-day-event-container" style={{ width, float: 'left' }}>
        <MonthDayView
          params={event.eventsMap}
          eventsFilter={allDayEventsFilter}
          date={selectedDate}
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

  getMainViewRenderer = (dates, events) => containerWidth => {
    const { events, selectedDate } = this.props;
    const eventsWithEventsMap = this.getEventsMap(events);
    const width = containerWidth / eventsWithEventsMap.length;
    return (
      <ChildrenWithProps className="ic-plan__single-classify-wrap">
        {eventsWithEventsMap.map(event => (
          <SingleDayView
            key={event.type}
            events={event.eventsMap.get(monthDayHasher(selectedDate))}
            eventsFilter={notAllDayEventsFilter}
            date={selectedDate}
            style={{ width, float: 'left' }}
          />
        ))}
      </ChildrenWithProps>
    );
  };

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
      <div className="ic-daily-calendar" ref={this.rootRef}>
        <DayTimeLine
          renderTitleRow={this.getTitleRowRenderer(dates, events)}
          renderEventRow={this.getEventRowRenderer(dates, events)}
          renderMainView={this.getMainViewRenderer(dates, events)}
          renderClassifyRow={this.getClassifyRowRenderer(dates, events)}
          onGetSideElement={this.handleGetSideElement}
        />
      </div>
    );
  }
}
