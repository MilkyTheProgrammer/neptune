// ==UserScript==
// @name         Neptune v6
// @namespace    http://tampermonkey.net/
// @version      6
// @description  try to take over the world!
// @author       Phoenix, AlienDrew
// @match        https://www.multiplayerpiano.net/*
// @match        https://mppclone.com/*
// @match        https://www.multiplayerpiano.com/*
// @match        http://augustberchelmann.com/piano/*
// @match        https://mpp.terrium.net/*
// @icon         https://www.google.com/s2/favicons?domain=mppclone.com
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @resource     MIDIPlayerJS https://raw.githubusercontent.com/PhoenixTheCoder/midiplayerjs/main/midiplayer.js
// @run-at       document-end
// ==/UserScript==

var prefix = "-";

var stringMIDIPlayerJS = GM_getResourceText("MIDIPlayerJS");
var scriptMIDIPlayerJS = document.createElement("script");
scriptMIDIPlayerJS.type = 'text/javascript';
scriptMIDIPlayerJS.appendChild(document.createTextNode(stringMIDIPlayerJS));
(document.body || document.head || document.documentElement).appendChild(scriptMIDIPlayerJS);

// CORS Anywhere (allows downloading files where JS can't)
var useCorsUrl = function(url) {
    var newUrl = null; // send null back if it's already a cors url
    var cors_api_url = 'https://cors-anywhere.phoenixxx1.repl.co/';
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
var songFileName = "";

setTimeout(() => {
    document.getElementById("noteCounter").textContent = 'Notes: ' + "0";
}, 2000);


function SHA512(str) {
 function int64(msint_32, lsint_32) {
 this.highOrder = msint_32;
 this.lowOrder = lsint_32;
 }

 var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
 new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
 new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
 new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)];

 var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
 new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
 new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
 new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
 new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
 new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
 new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
 new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
 new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
 new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
 new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
 new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
 new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
 new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
 new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
 new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
 new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
 new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
 new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
 new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
 new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
 new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
 new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
 new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
 new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
 new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
 new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
 new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
 new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
 new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
 new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
 new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
 new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
 new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
 new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
 new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
 new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
 new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
 new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
 new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)];

 var W = new Array(64);
 var a, b, c, d, e, f, g, h, i, j;
 var T1, T2;
 var charsize = 8;

 function utf8_encode(str) {
 return unescape(encodeURIComponent(str));
 }

 function str2binb(str) {
 var bin = [];
 var mask = (1 << charsize) - 1;
 var len = str.length * charsize;

 for (var i = 0; i < len; i += charsize) {
 bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
 }

 return bin;
 }

 function binb2hex(binarray) {
 var hex_tab = '0123456789abcdef';
 var str = '';
 var length = binarray.length * 4;
 var srcByte;

 for (var i = 0; i < length; i += 1) {
 srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
 str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
 }

 return str;
 }

 function safe_add_2(x, y) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
 msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function safe_add_4(a, b, c, d) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
 msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function safe_add_5(a, b, c, d, e) {
 var lsw, msw, lowOrder, highOrder;

 lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
 msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
 lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
 msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
 highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

 return new int64(highOrder, lowOrder);
 }

 function maj(x, y, z) {
 return new int64(
 (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
 (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
 );
 }

 function ch(x, y, z) {
 return new int64(
 (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
 (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
 );
 }

 function rotr(x, n) {
 if (n <= 32) {
 return new int64(
 (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
 (x.lowOrder >>> n) | (x.highOrder << (32 - n))
 );
 } else {
 return new int64(
 (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
 (x.highOrder >>> n) | (x.lowOrder << (32 - n))
 );
 }
 }

 function sigma0(x) {
 var rotr28 = rotr(x, 28);
 var rotr34 = rotr(x, 34);
 var rotr39 = rotr(x, 39);

 return new int64(
 rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
 rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
 );
 }

 function sigma1(x) {
 var rotr14 = rotr(x, 14);
 var rotr18 = rotr(x, 18);
 var rotr41 = rotr(x, 41);

 return new int64(
 rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
 rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
 );
 }

 function gamma0(x) {
 var rotr1 = rotr(x, 1), rotr8 = rotr(x, 8), shr7 = shr(x, 7);

 return new int64(
 rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
 rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
 );
 }

 function gamma1(x) {
 var rotr19 = rotr(x, 19);
 var rotr61 = rotr(x, 61);
 var shr6 = shr(x, 6);

 return new int64(
 rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
 rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
 );
 }

 function shr(x, n) {
 if (n <= 32) {
 return new int64(
 x.highOrder >>> n,
 x.lowOrder >>> n | (x.highOrder << (32 - n))
 );
 } else {
 return new int64(
 0,
 x.highOrder << (32 - n)
 );
 }
 }

 str = utf8_encode(str);
 strlen = str.length*charsize;
 str = str2binb(str);

 str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
 str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

 for (var i = 0; i < str.length; i += 32) {
 a = H[0];
 b = H[1];
 c = H[2];
 d = H[3];
 e = H[4];
 f = H[5];
 g = H[6];
 h = H[7];

 for (var j = 0; j < 80; j++) {
 if (j < 16) {
 W[j] = new int64(str[j*2 + i], str[j*2 + i + 1]);
 } else {
 W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
 }

 T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
 T2 = safe_add_2(sigma0(a), maj(a, b, c));
 h = g;
 g = f;
 f = e;
 e = safe_add_2(d, T1);
 d = c;
 c = b;
 b = a;
 a = safe_add_2(T1, T2);
 }

 H[0] = safe_add_2(a, H[0]);
 H[1] = safe_add_2(b, H[1]);
 H[2] = safe_add_2(c, H[2]);
 H[3] = safe_add_2(d, H[3]);
 H[4] = safe_add_2(e, H[4]);
 H[5] = safe_add_2(f, H[5]);
 H[6] = safe_add_2(g, H[6]);
 H[7] = safe_add_2(h, H[7]);
 }

 var binarray = [];
 for (var i = 0; i < H.length; i++) {
 binarray.push(H[i].highOrder);
 binarray.push(H[i].lowOrder);
 }
 return binb2hex(binarray);
}

        var responses = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes - definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.'
        ];

var languages = [
	"ab",
	"aa",
	"af",
	"ak",
	"sq",
	"am",
	"ar",
	"an",
	"hy",
	"as",
	"av",
	"ae",
	"ay",
	"az",
	"bm",
	"ba",
	"eu",
	"be",
	"bn",
	"bh",
	"bi",
	"bs",
	"br",
	"bg",
	"my",
	"ca",
	"km",
	"ch",
	"ce",
	"ny",
	"zh",
	"cu",
	"cv",
	"kw",
	"co",
	"cr",
	"hr",
	"cs",
	"da",
	"dv",
	"nl",
	"dz",
	"en",
	"eo",
	"et",
	"ee",
	"fo",
	"fj",
	"fi",
	"fr",
	"ff",
	"gd",
	"gl",
	"lg",
	"ka",
	"de",
	"ki",
	"el",
	"kl",
	"gn",
	"gu",
	"ht",
	"ha",
	"he",
	"hz",
	"hi",
	"ho",
	"hu",
	"is",
	"io",
	"ig",
	"id",
	"ia",
	"ie",
	"iu",
	"ik",
	"ga",
	"it",
	"ja",
	"jv",
	"kn",
	"kr",
	"ks",
	"kk",
	"rw",
	"kv",
	"kg",
	"ko",
	"kj",
	"ku",
	"ky",
	"lo",
	"la",
	"lv",
	"lb",
	"li",
	"ln",
	"lt",
	"lu",
	"mk",
	"mg",
	"ms",
	"ml",
	"mt",
	"gv",
	"mi",
	"mr",
	"mh",
	"ro",
	"mn",
	"na",
	"nv",
	"nd",
	"ng",
	"ne",
	"se",
	"no",
	"nb",
	"nn",
	"ii",
	"oc",
	"oj",
	"or",
	"om",
	"os",
	"pi",
	"pa",
	"ps",
	"fa",
	"pl",
	"pt",
	"qu",
	"rm",
	"rn",
	"ru",
	"sm",
	"sg",
	"sa",
	"sc",
	"sr",
	"sn",
	"sd",
	"si",
	"sk",
	"sl",
	"so",
	"st",
	"nr",
	"es",
	"su",
	"sw",
	"ss",
	"sv",
	"tl",
	"ty",
	"tg",
	"ta",
	"tt",
	"te",
	"th",
	"bo",
	"ti",
	"to",
	"ts",
	"tn",
	"tr",
	"tk",
	"tw",
	"ug",
	"uk",
	"ur",
	"uz",
	"ve",
	"vi",
	"vo",
	"wa",
	"cy",
	"fy",
	"wo",
	"xh",
	"yi",
	"yo",
	"za",
	"zu",
];

// Neptune's Favorite songs //

/* To add songs, you must add this to the jsonSongs

"Song name": {
        songName: "Song name",
        url: "midi link"
    },

*/
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
    usersfet({ name });
};

/*function connectSockets(clientAmount) {
    for (var i = 0; i < 25; i++) {
        const cli = Client2("wss://www.multiplayerpiano.net:8080");
        cli.setChannel('roommmm');
        clients.push(cli);

        cli.on('hi', () =~ {
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
        //noteCounter++
        //document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
        if (octaveEnabled) {
            for (let i = 1; i <= octaveAmount; i++) {
                    //noteCounter++
                    //document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                MPP.release(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]]);
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
                // MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode() }}]);
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
                       // MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode()  }}]);
                    }
                }
            }, echoDelay * (j + delay));
                delay *= 2;
            }
        }
        if (octaveEnabled) {
            let delay = 30;
            for (let i = 1; i <= octaveAmount; i++) {
                    MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                  for (var a = 0; a < echoAmount; a++) {
                      setTimeout(() => {
                          volume *= 0.5;
                          MPP.press(keyNameMap[Object.keys(keyNameMap)[Object.keys(keyNameMap).indexOf(event.noteName) + (i * 12)]], volume);
                          lolfucknote++;
                          noteCounter++
                          document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                          if (lolfucknote >= 2000) {
                              lolfucknote = 0;
                             // MPP.client.sendArray([{ m: "userset", set: { color: GenerateCode() }}]);
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


    if (msg.a.startsWith(prefix + 'sha512')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        const input = msg.a.substring(7).trim();
        mppChatSend(SHA512(input));
        return;

    }
    if (msg.a.startsWith(`${prefix}play`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
        totalNotes = 0
        let input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please enter a valid midi link');
        if (!input.includes('https://') || !input.includes('.mid')) {
            const file = Object.keys(jsonSongs).filter(a => a.includes(input.toLowerCase()));
            if (file === undefined) return mppChatSend('Song not found.');
            input = jsonSongs[file].url
            songFileName = jsonSongs[file].songName;
            urlToBlob(input, d => {
            fileOrBlobToBase64(d.blob, data => {
                if (Player.isPlaying()) {
                queue.push(data);
                mppChatSend('The song was added to the queue.');
                return;
                } else {
                try {
                Player.loadDataUri(data);
                for (var i = 1; i < Player.tracks.length; i++) {
                let trackNumber = i;
                totalNotes += Player.tracks[trackNumber].events.length;
                }
                document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                Player.play();
                var fileName = d.response.headers.get("content-disposition");
                mppChatSend(`Name: ${songFileName} [${sec2time(Player.getSongTime())}]. Tracks: ${Player.tracks.length}.`);
                songName = songFileName;
                songTime = sec2time(Player.getSongTime());
                    } catch (err) {
                      mppChatSend(err);
                      return
                    }
                }
            });
        });
        } else {
        if (!input.includes('.mid')) return mppChatSend('Invalid midi link.');
        urlToBlob(input, d => {
            fileOrBlobToBase64(d.blob, data => {
                if (Player.isPlaying()) {
                queue.push(data);
                mppChatSend('The song was added to the queue.');
                return;
                } else {
                try {
                Player.loadDataUri(data);
                for (var i = 1; i < Player.tracks.length; i++) {
                let trackNumber = i;
                totalNotes += Player.tracks[trackNumber].events.length;
                }
                document.getElementById("noteCounter").textContent = 'Notes: ' + noteCounter + ` / ${totalNotes}`;
                Player.play();
                var fileName = d.response.headers.get("content-disposition");
                mppChatSend(`Name: ${fileName ? fileName.split('filename=')[1].split(';')[0] : "No Name"} [${sec2time(Player.getSongTime())}]. Tracks: ${Player.tracks.length}.`);
                songName = fileName || songFileName;
                songTime = sec2time(Player.getSongTime());
                    } catch (err) {
                      mppChatSend(err);
                      return
                    }
                }
            });
        });
        }
    }
    if (msg.a.startsWith(prefix + 'list')) {
        mppChatSend(`${Object.values(jsonSongs).map(a => a.songName).join(", ")}`);
        return;
    }
    if (msg.a.startsWith(`${prefix}oct`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
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
        if (bannedFuckers.includes(msg.p._id)) return;
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

    if (msg.a.startsWith(prefix + 'follow')) {
        if (bannedFuckers.includes(msg.p._id)) return;
    let input = msg.a.substring(8).trim();
        if (!input) return mppChatSend("Please enter someone for me to follow.");
    let user = grbUsr(input);
    if (followCursor) return clearInterval(followCursor);
    if (!user) return mppChatSend('User not found.');
    if (!input) {
        let user = msg.p;
    }
    mppChatSend('Following ' + user.name + "'s cursor");
    followCursor = setInterval(() => { MPP.client.sendArray([{m: "m", x: Object.values(MPP.client.ppl).find(p => p._id === user._id).x, y: Object.values(MPP.client.ppl).find(p => p._id === user._id).y}]) }, 50);
    }

    if (msg.a.startsWith(prefix + 'stopfollow')) {
        if (bannedFuckers.includes(msg.p._id)) return;
    clearInterval(followCursor);
    return;
    }
    if (msg.a.startsWith(prefix + '8ball')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        let input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please ask me something.');
      var randomNumber = Math.floor(Math.random()*responses.length);
        var response = responses[randomNumber];
        mppChatSend(response);
        return;
    }


    if (msg.a.match(`${prefix}echod`)) {
       if (bannedFuckers.includes(msg.p._id)) return;
        var input = msg.a.substring(7).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 5) return mppChatSend('Echo Delay can only go up to 5.');
        echoDelay = input;
        mppChatSend('Echo Delay set to: ' + echoDelay);
    }
    if (msg.a.startsWith(`${prefix}stop`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
        Player.stop();
        totalNotes = 0
        MPP.client.sendArray([{ m: "m", x: 3.13, y: 15.07 }]);
        document.getElementById("midiProgress").value = 0;
        document.getElementById("noteCounter").textContent = 'Notes: ' + `0 / 0`;
        mppChatSend('Stopped the music.');
    }
    if (msg.a.startsWith(prefix + 'public')) {
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
        if (bot == false) {
         bot = true;
         mppChatSend('Public commands were enabled.');
        } else if (bot == true) {
            bot = false;
             mppChatSend('Public commands were disabled.');
        }
    }
    if (msg.a.startsWith(`${prefix}sustain`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
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
    if (bannedFuckers.includes(msg.p._id)) return;
    Player.pause();
        mppChatSend('Paused the music.');
    }
    if (msg.a.startsWith(`${prefix}resume`)) {
    if (bannedFuckers.includes(msg.p._id)) return;
    Player.play();
        mppChatSend('Resumed the music.');
    }
    if (msg.a.startsWith(`${prefix}loop`)) {
    if (bannedFuckers.includes(msg.p._id)) return;
    Player.playLoop();
    mppChatSend('Looping the song.')
    }
     if (msg.a.startsWith(`${prefix}deblack`)) {
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
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
    if (msg.a.startsWith(prefix + 'ip')) {
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
        var ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255));
        if (!args[1]) return mppChatSend('Please enter someone to grab an IP from.');
        let user = grbUsr(args[1]);
        mppChatSend(user.name + "'s IP is: " + ip);
        return;
    }
    if (msg.a.startsWith(prefix + 'solo')) {
    if (bannedFuckers.includes(msg.p._id)) return;
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
    if (msg.a.startsWith(prefix + 'sleep')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (!sleepingUsers.includes(msg.p._id)) {
            sleepingUsers.push(msg.p._id);
               mppChatSend(msg.p.name + ' is now asleep 💤...');
            } else {
               mppChatSend(msg.p.name + ' is now sound asleep 💤💤...');
                return;
        }
    }
        if (msg.a.startsWith(prefix + 'wake')) {
            if (bannedFuckers.includes(msg.p._id)) return;
        if (sleepingUsers.includes(msg.p._id)) {
            sleepingUsers.splice(sleepingUsers.indexOf(msg.p._id), 1);
               mppChatSend(msg.p.name + ' is now awake!');
            } else {
               mppChatSend(msg.p.name + ' is now wide awake!');
                return;
        }
    }
    if (msg.a.startsWith(prefix + 'dtracks')) {
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
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
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
        var input = msg.a.substring(7).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > Player.tracks.length) return mppChatSend(`There are only ${Player.tracks.length} in this midi.`);
        Player.enableTrack(input);
    }
    if (msg.a.startsWith(prefix + 'goto')) {
        if (admins.indexOf(msg.p._id) == -1) return;
        if (bannedFuckers.includes(msg.p._id)) return;
        var input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please enter a valid value.');
        if (isNaN(input)) return mppChatSend('Invalid value.');
        if (input > 100) return mppChatSend('Percentage can only be set below 100%.');
        Player.skipToPercent(input);
        Player.play();
    }
    if (msg.a.startsWith(prefix + 'kiss')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to kiss.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' kisses ' + person.name + '.');
        }
    }
        if (msg.a.startsWith(prefix + 'pat')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to pat.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' pats ' + person.name + ' on the head -w-');
        }
    }

    if (msg.a.startsWith(prefix + 'hug')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to hug.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' hugs ' + person.name + '.');
        }
    }
    if (msg.a.startsWith(prefix + 'slap')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to slap.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' slaps ' + person.name + '.');
        }
    }
        if (msg.a.startsWith(prefix + 'bonk')) {
            if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to bonk.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' bonks ' + person.name + '.');
        }
    }
        if (msg.a.startsWith(prefix + 'cuddle')) {
            if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to cuddle.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' cuddles ' + person.name + '.');
        }
    }
        if (msg.a.startsWith(prefix + 'kill')) {
            if (bannedFuckers.includes(msg.p._id)) return;
        if (!args[1]) return mppChatSend('Please mention someone to kill.');
       let person = grbUsr(args[1]);
       if (!person) return mppChatSend('User not found.');
        if (person && args[1]) {
            mppChatSend(msg.p.name + ' kills ' + person.name + '.');
        }
    }
    if (msg.a.startsWith(prefix + 'retardify')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        var input = msg.a.substring(11).trim();
        if (!input) return mppChatSend("‎You need to input something to retardify.");
        mppChatSend('‎' + retardify(input));
    }
    if (msg.a.startsWith(prefix + 'skip')) {
        if (bannedFuckers.includes(msg.p._id)) return;
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
    if (msg.a.startsWith(prefix + 'js')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(4).trim();
        try {
            let after = eval(input);
            mppChatSend('‌‌ ' + after);
        } catch (err) {
            console.log("\x1b[31m", err);
            mppChatSend('‌‌ Error: ' + err);
        }
    }
    if (msg.a.startsWith(prefix + 'song')) {
       if (bannedFuckers.includes(msg.p._id)) return;

       if (!Player.isPlaying()) return mppChatSend('There is nothing playing.');
       for (var i = 0; i < Player.tracks.length; i++) {
           let trackNumber = i;
           totalNotes += Player.tracks[trackNumber].events.length;
       }
       mppChatSend(`File: [ ${songName} ], Song Name: [ ${songName.replace('.mid', "")} ], Song Time: [ ${songTime} ], Tracks: [ ${Player.tracks.length} ], Total Notes: [ ${totalNotes} ].`);
        return;
    }
    if (msg.a.startsWith(prefix + 'time')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        mppChatSend(`Here's my current time: ${formatAMPM(new Date)}`);
    }
        if (msg.a.startsWith(prefix + 'tempo')) {
            if (bannedFuckers.includes(msg.p._id)) return;
           let input = args[1];
            Player.setTempo(input);
    }
    if (msg.a.startsWith(prefix + 'ban')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(5).trim();
         if (!input) return mppChatSend('Please input a user to ban.');
        let user = grbUsr(input);
        bannedFuckers.push(user._id);
        mppChatSend(`${user.name} was added to the ban list.`);
    }
    if (msg.a.startsWith(prefix + 'notecount')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        mppChatSend(noteCounter + ' noted have been played so far. Total amount of notes: ' + totalNotes);
        return;
    }
    if (msg.a.startsWith(prefix + 'admin')) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(7).trim();
        if (!input) return mppChatSend('Please input a user to admin.');
        let user = grbUsr(input);
        admins.push(user._id);
        mppChatSend(`${user.name} was added to the admin list.`);
    }
   badLinks.forEach(domain => {
       if (msg.a.includes(domain)) {
           if (msg.p._id == MPP.client.getOwnParticipant()._id) return;
           let lol4 = domain.substr(0, 2);
           let lol5 = domain.substr(2);
           let dom = lol4 + "‎" + lol5;
           MPP.chat.send(`Do NOT trust ‎${dom}. ‎${dom} is a suspicious domain that could be used for malicious purposes like IP grabbing. You probably should not go to links from that domain.`);
  }});
    if (msg.a.startsWith(`${prefix}help`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
        mppChatSend(' | Useful: ‎ ' + prefix + 'sha512, ' + prefix + 't‎ime, ' + prefix + 'di‎scord, ' + prefix + '‎ban, ' + prefix + 'unban, ' + prefix + 'unadmin, ' + prefix + 'ad‎min, ' + prefix + 'public, ' + prefix + 'list | Fun: ' + prefix + 'grouphug, ' + prefix + '8ball, ' + prefix + 'sleep, ' + prefix + 'wake, ' + prefix + 'follow, ' + prefix + 'stopfollow, ' + prefix + 're‎tardify, ' + prefix + 'kiss, ' + prefix + 'hug, ' + prefix + 'cuddle, ' + prefix + 'kill, ' + prefix + 'slap | Music: ' + prefix + 's‎ong, ' + prefix + 't‎ime, ' + prefix + 's‎kip, ' + prefix + 'g‎oto, ' + prefix + 'd‎track, ' + prefix + 'e‎track, ' + prefix + 'p‎lay, ', + prefix + 'stop, ' + prefix + 'resume, ' + prefix + 'pause, ' + prefix + 'e‎cho, ' + prefix + 'ech‎od, ' + prefix + 'info, ' + prefix + 'loop, ' + prefix + 'tempo, ' + prefix + 'oct, ' + prefix + 'sustain.')
    return;
    }
    if (msg.a.startsWith(`${prefix}info`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
        mppChatSend('A Tampermonkey script made by Phoenix or Foonix#1129 on discord. You can find the script and the newest releases here: https://github.com/PhoenixTheCoder/neptune');
        return;
    }
    if (msg.a.startsWith(prefix + 'grouphug')) {
        mppChatSend(msg.p.name + ' gave everyone a big hug!');
        return;
    }
    if (msg.a.startsWith(prefix + "unadmin")) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(8).trim();
        if (!input) return mppChatSend('Please input a user to revoke.');
        let user = grbUsr(input);
        admins.splice(admins.indexOf(user._id), 1);
        mppChatSend(`${user.name} was removed from the admin list.`);
    }
        if (msg.a.startsWith(prefix + "unban")) {
        if (bannedFuckers.includes(msg.p._id)) return;
        if (admins.indexOf(msg.p._id) == -1) return;
        let input = msg.a.substring(6).trim();
        if (!input) return mppChatSend('Please input a user to unban.');
        let user = grbUsr(input);
        bannedFuckers.splice(bannedFuckers.indexOf(user._id), 1);
        mppChatSend(`${user.name} was removed from the ban list.`);
    }
    if (msg.a.startsWith(`${prefix}discord`)) {
        if (bannedFuckers.includes(msg.p._id)) return;
        mppChatSend(`Here's my official Discord Server: https://discord.gg/TSVEekMBzc`);
        return;
    }
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
        console.log(document.getElementById('file-input').files[0])
        fileOrBlobToBase64(document.getElementById('file-input').files[0], data => {
            Player.stop();
            isQueue = false;
            noteCounter = 0;
            totalNotes = 0;
            Player.loadDataUri(data);
            for (var i = 1; i < Player.tracks.length; i++) {
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
<div id="file-input2" style="position:absolute; left:1140px; top:4px" class="ugly-button translate">
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
