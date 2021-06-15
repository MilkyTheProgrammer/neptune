// ==UserScript==
// @name         Neptune
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A really amazing MPP midi script
// @author       Phoenix, AlienDrew
// @match        https://www.multiplayerpiano.net/*
// @match        https://mppclone.com/*
// @icon         https://www.google.com/s2/favicons?domain=mppclone.com
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @resource     MIDIPlayerJS https://raw.githubusercontent.com/PhoenixTheCoder/midiplayerjs/main/midiplayer.js
// @run-at       document-end
// ==/UserScript==

var stringMIDIPlayerJS = GM_getResourceText("MIDIPlayerJS");
var scriptMIDIPlayerJS = document.createElement("script");
scriptMIDIPlayerJS.type = 'text/javascript';
scriptMIDIPlayerJS.appendChild(document.createTextNode(stringMIDIPlayerJS));
(document.body || document.head || document.documentElement).appendChild(scriptMIDIPlayerJS);

// CORS Anywhere (allows downloading files where JS can't)
var useCorsUrl = function(url) {
    var newUrl = null; // send null back if it's already a cors url
    var cors_api_url = 'https://cors.bridged.cc/';
    // removes protocols before applying cors api url
    if (url.indexOf(cors_api_url) == -1) newUrl = cors_api_url + url.replace(/(^\w+:|^)\/\//, '');
    return newUrl;
}

var queue = [];
var isQueue = false;
var queueNum = 0;
var skipNum = 0;
var lolfucknote = 0;
var noteCounter = 0;

setTimeout(() => {
document.getElementById("noteCounter").textContent = 'Notes: ' + "0";
}, 2000);

var prefix = "-";

var deblack = false;

var bannedFuckers = ["dac4b722f4f82190508878c1", "ed586bc5cb7a744a273ff32a", "f2085b4be9cc6c0deba09774"];
var admins = [MPP.client.getOwnParticipant()._id];

var deblackAmount = 4000;

var tracks = [];
var totalNotes = 0;

var songTime = 0;
var songName = "";

var items = ["cheek", "lips", "forehead"];
var permKey1 = "";
var shortenedURL = "";
var sustain = 1;
var clientNumber2 = 0;
var multiClient = false;
var clients = [];
var turns = false;
const users = [];
var clientNumber = 0;
let currentUser = undefined;
var solo = false;
var echo = false;
let lol = 0;
var octaveAmount = 0;
var octaveEnabled = false;
var origTemp = [];
var origTemp1 = false;
var echoAmount = 0;
var echoDelay = 0;

// Script constants
const song_queue = [];
const SCRIPT = GM_info.script;
const NAME = SCRIPT.name;
const NAMESPACE = SCRIPT.namespace;
const VERSION = SCRIPT.version;
const DESCRIPTION = SCRIPT.description;
const AUTHOR = SCRIPT.author;
const DOWNLOAD_URL = SCRIPT.downloadURL;

// Time constants (in milliseconds)
const TENTH_OF_SECOND = 100; // mainly for repeating loops
const SECOND = 10 * TENTH_OF_SECOND;
const CHAT_DELAY = 5 * TENTH_OF_SECOND; // needed since the chat is limited to 10 messages within less delay
const SLOW_CHAT_DELAY = 2 * SECOND // when you are not the owner, your chat quota is lowered
const REPEAT_DELAY = 2 * TENTH_OF_SECOND; // makes transitioning songs in repeat feel better
const SONG_NAME_TIMEOUT = 10 * SECOND; // if a file doesn't play, then forget about showing the song name it after this time

// URLs
const FEEDBACK_URL = "https://forms.gle/x4nqjynmRMEN2GSG7";

// Players listed by IDs (these are the _id strings)
const BANNED_PLAYERS = []; // empty for now
const LIMITED_PLAYERS = ["8c81505ab941e0760697d777"];

// Bot constants
const CHAT_MAX_CHARS = 512; // there is a limit of this amount of characters for each message sent (DON'T CHANGE)
const PERCUSSION_CHANNEL = 10; // (DON'T CHANGE)

// Bot constant settings
const ALLOW_ALL_INTRUMENTS = false; // removes percussion instruments (turning this on makes a lot of MIDIs sound bad)
const BOT_SOLO_PLAY = true; // sets what play mode when the bot boots up on an owned room

// Bot custom constants
const PREFIX = "/";
const PREFIX_LENGTH = PREFIX.length;
const BOT_KEYWORD = "MIDI"; // this is used for auto enabling the public commands in a room that contains the keyword (character case doesn't matter)
const BOT_ACTIVATOR = BOT_KEYWORD.toLowerCase();
const BOT_USERNAME = NAME + " [" + PREFIX + "help]";
const BOT_NAMESPACE = '(' + NAMESPACE + ')';
const BOT_DESCRIPTION = DESCRIPTION + " Made with JS via Tampermonkey, and thanks to grimmdude for the MIDIPlayerJS library."
const BOT_AUTHOR = "Created by " + AUTHOR + '.';
const BASE_COMMANDS = [
    ["help (command)", "displays info about command, but no command entered shows the commands"],
    ["about", "get information about this bot"],
    ["link", "get the download link for this bot"],
    ["feedback", "shows link to send feedback about the bot to the developer"],
    ["ping", "gets the milliseconds response time"]
];
const BOT_COMMANDS = [
    ["play [MIDI URL]", "plays a specific song (URL must be a direct link to a MIDI file)"],
    ["stop", "stops all music from playing"],
    ["pause", "pauses the music at that moment in the song"],
    ["resume", "plays music right where pause left off"],
    ["song", "shows the current song playing and at what moment in time"],
    ["repeat", "toggles repeating current song on or off"],
    ["sustain", "toggles how sustain is controlled via either MIDI or by MPP"]
];
const BOT_OWNER_COMMANDS = [
    ["loading", "toggles the MIDI loading progress audio, or text, on or off"],
    [BOT_ACTIVATOR, "toggles the public bot commands on or off"]
];
const PRE_MSG = NAME + " (v" + VERSION + "): ";
const PRE_HELP = PRE_MSG + "[Help]";
const PRE_ABOUT = PRE_MSG + "[About]";
const PRE_LINK = PRE_MSG + "[Link]";
const PRE_FEEDBACK = PRE_MSG + "[Feedback]";
const PRE_PING = PRE_MSG + "[Ping]";
const PRE_PLAY = PRE_MSG + "[Play]";
const PRE_STOP = PRE_MSG + "[Stop]";
const PRE_PAUSE = PRE_MSG + "[Pause]";
const PRE_RESUME = PRE_MSG + "[Resume]";
const PRE_SONG = PRE_MSG + "[Song]";
const PRE_REPEAT = PRE_MSG + "[Repeat]";
const PRE_SUSTAIN = PRE_MSG + "[Sustain]";
const PRE_DOWNLOADING = PRE_MSG + "[Downloading]";
const PRE_LOAD_MUSIC = PRE_MSG + "[Load Music]";
const PRE_PUBLIC = PRE_MSG + "[Public]";
const PRE_LIMITED = PRE_MSG + "Limited!";
const PRE_ERROR = PRE_MSG + "Error!";
const WHERE_TO_FIND_MIDIS = "You can find some good MIDIs to upload from https://bitmidi.com/ and https://midiworld.com/, or you can use your own MIDI files via a site like https://www.file.io/";
const NOT_OWNER = "The bot isn't the owner of the room";
const NO_SONG = "Not currently playing anything";
const LIST_BULLET = "• ";
const DESCRIPTION_SEPARATOR = " - ";
const CONSOLE_IMPORTANT_STYLE = "background-color: red; color: white; font-weight: bold";

// Gets the correct note from MIDIPlayer to play on MPP
const MIDIPlayerToMPPNote = {
    "A0": "a-1",
    "Bb0": "as-1",
    "B0": "b-1",
    "C1": "c0",
    "Db1": "cs0",
    "D1": "d0",
    "Eb1": "ds0",
    "E1": "e0",
    "F1": "f0",
    "Gb1": "fs0",
    "G1": "g0",
    "Ab1": "gs0",
    "A1": "a0",
    "Bb1": "as0",
    "B1": "b0",
    "C2": "c1",
    "Db2": "cs1",
    "D2": "d1",
    "Eb2": "ds1",
    "E2": "e1",
    "F2": "f1",
    "Gb2": "fs1",
    "G2": "g1",
    "Ab2": "gs1",
    "A2": "a1",
    "Bb2": "as1",
    "B2": "b1",
    "C3": "c2",
    "Db3": "cs2",
    "D3": "d2",
    "Eb3": "ds2",
    "E3": "e2",
    "F3": "f2",
    "Gb3": "fs2",
    "G3": "g2",
    "Ab3": "gs2",
    "A3": "a2",
    "Bb3": "as2",
    "B3": "b2",
    "C4": "c3",
    "Db4": "cs3",
    "D4": "d3",
    "Eb4": "ds3",
    "E4": "e3",
    "F4": "f3",
    "Gb4": "fs3",
    "G4": "g3",
    "Ab4": "gs3",
    "A4": "a3",
    "Bb4": "as3",
    "B4": "b3",
    "C5": "c4",
    "Db5": "cs4",
    "D5": "d4",
    "Eb5": "ds4",
    "E5": "e4",
    "F5": "f4",
    "Gb5": "fs4",
    "G5": "g4",
    "Ab5": "gs4",
    "A5": "a4",
    "Bb5": "as4",
    "B5": "b4",
    "C6": "c5",
    "Db6": "cs5",
    "D6": "d5",
    "Eb6": "ds5",
    "E6": "e5",
    "F6": "f5",
    "Gb6": "fs5",
    "G6": "g5",
    "Ab6": "gs5",
    "A6": "a5",
    "Bb6": "as5",
    "B6": "b5",
    "C7": "c6",
    "Db7": "cs6",
    "D7": "d6",
    "Eb7": "ds6",
    "E7": "e6",
    "F7": "f6",
    "Gb7": "fs6",
    "G7": "g6",
    "Ab7": "gs6",
    "A7": "a6",
    "Bb7": "as6",
    "B7": "b6",
    "C8": "c7"
}

// =============================================== VARIABLES

var publicOption = false; // turn off the public bot commands if needed
var pinging = false; // helps aid in getting response time
var pingTime = 0; // changes after each ping
var currentRoom = null; // updates when it connects to room
var chatDelay = CHAT_DELAY; // for how long to wait until posting another message
var endDelay; // used in multiline chats send commands

var loadingOption = false; // controls if loading music should be on or not
var loadingProgress = 0; // updates when loading files
var loadingMusicLoop = null; // this is to play notes while a song is (down)loading
var loadingMusicPrematureStop = false; // this is used when we need to stop the music after errors
var ended = true;
var stopped = false;
var paused = false;
var uploadButton = null; // this gets an element after it's loaded
var currentSongElapsedFormatted = "00:00"; // changes with the amount of song being played
var currentSongDurationFormatted = "00:00"; // gets updated when currentSongDuration is updated
var currentSongDuration = 0; // this changes after each song is loaded
var currentSongData = null; // this contains the song as a data URI
var currentFileLocation = null; // this leads to the MIDI location (local or by URL)
var currentSongName = null; // extracted from the file name/end of URL
var previousSongData = null; // grabs current when changing successfully
var previousSongName = null; // grabs current when changing successfully
var repeatOption = false; // allows for repeat of one song
var sustainOption = true; // makes notes end according to the midi file

// =============================================== PAGE VISIBILITY

var pageVisible = true;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        pageVisible = false;
    } else {
        pageVisible = true;
    }
});

