
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardFree.module.css';

const BoardFree = () => {
    const navigate = useNavigate();


    const pages = [1, 2, 3, 4, 5];

    // 행 클릭 시 실행될 함수
    const handleRowClick = (index) => {

        // 실제 백엔드 연동 시에는 index 대신 글 번호(boardId)를 파라미터로 넘겨 사용합니다.
        navigate('/boardfree/detail');
    };

  
     
    return(
            <main className="page">
                <div className={styles.boardCard}>

                    {/*게시판 헤더 */}
                    <div className={styles.boardHeader}>
                        <h2 className={styles.boardTitle}>자유게시판</h2>
                        
                        <button type="button" className={styles.btnWrite}  onClick={() =>{ location.href='/boardfree/write'}}>
                            <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                              글쓰기
                        </button>
                    </div>

                {/* 게시판 헤더 */}
                <div className={styles.boardHeader}>
                    <h2 className={styles.boardTitle}>자유게시판</h2>
                    
                    <button 
                        type="button" 
                        className={styles.btnWrite}  
                        onClick={() => navigate('/boardfree/write')}
                    >
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
                                onClick={() => handleRowClick(index)} // 클릭 이벤트 추가
                                 style={{ cursor: 'pointer' }}
                            >
                                <td className="colId boardId"> 
                                    {10 - index} 
                                </td>
                                <td className="colTitle"> 
                                    {index === 0 ? '청년 주거지원 정책 관련해서 질문 있습니다!' : '안녕하세요'} 
                                </td>
                                <td className="colAuthor">
                                    {index === 0 ? '김청년' : '건강최고'}
                                </td>
                                <td className="colDate">
                                    {index === 0 ? '2026-06-15' : '2026-06-08'}
                                </td>
                                <td className="colViews">
                                    {index === 0 ? '152' : '10'}
                                </td>
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
                                <td className={styles.colId}> 
                                    {10 - index} 
                                </td>
                                <td className={styles.colTitle}> 
                                    {index === 0 ? '청년 주거지원 정책 관련해서 질문 있습니다!' : '안녕하세요'} 
                                </td>
                                <td className={styles.colAuthor}>
                                    {index === 0 ? '김청년' : '건강최고'}
                                </td>
                                <td className={styles.colDate}>
                                    {index === 0 ? '2026-06-15' : '2026-06-08'}
                                </td>
                                <td className={styles.colViews}>
                                    {index === 0 ? '152' : '10'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 페이지네이션 (백엔드 연동) */}
                <div className={styles.pagination} id="pagination-container">
                    <a className={styles.pageItem} aria-label="Previous">
                        &lt;
                    </a>

                    {pages.map((p) => (
                        <a
                            key={p}
                            className={`${styles.pageItem} ${p === 1 ? styles.active : ''}`}
                        >
                            {p}
                        </a>
                    ))}

                    <a className={styles.pageItem} aria-label="Next">
                        &gt;
                    </a>
                </div>

                {/* 미리보기용 페이지네이션 (JS에서 컨트롤) */}
                <div className={styles.pagination} id="dummy-pagination-container" style={{display: 'none'}}></div>

                {/* 검색 영역 */}
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
