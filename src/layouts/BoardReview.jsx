import { useState, useEffect } from 'react';
import styles from './BoardReview.module.css';
import { useNavigate } from 'react-router-dom';

const BoardReview = () => {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [pages, setPages] = useState([1]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    const [searchType, setSearchType] = useState('keyword');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [appliedKeyword, setAppliedKeyword] = useState('');

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const params = new URLSearchParams({
                    boardType: 'REV',
                    page: currentPage
                });

                if (appliedKeyword && appliedKeyword.trim() !== '') {
                    params.set(searchType, appliedKeyword);
                }

                const res = await fetch(`/react/board/list?${params.toString()}`);
                const data = await res.json();

                setBoardList(data.content || []);

                const maxPage = data.pagination?.endPage || 1;
                setEndPage(maxPage);
                setPages(Array.from({ length: maxPage }, (_, i) => i + 1));
            } catch (err) {
                console.error(err);
            }
        };
        fetchBoardList();
    }, [currentPage, appliedKeyword, searchType]);

    const handleSearch = () => {
        setCurrentPage(1);
        setAppliedKeyword(searchKeyword);
    };

    const handleClearSearch = () => {
        setSearchKeyword('');
        setAppliedKeyword('');
        setCurrentPage(1);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

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
                    <tbody>
                        {boardList.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>등록된 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boardList.map((board) => (
                                <tr
                                    key={board.boardId}
                                    className={styles.dataRow}
                                    onClick={() => navigate(`/boardreview/detail/${board.boardId}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className={`${styles.colId} ${styles.boardId}`}>{board.boardId}</td>
                                    <td className={styles.colTitle}>{board.boardTitle}</td>
                                    <td className={styles.colAuthor}>{board.writerNickname}</td>
                                    <td className={styles.colDate}>{board.createDate?.split('T')[0] || '-'}</td>
                                    <td className={styles.colViews}>{board.views}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <a className={styles.pageItem}
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

                    <a className={styles.pageItem}
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

                <div className={styles.searchBar}>
                    <select
                        className={styles.searchSelect}
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="keyword">제목</option>
                        <option value="boardContent">내용</option>
                        <option value="nickname">작성자</option>
                    </select>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                        <input
                            type="text"
                            className={styles.searchInput}
                            placeholder="검색어를 입력해주세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            style={{ width: '100%', paddingRight: '30px' }}
                        />
                        {searchKeyword && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: '#999',
                                    padding: '4px'
                                }}
                            >
                                x
                            </button>
                        )}
                    </div>

                    <button type="button" className={styles.btnSearch} onClick={handleSearch}>검색</button>
                </div>
            </div>
        </main>
    );
};

export default BoardReview;