import React from 'react';
import TableBody from './tableBody';
import TableHeader from './tableHeader';

const Table = ({ columns , sortColumn , movies , onSort }) => {
    return ( 
        <table className="table">
            <TableHeader 
                columns={columns}
                sortColumn={sortColumn}
                onSort={onSort} />
            
            <TableBody columns={columns} data={movies} />
        </table>
     );
}
 
export default Table;