import { Key, Interval, IntervalQuality, Note, Accidental, } from "./models";

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

type KeyIntervalQuality = { root: Note, target: Note, quality: number };

const noteIntervalQualities: KeyIntervalQuality[] = [
    { root: Note.A, target: Note.A, quality: 0 },
    { root: Note.A, target: Note.B, quality: 0 },
    { root: Note.A, target: Note.C, quality: -1 },
    { root: Note.A, target: Note.D, quality: 0 },
    { root: Note.A, target: Note.E, quality: 0 },
    { root: Note.A, target: Note.F, quality: -1 },
    { root: Note.A, target: Note.G, quality: -1 },

    { root: Note.B, target: Note.A, quality: -1 },
    { root: Note.B, target: Note.B, quality: 0 },
    { root: Note.B, target: Note.C, quality: -1 },
    { root: Note.B, target: Note.D, quality: -1 },
    { root: Note.B, target: Note.E, quality: 0 },
    { root: Note.B, target: Note.F, quality: -1 },
    { root: Note.B, target: Note.G, quality: -1 },

    { root: Note.C, target: Note.A, quality: 0 },
    { root: Note.C, target: Note.B, quality: 0 },
    { root: Note.C, target: Note.C, quality: 0 },
    { root: Note.C, target: Note.D, quality: 0 },
    { root: Note.C, target: Note.E, quality: 0 },
    { root: Note.C, target: Note.F, quality: 0 },
    { root: Note.C, target: Note.G, quality: 0 },

    { root: Note.D, target: Note.A, quality: 0 },
    { root: Note.D, target: Note.B, quality: 0 },
    { root: Note.D, target: Note.C, quality: -1 },
    { root: Note.D, target: Note.D, quality: 0 },
    { root: Note.D, target: Note.E, quality: 0 },
    { root: Note.D, target: Note.F, quality: -1 },
    { root: Note.D, target: Note.G, quality: 0 },

    { root: Note.E, target: Note.A, quality: 0 },
    { root: Note.E, target: Note.B, quality: 0 },
    { root: Note.E, target: Note.C, quality: -1 },
    { root: Note.E, target: Note.D, quality: -1 },
    { root: Note.E, target: Note.E, quality: 0 },
    { root: Note.E, target: Note.F, quality: -1 },
    { root: Note.E, target: Note.G, quality: -1 },

    { root: Note.F, target: Note.A, quality: 0 },
    { root: Note.F, target: Note.B, quality: 1 },
    { root: Note.F, target: Note.C, quality: 0 },
    { root: Note.F, target: Note.D, quality: 0 },
    { root: Note.F, target: Note.E, quality: 0 },
    { root: Note.F, target: Note.F, quality: 0 },
    { root: Note.F, target: Note.G, quality: 0 },

    { root: Note.G, target: Note.A, quality: 0 },
    { root: Note.G, target: Note.B, quality: 0 },
    { root: Note.G, target: Note.C, quality: 0 },
    { root: Note.G, target: Note.D, quality: 0 },
    { root: Note.G, target: Note.E, quality: 0 },
    { root: Note.G, target: Note.F, quality: -1 },
    { root: Note.G, target: Note.G, quality: 0 }
];

type AccidentalDisplay = { accidental: Accidental, display: string };
// https://unicode-table.com/en/blocks/musical-symbols/
const accidentalDisplays: AccidentalDisplay[] = [
    { accidental: Accidental.Natural, display: "" },
    { accidental: Accidental.Flat, display: '\u266D' },
    { accidental: Accidental.Sharp, display: "\u266F" },
    { accidental: Accidental.DoubleFlat, display: "&#x1d12b;" },
    { accidental: Accidental.DoubleSharp, display: "&#x1d12a;" },
];

const vexAccidentalDisplays: AccidentalDisplay[] = [
    { accidental: Accidental.Natural, display: "" },
    { accidental: Accidental.Flat, display: 'b' },
    { accidental: Accidental.Sharp, display: "#" },
    { accidental: Accidental.DoubleFlat, display: "bb" },
    { accidental: Accidental.DoubleSharp, display: "##" },
];

const tonalDistanteRefereces = {
    1: 0,
    2: 1,
    3: 2,
    4: 2.5,
    5: 3.5,
    6: 4.5,
    7: 5.5
};

const qualityTonalDifferences = {
    DoubleDiminished: -2,
    Diminished: -1,
    Minor: -1,
    Unison: 0,
    Major: 0,
    Perfect: 0,
    Augmented: 1,
    DoubleAugmented: 2
}

function getIntervalQualityTonalDiferenece(quality: IntervalQuality){
    return qualityTonalDifferences[getIntervalQualityDisplay(quality)];
}

function getNoteIntervalQuality(root: Note, target:Note):number {
    return noteIntervalQualities.find(niq => niq.root === root && niq.target === target).quality 
}

export function getIntervalDistance(interval: Interval): number {
    const tonalDistanceReference = tonalDistanteRefereces[interval.degree];
    return tonalDistanceReference + (getIntervalQualityTonalDiferenece(interval.quality) / 2);
}

