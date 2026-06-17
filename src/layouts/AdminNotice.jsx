import React, { useState } from 'react';
import NoticeModal from './NoticeModal';
import styles from './AdminNotice.module.css'; // 전용 CSS (기존 CSS 복붙)

function AdminNotice() {
    const rowsPerPage = 5;
    const [currentNoticePage, setCurrentNoticePage] = useState(1);
    const [searchNoticeKeyword, setSearchNoticeKeyword] = useState('');
    const [noticeSort, setNoticeSort] = useState('latest');
    
    // 모달 제어 상태 (그대로 유지)
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [viewingNotice, setViewingNotice] = useState(null);

    // 공지사항 데이터
    const [notices, setNotices] = useState(() => {
        const initialNotices = [];
        for (let i = 1; i <= 15; i++) {
            initialNotices.push({
                boardId: i,
                boardTitle: `청년복지 MOA 시스템 정기 점검 안내 (${i})`,
                boardContent: `이것은 ${i}번째 더미 공지사항 내용입니다.\n시스템 점검으로 인해 서비스 이용이 제한될 수 있습니다.`,
                createDate: `2026-06-${(16 - i).toString().padStart(2, '0')}`,
                views: Math.floor(Math.random() * 200),
                isPinned: i <= 2
            });
        }
        return initialNotices;
    });

    let processedNotices = notices.filter(n => n.boardTitle.includes(searchNoticeKeyword));
    processedNotices.sort((a, b) => {
        if (noticeSort === 'latest') return new Date(b.createDate) - new Date(a.createDate);
        if (noticeSort === 'oldest') return new Date(a.createDate) - new Date(b.createDate);
        if (noticeSort === 'views') return b.views - a.views;
        return 0;
    });
    const totalNoticePages = Math.ceil(processedNotices.length / rowsPerPage);
    const currentNoticesList = processedNotices.slice((currentNoticePage - 1) * rowsPerPage, currentNoticePage * rowsPerPage);

    const handleTogglePin = (boardId) => {
        setNotices(notices.map(notice => notice.boardId === boardId ? { ...notice, isPinned: !notice.isPinned } : notice));
    };

    const handleDeleteNotice = (boardId) => {
        if (window.confirm('해당 공지사항을 정말 삭제하시겠습니까?')) {
            const updatedNotices = notices.filter(n => n.boardId !== boardId);
            setNotices(updatedNotices);
            const newProcessed = updatedNotices.filter(n => n.boardTitle.includes(searchNoticeKeyword));
            const newTotalPages = Math.ceil(newProcessed.length / rowsPerPage);
            if (currentNoticePage > newTotalPages && newTotalPages > 0) setCurrentNoticePage(newTotalPages);
        }
    };

    // NoticeModal에서 저장 성공 후 호출되는 함수 (그대로 유지)
    const handleSaveNotice = (savedNoticeData) => {
        if (editingNotice) {
            setNotices(notices.map(n => n.boardId === savedNoticeData.boardId ? savedNoticeData : n));
        } else {
            setNotices([savedNoticeData, ...notices]);
            setCurrentNoticePage(1);
        }
        setIsNoticeModalOpen(false);
        setEditingNotice(null);
    };

    const openCreateModal = () => { setEditingNotice(null); setIsNoticeModalOpen(true); };
    const openEditModal = (notice) => { setEditingNotice(notice); setIsNoticeModalOpen(true); };
    const openViewModal = (notice) => { setViewingNotice(notice); };

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <div className={styles['header-controls']}>
                <h2>공지사항관리</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={noticeSort}
                        onChange={(e) => { setNoticeSort(e.target.value); setCurrentNoticePage(1); }}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CED4DA', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
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
                        onChange={(e) => { setSearchNoticeKeyword(e.target.value); setCurrentNoticePage(1); }}
                    />
                    <button className={styles['primary-btn']} onClick={openCreateModal}>
                        + 새 공지 작성
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <table className={styles['report-table']}>
                    <thead>
                        <tr><th>번호</th><th>제목</th><th>등록일</th><th>조회수</th><th>메인 노출</th><th>관리</th></tr>
                    </thead>
                    <tbody>
                        {currentNoticesList.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6C757D' }}>등록된 공지사항이 없습니다.</td></tr>
                        ) : (
                            currentNoticesList.map(notice => (
                                <tr key={notice.boardId}>
                                    <td>{notice.boardId}</td>
                                    <td className={styles['clickable-title']} onClick={() => openViewModal(notice)}>{notice.boardTitle}</td>
                                    <td>{notice.createDate}</td>
                                    <td>{notice.views}</td>
                                    <td>
                                        <button className={notice.isPinned ? styles['badge-on'] : styles['badge-off']} onClick={() => handleTogglePin(notice.boardId)}>
                                            {notice.isPinned ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className={styles['detail-btn']} onClick={() => openEditModal(notice)}>수정</button>
                                            <button className={styles['danger-btn']} onClick={() => handleDeleteNotice(notice.boardId)}>삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {totalNoticePages > 0 && (
                    <div className={styles.pagination}>
                        {Array.from({ length: totalNoticePages }, (_, i) => i + 1).map(page => (
                            <button key={page} className={`${styles['page-btn']} ${currentNoticePage === page ? styles['active-page'] : ''}`} onClick={() => setCurrentNoticePage(page)}>{page}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* 모달 연동 완벽 유지 */}
            {isNoticeModalOpen && (
                <NoticeModal
                    notice={editingNotice}
                    onClose={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }}
                    onSave={handleSaveNotice}
                />
            )}

            {viewingNotice && (
                <NoticeModal
                    notice={viewingNotice}
                    isReadOnly={true}
                    onClose={() => setViewingNotice(null)}
                />
            )}
        </section>
    );
}

export default AdminNotice;