function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
};

var startLoadingMusic = function() {
    if (loadingMusicLoop == null) {
        humanMusic();
        loadingMusicLoop = setInterval(function() {
            humanMusic();
        }, 2200);
    }
}

//Queued Songs
function songQueue() {
   song_queue = [];
}

function userset(set) {
    MPP.client.sendArray([{ m: "userset", set }]);
};

function setName(name) {
    userset({ name });
};

/*function connectSockets(clientAmount) {
    for (var i = 0; i < 25; i++) {
        const cli = Client2("wss://www.multiplayerpiano.net:8080");
        cli.setChannel('roommmm');
        clients.push(cli);

        cli.on('hi', () => {
            clientNumber++
            console.log('Connected socket: ' + cli);
            cli.sendArray([{ userset: { name: clientNumber2 }}])
        });
    };
};*/

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

// Stops the loading music
var stopLoadingMusic = function() {
    if (loadingMusicLoop != null) {
        loadingMusicPrematureStop = true;
        clearInterval(loadingMusicLoop);
        loadingMusicLoop = null;
    }
}

// Gets file as a blob (data URI)
var urlToBlob = function(url, callback) {
    // show file download progress
    var downloading = null;
    //mppChatSend(PRE_DOWNLOADING + ' ' + url);
    if (loadingOption) startLoadingMusic();
    else {
        var progress = 0;
        downloading = setInterval(function() {
            //mppChatSend(PRE_DOWNLOADING + getProgress(progress));
            progress++;
        }, chatDelay);
    }

    fetch(url, {
        headers: {
            "Content-Disposition": "attachment" // this might not be doing anything
        }
    }).then(async response => {
        stopLoadingMusic();
        clearInterval(downloading);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        let blob = await response.blob();
        return {blob: blob, response: response};
    }).then(data => {
        stopLoadingMusic();
        clearInterval(downloading);
        callback(data);
    }).catch(error => {
        console.error("Normal fetch couldn't get the file:", error);
        var corsUrl = useCorsUrl(url);
        if (corsUrl != null) {
            if (loadingOption) startLoadingMusic();

            fetch(corsUrl, {
                headers: {
                    "Content-Disposition": "attachment" // this might not be doing anything
                }
            }).then(async response => {
                stopLoadingMusic();
                clearInterval(downloading);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                let blob = await response.blob();
                return {blob: blob, response: response};
            }).then(data => {
                stopLoadingMusic();
                clearInterval(downloading);
                callback(data);
            }).catch(error => {
                console.error("CORS Anywhere API fetch couldn't get the file:", error);
                stopLoadingMusic();
                clearInterval(downloading);
                callback(null);
            });
        }
        // callback(null); // disabled since the second fetch already should call the call back
    });
}

