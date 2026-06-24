import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardFreeDetail.module.css';
import { useEffect, useState } from 'react';

const BoardFreeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [replyContent, setReplyContent] = useState("");

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
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
                const response = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (!response.ok) {
                    throw new Error("게시글 조회 실패");
                }

                const data = await response.json();
                setPost(data);
                
            } catch (err) {
                console.error(err);
            }
        };

        fetchBoardDetail();
    }, [id]);
    const togglePostLike = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        const prevLiked = isLiked;
        const prevCount = likes;

        setIsLiked(!prevLiked);
        setLikes(prevLiked ? prevCount - 1 : prevCount + 1);

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
    if (!post) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>

                <span className={styles.categoryLabel}>자유게시판</span>

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
                                {post.isOwner && (
                                    <>
                                        <button className={styles.actionBtn} onClick={() => { navigate(`/boardfree/edit/${id}`) }}>수정</button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                                <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                            </div>
                        </div>
                    </div>

                    {/* 게시글 본문 */}
                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                   {/* 첨부파일 */}
                    <div className={styles.attachmentBox}>
                        <div className={styles.attachmentTitle}>
                            <svg viewBox="0 0 24 24">
                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                            </svg>
                            첨부파일
                        </div>
                        <ul className={styles.attachmentList}>
                            {post.attachments && post.attachments.length > 0 ? (
                                post.attachments.map((file) => (
                                    <li key={file.attmId}>
                                        {/* 클릭 시 다운로드 로직 등을 연결할 수 있습니다 */}
                                        <a 
                                            href={`/download/${file.attmId}`} 
                                            className={styles.attachmentLink}
                                        >
                                            {file.originalName}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li>
                                    <span className={styles.attachmentLink} style={{ color: '#ADB5BD', cursor: 'default' }}>
                                        등록된 첨부파일이 없습니다.
                                    </span>
                                </li>
                            )}
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

                    {/* 댓글 영역 */}
                    <div className={` ${styles.replySection}`} style={{ marginTop: '30px' }}>
                        
                        <div className={styles.attachmentTitle} style={{ borderBottom: '1px solid #E9ECEF', paddingBottom: '15px', marginBottom: '15px' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', marginRight: '6px', verticalAlign: 'middle' }}>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            댓글 <span style={{ color: '#378ADD', marginLeft: '5px' }}>0</span>
                        </div>

                        <form onSubmit={(e) => e.preventDefault()} className={styles.replyForm}>
                            <input 
                                type="text" 
                                className={styles.replyInput} 
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="댓글을 입력해 주세요..." 
                                required 
                            />
                            <button type="submit" className={styles.btnreplySubmit}>댓글 등록</button>
                        </form>

                        <div className={styles.replyList}>
                            <div className={styles.replyItem} style={{ textAlign: 'center', padding: '30px 0', color: '#adb5bd' }}>
                                등록된 댓글이 없습니다.
                            </div>
                        </div>

                        <div className={styles.pagination}>
                            <button className={styles.pageItem}>&lt;</button>
                            <button className={`${styles.pageItem} ${styles.active}`}>1</button>
                            <button className={styles.pageItem}>&gt;</button>
                        </div>

                    </div>

                </div>

                <div className={styles.bottomActions}>
                    <button className={styles.btnList} onClick={() => navigate('/boardfree')}>목록으로</button>
                </div>

            </div>
        </main>
    );
}

export default BoardFreeDetail;