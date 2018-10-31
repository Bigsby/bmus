import { Component, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import * as Vex from "vexflow";

import * as models from "./../models/models";
import * as helpers from "./../models/helpers";

@Component({
    selector: "note-picker",
    templateUrl: './note-picker.component.html',
    styleUrls: ['./note-picker.component.scss']
})
export class NotePickerComponent implements AfterViewInit {
    allKeys: models.Key[] = helpers.getAllKeys();
    @Input() selectedKey: models.Key;
    @Output() selectedKeyChange = new EventEmitter();
    @Output() change = new EventEmitter();
    private renderer: Vex.Flow.Renderer;
    private context: Vex.IRenderContext;
    private stave: Vex.Flow.Stave;
    private formatter: Vex.Flow.Formatter;

    @ViewChild("scoreDiv") scoreDiv: ElementRef;

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    private resetStave() {
        this.context.clear();
        this.stave = new Vex.Flow.Stave(10, 0, 80, { fill_style: "white" });
        this.stave.addClef("treble").setEndBarType(Vex.Flow.Barline.type.SINGLE);
        this.stave.setContext(this.context).draw();
        // this.scoreDiv.nativeElement.addEventListener("mousemove", function (e) {
        //     console.log(`x: ${e.offsetX} x ${e.offsetY}`);
        // });
    }

    updateKey() {
        this.resetStave();

        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
        const wholeKeyDisplay = `${helpers.getNoteName(this.selectedKey.note)}/4`;
        const note = new Vex.Flow.StaveNote({ keys: [wholeKeyDisplay], duration: "w" });

        if (this.selectedKey.accidental !== models.Accidental.Natural) {
            note.addAccidental(0, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(this.selectedKey.accidental)));
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
        this.change.emit();
        this.selectedKeyChange.emit(this.selectedKey);
    }

    ngAfterViewInit(): void {
        this.renderer = new Vex.Flow.Renderer(this.scoreDiv.nativeElement, Vex.Flow.Renderer.Backends.SVG);
        this.renderer.resize(100, 100);
        this.context = this.renderer.getContext();
        this.context.setFillStyle("#f3f3f3");
        this.context.setBackgroundFillStyle("blue");
        this.context.setStrokeStyle("white");
        this.formatter = new Vex.Flow.Formatter();
        this.resetStave();
    }
}