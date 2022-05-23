import rawPiecesSvg from "./rawPiecesSvg";

export enum Piece {
  none,
  pawn,
  knight,
  bishop,
  rook,
  queen,
  king,
}

export class PieceSvg {
  public htmlData: string;
  constructor(svgRaw: string) {
    this.htmlData =
      "data:image/svg+xml; charset=utf8, " + encodeURIComponent(svgRaw);
  }
}

const pieces = new Map<Piece, { black: PieceSvg; white: PieceSvg }>([
  [
    Piece.pawn,
    {
      black: new PieceSvg(rawPiecesSvg.pawnBlack),
      white: new PieceSvg(rawPiecesSvg.pawnWhite),
    },
  ],
  [
    Piece.knight,
    {
      black: new PieceSvg(rawPiecesSvg.knightBlackSvg),
      white: new PieceSvg(rawPiecesSvg.knightWhiteSvg),
    },
  ],
  [
    Piece.bishop,
    {
      black: new PieceSvg(rawPiecesSvg.bishopBlackSvg),
      white: new PieceSvg(rawPiecesSvg.bishopWhiteSvg),
    },
  ],
  [
    Piece.rook,
    {
      black: new PieceSvg(rawPiecesSvg.rookBlackSvg),
      white: new PieceSvg(rawPiecesSvg.rookWhiteSvg),
    },
  ],
  [
    Piece.queen,
    {
      black: new PieceSvg(rawPiecesSvg.queenBlackSvg),
      white: new PieceSvg(rawPiecesSvg.queenWhiteSvg),
    },
  ],
  [
    Piece.king,
    {
      black: new PieceSvg(rawPiecesSvg.kingBlackSvg),
      white: new PieceSvg(rawPiecesSvg.kingWhiteSvg),
    },
  ],
]);

export default pieces;
