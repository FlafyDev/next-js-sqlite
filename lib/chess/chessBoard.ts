import { random } from "lodash-es";
import shuffleArray from "../../utils/shuffleArray";
import { Piece } from "./pieces";

export class ColoredPiece {
  constructor(public piece: Piece, public color: "white" | "black") {}
}

export const piecesOriginalSorting: { top: Piece[][]; bottom: Piece[][] } = {
  top: [
    [
      Piece.rook,
      Piece.knight,
      Piece.bishop,
      Piece.queen,
      Piece.king,
      Piece.bishop,
      Piece.knight,
      Piece.rook,
    ],
    new Array(8).fill(Piece.pawn),
  ],

  bottom: [
    [
      Piece.rook,
      Piece.knight,
      Piece.bishop,
      Piece.queen,
      Piece.king,
      Piece.bishop,
      Piece.knight,
      Piece.rook,
    ],
    new Array(8).fill(Piece.pawn),
  ],
};

// Generates a board with the pieces located randomally.
export const chessBoardGenerator = () => {
  const board: ColoredPiece[][] = [];
  const size = 8;

  // Initialize an empty board of size: $size x $size
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = new ColoredPiece(Piece.none, "white");
    }
  }

  const piecesToPlace = piecesOriginalSorting.top
    .flat()
    .map((piece) => new ColoredPiece(piece, "white"))
    .concat(
      piecesOriginalSorting.bottom
        .flat()
        .map((piece) => new ColoredPiece(piece, "black"))
    );
  shuffleArray(piecesToPlace);
  piecesToPlace.forEach((piece) => {
    while (true) {
      const x = random(0, 7, false);
      const y = random(0, 7, false);

      if (board[x][y].piece === Piece.none) {
        board[x][y] = piece;
        break;
      }
    }
  });

  return board;
};
