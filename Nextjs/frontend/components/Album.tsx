import React from "react";

interface inputAlbum {
    id : number,
    title : string,
    artist : string,
    price : number,
}

export type pathProp = {
    path : string,
    key : string
}

export default function Album(prop: pathProp) {
    //const [albums, setAlbums] = React.useState<inputAlbum[]>([]);
    let album :inputAlbum = {
        artist: "Test",
        id: 1,
        price: 1,
        title: "Another test",
    }
    // fetch(prop.path).then(res => res.json()).then(data => {
    //     console.log(data);
    //     //setAlbums(data);
    //     album.id = data.id;
    // });
    fetch("http://backend:8081").then(res => res.json()).then(data => console.log(data));
    return (
        // <div key={prop.key}>
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
            <h1>
                {album.id}
            </h1>
            <h2>
                {album.title}
            </h2>
            <h2>
                {album.artist}
            </h2>
            <h2>
                {album.price}
            </h2>
        </div>
    );
}