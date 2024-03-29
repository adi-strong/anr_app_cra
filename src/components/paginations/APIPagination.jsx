import ReactPaginate from "react-paginate";

export default function APIPagination({setPage, onPaginate, count = 0, page = 0, className = 'justify-content-md-end'}) {
  const handlePageClick = event => {
    const getPage = event.selected
    const currentPage = getPage + 1
    setPage(currentPage)
    onPaginate(currentPage)
  }
  
  return (
    <>
      <ReactPaginate
        containerClassName={`pagination ${className}`}
        pageCount={count}
        breakLabel='...'
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        previousLabel={<i className='bi bi-chevron-left' />}
        nextLabel={<i className='bi bi-chevron-right' />}
        renderOnZeroPageCount={null}
        forcePage={page}
        breakClassName='page-item'
        pageClassName='page-item'
        pageLinkClassName='page-link'
        activeClassName='active'
        activeLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        breakLinkClassName='page-link' />
    </>
  )
}