// Converts files/blobs to base64 (data URI)
var fileOrBlobToBase64 = function(raw, callback) {
    if (raw == null) {
        stopLoadingMusic();
        callback(null);
    }

    // continue if we have a blob
    var reader = new FileReader();
    reader.readAsDataURL(raw);
    reader.onloadend = function() {
        var base64data = reader.result;
        callback(base64data);
    }
}

function makeid(l)
{
var text = "";
var char_list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
for(var i=0; i < l; i++ )
{
text += char_list.charAt(Math.floor(Math.random() * char_list.length));
}
return text;
}

if (localStorage.getItem("permKey") === null) {
    localStorage.setItem('permKey', makeid(34));
} else {
    permKey1 = localStorage.getItem("permKey");
};

function Keys(tempKey, permKey) {
  this.tempKey = tempKey;
  this.permKey = permKey;
}

var tempKey = makeid(24);

var myKey = new Keys(tempKey, permKey1);

console.table(myKey);

    function grbUsr(target) {
        for (var id in MPP.client.ppl) {
            if (!MPP.client.ppl.hasOwnProperty(id)) continue;
            var part = MPP.client.ppl[id];
            if (part.name.toLowerCase().indexOf(target.toLowerCase()) !== -1 || part._id.indexOf(target.toLowerCase()) !== -1 || part.id.indexOf(target.toLowerCase()) !== -1) {
                return part;
                break;
            }

        }
    }

