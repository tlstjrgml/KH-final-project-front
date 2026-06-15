import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardReviewDetail.module.css';

const BoardReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [isPostLiked, setIsPostLiked] = useState(false);
    const [postLikes, setPostLikes] = useState(15);
    const [activeReplyForm, setActiveReplyForm] = useState(null);

    const togglePostLike = () => {
        setIsPostLiked(!isPostLiked);
        setPostLikes(prev => isPostLiked ? prev - 1 : prev + 1);
    };

    const toggleReplyForm = (id) => {
        setActiveReplyForm(activeReplyForm === id ? null : id);
    };

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>
                <span className={styles.categoryLabel}>후기게시판</span>
                <div className={styles.detailCard}>

                    <div className={styles.welfareServiceBox}>
                        <div className={styles.welfareInfo}>
                            <strong>대상 복지 서비스:</strong> 청년 월세 지원 사업
                        </div>
                        <button
                            className={styles.btnShortcut}
                            onClick={() => navigate('/welfaredetail/1')}>
                            복지 서비스 글 바로가기
                        </button>
                    </div>

                    <div className={styles.postHeader}>
                        <h1 className={styles.postTitle}>청년 주거지원 정책 관련해서 질문 있습니다!</h1>
                        <div className={styles.postMetaContainer}>
                            <div className={styles.postMetaLeft}>
                                <span>작성자: <b>김청년</b></span>
                                <span className={styles.metaDivider}>|</span>
                                <span>조회수: 152</span>
                                <span className={styles.metaDivider}>|</span>
                                <span>2024.05.20 14:30</span>
                            </div>
                            <div className={styles.postMetaRight}>
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => navigate(`/boardreview/edit`)}>
                                    수정
                                </button>
                                <span className={styles.metaDivider}>|</span>
                                <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                                <span className={styles.metaDivider}>|</span>
                                <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.postContent}>
                        안녕하세요, 이번에 주거지원 정책을 알아보려고 하는데 여러 가지 헷갈리는 부분이 있어서 질문 남깁니다.<br /><br />
                        소득 분위 산정 기준이 세전인지 세후인지, 그리고 부모님과 떨어져 살아도 부모님 소득이 합산되는지 궁금합니다.
                    </div>

                    <div className={styles.likeActionArea}>
                        <button className={`${styles.btnLike} ${isPostLiked ? styles.liked : ''}`} onClick={togglePostLike}>
                            <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            좋아요 <span>{postLikes}</span>
                        </button>
                    </div>

                    <div className={styles.commentSection}>
                        <h3 className={styles.commentHeader}>댓글 <span>2</span></h3>
                        <form className={styles.commentForm}>
                            <input type="text" className={styles.commentInput} placeholder="댓글을 입력해 주세요..." />
                            <button type="submit" className={styles.btnCommentSubmit}>댓글 등록</button>
                        </form>

                        <div className={styles.commentList}>
                            {[1, 2].map((id) => (
                                <div key={id} className={styles.commentItem}>
                                    <div className={styles.commentInfo}>
                                        <span className={styles.commentAuthor}>{id === 1 ? '박복지' : '지식인청년'}</span>
                                        <span className={styles.commentDate}>2024.05.20 15:00</span>
                                    </div>
                                    <div className={styles.commentText}>
                                        {id === 1 ? '저도 그 부분이 헷갈리더라고요.' : '기준 중위소득(세전 기준)으로 산정합니다.'}
                                    </div>
                                    <div className={styles.commentActions}>
                                        <button className={styles.actionBtn}>좋아요</button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={styles.actionBtn} onClick={() => toggleReplyForm(id)}>대댓글</button>
                                    </div>

                                    {activeReplyForm === id && (
                                        <form className={`${styles.commentForm} ${styles.replyFormWrapper} ${styles.active}`}>
                                            <div className={styles.replyIndicator}>↳</div>
                                            <input type="text" className={styles.commentInput} placeholder="대댓글을 입력해 주세요..." />
                                            <button type="submit" className={styles.btnCommentSubmit}>등록</button>
                                        </form>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.pageItem}>&lt;</button>
                            <button className={`${styles.pageItem} ${styles.active}`}>1</button>
                            <button className={styles.pageItem}>2</button>
                            <button className={styles.pageItem}>3</button>
                            <button className={styles.pageItem}>4</button>
                            <button className={styles.pageItem}>&gt;</button>
                        </div>
                    </div>
                </div>

                <div className={styles.bottomActions}>
                    <button className={styles.btnList} onClick={() => navigate('/boardreview')}>목록으로</button>
                </div>
            </div>
        </main>
    );
};

export default BoardReviewDetail;