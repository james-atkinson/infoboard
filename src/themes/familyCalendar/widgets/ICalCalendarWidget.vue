<template>
  <div class="icalcalendar">
    <div class="icalcalendar__header">
      {{ currentMonth }} {{ currentYear }}
    </div>
    <div class="icalcalendar__body">
      <div
        v-for="(day, index) in days"
        :key="index"
        :style="`grid-area: ${day.gridRow} / ${day.gridColumn} / ${day.gridRow} / ${day.gridColumn};`"
        class="icalcalendar__day"
      >
        <div
          v-if="day.gridRow === 1"
          class="icalcalendar__day--header"
        >
          {{ daysOfTheWeek[index] }}
        </div>
        <div :class="`icalcalendar__day--number ${day.isCurrentDay ? 'current' :''}`">{{ day.number }}</div>
        <div
          v-for="event in day.events"
          :key="event.uid"
          :class="`icalcalendar__day--${event.isAllDay ? 'alldayevent' : 'event'}`"
        >
          {{ event.summary }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ical from 'ical';
import { mapState } from 'vuex';
import { cloneDeep } from 'lodash';
import { format, isWithinInterval, isSameDay } from 'date-fns';

export default {
  name: 'ICalCalendarWidget',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    currentMonth: '',
    currentYear: '',
    daysOfTheWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  }),
  computed: {
    ...mapState({
      calendarData: (state) => state.familyCalendar.calendarData,
    }),
    days() {
      const rawIcalData = this.calendarData;
      if (!rawIcalData) return [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getYear();
      const currentDay = new Date().getDate();
      const icalData = Object.values(ical.parseICS(rawIcalData));
      const days = [];

      const currentEvents = icalData.filter((entry) => {
        if (entry.type !== 'VEVENT') return false;

        const entryStartMonth = entry.start.getMonth();
        const entryStartYear = entry.start.getYear();
        const entryEndMonth = entry.end.getMonth();
        const entryEndYear = entry.end.getYear();

        return (entryStartYear === currentYear && entryStartMonth === currentMonth) || (entryEndMonth === currentMonth && entryEndYear === currentYear);
      });

      const firstDayOfMonth = new Date(new Date().getFullYear(), currentMonth, 1).getDay() + 1;
      const daysInMonth = 32 - (new Date(new Date().getYear(), new Date().getMonth(), 32).getDate());

      let daysCreated = 1;
      for (let row = 1; row < 7; row++) { // eslint-disable-line
        for (let column = 1; column < 8; column++) { // eslint-disable-line
          if (daysCreated > daysInMonth) break;
          const dayIsInMonth = (row === 1 && column >= firstDayOfMonth) || row > 1;
          const dayNumber = dayIsInMonth ? cloneDeep(daysCreated) : '';
          const isCurrentDay = dayNumber === currentDay;
          const dateTimeOfDay = dayIsInMonth ? new Date(new Date().getFullYear(), currentMonth, dayNumber, 12, 0, 0, 0) : null;
          const day = {
            number: dayNumber,
            isCurrentDay,
            gridRow: row,
            gridColumn: column,
            events: [],
          };

          const daysEvents = currentEvents.filter((event) => {
            const { start, end } = event;
            const eventSpansDay = isWithinInterval(dateTimeOfDay, { start, end });
            const eventOnDay = isSameDay(start, end) && isSameDay(start, dateTimeOfDay);
            return eventSpansDay || eventOnDay;
          });

          day.events = daysEvents.map((event) => {
            const { summary, start, end } = event;
            const isAllDay = !isSameDay(start, end);
            return {
              isAllDay,
              summary: isAllDay ? summary : `${format(start, 'h:mm a')} - ${summary}`,
            };
          });

          dayIsInMonth && daysCreated++; // eslint-disable-line
          days.push(day);
        }
      }
      return days;
    },
  },
  async created() {
    this.currentMonth = format(new Date(), 'MMMM');
    this.currentYear = new Date().getFullYear();
  },
};
</script>
<style lang="scss" scoped>
.icalcalendar {

  &__body {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(5, 1fr);
    max-height: 90%;
  }

  &__header {
    width: 100%;
    max-height: 10%;
    color: white;
    font-size: 3.2rem;
    font-weight: 800;
    text-align: right;
  }

  &__day {
    color: white;
    background: rgba($color: #000000, $alpha: 0.5);
    border: solid 1px rgba($color: #ffffff, $alpha: 0.5);
    max-width: 13rem;
    font-weight: 500;

    &--header {
      color: black;
      background: rgba($color: #ffffff, $alpha: 0.8);
      width: 100%;
      text-align: center;
      padding: 0;
      margin: 0;
    }

    &--number {
      width: 100%;
      text-align: right;
      &.current {
        color: black;
        border-top: solid 1px black;
        background: rgba($color: #ffffff, $alpha: 0.8);
      }
    }

    &--alldayevent {
      color: black;
      background-color: rgb(248, 211, 45);
      border: solid 1px rgb(248, 211, 45);
      border-radius: 3px;
      margin: 0.3rem;
      padding: 0.2rem 0.4rem 0.2rem 0.2rem;
      font-size: 0.9rem;
      text-align: right;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &--event {
      color: white;
      margin: 0.3rem;
      padding: 0.2rem 0.2rem 0.2rem 0.4rem;
      font-size: 0.9rem;
      text-align: left;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &::before {
        content: '';
        display: inline-block;
        width: 0.6rem;
        height: 0.6rem;
        -moz-border-radius: 7.5px;
        -webkit-border-radius: 7.5px;
        border-radius: 7.5px;
        background-color: rgb(248, 211, 45);
      }
    }
  }

}
</style>
