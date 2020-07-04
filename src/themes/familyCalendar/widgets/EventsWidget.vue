<template>
  <div class="events">
    <div class="events__title">{{ config.title }}</div>
    <div class="events__separator"></div>
    <div
      v-for="event in events"
      :key="event.title"
      class="events__event">
        <div class="events__event--title">{{ event.title }}</div>
        <div class="events__event--when">{{ event.when }}</div>
      </div>
  </div>
</template>
<script>
import ical from 'ical';
import { mapState } from 'vuex';
import {
  add, formatDistance, isBefore, isAfter,
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
        console.log('dates: ', entry.start, today, furthestAhead);
        console.log('isBefore: ', isBefore(entry.start, furthestAhead));

        return isAfter(entry.start, today) && isBefore(entry.start, furthestAhead);
      }).map((event) => ({
        title: event.summary,
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
  margin: 1rem 0.7rem 1rem 0.7rem;

  &__title {
    width: 100%;
    text-align: left;
  }

  &__separator {
    width: 100%;
    height: 0.3rem;
    border-bottom: solid 1px white;
  }

  &__event {
    display: flex;
    flex-direction: row;
    font-size: 1.4rem;

    &--title {
      flex-grow: 1;
      text-align: left;
    }
  }
}
</style>
