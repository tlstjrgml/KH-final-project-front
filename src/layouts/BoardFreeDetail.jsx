import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardFreeDetail.module.css';
import { useEffect, useState } from 'react';

const BoardFreeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const [replyContent, setReplyContent] = useState('');
    const [replies, setReplies] = useState([]);
    const [activeReplyForm, setActiveReplyForm] = useState(null); // 대댓글 입력창 제어용
    const [replyInputs, setReplyInputs] = useState({}); // 대댓글 입력값 저장용
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const [currentUser, setCurrentUser] = useState(null);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("");

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
            setIsLiked(prevLiked);
            setLikes(prevCount);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleReport = async () => {
        if (!reportReason.trim()) {
            alert('신고 사유를 입력해주세요.');
            return;
        }
        alert('신고가 접수되었습니다.');
        setIsReportModalOpen(false);
        setReportReason('');
    };

    const handleDeletePost = async () => {
        if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/react/board/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '삭제 실패');
            }

            alert('게시글이 삭제되었습니다.');
            navigate('/boardfree');
        } catch (err) {
            console.error(err);
            alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    const handleReplySubmit = async (e, parentId = null, code = 'B') => {
    e.preventDefault();
    const content = parentId ? replyInputs[parentId] : replyContent;

    if (!content?.trim()) return alert('내용을 입력해주세요.');

    const token = localStorage.getItem('token');
        try {
            const res = await fetch('/reply/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ replyContent: content, refId: parentId || id, code: code })
            });

            if (!res.ok) throw new Error(await res.text());
            
            // 입력 초기화 및 목록 재조회
            parentId ? setReplyInputs({...replyInputs, [parentId]: ''}) : setReplyContent('');
            setActiveReplyForm(null);
            fetchReplies(); 
        } catch (err) { alert(err.message); }
    };

    const submitEdit = async (replyId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/reply/${replyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ replyContent: editContent })
        });
        if (res.ok) { setEditingReplyId(null); fetchReplies(); }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('삭제하시겠습니까?')) return;
        const token = localStorage.getItem('token');
        await fetch(`/reply/${replyId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
        fetchReplies();
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
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => navigate(`//edit/${post.boardId || id}`)}>
                                            수정
                                        </button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button
                                            className={`${styles.actionBtn} ${styles.danger}`}
                                            onClick={handleDeletePost}
                                        >
                                            삭제
                                        </button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => setIsReportModalOpen(true)}>신고</button>
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
                                post.attachments.map((file) => {
                                     const fileId = file.attmId || file.fileId || index;
                                    const fileName = file.originalName || file.originName || '첨부파일';

                                    return (
                                        <li key={fileId} className={styles.attachmentItem}>
                                            <a
                                                href={`/react/board/dsownload/${fileId}`}
                                                download={fileName}
                                                className={styles.fileLink}
                                            >
                                                {fileName}
                                            </a>
                                        </li>

                                    );
                                })
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
                            {replies.filter(r => r.code === 'B').map(parent => (
                                <div key={parent.replyId} className={styles.replyItem}>
                                    {/* 원댓글 표시 */}
                                    <div>{parent.writerNickname}: {parent.replyContent}</div>
                                    <button onClick={() => setActiveReplyForm(parent.replyId)}>대댓글</button>

                                    {/* 대댓글 입력창 (activeReplyForm이 parent.replyId일 때만 노출) */}
                                    {activeReplyForm === parent.replyId && (
                                        <form onSubmit={(e) => handleReplySubmit(e, parent.replyId, 'R')}>
                                            <input 
                                                value={replyInputs[parent.replyId] || ''} 
                                                onChange={(e) => setReplyInputs({...replyInputs, [parent.replyId]: e.target.value})}
                                            />
                                            <button type="submit">등록</button>
                                        </form>
                                    )}

                                    {/* 대댓글 목록 (refId가 부모 ID와 같은 것들) */}
                                    {replies.filter(r => r.code === 'R' && r.refId === parent.replyId).map(child => (
                                        <div key={child.replyId} style={{ marginLeft: '30px', color: '#666' }}>
                                            ↳ {child.writerNickname}: {child.replyContent}
                                            {currentMemberId === child.memberId && (
                                                <>
                                                    <button onClick={() => {setEditingReplyId(child.replyId); setEditContent(child.replyContent);}}>수정</button>
                                                    <button onClick={() => handleDeleteReply(child.replyId)}>삭제</button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
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
            
            {/* 신고창 */}
            {isReportModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '12px',
                        padding: '30px', width: '400px'
                    }}>
                        <h3 style={{ marginBottom: '16px' }}>게시글 신고</h3>
                        <select
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            style={{
                                width: '100%', height: '44px', borderRadius: '8px',
                                border: '1px solid #ddd', padding: '0 12px',
                                marginBottom: '16px', fontSize: '15px'
                            }}
                        >
                            <option value="">신고 사유를 선택해주세요</option>
                            <option value="spam">스팸/광고</option>
                            <option value="abuse">욕설/비방</option>
                            <option value="abuse">음란물/혐오</option>
                            <option value="privacy">개인정보 노출</option>
                            <option value="false">허위정보</option>
                            <option value="etc">기타</option>
                        </select>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => { setIsReportModalOpen(false); setReportReason(''); }}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    border: '1px solid #ddd', background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleReport}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    border: 'none', background: '#e53e3e',
                                    color: 'white', cursor: 'pointer'
                                }}
                            >
                                신고하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default BoardFreeDetail;