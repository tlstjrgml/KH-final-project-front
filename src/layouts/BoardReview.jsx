import { useState, useEffect } from 'react';
import styles from './BoardReview.module.css'
import { useNavigate } from 'react-router-dom';

const BoardReview = () => {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [pages, setPages] = useState([1]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);

    const [searchType, setSearchType] = useState('title');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [appliedKeyword, setAppliedKeyword] = useState('');

    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const params = new URLSearchParams({
                    boardType: 'REV',
                    page: currentPage
                });
                if (appliedKeyword) {
                    params.set('keyword', appliedKeyword);
                    params.set('searchType', searchType);
                }

                const res = await fetch(`/react/board/list?${params.toString()}`);
                const data = await res.json();

                setBoardList(data.content || []);

                const maxPage = data.pagination?.endPage || 1;
                setEndPage(maxPage);
                setPages(Array.from({ length: maxPage }, (_, i) => i + 1));
            } catch (err) {
                console.error('목록 조회 실패:', err);
            }
        };
        fetchBoardList();
    }, [currentPage, appliedKeyword, searchType]);

    const handleSearch = () => {
        setCurrentPage(1);
        setAppliedKeyword(searchKeyword);
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
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                        <option value="author">작성자</option>
                    </select>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="검색어를 입력해주세요"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <button type="button" className={styles.btnSearch} onClick={handleSearch}>검색</button>
                </div>
            </div>
        </main>
    );
}

export default BoardReview;