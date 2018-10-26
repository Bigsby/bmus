export enum Note {
    A, B, C, D, E, F, G
}

export enum Accidental {
    DoubleFlat = -2,
    Flat = -1,
    Natural = 0,
    Sharp = 1,
    DoubleSharp = 2
}

export enum IntervalQuality {
    DoubleDiminished,
    Diminished,
    Unison,
    Major,
    Perfect,
    Minor,
    Augmented,
    DoubleAugmented
}

export type Key = { note: Note, accidental: Accidental };

export type Pitch = { key: Key, octave: number };

export type Interval = { degree: number, quality: IntervalQuality };

export type Scale = { degrees: Interval[] };
export class NamedScale {
    constructor(public name: string, public degrees: Interval[]) {
    }

    static fromScale(name: string, scale: Scale): NamedScale {
        return new NamedScale(name, scale.degrees);
    }

    static fromDegrees(name: string, degrees: Interval[]): NamedScale {
        return new NamedScale(name, degrees);
    }
}