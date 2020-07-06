<template>
  <div class="events">
    <div class="events__title">{{ config.title }}</div>
    <div class="events__separator"></div>
    <div
      v-for="event in events"
      :key="event.title"
      class="events__event"
    >
      <div class="events__event--icon">
        <span :class="`mdi ${event.isAllDay ? 'mdi-calendar-check' : 'mdi-calendar-clock'}`"></span>
      </div>
      <div class="events__event--title">{{ event.title }}</div>
      <div class="events__event--when">{{ event.when }}</div>
    </div>
    <div v-if="events.length === 0">No {{ config.title }}</div>
  </div>
</template>
<script>
import ical from 'ical';
import { mapState } from 'vuex';
import {
  add, formatDistance, isBefore, isAfter, isSameDay,
} from 'date-fns';

export default {
  name: 'EventsWidget',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      calendarData: (state) => state.familyCalendar.calendarData,
    }),
    events() {
      return this.getEvents();
    },
  },
  methods: {
    getEvents() {
      const rawIcalData = this.calendarData;
      if (!rawIcalData) return [];

      const icalData = Object.values(ical.parseICS(rawIcalData));
      return icalData.filter((entry) => {
        if (entry.type !== 'VEVENT') return false;

        const today = new Date();
        const furthestAhead = add(today, { days: this.config.lookAhead });

        return isAfter(entry.start, today) && isBefore(entry.start, furthestAhead);
      }).map((event) => ({
        title: event.summary,
        isAllDay: !isSameDay(event.start, event.end),
        when: formatDistance(event.start, new Date(), { addSuffix: true }).replace('about ', ''),
      }));
    },
  },
};
</script>
<style lang="scss" scoped>
.events {
  color: white;
  font-size: 1.1rem;
  margin-left: 0.7rem;

  &__title {
    width: 100%;
    text-align: left;
  }

  &__separator {
    width: 100%;
    height: 0.3rem;
    border-bottom: solid 1px white;
    margin-bottom: 0.7rem;
  }

  &__event {
    display: flex;
    flex-direction: row;
    font-size: 1.4rem;

    &--icon {
      margin-right: 0.3rem;
      font-size: 1rem;
      align-self: baseline;
    }

    &--title {
      flex-grow: 1;
      text-align: left;
    }
  }
}
</style>
