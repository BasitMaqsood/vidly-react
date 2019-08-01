import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMovies, deleteMovie } from '../services/movieServices';
import MoviesTable from './moviesTable';
import ListGroup  from './common/listGroup';
import Pagination from './common/pagination';
import { getGenres } from '../services/genreService';
import { paginate } from '../utils/paginate';
import Form from './common/form';
import _ from 'lodash';
import SearchBox from './common/searchBox';
import { async } from 'q';


class Movies extends Form {

    state = { 
        allMovies: [],
        genres:[],
        currentPage: 1,
        pageSize: 4,
        searchQuery: "",
        selectedGenre: null,
        sortColumn:{ path: 'title' , order: 'asc' }
     }

     async componentDidMount(){
         const { data } = await getGenres();
        const genres = [{ _id : "" , name: 'All Genres'} , ...data]

        const { data: allMovies } = await getMovies();
        this.setState({
            allMovies,
            genres
        });
     }

     handleDelete = async (movie) => {

        const orignalMovies = this.state.allMovies;
         const allMovies = orignalMovies.filter(m => m._id !== movie._id);
         this.setState({ allMovies });

         try{
            await deleteMovie(movie._id);
         }catch(ex){
             if(ex.response && ex.response.status === 404)
                toast.error('This movie has already been deleted !!!');
             this.setState({
                 allMovies : orignalMovies
             });


         }
     };

     handleLike = (movie) =>{
        //console.log('Liked Clicked' , movie);
        const allMovies = [...this.state.allMovies];
        const index = allMovies.indexOf(movie);
        allMovies[index] = { ...allMovies[index] };
        allMovies[index].liked = !allMovies[index].liked;
        this.setState({ allMovies }); 
     };

     handlePageChange = page =>{
         this.setState({
             currentPage: page
         });
     }

     handleGenreSelect = genre => {
         this.setState({ selectedGenre: genre, searchQuery:"", currentPage: 1 });
     }

     handleSearch =(query)=>{
        this.setState({ searchQuery: query , selectedGenre: null , currentPage: 1 });
     };

     handleSort = sortColumn =>{
        
         this.setState({
             sortColumn
         });
     }

     getPagedData = () =>{
        const { pageSize,
             currentPage,
             allMovies,
             searchQuery,
            selectedGenre,
            sortColumn } = this.state;

        let filtered = allMovies;
        if(searchQuery){
             filtered = allMovies.filter(m =>
                m.title.toLowerCase().startsWith(searchQuery.toLowerCase()));
        }
        else if(selectedGenre && selectedGenre._id){
            
            filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
        }
       
        const sorted =  _.orderBy(filtered , [sortColumn.path] , [sortColumn.order])
        
        const movies = paginate(sorted , currentPage , pageSize);

        return { totalCount: filtered.length , movies };

     }


    render() { 
        const { length: count } = this.state.allMovies;
        const { pageSize,
                currentPage,
                 sortColumn, 
                 allMovies,
                searchQuery } = this.state;
        const { user } = this.props;
        if(count === 0) 
            return <div className="alert alert-danger mt-4" role="alert">There is no movie in database </div>

        const {totalCount , movies} =   this.getPagedData();
      

        return (
        <div className="container row">
            <div className="col-sm-2 mt-4">
                <ListGroup 
                    items={ this.state.genres }
                    selectedItem={this.state.selectedGenre}
                    onItemSelect={this.handleGenreSelect}/>
                </div>
            <div className="col mt-4">
                {user &&
                (<Link to='/movies/new'
                    className="btn btn-primary"
                style={{ marginBottom: 20 }}>New Movie </Link>)}
                <p> Showing {totalCount} movies in database </p>
                <SearchBox value={searchQuery}
                           onChange={this.handleSearch} />    
                <MoviesTable movies={movies}
                            sortColumn={sortColumn}
                            onLike={this.handleLike}
                            onDelete = {this.handleDelete}
                            onSort={this.handleSort} />
                <Pagination 
                itemCount={totalCount} 
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange} />
            </div>   
        </div>
        );
    }
}
 
export default Movies;