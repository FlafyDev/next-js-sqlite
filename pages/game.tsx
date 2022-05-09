import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Game.module.css";
import { genSSP, PageProps } from "../lib/genSSP";

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
  const numberOfBoxes = 8;
  const boxColors = [
    "#000000",
    "#FFFFFF"
  ]

  // Initialize board
  useEffect(() => {
    if (!canvas.current) {
      return;
    }
    const ctx = canvas.current.getContext("2d")!;
    const size = canvas.current.width;

    for (let x = 0; x < numberOfBoxes; x++) {
      for (let y = 0; y < numberOfBoxes; y++) {
        ctx.beginPath();
        ctx.rect(x/numberOfBoxes*size, y/numberOfBoxes*size, size/numberOfBoxes, size/numberOfBoxes);
        ctx.fillStyle = boxColors[(x+y)%2];
        ctx.fill();
        ctx.closePath();
      }
    }
  }, [canvas]);

  const onCanvasMouseClick = (position: Position) => {
    console.log("CLICK!");
  }

  const onCanvasMouseMove = (position: Position) => {
    console.log(position);
  }

  const _calcMousePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    return new Position(e.pageX - e.currentTarget.getBoundingClientRect().left, e.pageY - e.currentTarget.getBoundingClientRect().top);
  }

  return (
    <div className={styles.canvasContainer}>
      <canvas id="myCanvas" ref={canvas} width={canvasSize} height={canvasSize}
        onClick={(e) => onCanvasMouseClick(_calcMousePos(e))}
        onMouseMove={(e) => onCanvasMouseMove(_calcMousePos(e))}>
      </canvas>
    </div>
  );
};

class Position {
  constructor(public x: number, public y: number) {}
}

export const getServerSideProps = genSSP();
export default Game;
