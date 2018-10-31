import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import * as Vex from "vexflow";
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";

@Component({
    templateUrl: './intervals.component.html',
    styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent implements AfterViewInit {
    allKeys: models.Key[] = helpers.getAllKeys();
    intervals: models.Interval[] = helpers.getIntervals();
    classifyRoot: models.Key = this.allKeys[1];
    classifyTarget: models.Key = this.allKeys[1];
    findRoot: models.Key = this.allKeys[1];
    findInterval: models.Interval = this.intervals[1];
    findKey: models.Key;
    findKeyDisplay: string;
    intervalDisplay: string;
    interval: models.Interval;
    tonalDistance: number;

    @ViewChild("classifyRootDiv") classifyRootDiv: ElementRef;
    private classifyRootScore: ScoreData;
    @ViewChild("classifyTargetDiv") classifyTargetDiv: ElementRef;
    private classifyTargetScore: ScoreData;

    constructor() {
    }
    getIntervalDisplay(interval: models.Interval): string {
        return helpers.getIntervalDisplay(interval);
    }

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    updateClassify() {
        this.interval = helpers.getKeyInterval(this.classifyRoot, this.classifyTarget);
        this.intervalDisplay = helpers.getIntervalDisplay(this.interval);
        this.tonalDistance = helpers.getIntervalDistance(this.interval);
        this.classifyRootScore.setNote({ key: this.classifyRoot, octave: 4 });
        this.classifyTargetScore.setNote({ key: this.classifyTarget, octave: 4 });
    }

    updateFind() {
        this.findKey = helpers.getIntervalKey(this.findRoot, this.findInterval);
        this.findKeyDisplay = helpers.getKeyDisplay(this.findKey);
    }

    ngAfterViewInit(): void {
        this.classifyRootScore = new ScoreData(this.classifyRootDiv, 10, 0).initialize();
        this.classifyTargetScore = new ScoreData(this.classifyTargetDiv, 10, 0).initialize();
        this.updateClassify();
        this.updateFind();
    }
}

class ScoreData {
    private renderer: Vex.Flow.Renderer;
    private context: Vex.IRenderContext;
    private stave: Vex.Flow.Stave;
    private formatter: Vex.Flow.Formatter;
    constructor(private el: ElementRef, private x: number, private y: number) {
    }

    initialize(): ScoreData {
        this.renderer = new Vex.Flow.Renderer(this.el.nativeElement, Vex.Flow.Renderer.Backends.SVG);
        this.renderer.resize(100, 100);
        this.context = this.renderer.getContext();
        this.context.setFillStyle("white");
        this.context.setStrokeStyle("white");
        this.formatter = new Vex.Flow.Formatter();
        this.stave = new Vex.Flow.Stave(this.x, this.y, 100, { fill_style: "white" });
        this.stave.addClef("treble");

        this.stave.setContext(this.context).draw();
        return this;
    }

    setNote(pitch: models.Pitch) {
        this.context.clear();
        this.stave = new Vex.Flow.Stave(this.x, this.y, 100, { fill_style: "white" });
        this.stave.addClef("treble");

        this.stave.setContext(this.context).draw();

        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
        const wholeKeyDisplay = `${helpers.getVexKeyDisplay(pitch.key)}/${pitch.octave}`;
        const note = new Vex.Flow.StaveNote({ clef: "treble", keys: [wholeKeyDisplay], duration: "w" });
        if (pitch.key.accidental !== models.Accidental.Natural){
            note.addAccidental(0, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(pitch.key.accidental)));
        }
        voice.addTickables([
            note
        ]);
        this.formatter.joinVoices([voice]).format([voice], 400);
        voice.draw(this.context, this.stave);
    }
}