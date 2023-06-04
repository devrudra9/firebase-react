import React, { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { db } from "./config/firebase";
import { getDocs, collection, addDoc, deleteDoc, doc } from "firebase/firestore";

function App() {
    const [movieList, setMovieList] = useState([]);

    const [newMovieTitle, setNewMovieTitle] = useState("");
    const [newMovieActor, setNewMovieActor] = useState("");
    const [newReleaseDate, setNewReleaseDate] = useState(0);
    const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

    const moviesCollectionRef = collection(db, "movies");

    
    

    const onSubmitMovie =async () => {
        try {
            await addDoc(moviesCollectionRef, {
                title: newMovieTitle,
                leadActor: newMovieActor,
                realeaseDate: newReleaseDate,
                wonOscar: isNewMovieOscar
            });
        } catch (err) {
            console.error(err);
        }
    }

    const deleteMovie = async (id) => {
        const movieDoc = doc(db, "movies", id)
        await deleteDoc(movieDoc);
    }
    
    useEffect( () => {
        const getMovieList = async () => {
            try {
                const data = await getDocs(moviesCollectionRef);
                const filteredData = data.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id
                }));
                setMovieList(filteredData);
            } catch (err) {
                console.error(err);
            }
        };    

        getMovieList();
    }, [onSubmitMovie])

    return (
        <div className="App">
            <Auth />

            <div>
                <input 
                    placeholder="Movie Title..." 
                    onChange={(e) => setNewMovieTitle(e.target.value)}
                />
                <input 
                    placeholder="Movie Lead Actor..." 
                    onChange={(e) => setNewMovieActor(e.target.value)}
                />
                <input 
                    type="number" 
                    placeholder="Release Date..." 
                    onChange={(e) => setNewReleaseDate(Number(e.target.value))} 
                />
                <input 
                    type="checkbox" 
                    checked={isNewMovieOscar} 
                    onChange={(e) => setIsNewMovieOscar(e.target.checked)}
                />
                <label> Received an Oscar</label>
                <button onClick={onSubmitMovie}> Submit Movie </button>
            </div>

            <div>
                {movieList.map((movie) => (
                    <div>
                        <h1 style={{color: movie.wonOscar ? "green" : "red"}}>
                            {movie.title}
                        </h1>
                        <p>
                            Release Date: {movie.realeaseDate}
                        </p>
                        <p>
                            Lead Actor: {movie.leadActor}
                        </p>
                        <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
