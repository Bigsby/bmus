import { Component } from '@angular/core';
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";

@Component({
    templateUrl: './scales.component.html',
    styleUrls: ['./scales.component.scss']
})
export class ScalesComponent {
    allKeys: models.Key[] = helpers.getAllKeys();
    root: models.Key = this.allKeys[1];
    target: models.Key = this.allKeys[1];
    intervalDisplay: string;
    interval: models.Interval;
    tonalDistance: number;

    constructor() {
        this.updateResult();
    }

    getNoteName(note: models.Note): string {
        return models.Note[note];
    }

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    updateResult() {
        this.interval = helpers.getKeyInterval(this.root, this.target);
        this.intervalDisplay = helpers.getIntervalDisplay(this.interval);
        this.tonalDistance = helpers.getIntervalDistance(this.interval);
    }
}
