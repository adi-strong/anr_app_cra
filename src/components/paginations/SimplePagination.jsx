import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../index";
import ReactPaginate from "react-paginate";

export default function SimplePagination({itemsPerPage, items, setItemOffset, className = 'justify-content-md-end'}) {
  const pageCount = Math.ceil(items.length / itemsPerPage)
  
  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % items?.length
    setItemOffset(newOffset)
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <ReactPaginate
        containerClassName={`pagination ${className}`}
        breakLabel='...'
        onPageChange={handlePageClick}
        previousLabel={<i className='bi bi-chevron-left' />}
        nextLabel={<i className='bi bi-chevron-right' />}
        renderOnZeroPageCount={null}
        breakClassName='page-item'
        pageClassName='page-item'
        pageLinkClassName='page-link'
        activeClassName='active'
        activeLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        breakLinkClassName='page-link'
        pageCount={pageCount}/>
    </ErrorBoundary>
  )
}
