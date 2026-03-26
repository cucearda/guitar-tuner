export const intervalNameConstants = [
    "Unison",
    "Minor Second",
    "Major Second",
    "Minor Third",
    "Major Third",
    "Perfect Fourth",
    "Tritone",
    "Perfect Fifth",
    "Minor Sixth",
    "Major Sixth",
    "Minor Seventh",
    "Major Seventh",
    "Octave"
]

const noteNameConstants = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
]

export class Interval {
    name: string;
    semitones: number;
    startingNote: string;
    endingNote: string;
    ascending: boolean;
    startingNoteOctave: number;
    endingNoteOctave: number;

    constructor(name: string, startingNote: string, startingNoteOctave: number, ascending: boolean) {
        this.name = name;
        this.startingNote = startingNote;
        this.startingNoteOctave = startingNoteOctave;
        this.ascending = ascending;
        this.semitones = intervalNameConstants.indexOf(name);
        if (this.semitones === -1) {
            throw new Error(`Invalid interval name: ${name}`);
        }
        this.endingNote = this.calculateEndingNote();
        this.endingNoteOctave = this.calculateEndingNoteOctave();
    }

    calculateEndingNote(): string {
        const startingNoteIndex = noteNameConstants.indexOf(this.startingNote);
        if (startingNoteIndex === -1) {
            throw new Error(`Invalid starting note: ${this.startingNote}`);
        }
        const direction = this.ascending ? 1 : -1;
        const endingNoteIndex = (startingNoteIndex + direction * this.semitones + 12) % 12;
        return noteNameConstants[endingNoteIndex];
    }
    calculateEndingNoteOctave(): number {
        const direction = this.ascending ? 1 : -1;
        const newNoteIndex = noteNameConstants.indexOf(this.startingNote) + direction * this.semitones
        const octaveChange = Math.floor(newNoteIndex / 12);
        return this.startingNoteOctave + octaveChange;
    }

    static createRandomInterval(availableIntervals: string[], availableOctaves: number[], ascending: boolean): Interval {
        const randomIntervalName = availableIntervals[Math.floor(Math.random() * availableIntervals.length)];
        const randomStartingNote = noteNameConstants[Math.floor(Math.random() * noteNameConstants.length)];
        const randomStartingOctave = availableOctaves[Math.floor(Math.random() * availableOctaves.length)];
        return new Interval(randomIntervalName, randomStartingNote, randomStartingOctave, ascending);
    }
}