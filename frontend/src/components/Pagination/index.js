import React from 'react'
import ReactPaginate from 'react-paginate';

const Pagination = ({ dataList, list, onPageChange, rowsPerPage, page = 1, pageNumber, totalPageSize }) => {
    const pageNo = totalPageSize / rowsPerPage;
    return (
        <div >
            {
                pageNo > 1 &&
                <ReactPaginate
                    nextClassName={''}
                    previousLabel={'<'}
                    nextLabel={'>'}
                    // pageCount={dataList ? Array.isArray(dataList.data) && dataList.data.length / rowsPerPage : totalPageSize / rowsPerPage}
                    pageCount={pageNo}
                    onPageChange={onPageChange}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                    containerClassName={'paginationBttns'}
                    previousLinkClassName={'previousBttn'}
                    nextLinkClassName={'nextBttn'}
                    disabledClassName={'paginationDisabled'}
                    activeClassName={'paginationActive'}
                    forcePage={pageNumber - 1}
                />
            }
        </div>
    )
}

export default Pagination