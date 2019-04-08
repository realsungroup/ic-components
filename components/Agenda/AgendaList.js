import React from 'react';
import moment from 'moment';
import result from 'lodash/result';
import { getWeekDayName, formatHHmmTime } from '../utils/dateUtil';
import { filterEventsByImportance, groupEventsByDay, getEventsGroupsInDateRange } from '../utils/eventUtil';
import styles from './AgendaList.module.css';
import attachmentIcon from './images/attachment.svg';
import weather1 from './images/icon-tq01.svg';
import weather2 from './images/icon-tq02.svg';
import weather3 from './images/icon-tq03.svg';

const weatherIcons = {
  1: weather1,
  2: weather2,
  3: weather3,
};

function getGroupTitle(date) {
  return `${getWeekDayName(date)} ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function AgendaList(props) {
  const { events, startDate, dateRange, detailVisible, importantOnly, weatherVisible } = props;

  const eventsGroups = groupEventsByDay(filterEventsByImportance(events, importantOnly));
  let eventsGroupsInDateRange = [];
  const [rangeStep, rangeUnit] = dateRange.split(':');
  const endDate = moment(startDate)
    .add(rangeStep, rangeUnit)
    .toDate();
  if (startDate && endDate) {
    eventsGroupsInDateRange = getEventsGroupsInDateRange(eventsGroups, startDate.valueOf(), endDate.valueOf());
  }

  return (
    <div className="ic-agenda-list">
      {eventsGroupsInDateRange.map(({ monthDayHash, date, events: groupEvents }) => (
        <div key={monthDayHash} className="ic-agenda__group">
          <div className="ic-agenda__group-header">
            <div className="ic-agenda__day-title">{getGroupTitle(date)}</div>
            {weatherVisible && (
              <img
                className={styles.dayWeather}
                src={weatherIcons[result(groupEvents[0], 'original.event_weather')]}
                alt=""
              />
            )}
          </div>
          <div className="ic-agenda__events">
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
                <div key={occurId} className="ic-agenda__event-card">
                  <div className="ic-agenda__event-card-left">
                    <div className="ic-agenda__event-time">
                      {`${formatHHmmTime(event_time)} ~ ${formatHHmmTime(event_endtime)}`}
                    </div>
                    <div className="ic-agenda__event-title">{event_title}</div>
                    <div className="ic-agenda__event-content">
                      <div className="ic-agenda__event-short">{event_short}</div>
                      {detailVisible && <div className="ic-agenda__event-detail">{event_desc}</div>}
                    </div>
                  </div>
                  <div className="ic-agenda__event-card-right">
                    {hasAttachment && (
                      <div className="ic-agenda__event-attachment">
                        <a href={event_attach[1]} target="_blank">
                          <img src={attachmentIcon} />
                        </a>
                      </div>
                    )}
                    {detailVisible && event_image && (
                      <div className="ic-agenda__event-image">
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
