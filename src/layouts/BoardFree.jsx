import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardFree.module.css';

const BoardFree = () => {
    const navigate = useNavigate();
    const pages = [1, 2, 3, 4, 5];

    const handleRowClick = () => {
        navigate('/boardfree/detail');
    };

    return (
        <main className={styles.page}>
            <div className={styles.boardCard}>
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>자유게시판</h2>
                    <button type="button" className={styles.btnWrite} onClick={() => navigate('/boardfree/write')}>
                        <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
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
                        {[...Array(10)].map((_, index) => (
                            <tr key={index} className={styles.dataRow} onClick={handleRowClick} style={{ cursor: 'pointer' }}>
                                {/* 각 td에 알맞은 스타일 클래스를 추가했습니다. */}
                                <td className={styles.colId}>{10 - index}</td>
                                <td className={styles.colTitle}>{index === 0 ? '청년 주거지원 정책 관련해서 질문 있습니다!' : '안녕하세요'}</td>
                                <td className={styles.colAuthor}>{index === 0 ? '김청년' : '건강최고'}</td>
                                <td className={styles.colDate}>{index === 0 ? '2026-06-15' : '2026-06-08'}</td>
                                <td className={styles.colViews}>{index === 0 ? '152' : '10'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <a className={styles.pageItem}>&lt;</a>
                    {pages.map((p) => (
                        <a key={p} className={`${styles.pageItem} ${p === 1 ? styles.active : ''}`}>{p}</a>
                    ))}
                    <a className={styles.pageItem}>&gt;</a>
                </div>

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
};

export default BoardFree;