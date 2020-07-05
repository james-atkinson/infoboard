<template>
  <div>
    <div v-if="currentWeather && currentWeather.main && currentWeather.weather && currentWeather.wind" class="weather">
      <div class="weather__current">
        <div class="weather__current--temp">
          <span :class="`mdi ${weatherTypes[currentWeather.weather[0].id].icon}`"></span> {{ roundTemp(currentWeather.main.temp) }}&deg;
        </div>
        <div class="weather__current--feels">
          Feels like {{ roundTemp(currentWeather.main.feels_like) }}&deg;
        </div>
      </div>
      <div class="weather__wind-sun">
        <div class="weather__wind-sun--wind">
          <span class="mdi mdi-weather-windy">
              {{ ((currentWeather.wind.speed * 60 * 60) / 1000).toFixed(0) }}</span><sup>{{ getWindDirection(currentWeather.wind.deg) }}</sup>
        </div>
        <div class="weather__wind-sun--sun">
          <span :class="`mdi ${sunUpDown.icon}`"></span>{{ sunUpDown.time }}
        </div>
      </div>
      <div
        v-if="Object.values(forecast).length > 0"
        class="weather__forecast"
      >
        <div class="weather__forecast--title">
          {{ config.title }}
        </div>
        <div class="weather__forecast--separator"></div>
        <div
          v-for="day in Object.values(forecast)"
          :key="day.day"
          class="weather__forecast--row"
        >
          <div class="weather__forecast--row-item">{{ day.day }}</div>
          <div class="weather__forecast--row-item"><span :class="`mdi ${day.icon}`"></span></div>
          <div class="weather__forecast--row-item">{{ day.high }}&deg;</div>
          <div class="weather__forecast--row-item">{{ day.low }}&deg;</div>
          <div class="weather__forecast--row-item">{{ day.precip > 0 ? `${day.precip.toFixed(1)}mm` : '' }}</div>
        </div>
      </div>
    </div>
    <GenericDataFetcher :config="currentWeatherFetcherConfig" />
    <GenericDataFetcher
      v-if="config.includeForecast"
      :config="forecastFetcherConfig"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { format, isBefore, isSameDay } from 'date-fns';
import GenericDataFetcher from '../../../components/data/GenericDataFetcher.vue';

