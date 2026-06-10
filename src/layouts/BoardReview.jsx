import styles from './BoardReview.module.css'

const BoardReview = () => {

    const pages = [1, 2, 3, 4, 5];

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>

                {/*게시판 헤더 */}
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>후기 게시판</h2>

                    <button type="button" className={styles.btnWrite} onClick={() => { location.href = '' }}>
                        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                        글쓰기
                    </button>
                </div>

                {/*게시판 목록 테이블 */}
                <table className={styles.boardTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>글 번호</th>
                            <th className={styles.colTitle}>글 제목</th>
                            <th className={styles.colAuthor}>작성자</th>
                            <th className={styles.colDate}>작성일자</th>
                            <th className={styles.colViews}>조회수</th>
                        </tr>
                    </thead>

                    <tbody id="board-tbody">
                        {[...Array(10)].map((_, index) => (
                            <tr key={index} className={styles.dataRow}>
                                <td className={`${styles.colId} ${styles.boardId}`}> user01 </td>
                                <td className={styles.colTitle}> 안녕하세요 </td>
                                <td className={styles.colAuthor}>건강최고</td>
                                <td className={styles.colDate}>2026-06-08</td>
                                <td className={styles.colViews}>10</td>
                            </tr>
                        ))}
                    </tbody>

                </table>

                {/* 페이지네이션 (백엔드 연동) */}
                <div className={styles.pagination} id="pagination-container" >
                    <a className={styles.pageItem} aria-label="Previous">
                        &lt;
                    </a>

                    {pages.map((p) => (
                        <a
                            key={p}
                            className={styles.pageItem}
                        >
                            {p}
                        </a>
                    ))}

                    <a className={styles.pageItem} aria-label="Next">
                        &gt;
                    </a>

                </div>

                { /*미리보기용 페이지네이션 (JS에서 컨트롤) */}
                <div className={styles.pagination} id="dummy-pagination-container" style={{ display: 'none' }}></div>

                {/*검색 영역 */}
                <div className={styles.searchBar}>
                    <select className={styles.searchSelect}>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="author">작성자</option>
                    </select>
                    <input type="text" className={styles.searchInput} placeholder="검색어를 입력해주세요" />
                    <button type="button" className={styles.btnSearch}>검색</button>
                </div>

            </div>
        </main>

    )
}

export default BoardReview;