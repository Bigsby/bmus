import { Component, ElementRef, ViewChild, AfterViewInit, Input, Output, EventEmitter } from "@angular/core";
import * as Vex from "vexflow";

import * as models from "./../models/models";
import * as helpers from "./../models/helpers";
import { KeyEventsPlugin } from "@angular/platform-browser/src/dom/events/key_events";

@Component({
    selector: "note-picker",
    templateUrl: './note-picker.component.html',
    styleUrls: ['./note-picker.component.scss']
})
export class NotePickerComponent implements AfterViewInit {
    allKeys: models.Key[] = helpers.getAllKeys();
    @Input() selectedPitch: models.Pitch;
    @Output() selectedPitchChange = new EventEmitter();
    @Output() change = new EventEmitter();
    private renderer: Vex.Flow.Renderer;
    private context: Vex.IRenderContext;
    private stave: Vex.Flow.Stave;
    private htmlElement: HTMLElement;
    private staveInBetweenSpace: number;
    private formatter: Vex.Flow.Formatter;
    private maxPitch: models.Pitch = { key: { note: models.Note.C, accidental: models.Accidental.Natural }, octave: 6 };
    private minPitch: models.Pitch = { key: { note: models.Note.G, accidental: models.Accidental.Natural }, octave: 3 };
    private maxPitchValue: number = helpers.getPitchReferenceValue(this.maxPitch);
    private minPitchValue: number = helpers.getPitchReferenceValue(this.minPitch);
    provisoryPitch: models.Pitch;

    @ViewChild("scoreDiv") scoreDiv: ElementRef;
    constructor() {
    }

    getKeyDisplay(key: models.Key): string {
        return helpers.getKeyDisplay(key);
    }

    getPitchDisplay(pitch: models.Pitch): string {
        return pitch ? helpers.getPitchDisplay(pitch) : "";
    }

    private resetStave() {
        this.context.clear();
        this.stave = new Vex.Flow.Stave(10, 10, 80, { fill_style: "white" });
        this.stave.addClef("treble").setEndBarType(Vex.Flow.Barline.type.SINGLE);
        this.stave.setContext(this.context).draw();
        this.staveInBetweenSpace = (<any>this.stave).options.spacing_between_lines_px;
        const _this = this;
        this.htmlElement = this.scoreDiv.nativeElement as HTMLElement;
        this.htmlElement.addEventListener("mousemove", (e) => this.getCurrentNote.call(_this, e));
        this.htmlElement.onclick = (event) => this.setSelectedPitch(event);
    }

    private redrawStave() {
        this.context.clear();
        this.stave.draw();
        //this.drawNotes(stave);
    };

    static setPathsColor(el: HTMLElement, color: string) {
        el.querySelectorAll("path").forEach(p => {
            p.setAttribute("fill", color);
            p.setAttribute("stroke", color);
        });
    }

    noteMap = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    private getBaseNote() {
        return { note: 'G', octave: 6 }; // represents 4 lines above the treble clef
    }

    private toNoteName(noteArea: number): models.Pitch {
        var baseNote = this.getBaseNote();
        var baseNoteValue = this.noteMap.indexOf(baseNote.note);

        var desiredNoteValue = (baseNoteValue - noteArea) % 7;
        //make it a positive value
        while (desiredNoteValue < 0) desiredNoteValue += 7;

        var desiredNoteOctave = baseNote.octave - (Math.floor(noteArea / 7));

        if ((desiredNoteValue == 5 || desiredNoteValue == 6))
            desiredNoteOctave--;

        const result = { key: { note: models.Note[this.noteMap[desiredNoteValue]], accidental: models.Accidental.Natural }, octave: desiredNoteOctave };
        const resultValue = helpers.getPitchReferenceValue(result);
        if (resultValue > this.maxPitchValue) {
            return this.maxPitch;
        }
        if (resultValue < this.minPitchValue) {
            return this.minPitch;
        }
        return result;
    }

