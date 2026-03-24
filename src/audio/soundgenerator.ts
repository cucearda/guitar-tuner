import * as Tone from "tone";

class Instrument {
  private synth: Tone.Sampler;
  private current: string;
  constructor(synth: Tone.Sampler, current: string = "stale") {
    this.synth = synth;
    this.current = current;
  }
  async playNote(note: string, duration: string) {
    try {
      await Tone.start();
      const value = await Tone.loaded();
      console.log("Samples loaded:", value);
      this.synth.triggerAttackRelease(note, duration);
    } catch (error) {
      console.error("Error playing note:", error);
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
  static createInstrument(
    instrumentConfig: InstrumentConfig,
    current: string = "stale",
  ): Instrument {
    const synth =                                                                                                                                                                                                                    
  new Tone.Sampler({                                                                                                                                                                                                 
    urls: {                                                                                                                                                                                                        
      "A2": "A2.mp3",                    
      "C3": "C3.mp3",
    },
    baseUrl: `${baseUrl}/${instrumentConfig.type}/`,                                                                                                                                                                 
    onload: () => {                                                                                                                                                                                                  
      console.log("INSTRUMENT LOADED");  
    }                                                                                                                                                                                                                
  }).toDestination();     
    return new Instrument(synth, current);
  }
}

export { InstrumentFactory, InstrumentType, type InstrumentConfig, Instrument };
