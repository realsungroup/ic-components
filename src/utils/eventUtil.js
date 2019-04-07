import memoizeOne from 'memoize-one';
import { monthDayHasher } from './dateUtil';

export const compareEvents = (e1, e2) => e1.endTime - e2.startTime;

export const isValidEvent = ({ startTime, endTime }) => startTime.valueOf() < endTime.valueOf();

export const normalizeEvent = (event, index) => {
  const safeEvent = event || {};
  if (safeEvent.original) {
    return event;
  }

  const startTime = new Date(safeEvent.occur_begin);
  const endTime = new Date(safeEvent.occur_end);

  return {
    original: safeEvent,
    occurId: safeEvent.occur_id || index,
    startTime,
    endTime,
  };
};

export const normalizeEvents = memoizeOne(events =>
  events
    .map(normalizeEvent)
    .filter(isValidEvent)
    .sort(compareEvents)
);

export const allocateDailyEvents = memoizeOne(events => {
  const validEvents = normalizeEvents(events);
  const eventsMap = new Map();

  const allocateEvent = event => {
    const { startTime, endTime } = event;
    let calcStartTime = startTime;
    const eventKey = monthDayHasher(startTime);
    const eventsOfDate = eventsMap.get(eventKey);
    if (!eventsOfDate) {
      eventsMap.set(eventKey, [event]);
    } else if (eventsOfDate.every(({ occurId }) => event.occurId !== occurId)) {
      eventsOfDate.push(event);
    }

    while (calcStartTime.getDate() !== endTime.getDate()) {
      calcStartTime = new Date(calcStartTime);
      calcStartTime.setDate(calcStartTime.getDate() + 1);
      calcStartTime.setHours(0, 0, 0, 0);
      allocateEvent({ ...event, startTime: calcStartTime, alreadyBegun: true });
    }
  };

  validEvents.forEach(allocateEvent);

  return eventsMap;
});

export const getEventDuration = (event, type) => {
  if (!isValidEvent(event)) {
    return 0;
  }

  const { startTime, endTime } = event;

  switch (type) {
  case 'day':
    return endTime.getDate() - startTime.getDate() + 1;
  default:
    return endTime - startTime;
  }
};

export const filterEventsByImportance = memoizeOne(function (events, importantOnly) {
  if (!importantOnly) {
    return events;
  }
  return normalizeEvents(events).filter(({ original: { event_important } }) => !!event_important);
});

export const groupEventsByDay = memoizeOne(function(events) {
  const validEvents = normalizeEvents(events);
  const groups = [];
  let currentMonthDayHash;
  let currentGroupIndex = -1;
  validEvents.forEach(event => {
    const { startTime } = event;
    let monthDayHash = monthDayHasher(startTime);
    if (monthDayHash !== currentMonthDayHash) {
      groups.push({ monthDayHash, date: startTime, events: [event] });
      currentMonthDayHash = monthDayHash;
      currentGroupIndex++;
    } else {
      groups[currentGroupIndex].events.push(event);
    }
  });
  return groups;
});

export const getEventsGroupsInDateRange = memoizeOne((groups, startDateValue, endDateValue) =>
  groups.filter(({ monthDayHash }) => monthDayHash >= startDateValue && monthDayHash <= endDateValue)
);