var badLinks = ["lovebird.guru", "trulove.guru", "dateing.club", "otherhalf.life", "shrekis.life", "headshot.monster", "gaming-at-my.best", "progaming.monster", "yourmy.monster", "screenshare.host", "imageshare.best", "screenshot.best", "gamingfun.me", "catsnthing.com", "mypic.icu", "catsnthings.fun", "curiouscat.club", "joinmy.site", "fortnitechat.site", "fortnight.space", "freegiftcards.co", "stopify.co", "leancoding.co", "grabify.link"];
var keyNameMap = {
            "A0": "a-1",
            "Bb0": "as-1",
            "B0": "b-1",
            "C1": "c0",
            "Db1": "cs0",
            "D1": "d0",
            "Eb1": "ds0",
            "E1": "e0",
            "F1": "f0",
            "Gb1": "fs0",
            "G1": "g0",
            "Ab1": "gs0",
            "A1": "a0",
            "Bb1": "as0",
            "B1": "b0",
            "C2": "c1",
            "Db2": "cs1",
            "D2": "d1",
            "Eb2": "ds1",
            "E2": "e1",
            "F2": "f1",
            "Gb2": "fs1",
            "G2": "g1",
            "Ab2": "gs1",
            "A2": "a1",
            "Bb2": "as1",
            "B2": "b1",
            "C3": "c2",
            "Db3": "cs2",
            "D3": "d2",
            "Eb3": "ds2",
            "E3": "e2",
            "F3": "f2",
            "Gb3": "fs2",
            "G3": "g2",
            "Ab3": "gs2",
            "A3": "a2",
            "Bb3": "as2",
            "B3": "b2",
            "C4": "c3",
            "Db4": "cs3",
            "D4": "d3",
            "Eb4": "ds3",
            "E4": "e3",
            "F4": "f3",
            "Gb4": "fs3",
            "G4": "g3",
            "Ab4": "gs3",
            "A4": "a3",
            "Bb4": "as3",
            "B4": "b3",
            "C5": "c4",
            "Db5": "cs4",
            "D5": "d4",
            "Eb5": "ds4",
            "E5": "e4",
            "F5": "f4",
            "Gb5": "fs4",
            "G5": "g4",
            "Ab5": "gs4",
            "A5": "a4",
            "Bb5": "as4",
            "B5": "b4",
            "C6": "c5",
            "Db6": "cs5",
            "D6": "d5",
            "Eb6": "ds5",
            "E6": "e5",
            "F6": "f5",
            "Gb6": "fs5",
            "G6": "g5",
            "Ab6": "gs5",
            "A6": "a5",
            "Bb6": "as5",
            "B6": "b5",
            "C7": "c6",
            "Db7": "cs6",
            "D7": "d6",
            "Eb7": "ds6",
            "E7": "e6",
            "F7": "f6",
            "Gb7": "fs6",
            "G7": "g6",
            "Ab7": "gs6",
            "A7": "a6",
            "Bb7": "as6",
            "B7": "b6",
            "C8": "c7"
        }
var bot = true;
window.client = MPP.client;
window.mppChatSend = MPP.chat.send;


function GenerateCode() {
      let RandomColor = "";
      let Char = "0123456789abcdefghijklmnopqrstuvwxyz";

      for(let i = 0; i < 6; i++) {
        RandomColor = RandomColor + Char[Math.floor(Math.random() * 16)];
      }
      return "#" + RandomColor;
    }

