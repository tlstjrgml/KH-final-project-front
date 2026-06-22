import React, { useState, useEffect } from 'react';
import NoticeModal from './NoticeModal';
import styles from './AdminNotice.module.css';

function AdminNotice() {
    const [notices, setNotices] = useState([]);
    const [currentNoticePage, setCurrentNoticePage] = useState(1);
    const [searchNoticeKeyword, setSearchNoticeKeyword] = useState('');
    const [noticeSort, setNoticeSort] = useState('latest');

    // 1. 백엔드 Pagination 객체 구조를 그대로 담을 상태
    const [pageInfo, setPageInfo] = useState({
        startPage: 1,
        endPage: 1,
        hasPrev: false,
        hasNext: false,
        totalPages: 1
    });

    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [viewingNotice, setViewingNotice] = useState(null);

    // 2. 백엔드에 10개 단위의 목록 및 페이징 정보 요청
    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('token');

            const url = `http://localhost:8080/board/list?boardType=NOT&page=${currentNoticePage}&keyword=${searchNoticeKeyword}&sort=${noticeSort}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('목록을 불러오는데 실패했습니다.');

            const data = await response.json();

            // 백엔드가 PageResponse 객체에 담아준 데이터 세팅
            setNotices(data.content || []);
            if (data.pagination) {
                setPageInfo(data.pagination);
            }

        } catch (error) {
            console.error('API 호출 에러:', error);
        }
    };

    // 3. 페이지 번호나 정렬 조건이 바뀔 때마다 재조회
    useEffect(() => {
        fetchNotices();
    }, [currentNoticePage, noticeSort]);

    // 모달을 띄울 때 상세 내용을 가져오기 위한 단건 조회
    const fetchNoticeDetail = async (boardId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/board/${boardId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('상세 조회 실패');
            return await response.json();
        } catch (error) {
            console.error('상세 조회 에러:', error);
            alert('상세 정보를 불러올 수 없습니다.');
            return null;
        }
    };

    const handleDeleteNotice = async (boardId) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:8080/board/${boardId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('삭제 실패');

                alert('삭제되었습니다.');
                setCurrentNoticePage(1); // 삭제 후 1페이지로 이동
                fetchNotices();
            } catch (error) {
                console.error('삭제 에러:', error);
            }
        }
    };

    const handleSaveNotice = () => {
        setIsNoticeModalOpen(false);
        setEditingNotice(null);
        setCurrentNoticePage(1); // 저장 후 최신 글을 보기 위해 1페이지로 이동
        fetchNotices();
    };

    const openCreateModal = () => { setEditingNotice(null); setIsNoticeModalOpen(true); };
    const openEditModal = async (notice) => {
        const detailData = await fetchNoticeDetail(notice.boardId);
        if (detailData) { setEditingNotice(detailData); setIsNoticeModalOpen(true); }
    };
    
    const openViewModal = async (notice) => {
        const detailData = await fetchNoticeDetail(notice.boardId);

        if (detailData) {
            setViewingNotice(detailData);
            setNotices(prevNotices =>
                prevNotices.map(item =>
                    item.boardId === notice.boardId
                        ? { ...item, views: item.views + 1 }
                        : item
                )
            );
        }
    };

    const executeSearch = () => {
        setCurrentNoticePage(1);
        fetchNotices();
    };

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            
            <div className={styles['header-controls']}>
                <h2>공지사항관리</h2>
                
                {/* 우측 컨트롤 영역 (위: 버튼, 아래: 검색) */}
                <div className={styles['right-controls']}>
                    <button className={styles['primary-btn']} onClick={openCreateModal}>
                        + 새 공지 작성
                    </button>

                    <div className={styles['search-group']}>
                        <select
                            className={styles['sort-select']}
                            value={noticeSort}
                            onChange={(e) => { setNoticeSort(e.target.value); setCurrentNoticePage(1); }}
                        >
                            <option value="latest">최신순</option>
                            <option value="oldest">오래된순</option>
                            <option value="views">조회수순</option>
                        </select>
                        
                        <input
                            type="text"
                            placeholder="제목 검색"
                            className={styles['search-input']}
                            value={searchNoticeKeyword}
                            onChange={(e) => setSearchNoticeKeyword(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') executeSearch(); }}
                        />
                        
                        <button className={styles['search-btn']} onClick={executeSearch}>
                            검색
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.card}>
                <table className={styles['report-table']}>
                    <thead>
                        <tr><th>번호</th><th>제목</th><th>등록일</th><th>조회수</th><th>관리</th></tr>
                    </thead>
                    <tbody>
                        {notices.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '30px', textAlign: 'center', color: '#6C757D' }}>게시글이 없습니다.</td></tr>
                        ) : (
                            notices.map(notice => (
                                <tr key={notice.boardId}>
                                    <td>{notice.boardId}</td>
                                    <td className={styles['clickable-title']} onClick={() => openViewModal(notice)}>{notice.boardTitle}</td>
                                    <td>{notice.createDate ? notice.createDate.substring(0, 10) : '-'}</td>
                                    <td>{notice.views}</td>
                                    <td>
                                        <div className={styles['action-buttons']}>
                                            <button className={styles['detail-btn']} onClick={() => openEditModal(notice)}>수정</button>
                                            <button className={styles['danger-btn']} onClick={() => handleDeleteNotice(notice.boardId)}>삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {pageInfo.totalPages > 0 && (
                    <div className={styles.pagination}>
                        {pageInfo.hasPrev && (
                            <button className={styles['page-btn']} onClick={() => setCurrentNoticePage(pageInfo.startPage - 1)}>
                                &lt;
                            </button>
                        )}

                        {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, i) => pageInfo.startPage + i).map(page => (
                            <button
                                key={page}
                                className={`${styles['page-btn']} ${currentNoticePage === page ? styles['active-page'] : ''}`}
                                onClick={() => setCurrentNoticePage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        {pageInfo.hasNext && (
                            <button className={styles['page-btn']} onClick={() => setCurrentNoticePage(pageInfo.endPage + 1)}>
                                &gt;
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isNoticeModalOpen && (
                <NoticeModal
                    notice={editingNotice}
                    onClose={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }}
                    onSave={handleSaveNotice}
                />
            )}

            {viewingNotice && (
                <NoticeModal notice={viewingNotice} isReadOnly={true} onClose={() => setViewingNotice(null)} />
            )}
        </section>
    );
}

export default AdminNotice;