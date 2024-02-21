import { useState } from "react";

function Square({ value, onSquareClick, isWinner }) {
    return (
        <button
            className={`square ${isWinner ? "winner" : ""}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    function handleClick(i) {
        if (squares[i]) {
            return;
        }
        if (calculateWinner(squares)) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = "Winner: " + winner.winner;
    } else {
        
        status = "Next player: " + (xIsNext ? "X" : "O");
        if (!squares.includes(null)) {
            status = "Draw!";
        }
    }

    function handleIsWinner(index) {
        if (winner) {
            return winner.lines.includes(index);
        }
    }

    function calcRow(i) {
        // 0 = 012
        // 1 = 345
        // 2 = 678
        // i = i*3

        let row = [];
        for (let index = 0; index < 3; index++) {
            row.push(
                <Square
                    key={i + index}
                    value={squares[i + index]}
                    onSquareClick={() => handleClick(i + index)}
                    isWinner={handleIsWinner(i + index)}
                />
            );
        }
        return row;
    }

    const table = [];
    for (let index = 0; index < 3; index++) {
        table.push(
            <div key={index} className="board-row">
                {calcRow(index * 3)}
            </div>
        );
    }

    return (
        <>
            <div className="status">{status}</div>
            {table}
        </>
    );
}

export default function Game() {
    const [history, setHisory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [reverse, setReverse] = useState(false);
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHisory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((_squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to start game";
        }
        if (move == currentMove) {
            description = "You are at move #" + move;
            return (
                <li key={move}>
                    <div
                        className="button current"
                        onClick={() => {
                            jumpTo(move);
                        }}
                    >
                        {description}
                    </div>
                </li>
            );
        }
        return (
            <li key={move}>
                <button
                    className="button"
                    onClick={() => {
                        jumpTo(move);
                    }}
                >
                    {description}
                </button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board
                    xIsNext={currentMove % 2 ? false : true}
                    squares={currentSquares}
                    onPlay={handlePlay}
                />
            </div>
            <div className="game-info">
                <button className="button" onClick={() => setReverse(!reverse)}>
                    toggle
                </button>
                <ol
                    style={
                        reverse
                            ? {
                                  display: "flex",
                                  flexDirection: "column-reverse",
                              }
                            : null
                    }
                >
                    {moves}
                </ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return {
                winner: squares[a],
                lines: lines[i],
            };
        }
    }
    return null;
}