var Player = new MidiPlayer.Player(function(event) {
    if (event.name == "Note off" || (event.name == "Note on" && event.velocity === 0)) {
        if (multiClient == true) {
        clients[clientNumber2].release(keyNameMap[event.noteName]);
        }
        MPP.release(keyNameMap[event.noteName]);
        if (octaveEnabled) {
            for (let i = 1; i <= octaveAmount; i++) {
                if (multiClient == true) {
                    clients[clientNumber2].release(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]]);
                } else {
                MPP.release(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]]);
                }
            }
        }
    } else if (event.name == "Note on") {
        var volume = event.velocity/127;
       if (multiClient == true) {
          clients[clientNumber2].press(keyNameMap[event.noteName], volume);
        } else {
        MPP.press(keyNameMap[event.noteName], volume);
            lolfucknote++
            noteCounter++
            document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
             if (lolfucknote >= 2000) {
                lolfucknote = 0;
                 MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode() }}]);
            }
        }
        if (echo == true) {
            let delay = 30;
            for (var j = 0; j < echoAmount; j++) {
            setTimeout(() => {
             volume *= 0.5;
                if (multiClient == true) {
                    clients[clientNumber2].press(keyNameMap[event.noteName], volume);
                } else {
              MPP.press(keyNameMap[event.noteName], volume);
                 lolfucknote++
                    noteCounter++
                    document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                    if (lolfucknote >= 2000) {
                        lolfucknote = 0;
                        MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode() }}]);
                    }
                }
            }, echoDelay * (j + delay));
                delay *= 2;
            }
        }
        if (octaveEnabled) {
            let delay = 30;
            for (let i = 1; i <= octaveAmount; i++) {
                    clients[clientNumber2].press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                  for (var a = 0; a < echoAmount; a++) {
                      setTimeout(() => {
                          volume *= 0.5;
                          MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                          lolfucknote++;
                          noteCounter++
                          document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                          if (lolfucknote >= 2000) {
                              lolfucknote = 0;
                              MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode() }}]);
                          }
                      }, echoDelay * (a + delay));
                      delay *= 2;
                  }
                }
        }
    } else if (event.name == "Set Tempo") {
        Player.setTempo(event.data);
        if (origTemp1 == true) {
            origTemp = event.data;
            origTemp1 = false;
        }
    }
});

function deblackMidi() {
    for (var i = 0; i < Player.tracks.length; i++) {
        let trackNumber = i;
        if (Player.tracks[trackNumber].events.length > deblackAmount) Player.disableTrack(trackNumber);
    }
}

function disableDeblack() {
    for (var i = 0; i < Player.tracks.length; i++) {
        let trackNumber = i;
        if (Player.tracks[trackNumber].events.length > deblackAmount) Player.enableTrack(trackNumber);
    }
}

setInterval(() => {
    clientNumber2++
    if (clientNumber2 == clients.length) clientNumber2 = 0;
    if (Player.isPlaying()) {
    //setName('๖ۣۜPhoenix [ >help ] [' + sec2time(Player.getSongTimeRemaining()) + ']');
    }
}, 1000);

Player.on('endOfFile', end => {
    setTimeout(() => {
        MPP.client.sendArray([{ m: "m", x: 3.13, y: 15.07 }]);
        clearInterval(lolol);
        //setName('๖ۣۜPhoenix [ >help ]');
        document.getElementById("noteCounter").textContent = 'Notes: ' + "0" + ` / 0`;
        bot = true;
        noteCounter = 0;
        document.getElementById("midiProgress").value = 0;
        if (isQueue == true) {
        Player.loadDataUri(queue[queueNum]);
        Player.play();
        queueNum++;
        if (queueNum < queue.length && queue[queueNum] === undefined) {
            queueNum = 0;
            Player.stop();
        }
    }
    }, 2000)
});

var lolol = setInterval(() => {
    if (Player.isPlaying()) {
        document.getElementById("midiProgress").value = 100 - (((Player.totalTicks - Player.getCurrentTick()) / Player.division / Player.tempo * 60) / Player.getSongTime() * 100)
        MPP.client.sendArray([{ m: "m", x: 100 - (((Player.totalTicks - Player.getCurrentTick()) / Player.division / Player.tempo * 60) / Player.getSongTime() * 100), y: 15.07 }]) }
}, 50);

