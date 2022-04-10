// const MidiPlayer = require("./midi-player-js");
const JZZ = require("../lib/JZZ");
require('../lib/JZZ.midi.SMF')(JZZ);

var songTime = 0;
var numTracks = 0;

const jsonSongs = {
    "bad apple": {
        songName: "Bad Apple",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Bad%2BApple7.mid"
    },
    "death waltz": {
        songName: "Death Waltz",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Death%20Waltz.mid"
    },
    "renai circulation": {
        songName: "Renai Circulation",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Renai_Circulation.mid"
    },
    "polish cow": {
        songName: "Polish Cow",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/PolishCowPiano.mid"
    },
    "sweden": {
        songName: "Sweden",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Sweden_Minecraft.mid"
    },
    "necrofantasia": {
        songName: "Necrofantasia",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Necrofantasia.mid"
    },
    "payphone": {
        songName: "Payphone",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Payphone.mid"
    },
    "hey there delilah": {
        songName: "Hey there Delilah",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Hey_There_Delilah.mid"
    },
    "circus galop": {
        songName: "Circus Galop",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Circus%2BGalop.mid"
    },
    "blend s opening": {
        songName: "Blend S Opening",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Blend_S_OP.mid"
    },
    "impossible despacito": {
        songName: "Impossible Despacito",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Despacito%20Deblacked.mid"
    },
    "impossible let it go": {
        songName: "Impossible Let It Go",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Let%20It%20Go%20by%20MBMS%20Deblacked.mid"
    },
    "impossible heart afire": {
        songName: "Impossible Heart Afire",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Heart%20Afire%20Deblacked.mid"
    },
    "impossible ghost busters theme": {
       songName: "Impossible Ghost Busters Theme",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Ghost%20Busters%20Deblacked.mid"
    },
    "voyage": {
        songName: "Voyage",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Voyage%20Deblacked.mid"
    },
    "unravel": {
        songName: "Unravel",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Unravel%20Deblacked.mid"
    },
    "the titan": {
        songName: "The Titan",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/The%20Titan%20Deblacked.mid"
    },
    "ouranos": {
        songName: "Ouranos",
        url: "https://github.com/PhoenixTheCoder/NMPB/raw/main/Deblacked/Ouranos%20-%20HDSQ%20%26%20The%20Romanticist%20%5Bv1.6.7%5D.mid"
    }
};

function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
};

function userset(set) {
    MPP.client.sendArray([{ m: "userset", set }]);
};

function setName(name) {
    userset({ name });
};

var moveMouse = function(x, y) {
    MPP.client.sendArray([{ m: "m", x, y }]);
};

function fromURL(url) {
    return new Promise((resolve, reject) => {
        try {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState == 4) {
                if (this.status == 200) {
                  let r, i;
                  let data = '';
                  r = xhttp.response;
                  if (r instanceof ArrayBuffer) {
                    r = new Uint8Array(r);
                    for (i = 0; i < r.length; i++) data += String.fromCharCode(r[i]);
                  }
                  else { // for really antique browsers
                    r = xhttp.responseText;
                    for (i = 0; i < r.length; i++) data += String.fromCharCode(r.charCodeAt(i) & 0xff);
                  }
                  resolve(data);
                }
                else {
                  console.log('XMLHttpRequest error');
                  reject(undefined);
                }
              }
            };
            try { xhttp.responseType = 'arraybuffer'; } catch (e) {}
            xhttp.overrideMimeType('text/plain; charset=x-user-defined');
            xhttp.open('GET', url, true);
            xhttp.send();
          }
          catch (e) {
            console.log('XMLHttpRequest error');
            reject(undefined);
          }
    });
}

var MIDI_TRANSPOSE = -12;
var MIDI_KEY_NAMES = ["a-1", "as-1", "b-1"];
var bare_notes = "c cs d ds e f fs g gs a as b".split(" ");
for (var oct = 0; oct < 7; oct++) {
    for (var i in bare_notes) {
        MIDI_KEY_NAMES.push(bare_notes[i] + oct);
    }
}
MIDI_KEY_NAMES.push("c7");

