import { Component } from "@angular/core";
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";

@Component({
    templateUrl: './intervals.component.html',
    styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent {
    //allKeys: models.Key[] = helpers.getAllKeys();
    intervals: models.Interval[] = helpers.getIntervals();
    classifyRoot: models.Pitch;
    classifyTarget: models.Pitch;
    selectedKey: models.Pitch;
    findRoot: models.Pitch;

    // classifyRoot: models.Key = this.allKeys[1];
    // classifyTarget: models.Key = this.allKeys[1];
    // selectedKey: models.Key = this.allKeys[1];
    // findRoot: models.Key = this.allKeys[1];
    findInterval: models.Interval = this.intervals[1];
    findPitch: models.Pitch;
    findPitchDisplay: string;
    intervalDisplay: string;
    interval: models.Interval;
    tonalDistance: number;

    constructor() {
        this.setClassifyDisplay();
        this.updateFind();
    }
    getIntervalDisplay(interval: models.Interval): string {
        return helpers.getIntervalDisplay(interval);
    }

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    setClassifyDisplay() {
        if (!this.classifyRoot || !this.classifyTarget) return;
        this.interval = helpers.getPitchInterval(this.classifyRoot, this.classifyTarget);
        this.intervalDisplay = helpers.getIntervalDisplay(this.interval);
        this.tonalDistance = helpers.getIntervalDistance(this.interval);
    }

    updateClassify(updateDisplay: boolean = false) {
        if (updateDisplay) {
            this.setClassifyDisplay();
        }
    }

    updateFind() {
        if (!this.findPitch) return;
        this.findPitch = helpers.getIntervalPitch(this.findRoot, this.findInterval);
        this.findPitchDisplay = helpers.getPitchDisplay(this.findPitch);
    }
}