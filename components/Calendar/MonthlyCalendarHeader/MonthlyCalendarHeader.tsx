import React from 'react';
import { getWeekDayIdLabelPairs } from '../../utils/dateUtil';

export default class MonthlyCalendarHeader extends React.PureComponent<any, any> {
  render() {
    return (
      <div className="ic-monthly-calendar-header">
        {getWeekDayIdLabelPairs().map(weekDay => (
          <div key={weekDay.id} className="ic-monthly-calendar-header__week-day">
            {weekDay.label}
          </div>
        ))}
      </div>
    );
  }
}