client.on('a', msg => {
    if (msg.a.startsWith(prefix) && bot == false && msg.p._id !== MPP.client.getOwnParticipant()._id) return mppChatSend("Owner disabled commands for now.");
    const args = msg.a.split(" ")

    if (msg.a.startsWith(`${prefix}play`)) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        totalNotes = 0
        let input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please enter a valid midi link');
        if (!input.includes('https://')) return mppChatSend('Invalid midi link.');
        if (!input.includes('.mid')) return mppChatSend('Invalid midi link.');
        urlToBlob(input, d => {
            fileOrBlobToBase64(d.blob, data => {
                if (Player.isPlaying()) {
                queue.push(data);
                mppChatSend('The song was added to the queue.');
                return;
                } else {
                Player.loadDataUri(data);
                for (var i = 0; i < Player.tracks.length; i++) {
                let trackNumber = i;
                totalNotes += Player.tracks[trackNumber].events.length;
                }
                document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                Player.play();
                var fileName = d.response.headers.get("content-disposition");
                mppChatSend(`Name: ${fileName ? fileName.split('filename=')[1].split(';')[0] : "No Name"} [${sec2time(Player.getSongTime())}]. Tracks: ${Player.tracks.length}.`);
                songName = fileName;
                songTime = sec2time(Player.getSongTime());
                }
            });
        });
    }
    if (msg.a.startsWith(`${prefix}oct`)) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(5).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 5) return mppChatSend('Octaves can only go up to 5.');
        octaveAmount = input;
        mppChatSend('Octaves set to: ' + octaveAmount);
        if (input == 0) {
            octaveEnabled = false;
        } else {
            octaveEnabled = true;
        }
    }
        if (msg.a.match(`${prefix}echo`) && !msg.a.match(`${prefix}echod`)) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(5).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 5) return mppChatSend('Echo can only go up to 5.');
        echoAmount = input;
        mppChatSend('Echo Amount set to: ' + echoAmount);
        if (echo == true && input == 0) {
            echo = false;
        } else if (echo == false) {
            echo = true;
        }
    }
    if (msg.a.match(`${prefix}echod`)) {
       if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        var input = msg.a.substring(7).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 5) return mppChatSend('Echo Delay can only go up to 5.');
        echoDelay = input;
        mppChatSend('Echo Delay set to: ' + echoDelay);
    }
    if (msg.a.startsWith(`${prefix}stop`)) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        Player.stop();
        totalNotes = 0
        MPP.client.sendArray([{ m: "m", x: 3.13, y: 15.07 }]);
        document.getElementById("midiProgress").value = 0;
        document.getElementById("noteCounter").textContent = 'Notes: ' + `0 / 0`;
        mppChatSend('Stopped the music.');
    }
    /*if (msg.a.startsWith('~bot')) {
        if (bot == false) {
         bot = true;
        } else if (bot == true) {
            bot = false;
        }
    }*/
    if (msg.a.startsWith(`${prefix}sustain`)) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        if (sustain == 0) {
            Player.sustain = true
            sustain = 1;
            mppChatSend('Sustain is on.');
        } else if (sustain == 1) {
            Player.sustain = false
            sustain = 0;
            mppChatSend('Sustain is off.');
        }
    }
    if (msg.a.startsWith(`${prefix}pause`)) {
    if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
    Player.pause();
        mppChatSend('Paused the music.');
    }
    if (msg.a.startsWith(`${prefix}resume`)) {
    if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
    Player.play();
        mppChatSend('Resumed the music.');
    }
    if (msg.a.startsWith(`${prefix}loop`)) {
    if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
    Player.playLoop();
    mppChatSend('Looping the song.')
    }
     if (msg.a.startsWith(`${prefix}deblack`)) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        Player.stop();
        totalNotes = 0
        bot = false;
        let input = msg.a.substring(9).trim();
        if (!input) return mppChatSend('Please enter a valid midi link');
        if (!input.includes('https://')) return mppChatSend('Invalid midi link.');
        if (!input.includes('.mid')) return mppChatSend('Invalid midi link.');
        urlToBlob(input, d => {
            fileOrBlobToBase64(d.blob, data => {
                Player.loadDataUri(data);
                deblackMidi();
                Player.play();
                var fileName = d.response.headers.get("content-disposition");
                mppChatSend(`Name: ${fileName ? fileName.split('filename=')[1].split(';')[0] : "No Name"} [${sec2time(Player.getSongTime())}]. Tracks: ${Player.tracks.length}.`);
            });
        });
    }
    if (msg.a.startsWith(prefix + 'solo')) {
    if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
    if (msg.p._id == MPP.client.getOwnParticipant()._id) {
    if (solo == true) {
        solo = false;
        mppChatSend('Solo is off.');
        client.sendArray([{m:'chset', set:{ crownsolo: false }}]);
    } else {
        solo = true;
        mppChatSend('Solo is now on.');
        client.sendArray([{m:'chset', set:{ crownsolo: true }}]);
        }
    }
    }
    if (msg.a.startsWith(prefix + 'dtracks')) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        if (!args[1]) return mppChatSend('Please enter a valid value.');
        if (args[1] > Player.tracks.length || args[2] > Player.tracks.length || args[3] > Player.tracks.length) return mppChatSend(`There are only ${Player.tracks.length} in this midi.`);
        Player.disableTrack(args[1]);
        if (args[2]) {
            Player.disableTrack(args[2]);
        }
        if (args[3]) {
            Player.disableTrack(args[3]);
            }
        if (args[4]) {
            Player.disableTrack(args[4]);
        }
        if (args[5]) {
            Player.disableTrack(args[5]);
            }
        if (args[6]) {
            Player.disableTrack(args[6]);
        }
        if (args[7]) {
            Player.disableTrack(args[7]);
            }
        if (args[8]) {
            Player.disableTrack(args[8]);
        }
        if (args[9]) {
            Player.disableTrack(args[9]);
            }
        if (args[10]) {
            Player.disableTrack(args[10]);
        }
        if (args[11]) {
            Player.disableTrack(args[11]);
        }
         if (args[12]) {
            Player.disableTrack(args[12]);
        }
         if (args[13]) {
            Player.disableTrack(args[13]);
        }
         if (args[14]) {
            Player.disableTrack(args[14]);
        }
        mppChatSend(`Disabled tracks ${args[1]} ${args[2]} ${args[3]} ${args[4]} ${args[5]} ${args[6]} ${args[7]} ${args[8]} ${args[9]} ${args[10]} ${args[11]} ${args[12]} ${args[13]} ${args[14]}`);
        }
        if (msg.a.startsWith(prefix + 'etrack')) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        var input = msg.a.substring(7).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > Player.tracks.length) return mppChatSend(`There are only ${Player.tracks.length} in this midi.`);
        Player.enableTrack(input);
    }
    if (msg.a.startsWith(prefix + 'goto')) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        var input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 100) return mppChatSend('Percentage can only be set below 100%.');
        Player.skipToPercent(input);
        Player.play();
    }
    if (msg.a.startsWith(prefix + 'retardify')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        if (!admins.indexOf(msg.p._id) == -1) return;
        var input = msg.a.substring(11).trim();
        if (!input) return mppChatSend("‎You need to input something to retardify.");
        mppChatSend('‎' + retardify(input));
    }
    if (msg.a.startsWith(prefix + 'skip')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        Player.stop();
        Player.loadDataUri(queue[queueNum]);
        queueNum++;
        Player.play();
        mppChatSend('Skipped the song.');
        if (queueNum < queue.length && queue[queueNum] === undefined) {
            queueNum = 0;
            Player.stop();
            mppChatSend('End of queue.');
            console.log('End of queue');
            return;
        }
        return;
    }
    if (msg.a.startsWith(prefix + 'kiss')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        let target = msg.a.substring(6).trim();
        let part = grbUsr(target.toLowerCase());
        if (!target) return mppChatSend('Please enter a person to kiss ;)');
        if (!part) return mppChatSend('User not found.');
        let rand = items[Math.floor(Math.random() * items.length)];
        mppChatSend(`${msg.p.name} kissed ${part.name} on the ${rand}!!!`);
    }
    if (msg.a.startsWith('>js')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        if (!admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(4).trim();
        try {
            let after = eval(input);
            mppChatSend('‌‌ ' + after);
        } catch (err) {
            console.log("\x1b[31m", err);
            mppChatSend('‌‌ Error: ' + err);
        }
    }
    /*if (msg.a.startsWith('~s') || msg.a.startsWith('~song')) {
       if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
       if (msg.p._id !== "e8297560cbf5248e619fdea0") return;

       if (!Player.isPlaying()) return mppChatSend('There is nothing playing.');
       for (var i = 0; i < Player.tracks.length; i++) {
           let trackNumber = i;
           totalNotes += Player.tracks[trackNumber].events.length;
       }
       mppChatSend(`File: [ ${songName} ], Song Name: [ ${songName.replace('.mid', "")} ], Song Time: [ ${songTime} ], Tracks: [ ${Player.tracks.length} ], Total Notes: [ ${totalNotes} ].`);
        return;
    }*/
    if (msg.a.startsWith(prefix + 'time')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
        mppChatSend(`Here's my current time: ${formatAMPM(new Date)}`);
    }
        if (msg.a.startsWith(prefix + 'tempo')) {
        if (!bannedFuckers.indexOf(msg.p._id) == -1) return;
           let input = args[1];
            Player.setTempo(input);
    }
    if (msg.a.startsWith(prefix + 'ban')) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(5).trim();
        let user = grbUsr(input);
        bannedFuckers.push(user._id);
    }
    if (msg.a.startsWith(prefix + 'admin')) {
        if (!admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(7).trim();
        let user = grbUsr(input);
        admins.push(user._id);
    }
   badLinks.forEach(domain => {
       if (msg.a.includes(domain)) {
           if (msg.p._id == MPP.client.getOwnParticipant()._id) return;
           let lol4 = domain.substr(0, 2);
           let lol5 = domain.substr(2);
           let dom = lol4 + "‎" + lol5;
           MPP.chat.send(`Do NOT trust ‎${dom}. ‎${dom} is a suspicious domain that could be used for malicious purposes like IP grabbing. You probably should not go to links from that domain.`);
  }});
    if (msg.a.startsWith(`${prefix}help`)) return mppChatSend('>ad‎min, >re‎tardify, >‎ban, >‎k‎iss, ‎>t‎ime, ‎>s‎ong, ‎>t‎ime, ‎>s‎kip, ‎>g‎oto, ‎>d‎track, ‎>e‎track, ‎>p‎lay, ‎>stop, ‎>resume, ‎>pause, ‎>e‎cho, ‎>ech‎od, ‎>info, ‎>loop, ‎>tempo, ‎>oct, ‎>sustain.')
    if (msg.a.startsWith(`${prefix}info`)) return mppChatSend('A Tampermonkey script made by Phoenix or Foonix#1129 on discord. You can find the script and the newest releases here: https://github.com/PhoenixTheCoder/neptune')
});

