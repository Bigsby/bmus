import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import * as Vex from "vexflow";
import * as models from "./../models/models";
import * as helpers from "./../models/helpers";
import { nodeChildrenAsMap } from "@angular/router/src/utils/tree";

@Component({
    templateUrl: './intervals.component.html',
    styleUrls: ['./intervals.component.scss']
})
export class IntervalsComponent implements AfterViewInit {
    allKeys: models.Key[] = helpers.getAllKeys();
    intervals: models.Interval[] = helpers.getIntervals();
    classifyRoot: models.Key = this.allKeys[1];
    classifyTarget: models.Key = this.allKeys[1];
    selectedKey: models.Key = this.allKeys[1];
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
        this.interval = helpers.getKeyInterval(this.classifyRoot, this.classifyTarget);
        this.intervalDisplay = helpers.getIntervalDisplay(this.interval);
        this.tonalDistance = helpers.getIntervalDistance(this.interval);
    }

    updateClassify(updateDisplay: boolean = false) {
        if (updateDisplay) {
            this.setClassifyDisplay();
        }
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
    }
}

class ScoreData {
    private renderer: Vex.Flow.Renderer;
    private context: Vex.IRenderContext;
    private stave: Vex.Flow.Stave;
    private formatter: Vex.Flow.Formatter;
    constructor(private el: ElementRef, private x: number, private y: number) {
    }

    private resetStave() {
        this.context.clear();
        this.stave = new Vex.Flow.Stave(this.x, this.y, 80, { fill_style: "white" });
        this.stave.addClef("treble").setEndBarType(Vex.Flow.Barline.type.SINGLE);
        this.stave.setContext(this.context).draw();
        this.el.nativeElement.addEventListener("mousemove", function(e) {
            console.log(`x: ${e.offsetX} x ${e.offsetY}`);
        });
    }

    initialize(): ScoreData {
        this.renderer = new Vex.Flow.Renderer(this.el.nativeElement, Vex.Flow.Renderer.Backends.SVG);
        this.renderer.resize(100, 100);
        this.context = this.renderer.getContext();
        this.context.setFillStyle("#f3f3f3");
        this.context.setBackgroundFillStyle("blue");
        this.context.setStrokeStyle("white");
        this.formatter = new Vex.Flow.Formatter();
        this.resetStave();
        return this;
    }

    setNote(pitch: models.Pitch) {
        this.resetStave();
        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
        const wholeKeyDisplay = `${helpers.getNoteName(pitch.key.note)}/${pitch.octave}`;
        const note = new Vex.Flow.StaveNote({ keys: [wholeKeyDisplay], duration: "w" });

        if (pitch.key.accidental !== models.Accidental.Natural) {
            note.addAccidental(0, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(pitch.key.accidental)));
        }
        voice.addTickables([
            note
        ]);

        this.formatter.joinVoices([voice]).format([voice], 400);
        voice.draw(this.context, this.stave);
        const el = (<any>note).getAttribute("el");
        el.style.cursor = "pointer";

        el.addEventListener("mouseover", function () {
            const p = el.querySelector("path");
            p.setAttribute("fill", "#cb6447");
            p.setAttribute("stroke", "#cb6447");    
        });
        el.addEventListener("mouseout", function () {
            const p = el.querySelector("path");
            p.setAttribute("fill", "#f3f3f3");
            p.setAttribute("stroke", "#f3f3f3");
        });
    }
}