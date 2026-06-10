import React, { useState } from 'react';
import styles from './AlertDetail.module.css';

const AlertDetail = () => {
    // 상태 관리 (좋아요 기능)
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(128);

    const toggleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    return (
        <>
           

            <main className={styles.page}>
                <div className={styles.contentWrapper}>
                    {/* 카테고리 라벨 */}
                    <span className={styles.categoryLabel}>공지사항</span>

                    <div className={styles.detailCard}>
                        {/* 게시글 헤더 */}
                        <div className={styles.postHeader}>
                            <h1 className={styles.postTitle}>[필독] 청년복지 MOA 커뮤니티 이용 수칙 안내</h1>
                            <div className={styles.postMetaContainer}>
                                <div className={styles.postMetaLeft}>
                                    <span>작성자: <b>관리자</b></span>
                                    <span className={styles.metaDivider}>|</span>
                                    <span>조회수: 3420</span>
                                    <span className={styles.metaDivider}>|</span>
                                    <span>2026.06.01 10:00</span>
                                </div>
                                <div className={styles.postMetaRight}>
                                    <button type="button" className={styles.actionBtn}>수정</button>
                                    <span className={styles.metaDivider}>|</span>
                                    <button type="button" className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                                </div>
                            </div>
                        </div>

                        {/* 본문 */}
                        <div className={styles.postContent}>
                            안녕하세요. 청년복지 MOA 관리자입니다.<br /><br />
                            모두가 쾌적하고 유익하게 커뮤니티를 이용할 수 있도록, 아래의 이용 수칙을 반드시 숙지해 주시기 바랍니다.<br /><br />
                            <b>1. 존중과 배려</b><br />
                            타인을 비방하거나 모욕적인 언행, 욕설 등은 엄격히 금지됩니다. 서로 존중하는 문화를 만들어갑시다.<br /><br />
                            <b>2. 허위 사실 유포 금지</b><br />
                            확인되지 않은 정책이나 지원금 정보 등 허위 사실을 유포하여 혼란을 초래하는 행위는 제재 대상입니다.<br /><br />
                            <b>3. 상업적 광고 및 홍보 금지</b><br />
                            게시판 목적과 맞지 않는 상업적 광고, 불법 사이트 링크 공유 등은 사전 경고 없이 삭제될 수 있습니다.<br /><br />
                            위 수칙을 위반할 경우, 서비스 이용이 제한될 수 있음을 안내해 드립니다.<br />
                            감사합니다.
                        </div>

                        {/* 첨부파일 */}
                        <div className={styles.attachmentBox}>
                            <div className={styles.attachmentTitle}>
                                <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                첨부파일
                            </div>
                            <ul className={styles.attachmentList}>
                                <li>
                                    <a href="#" className={styles.attachmentLink}>커뮤니티_이용수칙_가이드라인.pdf <span className={styles.attachmentSize}>(342KB)</span></a>
                                </li>
                            </ul>
                        </div>

                        {/* 좋아요 영역 */}
                        <div className={styles.likeActionArea}>
                            <button
                                type="button"
                                className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
                                onClick={toggleLike}
                            >
                                <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                                좋아요 <span>{likeCount}</span>
                            </button>
                        </div>
                    </div>

                    {/* 목록 버튼 */}
                    <div className={styles.bottomActions}>
                        <a href="/alert" className={styles.btnList}>
                            <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                            목록으로
                        </a>
                    </div>
                </div>
            </main>
        </>
    );
};

export default AlertDetail;