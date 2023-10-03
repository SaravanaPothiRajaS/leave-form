
"use client";

import React, { useState } from 'react';

export default function Table({ columns, data, className }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(4);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const getFilteredData = () => {
        return data.filter(item => {
            const values = Object.values(item);
            return values.some(value =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    };

    const filteredData = getFilteredData();

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(0);
    };

    const handleSort = (column) => {
        setSortColumn(column);
        setSortOrder(sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortedData = sortColumn ? [...filteredData].sort((a, b) => {
        const aValue = String(a[sortColumn.accessor]).toLowerCase();
        const bValue = String(b[sortColumn.accessor]).toLowerCase();
        if (sortOrder === 'asc') {
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        } else {
            if (aValue > bValue) return -1;
            if (aValue < bValue) return 1;
            return 0;
        }
    }) : filteredData;

    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

    return (
        <div>
            <div className="pagination-controls">
                <span>
                    <h3>Select Limit:</h3>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                        <option value={16}>16</option>
                    </select>
                </span>
                <span>
                    <h3>Search:</h3>
                    <input type="text" value={searchQuery} onChange={handleSearchChange} className='search-bar' />
                </span>
            </div>
            <table className={className}>
                <thead className="table-head">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.accessor}>
                                <button onClick={() => handleSort(column)}>
                                    {column.Header}
                                    {sortColumn === column && (
                                        sortOrder === 'asc' ? '🔺' : ' 🔻'
                                    )}
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {sortedData.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map((row, index) => (
                        <tr key={index}>
                            {columns.map((column) => (
                                <td key={column.accessor}>{row[column.accessor]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                {pageNumbers.map((page) => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={page === currentPage ? 'active' : 'inactive'}
                    >
                        {page + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
