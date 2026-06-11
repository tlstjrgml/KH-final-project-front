import styles from './NoticeBoard.module.css';
import { useNavigate } from 'react-router-dom'

const NoticeBoard = () =>{
    const navigate = useNavigate()
     const pageList = [1, 2, 3, 4, 5];

    return(
        <main className={styles.page}>
            <div className={styles.contentWrapper}>
                <span className={styles.categoryLabel}>공지사항</span>

                <div className={styles.boardCard}>

                    {/* 게시판 헤더 */}
                    <div className={styles.boardHeader}>
                        <h2 className={styles.boardTitle}>공지사항</h2>
                        <button type="button" className={styles.btnWrite} onClick={() => navigate('/noticewrite')}>
                        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                        글쓰기
                        </button>
                    </div>

                    {/* 게시판 목록 테이블 */}
                    <table className={styles.boardTable}>
                        <thead>
                        <tr>
                            <th className={styles.colId}>글 번호</th>
                            <th className={styles.colTitle}>글 제목</th>
                            <th className={styles.colauthor}>작성자</th>
                            <th className={styles.coldate}>작성일자</th>
                            <th className={styles.colviews}>조회수</th>
                        </tr>
                        </thead>
                        <tbody id="board-tbody">
                        {/* 1. 백엔드 연동용 데이터 출력 */}
                        {[...Array(10)].map((_, index) => (
                        <tr key={index} className={styles.dataRow}>
                            <td className={`${styles.colId} ${styles.boardId}`} >1</td>
                            <td className={styles.colTitle} >이번주 공지사항</td>
                            <td className={styles.colauthor} >관리자</td>
                            <td className={styles.coldate} >2026.06.10</td>
                            <td className={styles.colviews} >0</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* 페이지네이션 (백엔드 연동) */}
                    <div className={styles.pagination} id="pagination-container">
                        <a className={styles.pageitem} aria-label="Previous">&lt;</a>
                            {pageList.map((p) => (
                                <a key={p}>{p}</a>
                                ))}
                        <a className={styles.pageitem} aria-label="Next">&gt;</a>
                    </div>

                    {/* Canvas 미리보기 UI용 더미 페이지네이션 영역 (JS에서 컨트롤) */}
                    <div className={styles.pagination}id="dummy-pagination-container" style={{display: 'none'}}></div>

                    {/* 검색 영역 */}
                    <div className={styles.searchBar}>
                        <select className={styles.searchSelect}>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        </select>
                        <input type="text" className={styles.searchInput} placeholder="검색어를 입력해주세요"/>
                        <button type="button" className={styles.btnSearch}>검색</button>
                    </div>

                </div>
            </div>
        </main>
    )
}

export default NoticeBoard;
