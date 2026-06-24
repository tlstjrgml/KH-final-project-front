import { useState, useEffect } from 'react';
import styles from './BoardReview.module.css';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const typeToPath = {
    FRE: (id) => `/boardfree/detail/${id}`,
    REV: (id) => `/boardreview/detail/${id}`,
    NOT: (id) => `/notice/detail/${id}`
};

const MyRepliesList = () => {
    const navigate = useNavigate();
    const [allReplies, setAllReplies] = useState([]);
    const [replyList, setReplyList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [pages, setPages] = useState([1]);

    useEffect(() => {
        const fetchMyReplies = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/react/member/me/replies', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                setAllReplies(data);

                const total = Math.ceil(data.length / PAGE_SIZE) || 1;
                setEndPage(total);
                setPages(Array.from({ length: total }, (_, i) => i + 1));
                setReplyList(data.slice(0, PAGE_SIZE));
            } catch (err) {
                console.error('내 댓글 조회 실패:', err);
            }
        };
        fetchMyReplies();
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        setReplyList(allReplies.slice(start, start + PAGE_SIZE));
    }, [currentPage, allReplies]);

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>내가 작성한 댓글</h2>
                </div>

                <table className={styles.boardTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>댓글 번호</th>
                            <th className={styles.colTitle}>댓글 내용</th>
                            <th className={styles.colDate}>작성일자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {replyList.length === 0 ? (
                            <tr>
                                <td colSpan="3" style={{ textAlign: 'center' }}>작성한 댓글이 없습니다.</td>
                            </tr>
                        ) : (
                            replyList.map((reply) => (
                                <tr
                                    key={reply.replyId}
                                    className={styles.dataRow}
                                    onClick={() => navigate(typeToPath[reply.boardType]?.(reply.boardId) ?? '/')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className={`${styles.colId} ${styles.boardId}`}>{reply.replyId}</td>
                                    <td className={styles.colTitle}>{reply.replyContent}</td>
                                    <td className={styles.colDate}>{reply.createDate?.split('T')[0] || '-'}</td>
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

export default MyRepliesList;