    private getNoteName(stave: Vex.Flow.Stave, mouseY: number): models.Pitch {
        //Step 1: get mouse position relative to the stave
        var relativeMouseY = mouseY - (<any>stave).getBoundingBox().getY();

        //Step 2: get in which space within the staves the user clicked
        //using half the space between lines because we can click between a line (each line can hold 2 notes)
        var noteArea = Math.round(relativeMouseY / ((this.staveInBetweenSpace) / 2));
        var result = this.toNoteName(noteArea);
        return result;
    }

    private drawProvisoryNote() {
        this.redrawStave();
        const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
        const keys: string[] = [];
        let provisoryIndex = 0;
        if (!this.selectedPitch || this.provisoryPitch.key.note !== this.selectedPitch.key.note) {
            keys.push(`${helpers.getNoteName(this.provisoryPitch.key.note)}/${this.provisoryPitch.octave}`);
        }

        if (this.selectedPitch) {
            keys.push(`${helpers.getNoteName(this.selectedPitch.key.note)}/${this.selectedPitch.octave}`);
        }
        const notes = new Vex.Flow.StaveNote({ keys: keys, duration: "w" });
        if (keys.length > 1)
            provisoryIndex = helpers.getPitchReferenceValue(this.selectedPitch) < helpers.getPitchReferenceValue(this.provisoryPitch) ? 1 : 0;
        if (this.provisoryPitch.key.note !== this.selectedPitch.key.note)
            notes.setKeyStyle(Math.min(provisoryIndex, keys.length), { fillStyle: "grey" });
        if (this.provisoryPitch.key.accidental !== models.Accidental.Natural) {
            notes.addAccidental(0, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(this.provisoryPitch.key.accidental)));
        }
        if (this.selectedPitch && this.selectedPitch.key.accidental !== models.Accidental.Natural) {
            notes.addAccidental(1, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(this.selectedPitch.key.accidental)));
        }
        voice.addTickables([notes]);
        this.formatter.joinVoices([voice]).format([voice], 400);
        voice.draw(this.context, this.stave);
    }

    private getCurrentNote(e) {
        const note = this.getNoteName(this.stave, e.offsetY);
        this.provisoryPitch = note;
        //this.selectedPitch = this.provisoryPitch;
        this.drawProvisoryNote();
        // this.change.emit();
        // this.selectedPitchChange.emit(this.selectedPitch);
    }

    private setSelectedPitch(e) {
        this.selectedPitch = this.provisoryPitch;
        this.drawProvisoryNote();
        this.change.emit();
        this.selectedPitchChange.emit(this.selectedPitch);
    }

    // updateKey() {
    //     this.resetStave();

    //     const voice = new Vex.Flow.Voice({ num_beats: 1, beat_value: 1 });
    //     const wholeKeyDisplay = `${helpers.getNoteName(this.selectedPitch.key.note)}/4`;
    //     const note = new Vex.Flow.StaveNote({ keys: [wholeKeyDisplay], duration: "w" });
    //     if (this.selectedPitch.key.accidental !== models.Accidental.Natural) {
    //         note.addAccidental(0, new Vex.Flow.Accidental(helpers.getVexAccidentalDisplay(this.selectedPitch.key.accidental)));
    //     }
    //     voice.addTickables([
    //         note
    //     ]);

    //     this.formatter.joinVoices([voice]).format([voice], 400);
    //     voice.draw(this.context, this.stave);
    //     const el = (<any>note).getAttribute("el") as HTMLElement;
    //     el.style.cursor = "pointer";

    //     el.addEventListener("mouseover", function () {
    //         NotePickerComponent.setPathsColor(el, "#cb6447");
    //     });
    //     el.addEventListener("mouseout", function () {
    //         NotePickerComponent.setPathsColor(el, "#f3f3f3");
    //     });
    //     this.change.emit();
    //     this.selectedPitchChange.emit(this.selectedPitch);
    // }

    ngAfterViewInit(): void {
        this.renderer = new Vex.Flow.Renderer(this.scoreDiv.nativeElement, Vex.Flow.Renderer.Backends.SVG);
        this.renderer.resize(100, 120);
        this.context = this.renderer.getContext();
        this.context.setFillStyle("#f3f3f3");
        this.context.setBackgroundFillStyle("blue");
        this.context.setStrokeStyle("white");
        this.formatter = new Vex.Flow.Formatter();
        this.resetStave();
    }
}