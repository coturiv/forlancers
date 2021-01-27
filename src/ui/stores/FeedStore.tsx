import { observable, action, computed, makeObservable } from 'mobx';

export default class FeedStore {
  @observable
  feeds: any[] = [];

  @observable
  selectedFeed: any;

  @computed
  get hasFeeds() {
    return this.feeds.length > 0;
  }

  constructor() {
    makeObservable(this);
  }

  @action
  addFeed(feed: any) {
    !this.feeds.filter((c) => c.name === feed.name).length && this.feeds.push(feed);
  }

  @action
  removeFeed(feed: any) {
    const idx: number = this.feeds.findIndex((c) => c.name === feed.name);
    this.feeds.splice(idx, 1);
  }

  @action
  setFeed(feed: any) {
    this.selectedFeed = feed;
  }
}
