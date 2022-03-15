//                                  ENCODOVANJE FIGURA
// bijele figure                              crne figure

//   Piun:   P+| w = 9     0001 | 1000 = 1001   Piun:  P-| c = 18   00010 | 10000 = 10010
//   Kralj:  K | w = 11    0011 | 1000 = 1011   Kralj: K | c = 19   00011 | 10000 = 10011
//   Skakač: N | w = 12    0100 | 1000 = 1100   Skakač:N | c = 20   00100 | 10000 = 10100
//   Lovac:  B | w = 13    0101 | 1000 = 1101   Lovac: B | c = 21   00101 | 10000 = 10101
//   Top:    R | w = 14    0110 | 1000 = 1110   Top:   R | c = 22   00110 | 10000 = 10110
// Kraljica: Q | w = 15    0111 | 1000 = 1111 Kraljica:Q | c = 23   00111 | 10000 = 10111

// 0x88 ploca sa vrijednostima figura

// prettier-ignore
// start-pos
// let board = [
//   22, 20, 21, 23, 19, 21, 20, 22,   0, 5, 0, 0, 0, 0, 5, 0,
//   18, 18, 18, 18, 18, 18, 18, 18,   5, 5, 5, 5, 5, 5, 5, 5,
//   0,  0,  0,  0,  0,  0,  0,  0,    5,10,15,25,25,15,10, 5,
//   0,  0,  0,  0,  0,  0,  0,  0,    5,10,25,50,50,25,10, 5,
//   0,  0,  0,  0,  0,  0,  0,  0,    5,10,25,50,50,25,10, 5,
//   0,  0,  0,  0,  0,  0,  0,  0,    5,10,15,25,25,15,10, 5,
//   9,  9,  9,  9,  9,  9,  9,  9,    5, 5, 5, 5, 5, 5, 5, 5,
//   14, 12, 13, 15, 11, 13, 12, 14,   0, 5, 0, 0, 0, 0, 5, 0,
// ];

// unicode za reprezentaciju figura na ploci
let pieces = [
  //           crne
  '',
  '',
  '\u265F', // piun
  '\u265A', // kralj
  '\u265E', // skakac
  '\u265D', // lovac
  '\u265C', // top
  '\u265B', // kraljica

  //          bijele
  '',
  '\u2659', // piun
  '',
  '\u2654', // kralj
  '\u2658', // skakac
  '\u2657', // lovac
  '\u2656', // top
  '\u2655', // kraljica
];

// vrijednosti za evaluacija materijala
let pieceValue = [
  // crne figure
  //     P    K    S     L     T     Q
  0, 0, -100, 0, -300, -350, -500, -900,
  //bijele figure
  //     P    K    S     L     T     Q
  0, 0, 100, 0, 300, 350, 500, 900,
];

// kretnja figure

// prettier-ignore
let moveOffsets = [

  15,16,17,0, // crniPiun

  -15,-16,-17,0, // bijeliPiun

  1,16,-1,-16,0, // Top
  
  1,16,-1,-16,15,-15,17,-17,0, // Kraljica,Kralj, Lovac

  14,-14,18,-18,31,-31,33,-33,0, // Skakač

  3,-1,12,21,16,7,12, // početni index za svaku figuru
];

let onMove = 8;

// najbolji potez
let beststartSquare, bestEndSquare;

// potencijalni potezi(pinovi i rokada)
let potentialLegalMoves = [];

// da li je kliknuta figura
let selectPiece = false;

// završno polje
let playerEndSquare;

// dubina pretrage
let searchDepth = 3;

//potez jednog igrača
let halfMove = 0;
