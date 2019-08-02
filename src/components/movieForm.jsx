import React from 'react';
import Joi from 'joi-browser';
import Form from './common/form';
import { getGenres } from '../services/genreService';
import { getMovie, saveMovie } from '../services/movieServices';

class MovieForm extends Form{

    state = {
        data : {
             title: '',
             genreId: '',
             numberInStock: '',
             dailyRentalRate: ''},
        genres:[],
        errors : {} 
    };

    schema = {
        _id: Joi.string(),
        title: Joi.string()
                    .required()
                    .label('Title'),
        genreId: Joi.string()
                    .required()                    
                    .label('Genre'),
        numberInStock: Joi.number()
                    .min(0)
                    .max(100)
                    .integer()
                    .required()                    
                    .label('Number In Stock'),
        dailyRentalRate: Joi.number()
                 .min(0)
                 .max(10)
                 .required()                    
                 .label('Daily Rental Rate'),
    };

    async populateGenre(){
        const { data : genres} = await getGenres();
        this.setState({ genres });
    }

    async populateMovie(){
        try{
            const movieId = this.props.match.params.id;
            if(movieId === 'new') return;

            const { data: movie } = await getMovie(movieId);
            this.setState({ data: this.mapToViewModel(movie) });
        }catch(ex){
            if(ex.response && ex.response.status === 404) 
                this.props.history.replace('/not-found');
        }
    }

    async componentDidMount(){

        await this.populateGenre();

        await this.populateMovie();

    }

    // Transformation returning a new Object
    mapToViewModel(movie){
        return {
            _id: movie._id,
            title: movie.title,
            genreId: movie.genre._id,
            numberInStock: movie.numberInStock,
            dailyRentalRate: movie.dailyRentalRate
        };
    }

    doSubmit = async () =>{
        // Calling a Server
        await saveMovie(this.state.data);
        console.log('Submitted ...');
        this.props.history.replace('/movies');

   }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container">
                    <h1>Adding New Movie</h1>
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput('title' , 'Title')}
                        {this.renderSelect('genreId' , "Genre" , this.state.genres)}
                        {this.renderInput('numberInStock' , 'Number In Stock')}
                        {this.renderInput('dailyRentalRate' , 'Daily Rental Rate')}
                        { this.renderButton('Save') }
                    </form>
                </div>
            </React.Fragment>
         );
    }
}
 
export default MovieForm;