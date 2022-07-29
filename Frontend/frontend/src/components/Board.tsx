import React, {useEffect, useRef} from "react";
import Cell from "./Cell";


export default function Board() {
    const fetched = useRef(false);
    const [board, setBoard] = React.useState<number[][]>([]);
    useEffect(() => {
        if (!fetched.current) {
            fetched.current = true;
            fetch("http://localhost:8081/all").then(res => res.json()).then(data => {
                for (let i = 0; i < 9; i++) {
                    let row: number[] = [];
                    for (let j = 0 ; j < 9; j++) {
                        row.push(data.quiz[i*9+j]);
                    }
                    setBoard(board => [...board, row]);
                }  
            });
        }
    }, []);
    if (board.length === 0) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <table>
                <tbody>
            {board.map((row, i) => {
                return (
                    <tr key={i}>
                        {row.map((cell, j) => {
                            return (
                                <td key={j}>
                                    {(cell === 0) 
                                        ? <Cell id={i*9+j} value={cell} readonly={false}/>
                                        : <Cell id={i*9+j} value={cell} readonly={true}/>
                                    }
                                </td>
                            )
                        })}
                    </tr>
                );
            }
            )}
                </tbody>
            </table>
        </div>
    );
}
