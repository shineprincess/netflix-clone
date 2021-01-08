import React,{ useState , useEffect } from 'react' ; //rfce
import axios from './axios';
import './Row.css';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url ="https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl , isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");


    useEffect(() => {
        // if [] run once when the row loads , dont run again 
        async function fetchData() {
            const request = await axios.get(fetchUrl); // sending requests to this URL 
            //"https://api.themoviedb.org/3",  `discover/tv?api_key=${API_KEY}&with_networks=213`,
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    //console.table(movies);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
        },
        autoplay:1,
    };

    const handleClick = (movie) => {
        if (trailerUrl) {  //if the vedio was already open and click thn settrailerurl to empty 
            setTrailerUrl("");
        }else {
            movieTrailer(movie?.name || movie?.title || movie?.original_name || "") //https://youtu.be/bh1eOQ7PU7M
            .then((url) => {
                const urlParams = new URLSearchParams(new URL(url).search );
                setTrailerUrl(urlParams.get("v"));
            })
            .catch((error) => console.log(error));
        }
    };
    
    return (
        <div className="row">
           <h2>{title}</h2>

           <div className= "row__posters">
                       {/*movies go through the arrray of movies in the console */}
                {movies.map( (movie )=> (
                    <img
                        key ={movie.id}
                         onClick={() => handleClick(movie)}
                        className = {`row__poster ${isLargeRow && "row__posterLarge"}`}
                        src ={`${base_url}${ 
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        } `} 
                        alt={movie.name}   //XtMThy8QKqU    //'KVZ-P-ZI6W4
                    />
                ))}           
           </div>
            {trailerUrl && <Youtube vedioId= {trailerUrl} opts={opts} /> }
        </div>
    );
};

export default Row;


