const movieSearchBox = document.getElementById('movie_search_box');
const searchList = document.getElementById('search_list');
const resultGrid = document.getElementById('result_grid');

//load movies from API
async function loadMovies(searchTerm) {
    const Url = `http://www.omdbapi.com/?s=${searchTerm}&page=1&apikey=${process.env.apikey}`;
    const res = await fetch(`${Url}`);
    const data = await res.json();
    if(data.Response === 'True') {
        displayMovieList(data.Search)
    };
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if(searchTerm.length > 0) {
        searchList.classList.remove('hide_search_list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide_search_list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = '';
    for(let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; //setting movie id in data-id
        movieListItem.classList.add('search_list_item');
        if(movies[idx].Poster !== "N/A") {
            moviePoster = movies[idx].Poster;
        } else {
            moviePoster = "image_not_found.jpg";
        }

        movieListItem.innerHTML = `<div class="search_item_thumbnail">
                                    <img src="${moviePoster}" alt="movie poster">
                                </div>
                                <div class="search_item_info">
                                    <h3>${movies[idx].Title}</h3>
                                    <p>${movies[idx].Year}</p>
                                </div>`;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search_list_item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async() => {
            //console.log(movie.dataset.id)
            searchList.classList.add('hide_search_list');
            movieSearchBox.value = '';
            const result = await fetch(`http://omdbapi.com/?i=${movie.dataset.id}&apikey=31b7842c`);
            const movieDetails = await result.json();
            console.log(movieDetails);
            displayMovieDetails(movieDetails);
        })
    })
}

function displayMovieDetails(details) {
    resultGrid.innerHTML = `<div class="movie_poster">
                                <img src="${(details.Poster !== 'N/A') ? details.Poster : 'image_not_found.jpg'}" alt="movie poster">
                            </div>
                            <div class="movie_info">
                                <h3 class="movie_title">${details.Title}</h3>
                                <ul class="movie_misc_info">
                                    <li class="year">${details.Year}</li>
                                    <li class="rated">Ratings: ${details.Rated}</li>
                                    <li class="released">Released: ${details.Released}</li>
                                </ul>
                                <p class="genre"><b>Genre :</b> ${details.Genre}</p>
                                <p class="writer"><b>Writers :</b> ${details.Writer}</p>
                                <p class="actors"><b>Actors : </b> ${details.Actors}</p>
                                <p class="plot">${details.Plot}</p>
                                <p class="language"><b>Language :</b> ${details.Language}</p>
                                <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
                            </div>`;
}

window.addEventListener('click', (e) => {
    if(e.target.className !== "form_control") {
        searchList.classList.add('hide_search_list');
    }
})