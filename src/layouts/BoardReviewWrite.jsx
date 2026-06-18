import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardReviewWrite.module.css';

const BoardReviewWrite = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!boardTitle.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!boardContent.trim()) {
            alert('후기 내용을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/react/board/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardTitle: boardTitle,
                    boardContent: boardContent,
                    boardType: 'REV',
                    welfareId: null,
                    rating: rating
                })
            });

            if (!res.ok) {
                throw new Error('등록 실패');
            }

            const data = await res.json();
            alert('등록되었습니다.');
            navigate('/boardreview');
        } catch (err) {
            console.error(err);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 작성</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="board_type" value="REV" />

                    {/* 복지 서비스명 */}
                    <div className={styles.field}>
                        <label>연결할 복지 서비스명</label>
                        <input type="text" placeholder="상세조회 대상 복지 서비스 정보를 불러와주세요" readOnly />
                    </div>

                    {/* 제목 */}
                    <div className={styles.field}>
                        <label>제목<span className={styles.req}>*</span></label>
                        <input
                            type="text"
                            placeholder="게시글 제목을 입력해주세요"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                        />
                    </div>

                    {/* 만족도 & 불러오기 */}
                    <div className={styles.row}>                       
                        <div className={styles.field} style={{ flex: 1 }}>
                            <label>&nbsp;</label>
                            <button type="button" className={styles.btnLoad}>후기 해당 복지글 불러오기</button>
                        </div>
                    </div>

                    {/* 후기 내용 */}
                    <div className={styles.field}>
                        <label>후기 내용<span className={styles.req}>*</span></label>
                        <textarea
                            placeholder="복지 서비스를 이용하신 소감을 작성해주세요."
                            value={boardContent}
                            onChange={(e) => setBoardContent(e.target.value)}
                        ></textarea>
                    </div>

                    {/* 파일 첨부 */}
                    <div className={styles.field}>
                        <label>파일 첨부</label>
                        <div className={styles.fileCustomBox}>
                            <button type="button" className={styles.btnFile}>파일 선택</button>
                            <span className={styles.fileName}>선택된 파일 없음</span>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className={styles.btnSubmit}>글 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoardReviewWrite;