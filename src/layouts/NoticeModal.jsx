import React, { useState, useEffect } from 'react';
import styles from './NoticeModal.module.css'; 

function NoticeModal({ notice, onClose, onSave, isReadOnly = false }) {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');
    const [isPinned, setIsPinned] = useState(false); 

    useEffect(() => {
        if (notice) {
            setBoardTitle(notice.boardTitle);
            setBoardContent(notice.boardContent || '');
            setIsPinned(notice.boardType === 'PIN' || notice.isPinned === true);
        } else {
            setBoardTitle('');
            setBoardContent('');
            setIsPinned(false);
        }
    }, [notice]);

    const handleSubmit = async () => {
        if (!boardTitle.trim() || !boardContent.trim()) { alert("입력값을 확인해주세요."); return; }

        const token = localStorage.getItem('token');
        if (!token) { alert("로그인이 필요합니다."); return; }

        const requestBody = {
            boardTitle: boardTitle,
            boardContent: boardContent,
            boardType: "NOT", 
            memberId: 999
        };

        try {
            const response = await fetch('http://localhost:8080/board/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) throw new Error("서버 등록 실패");

            const savedData = await response.json();
            onSave({ ...savedData, isPinned: isPinned });

        } catch (error) {
            console.error(error);
            alert("공지사항 등록 중 에러가 발생했습니다.");
        }
    };

    return (
        <div className={styles['modal-overlay']}>
            {/* 넓이를 600px로 넓혀서 찌그러지지 않게 복구 */}
            <div className={styles.modal} style={{ width: '600px' }}> 
                <div className={styles['modal-header']}>
                    <h3>{isReadOnly ? '공지사항 상세' : (notice ? '공지사항 수정' : '새 공지사항 작성')}</h3>
                    <button className={styles['close-btn']} onClick={onClose}>✕</button>
                </div>

                <div className={styles['modal-body']}>
                    {/* 제목 영역 디자인 복구 */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#343A40' }}>제목</label>
                        <input
                            type="text"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                            className={styles['search-input']}
                            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: isReadOnly ? '#e9ecef' : '#fff' }}
                            disabled={isReadOnly}
                        />
                    </div>

                    {/* 내용 영역(textarea) 디자인 완벽 복구 */}
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#343A40' }}>내용</label>
                        <textarea
                            value={boardContent}
                            onChange={(e) => setBoardContent(e.target.value)}
                            style={{
                                width: '100%',
                                height: '200px',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #CED4DA',
                                resize: 'none',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit',
                                backgroundColor: isReadOnly ? '#e9ecef' : '#fff'
                            }}
                            disabled={isReadOnly}
                        />
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    {isReadOnly ? (
                        <button className={styles['primary-btn']} onClick={onClose}>닫기</button>
                    ) : (
                        <>
                            <button className={styles['outline-btn']} onClick={onClose}>취소</button>
                            <button className={styles['primary-btn']} onClick={handleSubmit}>
                                {notice ? '수정 완료' : '등록 완료'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeModal;