import React  from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import _ from 'lodash';

const Pagination = ({ itemCount , pageSize , currentPage ,  onPageChange }) => {
    const pageCount = Math.ceil(itemCount/pageSize);
    if(pageCount === 1) return null;
    
    const pages = _.range(1 , pageCount + 1);
    //[1,2,3] Array of numbers

    return ( 
        <nav>
            <ul className="pagination">
               
                {pages.map(page => (
                    <li key={page} className={ page === currentPage ? 'page-item active' : 'page-item'}>
                        <Link className="page-link" onClick={() => onPageChange(page)}>
                        {page} 
                        </Link>
                    </li>
                ))}
                
            </ul>
        </nav>
     );
}

Pagination.propTypes ={
    itemCount : PropTypes.number.isRequired,
    pageSize : PropTypes.number.isRequired,
    currentPage : PropTypes.number.isRequired,  
    onPageChange : PropTypes.func.isRequired
}
export default Pagination;