setTimeout(() => {
document.getElementById('file-input4').onchange = function queue24() {
    fileOrBlobToBase64(document.getElementById('file-input4').files[0], data2 => {
        console.log('Added a song to queue');
        console.log(document.getElementById('file-input4').files[0])
        isQueue = true;
        queue.push(data2);
    });
}
}, 3000);
setTimeout(() => {
document.getElementById('file-input').onchange = function upload() {
    totalNotes = 0
    if (deblack == true) {
    console.log(document.getElementById('file-input').files[0])
        fileOrBlobToBase64(document.getElementById('file-input').files[0], data => {
            Player.stop();
            isQueue = false;
            Player.loadDataUri(data);
            deblackMidi();
            noteCounter = 0;
            totalNotes = 0;
            for (var i = 0; i < Player.tracks.length; i++) {
                let trackNumber = i;
                totalNotes += Player.tracks[trackNumber].events.length;
            }
            //$("body").append(`<td style="position:absolute; left:780px; top:40px" id="noteCounter">0 / ${totalNotes}</td>`);
            document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
            songName = document.getElementById('file-input').files[0].name;
            songTime = sec2time(Player.getSongTime())
            Player.play();
    });
    } else {
        console.log(document.getElementById('file-input').files[0])
        fileOrBlobToBase64(document.getElementById('file-input').files[0], data => {
            Player.stop();
            isQueue = false;
            noteCounter = 0;
            totalNotes = 0;
            Player.loadDataUri(data);
            for (var i = 0; i < Player.tracks.length; i++) {
                let trackNumber = i;
                totalNotes += Player.tracks[trackNumber].events.length;
            }
            //$("body").append(`<td style="position:absolute; left:780px; top:40px" id="noteCounter">0 / ${totalNotes}</td>`);
            document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
            songName = document.getElementById('file-input').files[0].name;
            songTime = sec2time(Player.getSongTime())
            Player.play();
            });
        }
    }
}, 3000);


