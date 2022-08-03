import React, {useEffect, useRef} from "react";
import Cell from "./Cell";
import '../Board.css';

export default function Board() {
    const fetched = useRef(false);
    const [board, setBoard] = React.useState<number[]>([]);
    const [quizNumber, setQuizNumber] = React.useState<number>(0);
    useEffect(() => {
        document.title = "Sudoku";
        if (!fetched.current) {
            fetched.current = true;
            fetch("http://localhost:8081/getRandom").then(res => res.json()).then(data => {
                setQuizNumber(data.id);
                for (let i = 0; i < data.quiz.length; i++) {
                    setBoard(board => [...board, +data.quiz[i]]);
                }
            });
        }
    }, []);
    function onUpdate(id: number, value: number) : Number[] {
        let temp = [...board];
        temp[id] = value;
        setBoard(temp);
        return temp;
    }
    if (board.length === 0) {
        return <div><h1>Loading...</h1></div>;
    }
    return (
        <div className="Board">
            <div>
                <h1>
                    Sudoku Board # {quizNumber}
                </h1>
            </div>
            <ul>
                {board.map((cell, i) => (
                    <li>
                        <Cell id={i} value={cell} onUpdate={onUpdate}/>
                    </li>
                ))}
            </ul>
            <button onClick={() => {
                console.log(board);
                if (board.every(cell => +cell !== 0)) {
                    fetch("http://localhost:8081/check", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            quiz: board.join(""),
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
                            quiz: board.join(""),
                            solution: "Calculating..."
                        })
                    }).then(res => res.json()).then(data => {
                        alert(data.solution);
                    }
                    );
                }
            }
            }>Solve</button>
        </div>
    );
}
