import React from "react";
import axios from 'axios'; 
interface inputAlbum {
    id : number,
    title : string,
    artist : string,
    price : number,
}

type pathProp = {
    path : string
}

export default function Album(prop: pathProp) {
    const [albums, setAlbums] = React.useState<inputAlbum[]>([]);
    // fetch(prop.path).then(res => res.json()).then(data => {
    //     console.log(data);
    //     setAlbums(data);
    // });
    // fetch('http://backend:8081').then( res => {
    //     console.log(res.json());
    // });
    axios.get(prop.path).then(
        res => {
            console.log(res.data())
        }
    )
    return (
        // <div>
        //     {albums.map(album => {
        //         return (
        //             <div>
        //                 <h1>{album.title}</h1>
        //                 <h2>{album.artist}</h2>
        //                 <h3>{album.price}</h3>
        //             </div>
        //         );
        //     }
        //     )}
        // </div>
        <div>
            <div>
                Test
            </div>
        </div>
    );
}