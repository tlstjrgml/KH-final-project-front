import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardReviewWrite.module.css';

const BoardReviewWrite = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 작성</h2>
                </div>

                <form>
                    <input type="hidden" name="board_type" value="REV" />

                    {/* 복지 서비스명 */}
                    <div className={styles.field}>
                        <label>연결할 복지 서비스명</label>
                        <input type="text" placeholder="상세조회 대상 복지 서비스 정보를 불러와주세요" readOnly />
                    </div>

                    {/* 제목 */}
                    <div className={styles.field}>
                        <label>제목<span className={styles.req}>*</span></label>
                        <input type="text" placeholder="게시글 제목을 입력해주세요" />
                    </div>

                    {/* 만족도 & 불러오기 */}
                    <div className={styles.row}>
                        <div className={styles.field} style={{ flex: 1 }}>
                            <label>만족도</label>
                            <div className={styles.starContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        className={star <= rating ? styles.starFilled : styles.starEmpty}
                                        onClick={() => setRating(star)}
                                    >★</span>
                                ))}
                            </div>
                            <input type="hidden" name="rating" value={rating} />
                        </div>
                        <div className={styles.field} style={{ flex: 1 }}>
                            <label>&nbsp;</label>
                            <button type="button" className={styles.btnLoad}>후기 해당 복지글 불러오기</button>
                        </div>
                    </div>

                    {/* 후기 내용 */}
                    <div className={styles.field}>
                        <label>후기 내용<span className={styles.req}>*</span></label>
                        <textarea placeholder="복지 서비스를 이용하신 소감을 작성해주세요."></textarea>
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