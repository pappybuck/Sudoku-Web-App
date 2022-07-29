import React from "react";

export default function Cell(props: {id: number, value: number, readonly: boolean}) {
    if (props.readonly) {
        return (
            <input
                value={props.value}
                readOnly
            />
        )
        } else {
        return (
            <input
                value={props.value}
                onChange={(e) => {
                    console.log(e.target.value);
                }
                }
            />
        )
    }
}