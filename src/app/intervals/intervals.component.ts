import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import * as vf from "vexflow";
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";
import { startTimeRange } from "@angular/core/src/profile/wtf_impl";


@Component({
    templateUrl: './intervals.component.html',
    styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent implements AfterViewInit {
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
    @ViewChild("rootDiv")rootScore: ElementRef;
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

    ngAfterViewInit(): void {
        let renderer: vf.Flow.Renderer = new vf.Flow.Renderer(this.rootScore.nativeElement, vf.Flow.Renderer.Backends.SVG);
        renderer.resize(400,200);
        let context: vf.IRenderContext = renderer.getContext();
        context.setFillStyle("white");
        context.setStrokeStyle("white");
        let stave:vf.Flow.Stave = new vf.Flow.Stave(10, 40, 400, { fill_style: "white" });
        //stave.addClef("treble").addTimeSignature("4/4");
        
        stave.setContext(context).draw();

        var voice = new vf.Flow.Voice({num_beats: 1,  beat_value: 4});
        voice.addTickables([
            new vf.Flow.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),
        ]);
        new vf.Flow.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
    }
}