let logarithmicVelocity = false;
var pitchBends = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
};
class Player {
    constructor(cl) {
        this.isPlaying = false;
        this.octave = 0;
        this.echo = 0;
        this.echod = 0;
        this.transpose = 0;
        this.cl = cl;
        
        this.player;
        this.midiout = JZZ.Widget({ _receive: function(evt) {
            var channel = evt[0] & 0xf;
            var cmd = evt[0] >> 4;
            var note_number = evt[1];
            var vel = evt[2];
            if (cmd == 8 || (cmd == 9 && vel == 0)) {
                // if (vel < 54) return;
                // NOTE_OFF
                MPP.release(
                    MIDI_KEY_NAMES[
                        note_number - 9 + MIDI_TRANSPOSE + pitchBends[channel]
                    ]
                );
            } else if (cmd == 9) {
                // if (vel < 54) return;
                // NOTE_ON
                MPP.press(
                    MIDI_KEY_NAMES[
                        note_number - 9 + MIDI_TRANSPOSE + pitchBends[channel]
                    ],
                    vel / 127
                );
            } else if (cmd == 11) {
                // CONTROL_CHANGE
                if (!MPP.gAutoSustain) {
                    if (note_number == 64) {
                        if (vel > 0) {
                            MPP.pressSustain();
                        } else {
                            MPP.releaseSustain();
                        }
                    }
                }
            } else if (cmd == 14) {
                var pitchMod = evt[1] + (evt[2] << 7) - 0x2000;
                pitchMod = Math.round(pitchMod / 1000);
                pitchBends[channel] = pitchMod;
            }
        }});
        navigator.requestMIDIAccess = JZZ.requestMIDIAccess;
        JZZ.addMidiOut('Neptune MIDI Port #1', this.midiout);
        JZZ.requestMIDIAccess();

    //     this.Player = new MidiPlayer.Player(function(event) {
    //         if (event.name == "Note off" || (event.name == "Note on" && event.velocity === 0)) {
    //             if (event.velocity < 54) return;
    //             MPP.release(keyNameMap[event.noteName]);
    //             if (octave !== 0) {
    //                 for (let i = 1; i <= octave; i++) {
    //                     MPP.release(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]]);
    //                 } 
    //             }
    //         } else if (event.name == "Note on") {
    //             if (event.velocity < 54) return;
    //             var volume = event.velocity/127;
    //             MPP.press(keyNameMap[event.noteName], volume);
    //         }
    //         if (echo !== 0) {
    //             let delay = 30;
    //             for (var j = 0; j < echo; j++) {
    //                 setTimeout(() => {
    //                     volume *= 0.5;
    //                         MPP.press(keyNameMap[event.noteName], volume);
    //                 }, echod * (j + delay));
    //                 delay *= 2;
    //             }
    //         }
    //         if (echo !== 0) {
    //             let delay = 30;
    //             for (let i = 1; i <= this.octave; i++) {
    //                 MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
    //                 for (var a = 0; a < echo; a++) {
    //                     setTimeout(() => {
    //                         volume *= 0.5;
    //                         MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
    //                     }, echod * (a + delay));
    //                     delay *= 2;
    //                 }
    //             }
    //         } else if (event.name == "Set tempo") {
                
    //         }
    //     });
    }

    listMIDIs() {
        this.cl.send(`${Object.values(jsonSongs).map(a => a.songName).join(", ")}`);
    }

    async playMIDI(url) {
        try {
            if (!url.includes('https://')) {
                const file = Object.keys(jsonSongs).filter(a => a.includes(url.toLowerCase()));
                if (file === undefined) return this.cl.send('Song not found.');
                var input = "https://cors-anywhere3.herokuapp.com/" + jsonSongs[file].url
                var songFileName = jsonSongs[file].songName;

                if (this.player) this.player.stop();
                let data = await fromURL(input);
                let smf = new JZZ.MIDI.SMF(data);
                let output = JZZ().openMidiOut('Neptune MIDI Port #1');
                this.player = smf.player();
                this.player.connect(output);
                this.player.play();
                this.isPlaying = true;
        
                songTime = sec2time(this.player.durationMS() * 1000);
                numTracks = this.player.tracks();
        
                this.cl.send(`Playing ${songFileName} | Time: [${songTime}] | Tracks: ${numTracks}.`);
                this.player.onEnd(() => {
                    this.isPlaying = false;
                });
            } else {
                if (this.player) this.player.stop();
                let data = await fromURL("https://cors-anywhere3.herokuapp.com/" + url);
                let smf = new JZZ.MIDI.SMF(data);
                let output = JZZ().openMidiOut('Neptune MIDI Port #1');
                this.player = smf.player();
                this.player.connect(output);
                this.player.play();
                this.isPlaying = true;
        
                songTime = sec2time(this.player.durationMS() * 1000);
                numTracks = this.player.tracks();
        
                this.cl.send(`Playing MIDI... Time: [${songTime}]. Tracks: ${numTracks}.`);
                this.player.onEnd(() => {
                    this.isPlaying = false;
                });
            }
        } catch(err) {
            this.cl.send(err);
        }
    }

    async playMIDIFromData(data, fileName) {
        try {
            if (this.player) this.player.stop();
            let smf = new JZZ.MIDI.SMF(data);
            let output = JZZ().openMidiOut('Neptune MIDI Port #1');
            this.player = smf.player();
            this.player.connect(output);
            this.player.play();
            this.isPlaying = true;
    
            songTime = sec2time(this.player.durationMS() * 1000);
            numTracks = this.player.tracks();
    
            this.cl.send(`Playing ${fileName} Time: [${songTime}]. Tracks: ${numTracks}.`);
            this.player.onEnd(() => {
                this.isPlaying = false;
            });
        } catch(err) {
            this.cl.send(err);
        }
    }

    stopMIDI() {
        if (this.isPlaying) {
            this.player.stop();
            this.cl.send("Stopping music...");
            this.isPlaying = false;
        }
    }

    pauseMIDI() {
        this.player.pause();
        this.cl.send("Pausing music...");
        this.isPlaying = false;
    }

    resumeMIDI() {
        this.player.resume();
        this.cl.send("Resuming music...");
        this.isPlaying = true;
    }
}

module.exports = Player;