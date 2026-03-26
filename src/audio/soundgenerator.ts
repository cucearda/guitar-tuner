import * as Tone from "tone";
import { Interval } from "../models/interval";

class Instrument {
  private sampler: Tone.Sampler;
  private current: string;
  private synth: Tone.Synth | null = null;
  constructor(
    sampler: Tone.Sampler,
    current: string = "stale",
    synth: Tone.Synth | null = null,
  ) {
    this.sampler = sampler;
    this.current = current;
    this.synth = synth;
  }
  async playNote(note: string, duration: string) {
    try {
      await Tone.start();
      const value = await Tone.loaded();
      console.log("Samples loaded:", value);
      this.sampler.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error("Error playing note:", error);
    }
  }
  async playNotes(notes: string[], duration: string) {
    try {
      await Tone.start();
      await Tone.loaded();
      let i = 0
      const loop = new Tone.Loop((time) => {
        this.sampler.triggerAttackRelease(notes[i], duration);
        i += 1;
        if (i >= notes.length) {
          loop.stop();
        }
      }, duration).start(0);
      Tone.Transport.start();
    
    } catch (error) {
      console.error("Error playing interval:", error);
    }
  }
}

const baseUrl = "/guitar-tuner/audio/samples";

enum InstrumentType {
  PIANO = "piano",
  CLASSIC = "guitar-nylon",
  DRUMS = "drums",
  BASS = "bass",
}

type InstrumentConfig = {
  type: InstrumentType;
};

class InstrumentFactory {
  static async createInstrument(
    instrumentConfig: InstrumentConfig,
    current: string = "stale",
  ): Promise<Instrument> {
    let sampler: Tone.Sampler;
    console.log(
      "Creating instrument with baseURL:",
      `${baseUrl}/${instrumentConfig.type}/`,
    );
    try {
      sampler = new Tone.Sampler({
        urls: {
          A2: "A2.mp3",
          A3: "A3.mp3",
          A4: "A4.mp3",
          A5: "A5.mp3",
        },
        baseUrl: `${baseUrl}/${instrumentConfig.type}/`,
        onload: () => {
          console.log("INSTRUMENT LOADED");
        },
      }).toDestination();
    } catch (error) {
      console.error("Error creating instrument:", error);
      throw error;
    }
    let synth = new Tone.Synth().toDestination();

    console.log("Loading samples...");
    await Tone.loaded();
    return new Instrument(sampler, current, synth);
  }
}

export { InstrumentFactory, InstrumentType, type InstrumentConfig, Instrument };
