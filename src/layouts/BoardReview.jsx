import styles from './BoardReview.module.css';
import { useNavigate } from 'react-router-dom';

const BoardReview = () => {
    const pages = [1, 2, 3, 4, 5];
    const navigate = useNavigate();

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>

                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>후기 게시판</h2>
                    <button
                        type="button"
                        className={styles.btnWrite}
                        onClick={() => { navigate('/boardreview/write'); }}>
                        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                        글쓰기
                    </button>
                </div>

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
                            <tr
                                key={index}
                                className={styles.dataRow}
                                onClick={() => navigate(`/boardreview/detail/${index + 1}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className={`${styles.colId} ${styles.boardId}`}>user01</td>
                                <td className={styles.colTitle}>안녕하세요</td>
                                <td className={styles.colAuthor}>건강최고</td>
                                <td className={styles.colDate}>2026-06-08</td>
                                <td className={styles.colViews}>10</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination} id="pagination-container">
                    <a className={styles.pageItem} aria-label="Previous">&lt;</a>
                    {pages.map((p) => (
                        <a key={p} className={styles.pageItem}>{p}</a>
                    ))}
                    <a className={styles.pageItem} aria-label="Next">&gt;</a>
                </div>

                <div className={styles.pagination} id="dummy-pagination-container" style={{ display: 'none' }}></div>

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
    );
}

export default BoardReview;