const weatherTypes = {
  200: {
    label: 'thunderstorm with light rain',
    icon: 'mdi-weather-lightning-rainy',
  },
  201: {
    label: 'thunderstorm with rain',
    icon: 'mdi-weather-lightning-rainy',
  },
  202: {
    label: 'thunderstorm with heavy rain',
    icon: 'mdi-weather-lightning-rainy',
  },
  210: {
    label: 'light thunderstorm',
    icon: 'mdi-weather-lightning-rainy',
  },
  211: {
    label: 'thunderstorm',
    icon: 'mdi-weather-lightning',
  },
  212: {
    label: 'heavy thunderstorm',
    icon: 'mdi-weather-lightning',
  },
  221: {
    label: 'ragged thunderstorm',
    icon: 'mdi-weather-lightning',
  },
  230: {
    label: 'thunderstorm with light drizzle',
    icon: 'mdi-weather-lightning-rainy',
  },
  231: {
    label: 'thunderstorm with drizzle',
    icon: 'mdi-weather-lightning-rainy',
  },
  232: {
    label: 'thunderstorm with heavy drizzle',
    icon: 'mdi-weather-lightning-rainy',
  },
  300: {
    label: 'light intensity drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  301: {
    label: 'drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  302: {
    label: 'heavy intensity drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  310: {
    label: 'light intensity drizzle rain',
    icon: 'mdi-weather-partly-rainy',
  },
  311: {
    label: 'drizzle rain',
    icon: 'mdi-weather-partly-rainy',
  },
  312: {
    label: 'heavy intensity drizzle rain',
    icon: 'mdi-weather-partly-rainy',
  },
  313: {
    label: 'shower rain and drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  314: {
    label: 'heavy shower rain and drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  321: {
    label: 'shower drizzle',
    icon: 'mdi-weather-partly-rainy',
  },
  500: {
    label: 'light rain',
    icon: 'mdi-weather-rainy',
  },
  501: {
    label: 'moderate rain',
    icon: 'mdi-weather-rainy',
  },
  502: {
    label: 'heavy intensity rain',
    icon: 'mdi-weather-rainy',
  },
  503: {
    label: 'very heavy rain',
    icon: 'mdi-weather-rainy',
  },
  504: {
    label: 'extreme rain',
    icon: 'mdi-weather-rainy',
  },
  511: {
    label: 'freezing rain',
    icon: 'mdi-weather-snowy-rainy',
  },
  520: {
    label: 'light intensity shower rain',
    icon: 'mdi-weather-pouring',
  },
  521: {
    label: 'shower rain',
    icon: 'mdi-weather-pouring',
  },
  522: {
    label: 'heavy intensity shower rain',
    icon: 'mdi-weather-pouring',
  },
  531: {
    label: 'ragged shower rain',
    icon: 'mdi-weather-pouring',
  },
  600: {
    label: 'light snow',
    icon: 'mdi-weather-snowy',
  },
  601: {
    label: 'mdi-weather-snowy',
    icon: 'mdi-weather-snowy',
  },
  602: {
    label: 'heavy snow',
    icon: 'mdi-weather-snowy',
  },
  611: {
    label: 'sleet',
    icon: 'mdi-weather-snowy-rainy',
  },
  612: {
    label: 'shower sleet',
    icon: 'mdi-weather-snowy-rainy',
  },
  615: {
    label: 'light rain and snow',
    icon: 'mdi-weather-snowy-rainy',
  },
  616: {
    label: 'rain and snow',
    icon: 'mdi-weather-snowy-rainy',
  },
  620: {
    label: 'light shower snow',
    icon: 'mdi-weather-snowy-rainy',
  },
  621: {
    label: 'shower snow',
    icon: 'mdi-weather-snowy-rainy',
  },
  622: {
    label: 'heavy shower snow',
    icon: 'mdi-weather-snowy-rainy',
  },
  701: {
    label: 'mist',
    icon: 'mdi-weather-fog',
  },
  711: {
    label: 'smoke',
    icon: 'mdi-weather-hazy',
  },
  721: {
    label: 'haze',
    icon: 'mdi-weather-hazy',
  },
  731: {
    label: 'sand, dust whirls',
    icon: 'mdi-weather-windy-variant',
  },
  741: {
    label: 'fog',
    icon: 'mdi-weather-fog',
  },
  751: {
    label: 'sand',
    icon: 'mdi-weather-hazy',
  },
  761: {
    label: 'dust',
    icon: 'mdi-weather-hazy',
  },
  762: {
    label: 'volcanic ash',
    icon: 'mdi-weather-hazy',
  },
  771: {
    label: 'squalls',
    icon: 'mdi-weather-windy',
  },
  781: {
    label: 'tornado',
    icon: 'mdi-weather-tornado',
  },
  800: {
    label: 'clear sky',
    icon: 'mdi-weather-sunny',
  },
  801: {
    label: 'few clouds',
    icon: 'mdi-weather-cloudy',
  },
  802: {
    label: 'scattered clouds',
    icon: 'mdi-weather-cloudy',
  },
  803: {
    label: 'broken clouds',
    icon: 'mdi-weather-cloudy',
  },
  804: {
    label: 'overcast clouds',
    icon: 'mdi-weather-cloudy',
  },
  900: {
    label: 'tornado',
    icon: 'mdi-weather-tornado',
  },
  901: {
    label: 'tropical storm',
    icon: 'mdi-weather-hurricane',
  },
  902: {
    label: 'hurricane',
    icon: 'mdi-weather-hurricane',
  },
  903: {
    label: 'cold',
    icon: 'mdi-thermometer-low',
  },
  904: {
    label: 'hot',
    icon: 'mdi-weather-sunny-alert',
  },
  905: {
    label: 'windy',
    icon: 'mdi-weather-windy',
  },
  906: {
    label: 'hail',
    icon: 'mdi-weather-hail',
  },
  951: {
    label: 'calm',
    icon: 'mdi-weather-sunny',
  },
  952: {
    label: 'light breeze',
    icon: 'mdi-weather-windy-variant',
  },
  953: {
    label: 'gentle breeze',
    icon: 'mdi-weather-windy-variant',
  },
  954: {
    label: 'moderate breeze',
    icon: 'mdi-weather-windy-variant',
  },
  955: {
    label: 'fresh breeze',
    icon: 'mdi-weather-windy-variant',
  },
  956: {
    label: 'strong breeze',
    icon: 'mdi-weather-windy-variant',
  },
  957: {
    label: 'high wind, near gale',
    icon: 'mdi-weather-windy-variant',
  },
  958: {
    label: 'gale',
    icon: 'mdi-weather-windy-variant',
  },
  959: {
    label: 'severe gale',
    icon: 'mdi-weather-windy-variant',
  },
  960: {
    label: 'storm',
    icon: 'mdi-weather-lightning',
  },
  961: {
    label: 'violent storm',
    icon: 'mdi-weather-lightning',
  },
  962: {
    label: 'hurricane',
    icon: 'mdi-weather-windy-variant',
  },
};

