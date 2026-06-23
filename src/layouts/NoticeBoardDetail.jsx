import { useNavigate, useParams } from 'react-router-dom';
import styles from './NoticeBoardDetail.module.css';
import { useEffect, useState } from 'react';

const NoticeBoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    // 현재 로그인한 사용자 정보 (JWT 토큰 디코딩)
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // JWT 토큰에서 로그인 유저 정보 추출
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUser({
                    id: payload.memberId,
                    nickname: payload.nickname,
                });
            } catch (err) {
                console.error(err);
            }
        }

        const fetchBoardDetail = async () => {
            try {
                const response = await fetch(`/react/board/${id}`);

                if (!response.ok) {
                    throw new Error("게시글 조회 실패");
                }

                const data = await response.json();
                setPost(data);
                // 초기 좋아요 수 세팅 로직 추가 가능
                // setLikes(data.views || 0);

            } catch (err) {
                console.error(err);
            }
        };

        fetchBoardDetail();
    }, [id]);

    const togglePostLike = () => {
       setIsLiked(prev => {
        setLikes(l => prev ? l - 1 : l + 1);
        return !prev;
});
    };

    const toggleReplyForm = (replyId) => {
        setActiveReplyForm(activeReplyForm === replyId ? null : replyId);
    };

    if (!post) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>

                <span className={styles.categoryLabel}>공지사항</span>

                <div className={styles.detailCard}>

                    {/* 게시글 헤더 */}
                    <div className={styles.postHeader}>
                        <h1 className={styles.postTitle}>{post.boardTitle}</h1>
                        <div className={styles.postMetaContainer}>
                            <div className={styles.postMetaLeft}>
                                <span>작성자: <b>{post.writerNickname}</b></span>
                                <span className={styles.metaDivider}>|</span>
                                <span>조회수: {post.views}</span>
                                <span className={styles.metaDivider}>|</span>
                                <span>{post.createDate ? post.createDate.split('T')[0] : ''}</span>
                            </div>
                            <div className={styles.postMetaRight}>
                                <button className={styles.actionBtn} onClick={() => { navigate(`/notice/edit/${id}`) }}>수정</button>
                                <span className={styles.metaDivider}>|</span>
                                <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                                <span className={styles.metaDivider}>|</span>
                                <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                            </div>
                        </div>
                    </div>

                    {/*게시글 본문 */}
                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                    {/* 첨부파일 */}
                    <div className={styles.attachmentBox}>
                        <div className={styles.attachmentTitle}>
                            <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            첨부파일
                        </div>
                        <ul className={styles.attachmentList}>
                            <li>
                                <a href="#" className={styles.attachmentLink} onClick={(e) => e.preventDefault()}>
                                    등록된 첨부파일이 없습니다.
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 좋아요 */}
                    <div className={styles.likeActionArea}>
                        <button
                            id="btn-post-like"
                            className={styles.btnLike}
                            style={isLiked ? { backgroundColor: '#378ADD', color: '#fff', borderColor: '#378ADD' } : {}}
                            onClick={togglePostLike}
                        >
                            <svg viewBox="0 0 24 24" stroke={isLiked ? "#fff" : "currentColor"}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            좋아요 <span id="post-like-count">{likes}</span>
                        </button>
                    </div>


                </div> {/* detail-card */}

               <div className={styles.bottomActions}>
                    <button className={styles.btnList} onClick={() => navigate('/noticeboard')}>목록으로</button>
                </div>

            </div>
        </main>
    );
}

export default NoticeBoardDetail;