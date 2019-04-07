import React from 'react';
import result from 'lodash/result';
import { getWeekDayName, formatHHmmTime } from '../../utils/dateUtil';
import { filterEventsByImportance, groupEventsByDay, getEventsGroupsInDateRange } from '../../utils/eventUtil';
import styles from './AgendaList.module.css';
import attachmentIcon from './images/attachment.svg';

function getGroupTitle(date) {
  return `${getWeekDayName(date)} ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function AgendaList(props) {
  const { events, dateRange, detailVisible, importantOnly, weatherVisible } = props;

  const eventsGroups = groupEventsByDay(filterEventsByImportance(events, importantOnly));
  let eventsGroupsInDateRange = [];
  const [start, end] = dateRange || [];
  if (start && end) {
    eventsGroupsInDateRange = getEventsGroupsInDateRange(
      eventsGroups,
      start.toDate().valueOf(),
      end.toDate().valueOf()
    );
  }

  return (
    <div className={styles.container}>
      {eventsGroupsInDateRange.map(({ monthDayHash, date, events: groupEvents }) => (
        <div key={monthDayHash} className={styles.group}>
          <div className={styles.groupHeader}>
            <div className={styles.dayTitle}>{getGroupTitle(date)}</div>
            {weatherVisible && (
              <img className={styles.dayWeather} alt={`天气${result(groupEvents[0], 'original.event_weather', '')}`} />
            )}
          </div>
          <div className={styles.events}>
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
                <div key={occurId} className={styles.eventCard}>
                  <div className={styles.eventCardLeft}>
                    <div className={styles.eventTime}>
                      {`${formatHHmmTime(event_time)} ~ ${formatHHmmTime(event_endtime)}`}
                    </div>
                    <div className={styles.eventTitle}>{event_title}</div>
                    <div className={styles.eventContent}>
                      <div className={styles.eventShort}>{event_short}</div>
                      {detailVisible && <div className={styles.eventDetail}>{event_desc}</div>}
                    </div>
                  </div>
                  <div className={styles.eventCardRight}>
                    {hasAttachment && (
                      <div className={styles.eventAttachment}>
                        <a href={event_attach[1]} target="_blank">
                          <img src={attachmentIcon} />
                        </a>
                      </div>
                    )}
                    {detailVisible && event_image && (
                      <div className={styles.eventImage}>
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
