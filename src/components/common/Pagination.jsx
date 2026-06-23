import styles from './Pagination.module.css'

const Pagination = ({ pageInfo, currentPage, changePage }) => {
  if (!pageInfo) return null

  return (
    <div className={styles.paging}>
      <button
        className={styles.pgbtn}
        onClick={() => currentPage > 1 && changePage(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ‹
      </button>

      {Array.from(
        { length: pageInfo.endPage - pageInfo.startPage + 1 },
        (_, i) => pageInfo.startPage + i
      ).map(pageNum => (
        <button
          key={pageNum}
          className={`${styles.pgbtn} ${currentPage === pageNum ? styles.on : ''}`}
          onClick={() => changePage(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      <button
        className={styles.pgbtn}
        onClick={() => currentPage < pageInfo.totalPages && changePage(currentPage + 1)}
        disabled={currentPage >= pageInfo.totalPages}
      >
        ›
      </button>
    </div>
  )
}

export default Pagination