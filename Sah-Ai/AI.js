// potraga najboljeg poteza alfa-beta prunining

function alfaBeta(onMove, alpha, beta, depth, maximizingPlayer) {
  if (depth == 0) {
    let score = 0;

    for (let square = 0; square < 128; square++) {
      if ((square & 0x88) == 0) {
        let piece = board[square];

        if (piece) {
          // vrijednost figure
          score += pieceValue[piece & 15];
          // vrijednost pozicije
          piece & 8
            ? (score += board[square + 8])
            : (score -= board[square + 8]);
        }
      }
    }
    // vraća pozitivan score za bijelog a negativan za crnog
    return onMove == 8 ? score : -score;
  }

  let previousAlpha = alpha; //ubacuje bolji potez ako ga nađe
  let possibleBestStartSquare;
  let possibleBestEndSquare;
  let score = -10000; // početni skor za crnog igrača u alfabeta pretragi (-∞)

  let startSquare;
  let endSquare;
  let capturedSquare;
  let capturedPiece;
  let piece;
  let pieceType;
  let directions;
  let moveDirection;

  // generisanje poteza
  for (let square = 0; square < 128; square++) {
    if ((square & 0x88) == 0) {
      startSquare = square;

      piece = board[square];

      if (piece & onMove) {
        pieceType = piece & 7;

        directions = moveOffsets[pieceType + 30];

        while ((moveDirection = moveOffsets[++directions])) {
          endSquare = startSquare;

          do {
            endSquare += moveDirection;

            capturedSquare = endSquare;

            if (endSquare & 0x88) break;

            capturedPiece = board[capturedSquare];

            if (capturedPiece & onMove) break;

            if (pieceType < 3 && !(moveDirection & 7) != !capturedPiece) break;

            // vrijednost evaluacije u slucaju sahmata
            if ((capturedPiece & 7) == 3) return 10000 - halfMove;

            if (maximizingPlayer)
              potentialLegalMoves.push([startSquare, endSquare]);

            // napravi potez
            board[capturedSquare] = 0;

            board[startSquare] = 0;

            board[endSquare] = piece;

            if (pieceType < 3) {
              if ((endSquare + moveDirection + 1) & 0x80) board[endSquare] |= 7;
            }

            // negamax pretraga koja se ponavlja u svim iteracijama

            halfMove++;

            score = -alfaBeta(24 - onMove, -beta, -alpha, depth - 1);

            halfMove--;

            // ponovi potez
            board[endSquare] = 0;
            board[startSquare] = piece;
            board[capturedSquare] = capturedPiece;

            bestStartSquare = startSquare;
            bestEndSquare = endSquare;

            // nalazi bolji potez
            if (score > alpha) {
              // bolji potez koji odbacuje granu prilikom pretrage
              if (score >= beta) return beta;

              alpha = score;

              // najbolji potez u grani
              possibleBestStartSquare = startSquare;
              possibleBestEndSquare = endSquare;
            }

            // slucaj kada skakac preskace figure
            capturedPiece += pieceType < 5;

            // dupli skok piuna
            if ((pieceType < 3) & (6 * onMove + (endSquare & 0x70) == 0x80))
              capturedPiece--;
          } while (capturedPiece == 0);
        }
      }
    }
  }

  // najbolja vrijednost evaluacije se pridaju najboljem potezu

  if (alpha != previousAlpha) {
    bestStartSquare = possibleBestStartSquare;
    bestEndSquare = possibleBestEndSquare;
  }

  // nije naden bolji potez
  return alpha;
}
