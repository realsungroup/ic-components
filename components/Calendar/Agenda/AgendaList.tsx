/// <reference path='../../../typings/custom-typings.d.ts'/>

import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import result from 'lodash/result';
import { getWeekDayName, formatHHmmTime } from '../../utils/dateUtil';
import { filterEventsByImportance, groupEventsByDay, getEventsGroupsInDateRange } from '../../utils/eventUtil';

function getGroupTitle(date) {
  return `${getWeekDayName(date)} ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function AgendaList(props) {
  const { events, startDate: propStartDate, dateRange, detailVisible, importantOnly, weatherVisible } = props;

  const eventsGroups = groupEventsByDay(filterEventsByImportance(events, importantOnly));
  let eventsGroupsInDateRange = [];
  const [rangeStep, rangeUnit] = dateRange.split(':');
  const startDate = new Date(propStartDate);
  startDate.setHours(0, 0, 0, 0);
  const endDate = moment(startDate)
    .add(rangeStep, rangeUnit)
    .subtract(1, 'ms')
    .toDate();
  if (startDate && endDate) {
    eventsGroupsInDateRange = getEventsGroupsInDateRange(eventsGroups, startDate.valueOf(), endDate.valueOf());
  }

  return (
    <div className="ic-agenda-list">
      {eventsGroupsInDateRange.map(({ monthDayHash, date, events: groupEvents }) => (
        <div key={monthDayHash} className="ic-agenda-list__group">
          <div className="ic-agenda-list__group-header">
            <div className="ic-agenda-list__day-title">{getGroupTitle(date)}</div>
            {weatherVisible && (
              <div
                className={classnames(
                  'ic-agenda__img',
                  'ic-agenda-list__weather',
                  `ic-agenda-list__weather-${result(groupEvents[0], 'original.event_weather')}`
                )}
              />
            )}
          </div>
          <div className="ic-agenda-list__events">
            {groupEvents.map(event => {
              const {
                occurId,
                original: {
                  event_time,
                  event_endtime,
                  event_title,
                  event_short,
                  event_desc,
                  event_attach,
                  event_image,
                },
              } = event;
              const hasAttachment = event_attach && event_attach[1];
              return (
                <div key={occurId} className="ic-agenda-list__event-card">
                  <div className="ic-agenda-list__event-card-left">
                    <div className="ic-agenda-list__event-time">
                      {`${formatHHmmTime(event_time)} ~ ${formatHHmmTime(event_endtime)}`}
                    </div>
                    <div className="ic-agenda-list__event-title">{event_title}</div>
                    <div className="ic-agenda-list__event-content">
                      <div className="ic-agenda-list__event-short">{event_short}</div>
                      {detailVisible && <div className="ic-agenda-list__event-detail">{event_desc}</div>}
                    </div>
                  </div>
                  <div className="ic-agenda-list__event-card-right">
                    {hasAttachment && (
                      <div className="ic-agenda-list__event-attachment">
                        <a className="ic-agenda__img" href={event_attach[1]} target="_blank">
                          <div className="ic-agenda-list__event-attachment-icon" />
                        </a>
                      </div>
                    )}
                    {detailVisible && event_image && (
                      <div className="ic-agenda-list__event-image">
                        <img src={event_image} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
