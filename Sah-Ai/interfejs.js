function drawBoard() {
  // crtanje sahovske ploce
  let chessBoard = `<table 
                          align="center"
                          cellspacing="1"
                          style="border: 1px solid #black;"
                          unselectable="on"
                          onselectstart="return false;"
                          onmousedown="return false;"`;
  for (let row = 0; row < 8; row++) {
    // napravi red
    chessBoard += '<tr>';
    // napravi kolonu
    for (let column = 0; column < 16; column++) {
      let file, rank;
      file = column;
      rank = row;
      //inicijliziraj polja
      let square = rank * 16 + file;

      if ((square & 0x88) == 0)
        // oboji polja na ploci
        chessBoard +=
          '<td align="center" width="65" height="65" style="font-size: 45px;" id="' +
          square +
          '"bgcolor="' +
          ((column + row) % 2 ? '#7EA3B6' : '#D8E3E7') +
          '"  ' +
          ' onclick="playerMove(this.id)">' +
          pieces[board[square] & 15] +
          '</td>';
    }
    chessBoard += '</tr>';
  }
  chessBoard += '</table>';
  // renderuj plocu
  document.getElementById('board').innerHTML = chessBoard;
}
// input
function clearContent(elementID) {
  document.getElementById(elementID).innerHTML = '';
}
function playerMove(sq) {
  let clickSquare = parseInt(sq, 10);

  // ako igrac klikne na početno polje
  if (!selectPiece && board[clickSquare]) {
    for (let square = 0; square < 128; square++)
      if ((square & 0x88) == 0)
        document.getElementById(square).classList.remove('hl');
    // naznaci odabranu figuru
    document.getElementById(clickSquare).classList.add('hl');
    // resetuj listu poteza
    potentialLegalMoves = [];
    // provjeri validnost poteza
    alfaBeta(onMove, -10000, 10000, 1, true);

    // naznaci moguce poteza sa odabranom figurom
    for (let moveIndex = 0; moveIndex < potentialLegalMoves.length; moveIndex++)
      if (clickSquare == potentialLegalMoves[moveIndex][0])
        document
          .getElementById(potentialLegalMoves[moveIndex][1])
          .classList.add('hl');
    playerEndSquare = clickSquare;
    selectPiece ^= 1;
  }

  // ako igrač klikne na konačno polje
  else if (selectPiece) {
    let boardCopy = JSON.stringify(board);

    // // kolona i red konačnog polja
    let column = playerEndSquare & 7;
    let row = playerEndSquare >> 4;
    //figura se pomjerila sa startnog polja na konačno
    board[clickSquare] = board[playerEndSquare];
    board[playerEndSquare] = 0;

    if (
      (board[clickSquare] == 9 && clickSquare >= 0 && clickSquare <= 7) ||
      (board[clickSquare] == 18 && clickSquare >= 112 && clickSquare <= 119)
    )
      board[clickSquare] |= 7; // promjeni pijuna u kraljicu

    // promjeni stranu koja igra potez
    onMove = 24 - onMove;

    selectPiece ^= 1;

    // legalan potez
    if (
      clickSquare == playerEndSquare ||
      document.getElementById(clickSquare).classList.value != 'hl' ||
      alfaBeta(onMove, -10000, 10000, 2) == Math.abs(10000)
    ) {
      takeBack(boardCopy);
      return;
    }
    clearContent('text');
    // update poziciju na tabli
    drawBoard();

    // naznaci zadnji potez
    document.getElementById(clickSquare).classList.add('hl');
    let newDiv = document.querySelector('#text');
    let tex = document.createTextNode('BLACK ON MOVE');

    newDiv.appendChild(tex);
    setTimeout(function () {
      clearContent('text');
      let tex1 = document.createTextNode('WHITE ON MOVE');
      newDiv.appendChild(tex1);
    }, 1000);
    // kompijuter igra potez
    setTimeout(function () {
      engineMove(searchDepth);
    }, 1000);
  }
}

// nelegalan potez
function takeBack(boardCopy) {
  board = JSON.parse(boardCopy);

  //promjeni stranu koja je na potezu
  onMove = 24 - onMove;

  for (let square = 0; square < 128; square++)
    if ((square & 0x88) == 0)
      document.getElementById(square).classList.remove('hl');
}

function engineMove(depth) {
  let score = alfaBeta(onMove, -10000, 10000, depth);
  drawBoard();
  // crni igrac je matiran
  if (score <= -9999) {
    drawBoard();
    for (let square = 0; square < 128; square++)
      if (board[square] == 19)
        document.getElementById(square).classList.add('mat');
    setTimeout(function () {
      window.alert('Checkmate.You Winn!!!');
    }, 10);

    // kraj
    return;
  }

  //pomakni crne figure
  board[bestEndSquare] = board[bestStartSquare];
  board[bestStartSquare] = 0;

  // promocija
  if (
    (board[bestEndSquare] == 9 && bestEndSquare >= 0 && bestEndSquare <= 7) ||
    (board[bestEndSquare] == 18 && bestEndSquare >= 112 && bestEndSquare <= 119)
  )
    board[bestEndSquare] |= 7;

  onMove = 24 - onMove;

  // bijeli igrac je matiran
  if (score >= 9998) {
    drawBoard();
    document.getElementById(bestEndSquare).classList.add('hl');

    for (let square = 0; square < 128; square++)
      if (board[square] == 11)
        document.getElementById(square).classList.add('mat');

    setTimeout(function () {
      window.alert('Checkmate.You Loose!!!');
    }, 10);

    // kraj
    return;
  } else {
    console.log(score);
    drawBoard();
    document.getElementById(bestEndSquare).classList.add('hl');
  }
}

drawBoard();

// nova igra
const btn = document.querySelector('.newG');

btn.addEventListener('click', function () {
  window.location.reload(true);
  history.go(1);
  window.location.href = window.location.href;
});
