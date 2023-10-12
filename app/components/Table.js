
"use client";

import React, { useState, useEffect } from 'react';

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

    const calculateVisiblePages = () => {
        const totalVisibleButtons = 2;
        const visiblePages = [];

        if (totalPages <= totalVisibleButtons) {
            for (let i = 0; i < totalPages; i++) {
                visiblePages.push(i);
            }
        } else {
            visiblePages.push(currentPage);
            if (currentPage < totalPages - 1) {
                visiblePages.push(currentPage + 1);
            }
        }

        return visiblePages;
    };

    const [visiblePages, setVisiblePages] = useState(calculateVisiblePages());

    useEffect(() => {
        setVisiblePages(calculateVisiblePages());
    }, [currentPage, totalPages]);

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

    const prevpage = () => {
        setCurrentPage(currentPage - 1 < 0 ? 0 : currentPage - 1);
    };

    const nextpage = () => {
        setCurrentPage(currentPage + 1 >= totalPages ? totalPages - 1 : currentPage + 1);
    };

    return (
        <div>
            <div className="w-11/12 m-auto flex justify-end">
                <span className='flex gap-5 mt-10'>
                    <h3 className='mt-2'>Search:</h3>
                    <input type="text" value={searchQuery} onChange={handleSearchChange} className='search-bar p-2' />
                </span>
            </div>
            {filteredData.length > 0 ? <div>
                {data?.length > 0 ?
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
                    :
                    <div className=' w-11/12 flex justify-center '>
                        <h1 className='font-bold text-rose-800'>No data</h1>
                    </div>}
            </div> :
                <div className=' w-11/12 flex justify-center '>
                    <h1 className='font-bold text-rose-800'>No data</h1>
                </div>}
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
                    <button onClick={prevpage} disabled={currentPage === 0} className='border px-4 py-2 rounded-lg mr-1'>perv</button>
                    {visiblePages.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(page)}
                            className={page === currentPage ? 'active' : 'inactive'}
                        >
                            {page + 1}
                        </button>
                    ))}
                    <button onClick={nextpage} disabled={currentPage === totalPages - 1} className='border px-4 py-2 rounded-lg ml-1 '>next</button>
                </span>
            </div>
        </div>
    );
}


