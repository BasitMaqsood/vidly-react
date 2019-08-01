import React from 'react';

const Input = ({ name , label ,  errors , ...rest}) => {
    return ( 
        <React.Fragment>
            <div className="form-group">
                <label htmlFor="username">{ label }</label>
                <input
                    {...rest} 
                    name={name}
                    id={name}
                    className="form-control"
                    autoFocus />
            </div>
            {errors && <div className="alert alert-danger">{ errors }</div>}
        </React.Fragment>
     );
}
 
export default Input;