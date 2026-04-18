import { Interval } from './interval';

export class IntervalQuestion {
  interval: Interval;
  guessedIntervals: string[];
  answeredCorrectly: boolean;
  constructor(interval: Interval) {
    this.interval = interval;
    this.guessedIntervals = [];
    this.answeredCorrectly = false;
  }

  guessInterval(guess: string): boolean {
    if (guess === this.interval.name) {
      this.answeredCorrectly = true;
      this.guessedIntervals.push(guess);
      return true;
    }
    else if (!this.guessedIntervals.includes(guess)) {
      this.guessedIntervals.push(guess);
    }
    return false;
  }
}
