export enum Note {
    A, B, C, D, E, F, G
}

export enum Accidental {
    Natural,
    Sharp,
    Flat,
    DoubleSharp,
    DoubleFlat
}

export class Key {
    constructor(public note: Note, public accidental: Accidental) {

    }
}

export class Pitch extends Key {
    constructor(public note: Note, public accidental: Accidental, public octave: number) {
        super(note, accidental);
    }
}

export enum IntervalQuality {
    Major,
    Minor,
    Diminished,
    Augmented
}

export class Interval {
    constructor(public degree: number, public quality: IntervalQuality) {

    }
}

const notesSequence = [
    Note.A,
    Note.B,
    Note.C,
    Note.D,
    Note.E,
    Note.F,
    Note.G,
    Note.A,
    Note.B,
    Note.C,
    Note.D,
    Note.E,
    Note.F
];

class NoteIntevalQuality{
    constructor(public root: Note, public target: Note, public quality: IntervalQuality) {
    }
}

const noteIntervalQualities: NoteIntevalQuality[] = [
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.C, IntervalQuality.Minor),
    new NoteIntevalQuality(Note.A, Note.D, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.E, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major),
    new NoteIntevalQuality(Note.A, Note.B, IntervalQuality.Major)
];

export function getInterval(root: Key, target: Key): Interval {
    const rootIndex = notesSequence.indexOf(root.note);
    const targetIndex = notesSequence.slice(rootIndex).indexOf(target.note);

    const quality = noteIntervalQualities.find(niq => niq.root === root.note && niq.target === target.note).quality;

    return new Interval(targetIndex - rootIndex + 1, quality);
}