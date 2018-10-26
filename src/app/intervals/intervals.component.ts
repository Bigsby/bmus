import { Component } from '@angular/core';
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";

@Component({
    templateUrl: './intervals.component.html',
    styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent {
    allKeys: models.Key[] = helpers.getAllKeys();
    intervals: models.Interval[] = helpers.getIntervals();
    root: models.Key = this.allKeys[1];
    target: models.Key = this.allKeys[1];
    findRoot: models.Key = this.allKeys[1];
    findInterval: models.Interval = this.intervals[1];
    findKey: models.Key;
    findKeyDisplay: string;
    intervalDisplay: string;
    interval: models.Interval;
    tonalDistance: number;

    constructor() {
        this.updateDetect();
        this.updateFind();
    }
    getIntervalDisplay(interval: models.Interval): string {
        return helpers.getIntervalDisplay(interval);
    }

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    updateDetect() {
        this.interval = helpers.getKeyInterval(this.root, this.target);
        this.intervalDisplay = helpers.getIntervalDisplay(this.interval);
        this.tonalDistance = helpers.getIntervalDistance(this.interval);
    }

    updateFind() {
        this.findKey = helpers.getIntervalKey(this.findRoot, this.findInterval);
        this.findKeyDisplay = helpers.getKeyDisplay(this.findKey);
    }
}
