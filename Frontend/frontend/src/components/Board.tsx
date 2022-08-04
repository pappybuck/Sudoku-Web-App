import React, {useEffect, useRef} from "react";
import Cell from "./Cell";
import '../Board.css';
import { Button } from "@material-tailwind/react";
export default function Board() {
    const fetched = useRef(false);
    const [board, setBoard] = React.useState<[number, boolean][]>([]);
    const [quizNumber, setQuizNumber] = React.useState<number>(0);
    useEffect(() => {
        document.title = "Sudoku";
        if (!fetched.current) {
            fetched.current = true;
            fetch("http://localhost:8081/getRandom").then(res => res.json()).then(data => {
                setQuizNumber(data.id);
                for (let i = 0; i < data.quiz.length; i++) {
                    setBoard(board => [...board, [+data.quiz[i], true]]);
                }
            });
        }
    }, []);

    function onUpdate(id: number, value: number) {
        const newBoard = [...board];
        newBoard[id] = [value, newBoard[id][1]];
        for (let i = 0; i < newBoard.length; i++) {
            newBoard[i][1] = true;
            if (newBoard[i][0] === 0) {
                newBoard[i] = [newBoard[i][0], true];
                continue;
            }
            let row_x: number[] = [];
            let col_y: number[] = [];
            let block: number[] = [];
            let x:number = i % 9;
            let y:number = Math.floor(i / 9);
            for (let j = 0; j < 9; j++) {
                row_x.push(newBoard[j * 9 + x][0]);
                col_y.push(newBoard[y * 9 + j][0]);
            }
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    block.push(newBoard[(y - y % 3 + j) * 9 + (x - x % 3 + k)][0]);
                }
            }
            let x_count = 0;
            let y_count = 0;
            let b_count = 0;
            for (let j = 0; j < 9; j++) {
                if (row_x[j] === newBoard[i][0]) {
                    x_count++;
                }
                if (col_y[j] === newBoard[i][0]) {
                    y_count++;
                }
                if (block[j] === newBoard[i][0]) {
                    b_count++; 
                }
            }
            if (x_count > 1 || y_count > 1 || b_count > 1) {
                newBoard[i][1] = false;
            }
        }
        setBoard(newBoard);
    }


    if (board.length === 0) {
        return <div><h1>Loading...</h1></div>;
    }
    return (
        <div className="Board">
            <div>
                <h1 className="text-6xl">
                    Sudoku Board # {quizNumber}
                </h1>
            </div>
            <ul>
                {board.map((cell, i) => (
                    <li>
                        < Cell id={i} value={cell[0]} valid={cell[1]} onUpdate={onUpdate}/>
                    </li>
                ))}
            </ul>
            <Button onClick={() => {
                if (board.every(cell => +cell[0] !== 0)) {
                    fetch("http://localhost:8081/check", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            quiz: board.map(cell => cell[0]).join(""),
                            solution: "Calculating..."
                        })
                    }).then(res => res.json()).then(data => {
                        alert(data.solution);
                    }
                    );
                } else {
                    fetch("http://localhost:8081/solve", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            quiz: board.map(cell => cell[0]).join(""),
                            solution: "Calculating..."
                        })
                    }).then(res => res.json()).then(data => {
                        alert(data.solution);
                    }
                    );
                }
            }
            }>Solve</Button>
        </div>
    );
}
