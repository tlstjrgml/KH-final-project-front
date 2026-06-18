import React, { useState, useEffect } from 'react';
import styles from './NoticeModal.module.css'; 

function NoticeModal({ notice, onClose, onSave, isReadOnly = false }) {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');

    useEffect(() => {
        if (notice) {
            // 수정 또는 상세보기 모드일 때 기존 데이터 세팅
            setBoardTitle(notice.boardTitle);
            setBoardContent(notice.boardContent || '');
        } else {
            // 새 글 작성 모드일 때 입력창 초기화
            setBoardTitle('');
            setBoardContent('');
        }
    }, [notice]);

    const handleSubmit = async () => {
        if (!boardTitle.trim() || !boardContent.trim()) { 
            alert("입력값을 확인해주세요."); 
            return; 
        }

        const token = localStorage.getItem('token');
        if (!token) { 
            alert("로그인이 필요합니다."); 
            return; 
        }

        // 💡 1. 모드 판별을 가장 먼저 실행합니다. (에러 해결 핵심 포인트)
        const isEditMode = notice && notice.boardId;

        // 💡 2. 이제 에러 없이 isEditMode와 notice.boardId를 사용할 수 있습니다.
        // 백엔드로 보낼 JSON 데이터 (memberId: 999 삭제, boardId 추가)
        const requestBody = {
            boardId: isEditMode ? notice.boardId : null,
            boardTitle: boardTitle,
            boardContent: boardContent,
            boardType: "NOT" 
        };
        
        // 3. 모드에 따라 URL과 HTTP 메서드를 다르게 설정합니다.
        const url = isEditMode 
            ? `http://localhost:8080/board/${notice.boardId}` // 수정 (PUT)
            : `http://localhost:8080/board/write`;            // 작성 (POST)
            
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method, 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                // 추가 팁: 백엔드에서 보낸 에러 메시지(400 에러 사유 등)를 읽어서 띄워주면 디버깅이 더 편합니다.
                const errorText = await response.text();
                throw new Error(errorText || (isEditMode ? "서버 수정 실패" : "서버 등록 실패"));
            }

            // 부모 컴포넌트(AdminNotice)의 handleSaveNotice를 호출하여 모달 닫기 및 목록 새로고침
            alert(isEditMode ? "수정이 완료되었습니다." : "새 공지사항이 등록되었습니다.");
            onSave(); 

        } catch (error) {
            console.error('Submit Error:', error);
            alert(`에러 발생: ${error.message}`);
        }
    };

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles.modal} style={{ width: '600px' }}> 
                <div className={styles['modal-header']}>
                    <h3>{isReadOnly ? '공지사항 상세' : (notice ? '공지사항 수정' : '새 공지사항 작성')}</h3>
                    <button className={styles['close-btn']} onClick={onClose}>✕</button>
                </div>

                <div className={styles['modal-body']}>
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