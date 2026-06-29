import { useState, useEffect } from 'react';
import styles from './BoardReview.module.css';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const MyWishList = () => {
    const navigate = useNavigate();
    const [allWishes, setAllWishes] = useState([]);
    const [wishList, setWishList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [pages, setPages] = useState([1]);

    useEffect(() => {
        const fetchMyBoards = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://localhost:8080/api/wish', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                setAllWishes(data);

                const total = Math.ceil(data.length / PAGE_SIZE) || 1;
                setEndPage(total);
                setPages(Array.from({ length: total }, (_, i) => i + 1));
                setWishList(data.slice(0, PAGE_SIZE));
            } catch (err) {
                console.error('찜한 복지 조회 실패:', err);
            }
        };
        fetchMyBoards();
    }, []);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        setWishList(allWishes.slice(start, start + PAGE_SIZE));
    }, [currentPage, allWishes]);

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>내가 찜한 복지</h2>
                </div>

                <table className={styles.boardTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>카테고리</th>
                            <th className={styles.colTitle}>복지 명</th>
                            <th className={styles.colDate}>찜한 날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishList.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>찜한 복지가 없습니다.</td>
                            </tr>
                        ) : (
                            wishList.map((wish) => (
                                <tr
                                    key={wish.welfareId}
                                    className={styles.dataRow}
                                    onClick={() => navigate(`/welfaredetail/${wish.welfareId}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className={`${styles.colId} ${styles.boardId}`}>{wish.lclsfNm}</td>
                                    <td className={styles.colTitle}>{wish.plcyNm}</td>
                                    <td className={styles.colDate}>{wish.wishDate?.split(' ')[0] || '-'}</td>
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

export default MyWishList;