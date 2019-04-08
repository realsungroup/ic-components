import React from 'react';
import ChildrenWithProps from '../../ChildrenWithProps';
import DayTimeLine from '../DayTimeLine';
import SingleDayView from '../SingleDayView';

export default class DailyCalendar extends React.PureComponent {
  render() {
    const { events } = this.props;

    return (
      <div className="ic-daily-calendar">
        <div style={{ height: 40 }}>未完成</div>
        <DayTimeLine>
          <ChildrenWithProps className="ic-daily-calendar__day-views">
            <SingleDayView events={events} />
            {/* <SingleDayView index={2} /> */}
          </ChildrenWithProps>
        </DayTimeLine>
      </div>
    );
  }
}
