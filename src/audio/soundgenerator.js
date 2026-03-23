import * as Tone from "tone";


class Instrument {
    synth;

    constructor(synth) {
        this.synth = synth;
    }
    playNote(note, duration) {
        this.synth.triggerAttackRelease(note, duration);
    }
}


export class InstrumentFactory {
    static createInstrument(instrumentConfig) {
        const synth = new Tone.Sampler({
	"C3" : "path/to/C3.mp3",
	"D#3" : "path/to/Dsharp3.mp3",
	"F#3" : "path/to/Fsharp3.mp3",
	"A3" : "path/to/A3.mp3",
}).toDestination
    }
}
