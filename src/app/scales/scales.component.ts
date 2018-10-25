import { Component } from '@angular/core';
import * as models from "./../models/models";

@Component({
    templateUrl: './scales.component.html',
    styleUrls: ['./scales.component.scss']
})
export class ScalesComponent {
    root = new models.Key(models.Note.A, models.Accidental.Natural);
    target = new models.Key(models.Note.C, models.Accidental.Natural);
    value: number;
    quality: string;
    constructor() {
        const result = models.getInterval(this.root, this.target);
        this.value = result.degree;
        this.quality = models.IntervalQuality[result.quality];
    }

    getNotes(): models.Note[] {
        let result = [];
        for (let note in models.Note) {
            if (parseInt(note, 10) >= 0) {
                result.push(note);
            }
        }
        return result;
    }

    getNoteName(note: models.Note): string {
        return models.Note[note];
    }
}
