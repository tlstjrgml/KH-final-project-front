import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardReviewDetail.module.css';

const BoardReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [postLikes, setPostLikes] = useState(0);
    const [activeReplyForm, setActiveReplyForm] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (!res.ok) throw new Error('상세조회 실패');
                const data = await res.json();
                setPost(data);
                setIsPostLiked(data.isLiked);
                setPostLikes(data.likeCount);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetail();
    }, [id]);

    const togglePostLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        const prevLiked = isPostLiked;
        const prevCount = postLikes;

        setIsPostLiked(!prevLiked);
        setPostLikes(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            const res = await fetch(`/react/board/${id}/likes`, {
                method: prevLiked ? 'DELETE' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                throw new Error('좋아요 처리 실패');
            }
        } catch (err) {
            console.error(err);
            setIsPostLiked(prevLiked);
            setPostLikes(prevCount);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const toggleReplyForm = (replyId) => {
        setActiveReplyForm(activeReplyForm === replyId ? null : replyId);
    };

    if (!post) return <div>로딩 중...</div>;

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>
                <span className={styles.categoryLabel}>후기게시판</span>
                <div className={styles.detailCard}>

                    <div className={styles.welfareServiceBox}>
                        <div className={styles.welfareInfo}>
                            <strong>대상 복지 서비스:</strong> 테스트용
                        </div>
                        <button
                            className={styles.btnShortcut}
                            onClick={() => navigate('/welfaredetail/1')}>
                            복지 서비스 글 바로가기
                        </button>
                    </div>

                    <div className={styles.postHeader}>
                        <h1 className={styles.postTitle}>{post.boardTitle}</h1>
                        <div className={styles.postMetaContainer}>
                            <div className={styles.postMetaLeft}>
                                <span>작성자: <b>{post.writerNickname}</b></span>
                                <span className={styles.metaDivider}>|</span>
                                <span>조회수: {post.views}</span>
                                <span className={styles.metaDivider}>|</span>
                                <span>{post.createDate.split('T')[0]}</span>
                            </div>
                            <div className={styles.postMetaRight}>
                                {post.isOwner && (
                                    <>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => navigate(`/boardreview/edit`)}>
                                            수정
                                        </button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                                <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                    <div className={styles.likeActionArea}>
                        <button className={`${styles.btnLike} ${isPostLiked ? styles.liked : ''}`} onClick={togglePostLike}>
                            <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            좋아요 <span>{postLikes}</span>
                        </button>
                    </div>

                    <div className={styles.commentSection}>
                        <h3 className={styles.commentHeader}>댓글 <span>0</span></h3>
                        <form className={styles.commentForm}>
                            <input type="text" className={styles.commentInput} placeholder="댓글을 입력해 주세요..." />
                            <button type="submit" className={styles.btnCommentSubmit}>댓글 등록</button>
                        </form>

                        <div className={styles.commentList}>
                            {/* 댓글 기능은 추후 연동 */}
                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.pageItem}>&lt;</button>
                            <button className={`${styles.pageItem} ${styles.active}`}>1</button>
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