export function getKeyInterval(root: Key, target: Key): Interval {
    let degree = getKeyIntervalDegree(root, target);

    const accidentalDifference = target.accidental - root.accidental;
    let intervalQuality: IntervalQuality;
    if (degree === 1 || degree === 4 || degree == 5) {
        switch (accidentalDifference) {
            case -2:
                intervalQuality = IntervalQuality.DoubleDiminished;
                break;
            case -1:
                intervalQuality = IntervalQuality.Diminished;
                break;
            case 0:
                intervalQuality = degree === 1 ? IntervalQuality.Unison : IntervalQuality.Perfect;
                break;
            case 1:
                intervalQuality = IntervalQuality.Augmented;
                break;
            case 2:
                intervalQuality = IntervalQuality.DoubleAugmented;
                break;
        }
    }
    else {
        const quality = getNoteIntervalQuality(root.note, target.note) + accidentalDifference;
        switch (quality) {
            case -2:
                intervalQuality = IntervalQuality.Diminished;
                break;
            case -1:
                intervalQuality = IntervalQuality.Minor;
                break;
            case 0:
                intervalQuality = IntervalQuality.Major;
                break;
            case 1:
                intervalQuality = IntervalQuality.Augmented;
                break;
            case 2:
                intervalQuality = IntervalQuality.DoubleAugmented;
                break;
        }
    }
    return { degree: degree, quality: intervalQuality };
}

export function getKeyIntervalDegree(root: Key, target: Key): number {
    const rootIndex = notesSequence.indexOf(root.note);
    const targetIndex = notesSequence.slice(rootIndex).indexOf(target.note);
    return targetIndex + 1;
}

export function getNoteName(note: Note): string {
    return Note[note];
}

export function getAccidentalDisplay(accidental: Accidental): string {
    return accidentalDisplays.find(ad => ad.accidental === accidental).display;
}

export function getVexAccidentalDisplay(accidental: Accidental): string {
    return vexAccidentalDisplays.find(ad => ad.accidental === accidental).display;
}

export function getKeyDisplay(key: Key): string {
    return `${getNoteName(key.note)}${getAccidentalDisplay(key.accidental)}`;
}

export function getVexKeyDisplay(key: Key): string {
    return `${getNoteName(key.note).toLowerCase()}${getVexAccidentalDisplay(key.accidental)}`;
}

export function getIntervalQualityDisplay(quality: IntervalQuality) {
    return IntervalQuality[quality];
}

export function getIntervalDisplay(interval: Interval): string {
    if (interval.quality === IntervalQuality.Unison) {
        return getIntervalQualityDisplay(interval.quality);
    }
    return `${getIntervalQualityDisplay(interval.quality)} ${getDegreeCardinalDisplay(interval.degree)}`;
}

export function getDegreeCardinalDisplay(degree: number): string {
    const numberString = String(degree);
    switch (degree) {
        case 1:
            return numberString + "st";
        case 2:
            return numberString + "nd";
        case 3:
            return numberString + "rd";
        default:
            return numberString + "th";
    }
}

export function getAllKeys(): Key[] {
    let result: Key[] = [];
    for (let note in Note) {
        if (parseInt(note, 10) >= 0) {
            result.push({ note: Note[Note[note]], accidental: Accidental.Flat });
            result.push({ note: Note[Note[note]], accidental: Accidental.Natural });
            result.push({ note: Note[Note[note]], accidental: Accidental.Sharp });
        }
    }
    return result;
}

export function romanize(num: number): string {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

export function getIntervals(): Interval[]{
    let result: Interval[] = [];

    for (let degree = 1; degree < 8; degree++) {
        if (degree === 1) {
            result.push({degree: degree, quality: IntervalQuality.Diminished });
            result.push({degree: degree, quality: IntervalQuality.Unison });
            result.push({degree: degree, quality: IntervalQuality.Augmented });
        } else if (degree === 4 || degree === 5) {
            result.push({degree: degree, quality: IntervalQuality.Diminished });
            result.push({degree: degree, quality: IntervalQuality.Perfect });
            result.push({degree: degree, quality: IntervalQuality.Augmented });
        } else {
            result.push({degree: degree, quality: IntervalQuality.Minor });
            result.push({degree: degree, quality: IntervalQuality.Major });
        }
    }

    return result;
}

export function getIntervalKey(root: Key, interval: Interval): Key {
    const rootIndex = notesSequence.indexOf(root.note);
    const targetNote = notesSequence.slice(rootIndex)[interval.degree - 1];

    let accidental: Accidental = Accidental.Natural;
    const qualityTonalDifference = getIntervalQualityTonalDiferenece(interval.quality);
    const noteIntervalQuality = getNoteIntervalQuality(root.note, targetNote);
    accidental = Accidental[Accidental[root.accidental + qualityTonalDifference]] - noteIntervalQuality;
    return { note: targetNote, accidental: accidental };
}