export default {
  name: 'WeatherWidget',
  components: { GenericDataFetcher },
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    currentWeatherFetcherConfig: {},
    forecastFetcherConfig: {},
    weatherTypes,
    sunUpDown: {
      icon: 'mdi-weather-sunset-up',
      time: null,
    },
  }),
  computed: {
    ...mapState({
      currentWeather: (state) => state.familyCalendar.currentWeather,
      weatherForecast: (state) => state.familyCalendar.weatherForecast,
    }),
    forecast() {
      if (!this.weatherForecast || !this.weatherForecast.list) return [];
      const forecastDays = this.weatherForecast.list;
      const result = forecastDays.reduce((acc, day) => {
        const workingDateTime = new Date(day.dt * 1000);
        if (isSameDay(new Date(), workingDateTime)) return acc;
        const workingDay = format(workingDateTime, 'D', { useAdditionalDayOfYearTokens: true });
        const workingIcon = workingDateTime.getHours() > 11 && workingDateTime.getHours() < 13 ? this.weatherTypes[day.weather[0].id].icon : false;

        if (!acc[workingDay]) {
          acc[workingDay] = {
            day: format(workingDateTime, 'E'),
            icon: workingIcon,
            high: this.roundTemp(day.main.temp_max),
            low: this.roundTemp(day.main.temp_min),
            precip: day.rain ? day.rain[Object.keys(day.rain)[0]] : 0,
          };
        }

        day.main.temp_max > acc[workingDay].high && (acc[workingDay].high = this.roundTemp(day.main.temp_max)); // eslint-disable-line
        day.main.temp_min < acc[workingDay].low && (acc[workingDay].low = this.roundTemp(day.main.temp_min)); // eslint-disable-line
        day.rain && (acc[workingDay].precip += day.rain[Object.keys(day.rain)[0]]); // eslint-disable-line
        workingIcon && (acc[workingDay].icon = workingIcon); // eslint-disable-line

        return acc;
      }, {});

      return result;
    },
  },
  created() {
    const currentWeatherUrl = `http://api.openweathermap.org/data/2.5/weather?APPID=${this.config.appId}&lang=en&units=${this.config.units}&id=${this.config.locationId}`;
    const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?APPID=${this.config.appId}&lang=en&units=${this.config.units}&id=${this.config.locationId}`;

    this.currentWeatherFetcherConfig = {
      immediate: true,
      fetchUrl: currentWeatherUrl,
      storeAction: 'familyCalendar/setData',
      storeKey: 'currentWeather',
      interval: this.config.interval,
    };

    this.forecastFetcherConfig = {
      immediate: true,
      fetchUrl: forecastUrl,
      storeAction: 'familyCalendar/setData',
      storeKey: 'weatherForecast',
      interval: this.config.interval,
    };

    const determineSunUpDown = () => {
      if (!this.currentWeather) return;
      const current = new Date();
      const sunset = new Date(this.currentWeather.sys.sunset * 1000);
      const sunrise = new Date(this.currentWeather.sys.sunrise * 1000);

      if (isBefore(current, sunrise) && isBefore(current, sunset)) {
        this.sunUpDown.icon = 'mdi-weather-sunset-up';
        this.sunUpDown.time = format(sunrise, 'hh:mm aa');
      } else {
        this.sunUpDown.icon = 'mdi-weather-sunset-down';
        this.sunUpDown.time = format(sunset, 'hh:mm aa');
      }
    };

    setTimeout(() => {
      determineSunUpDown();
      setInterval(() => {
        determineSunUpDown();
      }, 1 * 60 * 60 * 1000);
    }, 5 * 1000);
  },
  methods: {
    roundTemp(temp) {
      return this.config.roundTemp ? temp.toFixed(0) : temp;
    },
    getWindDirection(deg) {
      if (deg > 11.25 && deg <= 33.75) {
        return 'NNE';
      } if (deg > 33.75 && deg <= 56.25) {
        return 'NE';
      } if (deg > 56.25 && deg <= 78.75) {
        return 'ENE';
      } if (deg > 78.75 && deg <= 101.25) {
        return 'E';
      } if (deg > 101.25 && deg <= 123.75) {
        return 'ESE';
      } if (deg > 123.75 && deg <= 146.25) {
        return 'SE';
      } if (deg > 146.25 && deg <= 168.75) {
        return 'SSE';
      } if (deg > 168.75 && deg <= 191.25) {
        return 'S';
      } if (deg > 191.25 && deg <= 213.75) {
        return 'SSW';
      } if (deg > 213.75 && deg <= 236.25) {
        return 'SW';
      } if (deg > 236.25 && deg <= 258.75) {
        return 'WSW';
      } if (deg > 258.75 && deg <= 281.25) {
        return 'W';
      } if (deg > 281.25 && deg <= 303.75) {
        return 'WNW';
      } if (deg > 303.75 && deg <= 326.25) {
        return 'NW';
      } if (deg > 326.25 && deg <= 348.75) {
        return 'NNW';
      }
      return 'N';
    },
  },
};
</script>
<style lang="scss" scoped>
.weather {
  color: white;
  font-size: 1.1rem;
  margin-left: 0.6rem;

  display: grid;
  grid-template-columns: repeat(24, 1fr);
  grid-template-rows: repeat(24, 1fr);

  &__current {
    grid-area: 1 / 1 / 6 / 25;
    text-align: left;

    &--temp {
      font-size: 5.5rem;
      line-height: 1.5rem;
      margin-bottom: 2rem;
    }
  }

  &__wind-sun {
    grid-area: 6 / 1 / 9 / 25;

    display: flex;
    flex-direction: row;

    font-size: 2rem;

    &--wind {
      sup { font-size: 1rem; }
      margin-right: 2rem;
    }
  }

  &__forecast {
    grid-area: 9 / 1 / 25 / 25;

    &--title {
      text-align: left;
    }

    &--separator {
      width: 100%;
      height: 0.3rem;
      border-bottom: solid 1px white;
    }

    &--row {
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      font-size: 1.3rem;
      justify-content: space-around;

      &-item {
        width: 20%;
        text-align: left;
      }
    }
  }

}
</style>
