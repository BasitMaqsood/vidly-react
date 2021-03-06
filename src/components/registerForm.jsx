import React  from 'react';
import Joi from 'joi-browser';
import * as userService from '../services/userService';
import Form from './common/form';

class LoginForm extends Form{

    state = {
        data : { username: '' , password: '' , name: '' },
        errors : {} 
    };

    schema = {
        username: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2 })
                    .label('Username'),
        password: Joi.string()
                    .required()
                    .min(5)
                    .label('Password'),
        name: Joi.string()
                .required()
                .label('Name')
    };

    doSubmit = async () =>{
        try{
            const response = await userService.register(this.state.data);
            console.log(response);
            //auth.loginWithJwt(response.headers['x-auth-token']);
            this.props.children.push = '/';
        }catch(ex){
            if(ex.response && ex.response.status === 400){
                const errors = {...this.state.errors};
                errors.username = ex.response.data;
                this.setState({ errors });
            }
        }
   }

    render() { 
        return ( 
            <React.Fragment>
                <div className="container">
                    <h1>Register</h1>
                    <form onSubmit={this.handleSubmit}>
                        {this.renderInput('username' , 'Username')}
                        {this.renderInput('password' , 'Password' , 'password')}
                        {this.renderInput('name' , 'Name')}
                        { this.renderButton('Register') }
                    </form>
                </div>
            </React.Fragment>
         );
    }
}
 
export default LoginForm;