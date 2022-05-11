import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Game.module.css";
import { genSSP, PageProps } from "../lib/genSSP";

enum Piece {
  none,
  pown,
}

const Game: React.FC<PageProps> = (
  props
) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(135deg, rgb(163, 185, 255) 0%, rgba(29, 185, 181, 1) 41%, rgb(49, 147, 142) 100%)`
      ),
    []
  );
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(600);
  const squareColors = [
    "#5e3a10",
    "#e6b277"
  ];
  const board: Piece[][] = [
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [sizeOfGrid, setSizeOfGrid] = useState(canvasSize / board.length);
  const [holdingPiece, setHolding] = useState<Piece | null>(null);
  const [mousePos, setMousePos] = useState(new Position(0, 0));

  const draw = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mousePos: Position, isClicking: boolean) => {
    const size = canvas.width; // Square
    const mouseGridPos = new Position(Math.floor(mousePos.x / sizeOfGrid), Math.floor(mousePos.y / sizeOfGrid));
    const mouseInsideCanvas = !(
      mousePos.x < 0 || mousePos.x > size ||
      mousePos.y < 0 || mousePos.y > size
    );

    // Clear board
    ctx.clearRect(0, 0, size, size);

    // Draw board
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {
        ctx.beginPath();
        ctx.rect(x/board.length*size, y/board.length*size, size/board.length, size/board.length);
        ctx.fillStyle = squareColors[(x+y)%2];
        ctx.fill();
        ctx.closePath();
      }
    }

    if (isClicking && mouseInsideCanvas) {
      if (holdingPiece) {
        board[mouseGridPos.x][mouseGridPos.y] = holdingPiece;
        setHolding(null);
      } else {
        if (board[mouseGridPos.x][mouseGridPos.y] != Piece.none) {
          setHolding(board[mouseGridPos.x][mouseGridPos.y]);
          board[mouseGridPos.x][mouseGridPos.y] = Piece.none;
        }
      }
    }

    // Draw pieces
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {

        drawPiece(ctx, board[x][y], new Position(x * sizeOfGrid, y * sizeOfGrid));
      }
    }

  }

  // Initialize board
  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    draw(canvas.current.getContext("2d")!, canvas.current, new Position(0, 0), false);
  }, [canvas]);

  const onCanvasMouseClick = (position: Position) => {
    if (!canvas.current) {
      return;
    }

    draw(canvas.current.getContext("2d")!, canvas.current, position, true);
  }

  const onCanvasMouseMove = (position: Position) => {
    if (!canvas.current) {
      return;
    }
    
    console.log(canvas.current.clientLeft);
    setMousePos(new Position(position.x + canvas.current.offsetLeft - sizeOfGrid/2, position.y + canvas.current.offsetTop - sizeOfGrid/2));
    draw(canvas.current.getContext("2d")!, canvas.current, position, false);
  }

  return (
    <div className={styles.canvasContainer}>
      <canvas id="myCanvas" ref={canvas} width={canvasSize} height={canvasSize}
        onClick={(e) => onCanvasMouseClick(_calcMousePos(e))}
        onMouseMove={(e) => onCanvasMouseMove(_calcMousePos(e))}>
      </canvas>
      {
        holdingPiece ? <svg style={{
          position: "absolute",
          inset: 0,
          left: mousePos.x,
          top: mousePos.y,
          pointerEvents: "none",
        }}  width={sizeOfGrid} height={sizeOfGrid}>    
          <image xlinkHref={piecesSvgs[holdingPiece]} width={sizeOfGrid} height={sizeOfGrid}/>
        </svg> : null
      }
    </div>
  );
};

class Position {
  constructor(public x: number, public y: number) {}
}

const _calcMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  return new Position(e.pageX - e.currentTarget.getBoundingClientRect().left, e.pageY - e.currentTarget.getBoundingClientRect().top);
}

const drawPiece = (ctx: CanvasRenderingContext2D, piece: Piece, pos: Position) => {
  switch (piece) {
    case Piece.none:
      break;
    case Piece.pown:
      ctx.beginPath();
      ctx.rect(pos.x, pos.y, 16, 16);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();
      break;
  }
}

const piecesSvgs: {[piece in Piece]: string} = {
  [Piece.none]: "",
  [Piece.pown]: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
}

export const getServerSideProps = genSSP();
export default Game;
