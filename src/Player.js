const MidiPlayer = require("midi-player-js/browser/midiplayer");

var useCorsUrl = function(url) {
    var newUrl = null; // send null back if it's already a cors url
    var cors_api_url = 'https://test.cors.workers.dev/';
    // removes protocols before applying cors api url
    if (url.indexOf(cors_api_url) == -1) newUrl = cors_api_url + url.replace(/(^\w+:|^)\/\//, '');
    return newUrl;
}

var followCursor = null;

var deblack = false;
var awokenUsers = [];

var bannedFuckers = ["dac4b722f4f82190508878c1", "ed586bc5cb7a744a273ff32a", "f2085b4be9cc6c0deba09774"];

var admins = ["e8297560cbf5248e619fdea0", "9899ddab65b7c6a559a21398"];
var neptune_colors = ["7d9cf5", "4b70dd", "0000ff", "#4b70dd", "4169e1", "3967ef", "1245db"];

var deblackAmount = 4000;

var tracks = [];
var totalNotes = 0;

var songTime = 0;
var songName = "";
var sleepingUsers = [];

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


function fetchTranslation(text, lang){
const data = `q=${text}&target=${lang}&source=en`;

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
	if (this.readyState === this.DONE) {
		text = JSON.parse(this.response).data.translations[0].translatedText;
        MPP.chat.send(text);
	}
});

xhr.open("POST", "https://google-translate1.p.rapidapi.com/language/translate/v2");
xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
xhr.setRequestHeader("accept-encoding", "application/gzip");
xhr.setRequestHeader("x-rapidapi-key", "7c6ac91f4fmshac91f4fc2b2b284p11f5cfjsna8c162994379");
xhr.setRequestHeader("x-rapidapi-host", "google-translate1.p.rapidapi.com");

xhr.send(data);
}

// Gets the correct note from MIDIPlayer to play on MPP
const keyNameMap = {
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
    usersfet({ name });
};

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
            'X-Requested-With': 'XMLHttpRequest',
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
                    'X-Requested-With': 'XMLHttpRequest',
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

var moveMouse = function(x, y) {
    MPP.client.sendArray([{ m: "m", x, y }]);
};

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

class Player {
    constructor(cl) {
        this.octave = 0;
        this.echo = 0;
        this.echod = 0;
        this.transpose = 0;
        this.cl = cl;
        
        this.Player = new MidiPlayer.Player(function(event) {
            if (event.name == "Note off" || (event.name == "Note on" && event.velocity === 0)) {
                if (event.velocity < 54) return;
                MPP.release(keyNameMap[event.noteName]);
                if (this.octave !== 0) {
                    for (let i = 1; i <= this.octave; i++) {
                        MPP.release(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]]);
                    }
                }
            } else if (event.name == "Note on") {
                if (event.velocity < 54) return;
                var volume = event.velocity/127;
                MPP.press(keyNameMap[event.noteName], volume);
            }
            if (this.echo !== 0) {
                let delay = 30;
                for (var j = 0; j < this.echo; j++) {
                    setTimeout(() => {
                        volume *= 0.5;
                            MPP.press(keyNameMap[event.noteName], volume);
                    }, this.echod * (j + delay));
                    delay *= 2;
                }
            }
            if (this.echo !== 0) {
                let delay = 30;
                for (let i = 1; i <= this.octave; i++) {
                    MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                    for (var a = 0; a < this.echo; a++) {
                        setTimeout(() => {
                            volume *= 0.5;
                            MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                        }, this.echod * (a + delay));
                        delay *= 2;
                    }
                }
            } else if (event.name == "Set tempo") {
                
            }
        });
    }

    playMIDI(songName) {
        urlToBlob(songName, d => {
            fileOrBlobToBase64(d.blob, data => {
                try {
                        this.Player.stop();
                        this.Player.loadDataUri(data);
                        this.Player.play();
                        var fileName = d.response.headers.get("content-disposition");
                        this.cl.send(`Name: ${fileName ? fileName.split('filename=')[1].split(';')[0] : "No Name"} [${sec2time(this.Player.getSongTime())}]. Tracks: ${this.Player.tracks.length}.`);
                        songName = fileName || songFileName;
                        songTime = sec2time(this.Player.getSongTime());
                    } catch (err) {
                        this.cl.send(err);
                    return
                }
            });
        });
    }

    stopMIDI() {
        this.Player.stop();
        this.cl.send("Stopping music...");
    }
}

module.exports = Player;