import { useState, useEffect } from 'react';
import styles from './BoardReview.module.css';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const typeToPath = {
    FRE: (id) => `/boardfree/detail/${id}`,
    REV: (id) => `/boardreview/detail/${id}`,
    NOT: (id) => `/notice/detail/${id}`
};

const MyBoardList = () => {
    const navigate = useNavigate();
    const [allBoards, setAllBoards] = useState([]);
    const [boardList, setBoardList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [pages, setPages] = useState([1]);

    useEffect(() => {
        const fetchMyBoards = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/react/member/me/boards', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                setAllBoards(data);

                const total = Math.ceil(data.length / PAGE_SIZE) || 1;
                setEndPage(total);
                setPages(Array.from({ length: total }, (_, i) => i + 1));
                setBoardList(data.slice(0, PAGE_SIZE));
            } catch (err) {
                console.error('내 게시글 조회 실패:', err);
            }
        };
        fetchMyBoards();
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        setBoardList(allBoards.slice(start, start + PAGE_SIZE));
    }, [currentPage, allBoards]);

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>내가 작성한 글</h2>
                </div>

                <table className={styles.boardTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>글 번호</th>
                            <th className={styles.colTitle}>글 제목</th>
                            <th className={styles.colDate}>작성일자</th>
                            <th className={styles.colViews}>조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>작성한 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boardList.map((board) => (
                                <tr
                                    key={board.boardId}
                                    className={styles.dataRow}
                                    onClick={() => navigate(typeToPath[board.boardType]?.(board.boardId) ?? '/')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className={`${styles.colId} ${styles.boardId}`}>{board.boardId}</td>
                                    <td className={styles.colTitle}>{board.boardTitle}</td>
                                    <td className={styles.colDate}>{board.createDate?.split('T')[0] || '-'}</td>
                                    <td className={styles.colViews}>{board.views}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <a
                        className={styles.pageItem}
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        style={{
                            pointerEvents: currentPage <= 1 ? 'none' : 'auto',
                            opacity: currentPage <= 1 ? 0.4 : 1,
                            cursor: 'pointer'
                        }}
                    >
                        &lt;
                    </a>

                    {pages.map((p) => (
                        <a
                            key={p}
                            className={`${styles.pageItem} ${p === currentPage ? styles.active : ''}`}
                            onClick={() => setCurrentPage(p)}
                            style={{ cursor: 'pointer' }}
                        >
                            {p}
                        </a>
                    ))}

                    <a
                        className={styles.pageItem}
                        onClick={() => currentPage < endPage && setCurrentPage(currentPage + 1)}
                        style={{
                            pointerEvents: currentPage >= endPage ? 'none' : 'auto',
                            opacity: currentPage >= endPage ? 0.4 : 1,
                            cursor: 'pointer'
                        }}
                    >
                        &gt;
                    </a>
                </div>
            </div>
        </main>
    );
};

export default MyBoardList;