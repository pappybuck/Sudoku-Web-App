import React, { useEffect } from "react";

export default function Cell(props: {id: number, value: number, onUpdate: (id: number, value: number) => Number[]}) {
    const [valid , setValid] = React.useState<boolean>(true);
    const [value, setValue] = React.useState(props.value);
    const [isInitial, _] = React.useState(() => {
        return +props.value !== 0;
    })
    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = parseInt(e.target.value) % 10;
        if (+newValue >= 1 && +newValue <= 9) {
            setValue(newValue);
            if (+newValue === 0) {
                setValid(true);
                return;
            }
            const board = props.onUpdate(props.id, newValue);
            let row_x: Number[] = [];
            let col_y: Number[] = [];
            let block: Number[] = [];
            let x:number = props.id % 9;
            let y:number = Math.floor(props.id / 9);
            for (let i = 0; i < 9; i++) {
                row_x.push(+board[i * 9 + x]);
                col_y.push(+board[y * 9 + i]);
            }
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    block.push(+board[(y - y % 3 + i) * 9 + (x - x % 3 + j)]);
                }
            }
            let x_count = 0;
            let y_count = 0;
            let b_count = 0;
            for (let i = 0; i < 9; i++) {
                if (row_x[i] === newValue) {
                    x_count++;
                }
                if (col_y[i] === newValue) {
                    y_count++;
                }
                if (block[i] === newValue) {
                    b_count++;
                }
            }
            console.log(x_count, y_count, b_count);
            setValid(x_count <= 1 && y_count <= 1 && b_count <= 1);
        } else {
            setValue(0);
            setValid(true);
        }
    }
    if (isInitial) {
        return <input className="given" type="text" value={value} readOnly/>;
    }
    return (
        <input className={valid ? 'background-white' : 'background-red'} onChange={onChange} type="text" value={value} contentEditable={true} />
    )
}