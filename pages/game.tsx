import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Game.module.css";
import { genSSP, PageProps } from "../lib/genSSP";
import pieces, { Piece } from "../lib/chess/pieces";
import {
  chessBoardGenerator,
  ColoredPiece,
  piecesOriginalSorting,
} from "../lib/chess/chessBoard";
import { isEqual } from "lodash-es";
import { apiGameReward } from "../lib/apiCommunicator";

const Game: React.FC<PageProps> = (props) => {
  useEffect(
    () =>
      props.addBackground(
        `linear-gradient(135deg, rgb(163, 185, 255) 0%, rgba(29, 185, 181, 1) 41%, rgb(49, 147, 142) 100%)`
      ),
    []
  );
  const canvas = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(600);
  const squareColors = ["#5e3a10", "#e6b277"];
  const [board, setBoard] = useState<ColoredPiece[][]>(chessBoardGenerator());
  const [sizeOfGrid, setSizeOfGrid] = useState(canvasSize / board.length);
  const [holdingPiece, setHolding] = useState<ColoredPiece>(
    new ColoredPiece(Piece.none, "white")
  );
  const [mousePos, setMousePos] = useState(new Position(0, 0));
  const [winText, setWinText] = useState("");
  const [hints, setHints] = useState(0);
  const [switches, setSwitches] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const checkWin = () => {
    // return board[0][0].piece === Piece.pawn;
    return (
      isEqual(
        board[0],
        piecesOriginalSorting.top[0].map(
          (piece) => new ColoredPiece(piece, "black")
        )
      ) &&
      isEqual(
        board[1],
        piecesOriginalSorting.top[1].map(
          (piece) => new ColoredPiece(piece, "black")
        )
      ) &&
      isEqual(
        board[board.length - 2],
        piecesOriginalSorting.bottom[1].map(
          (piece) => new ColoredPiece(piece, "white")
        )
      ) &&
      isEqual(
        board[board.length - 1],
        piecesOriginalSorting.bottom[0].map(
          (piece) => new ColoredPiece(piece, "white")
        )
      )
    );
  };

  const renderPiece = (
    piece: ColoredPiece,
    position: Position,
    zIndex: number = 0
  ) => {
    return piece.piece === Piece.none ? null : (
      <svg
        style={{
          zIndex,
          position: "absolute",
          inset: 0,
          left: position.x,
          top: position.y,
          pointerEvents: "none",
        }}
        width={sizeOfGrid}
        height={sizeOfGrid}
      >
        <image
          href={pieces.get(piece.piece)?.[piece.color].htmlData}
          width={sizeOfGrid}
          height={sizeOfGrid}
        />
      </svg>
    );
  };

  useEffect(() => {
    if (showHint) {
      setHints(hints + 1);

      setTimeout(() => {
        setShowHint(false);
      }, 5000);
    }
  }, [showHint]);

  const draw = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    mousePos: Position,
    isClicking: boolean
  ) => {
    const size = canvas.width; // Square
    const mouseGridPos = new Position(
      Math.floor(mousePos.y / sizeOfGrid),
      Math.floor(mousePos.x / sizeOfGrid)
    );
    const mouseInsideCanvas = !(
      mousePos.x < 0 ||
      mousePos.x > size ||
      mousePos.y < 0 ||
      mousePos.y > size
    );

    // Clear board
    ctx.clearRect(0, 0, size, size);

    // Draw board
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board.length; y++) {
        ctx.beginPath();
        ctx.rect(
          (x / board.length) * size,
          (y / board.length) * size,
          size / board.length,
          size / board.length
        );
        ctx.fillStyle = squareColors[(x + y) % 2];
        ctx.fill();
        ctx.closePath();
      }
    }

    if (isClicking && mouseInsideCanvas) {
      const currentPiece = board[mouseGridPos.x][mouseGridPos.y];
      if (holdingPiece.piece === Piece.none) {
        setHolding(currentPiece);
        board[mouseGridPos.x][mouseGridPos.y] = holdingPiece;
      } else {
        setSwitches(switches + 1);
        board[mouseGridPos.x][mouseGridPos.y] = holdingPiece;
        setHolding(currentPiece);
      }

      (async () => {
        if (checkWin()) {
          const details = await apiGameReward(hints, switches);
          if (details) {
            setWinText(
              `You won with ${hints} hints and ${switches} switches!\nYou got ${details.pointsReceived} points and now have ${details.currentPoints} points in total.`
            );
            setHolding(new ColoredPiece(Piece.none, "white"));
            setBoard(chessBoardGenerator());
          }
          setHints(0);
          setSwitches(0);
        }
      })();
    }
  };

  // Initialize board
  useEffect(() => {
    if (!canvas.current) {
      return;
    }

    draw(
      canvas.current.getContext("2d")!,
      canvas.current,
      new Position(0, 0),
      false
    );
  }, [canvas]);

  const onCanvasMouseClick = (position: Position) => {
    if (!canvas.current) {
      return;
    }

    draw(canvas.current.getContext("2d")!, canvas.current, position, true);
  };

  const onCanvasMouseMove = (position: Position) => {
    if (!canvas.current) {
      return;
    }

    setMousePos(
      new Position(
        position.x + canvas.current.offsetLeft - sizeOfGrid / 2,
        position.y + canvas.current.offsetTop - sizeOfGrid / 2
      )
    );
    draw(canvas.current.getContext("2d")!, canvas.current, position, false);
  };

  return (
    <div className={styles.canvasContainer}>
      <div className={styles.instructions}>
        {"Organize the board to how it starts"}
      </div>
      {winText ? (
        <div className={styles.winTextContainer} onClick={() => setWinText("")}>
          <div>{winText}</div>
        </div>
      ) : null}
      {showHint ? (
        <div className={styles.winTextContainer}>
          <img src="/completedBoard.png"></img>
        </div>
      ) : null}
      <canvas
        id="myCanvas"
        ref={canvas}
        width={canvasSize}
        height={canvasSize}
        onClick={(e) => onCanvasMouseClick(_calcMousePos(e))}
        onMouseMove={(e) => onCanvasMouseMove(_calcMousePos(e))}
      ></canvas>
      <div style={{ margin: "10px 0 -10px 0" }}>{`Hints taken: ${hints}`}</div>
      <div
        style={{ margin: "10px 0 -10px 0" }}
      >{`Switches done: ${switches}`}</div>
      <div
        className={styles.hintButton}
        onClick={() => {
          if (!showHint && holdingPiece.piece === Piece.none) {
            setShowHint(true);
          }
        }}
      >
        <div>{"Take hint"}</div>
      </div>
      {holdingPiece ? renderPiece(holdingPiece, mousePos, 100) : null}
      {canvas.current
        ? board.map((_, x) =>
            board[x].map((_, y) => {
              return renderPiece(
                board[x][y],
                new Position(
                  canvas.current!.offsetLeft + y * sizeOfGrid - 1,
                  canvas.current!.offsetTop + x * sizeOfGrid - 1
                )
              );
            })
          )
        : null}
    </div>
  );
};

class Position {
  constructor(public x: number, public y: number) {}
}

const _calcMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  return new Position(
    e.pageX - e.currentTarget.getBoundingClientRect().left,
    e.pageY - e.currentTarget.getBoundingClientRect().top
  );
};

const _drawInlineSVG = async (piece: Piece, ctx: CanvasRenderingContext2D) =>
  new Promise<void>((resolve, reject) => {
    var img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.onerror = () => {
      reject();
    };
    img.src = pieces.get(piece)?.black?.htmlData ?? "";
  });

export const getServerSideProps = genSSP();
export default Game;
