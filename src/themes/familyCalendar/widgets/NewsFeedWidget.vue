<template>
  <div class="newsfeed">
    <div v-if="articles.length > 0">
      <div :class="fadeClass">
        <div class="newsfeed__source">{{ articles[activeArticleNumber].source }}, {{ articles[activeArticleNumber].displayDate }}:</div>
        <div class="newsfeed__headline">{{ articles[activeArticleNumber].title }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import { formatDistance } from 'date-fns';
import { serverUrl } from '../../../config.json';

const parseRSSFeed = async (source) => {
  const { title, url } = source;
  const feed = await axios.get(`${serverUrl}/api/fetchData?url=${url}`);
  const results = [];
  if (feed.status === 200) {
    const feedData = feed.data;
    const currentDate = new Date();
    const parsedFeedData = await new window.DOMParser().parseFromString(feedData, 'text/xml');
    const items = parsedFeedData.querySelectorAll('item');
    [...items].sort((a, b) => {
      const aDate = new Date(a.querySelector('pubDate').innerHTML).getTime();
      const bDate = new Date(b.querySelector('pubDate').innerHTML).getTime();
      return bDate - aDate;
    })
      .forEach((item) => {
        const itemTitle = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
        const pubDate = new Date(item.querySelector('pubDate').innerHTML);
        const itemDate = formatDistance(pubDate, currentDate, { addSuffix: true }).replace('about ', '');

        results.push({
          source: title,
          title: itemTitle,
          date: pubDate,
          displayDate: itemDate,
        });
      });
  }
  return results;
};

const parseRedditFeed = async (source) => {
  const { title, url } = source;
  const feed = await axios.get(`${serverUrl}/api/fetchData?url=${url}`);
  const results = [];
  if (feed.status === 200) {
    const feedData = feed.data?.data?.children;
    const currentDate = new Date();
    feedData.filter((item) => !item.data.stickied)
      .sort((a, b) => b.data.created - a.data.created)
      .forEach((item) => {
        const pubDate = new Date(item.data.created_utc * 1000);
        const itemDate = formatDistance(pubDate, currentDate, { addSuffix: true }).replace('about ', '');
        results.push({
          source: title,
          title: item.data.title,
          date: pubDate,
          displayDate: itemDate,
        });
      });
  }
  return results;
};

export default {
  name: 'NewsFeedWidget',
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    activeArticleNumber: 0,
    articles: [],
    fadeClass: 'newsfeed__fadein',
  }),
  created() {
    const updateActiveArtical = async () => {
      const resetCounter = this.activeArticleNumber + 1 > this.articles.length - 1;
      this.fadeClass = 'newsfeed__fader';
      await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
      this.activeArticleNumber = resetCounter ? 0 : this.activeArticleNumber + 1;
      await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
      this.fadeClass = '';
    };

    const processSources = () => {
      const parsePromises = this.config.sources.map((source) => {
        let parseFunction = parseRSSFeed;
        if (source.type === 'reddit') {
          parseFunction = parseRedditFeed;
        }

        return parseFunction(source);
      });
      Promise.all(parsePromises).then((results) => {
        const unsortedArticles = [];
        results.forEach((resultArray) => unsortedArticles.push(...resultArray));
        this.articles = unsortedArticles.sort((a, b) => b.date.getTime() - a.date.getTime());
      });
    };

    processSources();

    setInterval(processSources, this.config.interval * 60 * 1000);
    updateActiveArtical();
    setInterval(updateActiveArtical, 15 * 1000);
  },
};
</script>
<style lang="scss" scoped>
.newsfeed {
  color: white;
  padding-top: 0.3rem;
  overflow: hidden;
  text-overflow: ellipsis;

  &__source {
    font-size: 1.1rem;
    color: lightgray;
  }

  &__headline {
    font-size: 2.2rem;
    font-weight: 800;
    color: white;
  }

  &__fader {
    animation-name: fadeit;
    animation-duration: 2s;
    animation-iteration-count: 2;
    animation-direction: alternate;
  }
}

@-webkit-keyframes fadeit {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes fadeit {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}
</style>