setTimeout(() => {
document.getElementById('stop-btn').onclick = function upload() {
    if (!Player.isPlaying()) return;
    Player.stop();
}
}, 3000);

setTimeout(() => {
    document.getElementById("deblack-btn").onclick = function deblac() {
    if (!Player.isPlaying()) return;
    deblackMidi();
    }
}, 3000);

setTimeout(() => {
    document.getElementById("undeblack-btn").onclick = function deblac2() {
    if (!Player.isPlaying()) return;
    disableDeblack();
    }
}, 3000);

setTimeout(() => {
    document.getElementById("pause-btn").onclick = function pause() {
    if (!Player.isPlaying()) return;
    Player.pause();
    }
}, 3000);

setTimeout(() => {
    document.getElementById("resume-btn").onclick = function resume() {
    Player.play();
    }
}, 3000);

function retardify(str) {
    for(let i = 0; i < str.length; i++) {
      let r = Math.floor(Math.random() * str.length);
      str = str.split('');
      str.splice(r, 1, str[r].toUpperCase());
      str = str.join('');
    }
    for(let i = 0; i < str.length; i++) {
      let r = Math.floor(Math.random() * str.length);
      str = str.split('');
      str.splice(r, 1, str[r].toLowerCase());
      str = str.join('');
    }
    return str;
}

/*MPP.chat.send = (msg) => {
    msg = retardify(msg)
    MPP.client.sendArray([{m: 'a', message: retardify(msg) }]);
}*/

/*MPP.press = (msg) => {
    console.log(msg);
   for (let i = 1; i <= 5; i++) {
       MPP.client.sendArray([{ m: "n", n: [{ n: msg.n + (i * 12), v: 1 }], t: Date.now() + 1000 }]);
    }
}*/

var html2 = `
<div id="file-input2" style="position:absolute; left:660px; top:4px" class="ugly-button translate">
<label> Choose MIDI
<input id="file-input" style="display: none;" type="file"></input>
</label>
</div>
<pre id="file-contents"></pre>
`

$("#bottom .relative").append(html2);

function stopButton() {
 if (!Player.isPlaying()) return;
 Player.stop();
};

$("#bottom .relative").append(`<div id="stop-btn" style="position:absolute; left:780px; top:4px" class="ugly-button translate"><label> Stop </label></div>`);
$("#bottom .relative").append(`<div id="deblack-btn" style="position:absolute; left:780px; top:32px" class="ugly-button translate"><label> Deblack </label></div>`);
$("#bottom .relative").append(`<div id="undeblack-btn" style="position:absolute; left:900px; top:4px" class="ugly-button translate"><label> ReEnable Tracks </label></div>`);
$("#bottom .relative").append(`<div id="pause-btn" style="position:absolute; left:900px; top:32px" class="ugly-button translate"><label> Pause </label></div>`);
$("#bottom .relative").append(`<div id="resume-btn" style="position:absolute; left:1020px; top:4px" class="ugly-button translate"><label> Resume </label></div>`);
$("#bottom .relative").append(`<div id="file-input3" style="position:absolute; left:1020px; top:32px" class="ugly-button translate">
<label> Add MIDI
<input id="file-input4" style="display: none;" type="file"></input>
</label>
</div>
<pre id="file-contents2"></pre>`);
$("body").append(`<td style="position:absolute; left:1100px; top:160px" id="noteCounter">Notes: 0</td>`);
$("body").append(`<progress id="midiProgress" style="position:absolute; left: 50px; top: 200px; width: 1500px" value="0" max="100"> 0% </progress>`);
