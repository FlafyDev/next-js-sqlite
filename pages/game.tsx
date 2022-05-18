import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Game.module.css";
import { genSSP, PageProps } from "../lib/genSSP";
import pieces, { Piece } from "../lib/pieces";

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
  const [board, setBoard] = useState<Piece[][]>([
    [1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [sizeOfGrid, setSizeOfGrid] = useState(canvasSize / board.length);
  const [holdingPiece, setHolding] = useState<Piece | null>(null);
  const [mousePos, setMousePos] = useState(new Position(0, 0));

  const renderPiece = (piece: Piece, position: Position) => {
    return  <svg style={{
      position: "absolute",
      inset: 0,
      left: position.x,
      top: position.y,
      pointerEvents: "none",
    }} width={sizeOfGrid} height={sizeOfGrid}>    
      <image href={pieces.get(piece)?.black} width={sizeOfGrid} height={sizeOfGrid}/>
    </svg>
  };

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
        if (board[mouseGridPos.x][mouseGridPos.y] === Piece.none) {
          board[mouseGridPos.x][mouseGridPos.y] = holdingPiece;
          setHolding(null);
        }
      } else {
        if (board[mouseGridPos.x][mouseGridPos.y] != Piece.none) {
          setHolding(board[mouseGridPos.x][mouseGridPos.y]);
          board[mouseGridPos.x][mouseGridPos.y] = Piece.none;
        }
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
        holdingPiece ? renderPiece(holdingPiece, mousePos) : null
      }
      {
        board.map((_, x) => {
          return board[x].map((_, y) => {
            return renderPiece(board[x][y], new Position(canvas.current.cu x * sizeOfGrid, y * sizeOfGrid));
          });
        })
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

const _drawInlineSVG = async (piece: Piece, ctx: CanvasRenderingContext2D) => new Promise<void>((resolve, reject) => {
  var img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    resolve();
  };
  img.onerror = () => {
    reject();
  };
  img.src = pieces.get(piece)?.black ?? "";
})

export const getServerSideProps = genSSP();
export default Game;
