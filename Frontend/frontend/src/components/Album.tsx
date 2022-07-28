import React, { useEffect } from "react";
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
    useEffect(()=> {
        fetch(prop.path).then(res => res.json()).then(data => {
            setAlbums(data);
        });
    }, []);
    return (
        <div>
            {albums.map(album => {
                return (
                    <div>
                        <h1>{album.title}</h1>
                        <h2>{album.artist}</h2>
                        <h3>{album.price}</h3>
                    </div>
                );
            }
            )}
        </div>
    );
}