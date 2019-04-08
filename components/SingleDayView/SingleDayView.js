import React from 'react';
import memoizeOne from 'memoize-one';
import { getHHmmDurationByMinute } from '../utils/dateUtil';
import { normalizeEvents } from '../utils/eventUtil';
import styles from './SingleDayView.module.css';

export default class SingleDayView extends React.PureComponent {
  componentDidMount() {
    const { start, end, containerHeight } = this.props;
    this.reLayout(start, end, containerHeight);
  }

  componentDidUpdate() {
    const { start, end, containerHeight } = this.props;
    this.reLayout(start, end, containerHeight);
  }

  reLayout = memoizeOne((start, end, containerHeight) => {
    const { current } = this.rootRef;
    if (!current) {
      return;
    }

    const totalMinutes = getHHmmDurationByMinute(end) - getHHmmDurationByMinute(start);
    const heightToMinutes = containerHeight / totalMinutes;
    const eventElements = current.children;
    Array.prototype.forEach.call(eventElements, element => {
      const eventStart = element.getAttribute('data-event_time');
      const eventEnd = element.getAttribute('data-event_endtime');
      const startMinutes = getHHmmDurationByMinute(eventStart);
      const endMinutes = getHHmmDurationByMinute(eventEnd);
      const eventTotalMinutes = endMinutes - startMinutes;
      const elementTop = startMinutes * heightToMinutes;
      const elementHeight = (eventTotalMinutes * containerHeight) / totalMinutes;
      element.style.top = `${elementTop}px`;
      element.style.height = `${elementHeight}px`;
    });
  });

  rootRef = React.createRef();

  handleEventClick = event => {
    console.log(event);
  };

  render() {
    const { events } = this.props;

    return (
      <div ref={this.rootRef} className="ic-single-day-view">
        {normalizeEvents(events).map(event => {
          const {
            occurId,
            original: { event_time, event_endtime, event_title, event_hostheadurl, category_color },
          } = event;
          return (
            <div
              data-event_time={event_time}
              data-event_endtime={event_endtime}
              key={occurId}
              className="ic-single-day-view__event"
              onClick={() => {
                this.handleEventClick(event);
              }}
            >
              <img className="ic-single-day-view__host-avatar" src={event_hostheadurl} />
              <div className="ic-single-day-view__content" style={{ background: category_color }}>
                <div className="ic-single-day-view__event-time">{`${event_time} - ${event_endtime}`}</div>
                <div className="ic-single-day-view__event-title">{event_title}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
