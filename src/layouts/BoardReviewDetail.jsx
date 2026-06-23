import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardReviewDetail.module.css';

const BoardReviewDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [postLikes, setPostLikes] = useState(0);
    const [welfareInfo, setWelfareInfo] = useState(null);

    // 댓글 관련 state
    const [replies, setReplies] = useState([]);
    const [replyCount, setReplyCount] = useState(0);
    const [replyPage, setReplyPage] = useState(1);
    const [replyEndPage, setReplyEndPage] = useState(1);
    const [newComment, setNewComment] = useState('');

    const [activeReplyForm, setActiveReplyForm] = useState(null);
    const [replyInputs, setReplyInputs] = useState({});

    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');

    const currentMemberId = (() => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split('.')[1])).memberId;
        } catch {
            return null;
        }
    })();

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

                if (data.welfareId) {
                    const wRes = await fetch(`/api/welfare/detail/${data.welfareId}`);
                    if (wRes.ok) {
                        const wData = await wRes.json();
                        setWelfareInfo(wData);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchDetail();
    }, [id]);

    // 댓글 목록 조회
    const fetchReplies = async () => {
        try {
            const res = await fetch(`/react/reply/list/${id}?page=${replyPage}&limit=10`);
            if (!res.ok) throw new Error('댓글 조회 실패');
            const data = await res.json();

            setReplies(data.content || []);
            setReplyEndPage(data.pagination?.endPage || 1);

            const totalCount = data.pagination?.totalItems ?? data.content.filter(r => r.code === 'B').length;
            setReplyCount(totalCount);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReplies();
    }, [id, replyPage]);

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

            if (!res.ok) throw new Error('좋아요 처리 실패');
        } catch (err) {
            console.error(err);
            setIsPostLiked(prevLiked);
            setPostLikes(prevCount);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    // 게시글 삭제
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
            navigate('/boardreview');
        } catch (err) {
            console.error(err);
            alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    // 원댓글 등록
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const res = await fetch('/react/reply/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    replyContent: newComment,
                    refId: id,
                    code: 'B'
                })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '댓글 등록 실패');
            }

            setNewComment('');
            fetchReplies();
        } catch (err) {
            console.error(err);
            alert(`댓글 등록 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    // 대댓글 입력창 토글
    const toggleReplyForm = (replyId) => {
        setActiveReplyForm(activeReplyForm === replyId ? null : replyId);
    };

    // 대댓글 입력값 변경
    const handleReplyInputChange = (replyId, value) => {
        setReplyInputs(prev => ({ ...prev, [replyId]: value }));
    };

    // 대댓글 등록
    const handleReplySubmit = async (e, parentReplyId) => {
        e.preventDefault();

        const content = replyInputs[parentReplyId];
        if (!content || !content.trim()) {
            alert('대댓글 내용을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const res = await fetch('/react/reply/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    replyContent: content,
                    refId: parentReplyId,
                    code: 'R'
                })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '대댓글 등록 실패');
            }

            setReplyInputs(prev => ({ ...prev, [parentReplyId]: '' }));
            setActiveReplyForm(null);
            fetchReplies();
        } catch (err) {
            console.error(err);
            alert(`대댓글 등록 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    // 댓글 수정 모드 진입
    const startEdit = (reply) => {
        setEditingReplyId(reply.replyId);
        setEditContent(reply.replyContent);
    };

    const cancelEdit = () => {
        setEditingReplyId(null);
        setEditContent('');
    };

    // 댓글 수정 등록
    const submitEdit = async (replyId) => {
        if (!editContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const res = await fetch(`/react/reply/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ replyContent: editContent })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '댓글 수정 실패');
            }

            setEditingReplyId(null);
            setEditContent('');
            fetchReplies();
        } catch (err) {
            console.error(err);
            alert(`댓글 수정 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    // 댓글 삭제
    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/react/reply/${replyId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('삭제 실패');
            fetchReplies();
        } catch (err) {
            console.error(err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    if (!post) return <div>로딩 중...</div>;

    const parentReplies = replies.filter(r => r.code === 'B');
    const getChildReplies = (parentId) => replies.filter(r => r.code === 'R' && r.refId === parentId);

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>
                <span className={styles.categoryLabel}>후기게시판</span>
                <div className={styles.detailCard}>

                    <div className={styles.welfareServiceBox}>
                        <div className={styles.welfareInfo}>
                            <strong>대상 복지 서비스:</strong> {welfareInfo ? welfareInfo.plcyNm : '연결된 복지 없음'}
                        </div>

                        {post.welfareId && (
                            <button
                                className={styles.btnShortcut}
                                onClick={() => navigate(`/welfaredetail/${post.welfareId}`)}>
                                복지 서비스 글 바로가기
                            </button>
                        )}
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
                                            onClick={() => navigate(`/boardreview/edit/${post.boardId || id}`)}>
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
                                <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                    {post && post.attachments && post.attachments.length > 0 && (
                        <div className={styles.attachmentSection}>
                            <h4 className={styles.attachmentHeader}>첨부파일 ({post.attachments.length})</h4>
                            <ul className={styles.attachmentList}>
                                {post.attachments.map((file, index) => {
                                    const fileId = file.attmId || file.fileId || index;
                                    const fileName = file.originalName || file.originName || '첨부파일';

                                    return (
                                        <li key={fileId} className={styles.attachmentItem}>
                                            <span className={styles.fileIcon}>📁</span>
                                            <a
                                                href={`/react/board/download/${fileId}`}
                                                download={fileName}
                                                className={styles.fileLink}
                                            >
                                                {fileName}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div className={styles.likeActionArea}>
                        <button className={`${styles.btnLike} ${isPostLiked ? styles.liked : ''}`} onClick={togglePostLike}>
                            <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            좋아요 <span>{postLikes}</span>
                        </button>
                    </div>

                    <div className={styles.commentSection}>
                        <h3 className={styles.commentHeader}>댓글 <span>{replyCount}</span></h3>

                        <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                            <input
                                type="text"
                                className={styles.commentInput}
                                placeholder="댓글을 입력해 주세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button type="submit" className={styles.btnCommentSubmit}>댓글 등록</button>
                        </form>

                        <div className={styles.commentList}>
                            {parentReplies.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#999' }}>등록된 댓글이 없습니다.</p>
                            ) : (
                                parentReplies.map((reply) => (
                                    <div className={styles.commentItem} key={reply.replyId}>
                                        <div className={styles.commentInfo}>
                                            <span className={styles.commentAuthor}>{reply.writerNickname}</span>
                                            <span className={styles.commentDate}>{reply.createDate.split('T')[0]}</span>
                                        </div>

                                        {editingReplyId === reply.replyId ? (
                                            <div className={styles.commentForm}>
                                                <input
                                                    type="text"
                                                    className={styles.commentInput}
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                />
                                                <button type="button" className={styles.btnCommentSubmit} onClick={() => submitEdit(reply.replyId)}>저장</button>
                                                <button type="button" className={styles.actionBtn} onClick={cancelEdit}>취소</button>
                                            </div>
                                        ) : (
                                            <div className={styles.commentText}>{reply.replyContent}</div>
                                        )}

                                        <div className={styles.commentActions}>
                                            <button
                                                type="button"
                                                className={styles.actionBtn}
                                                onClick={(e) => {
                                                    console.log('onClick 실행됨!');
                                                    const newState = activeReplyForm === reply.replyId ? null : reply.replyId;
                                                    console.log('activeReplyForm을 이렇게 변경:', newState);
                                                    setActiveReplyForm(newState);
                                                }}
                                            >
                                                대댓글
                                            </button>
                                            {currentMemberId === reply.memberId && editingReplyId !== reply.replyId && (
                                                <>
                                                    <span className={styles.metaDivider}>|</span>
                                                    <button className={styles.actionBtn} onClick={() => startEdit(reply)}>수정</button>
                                                    <span className={styles.metaDivider}>|</span>
                                                    <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteReply(reply.replyId)}>삭제</button>
                                                </>
                                            )}
                                        </div>

                                        {activeReplyForm === reply.replyId && (
                                            <form
                                                className={`${styles.commentForm} ${styles.replyFormWrapper} ${styles.active}`}
                                                onSubmit={(e) => handleReplySubmit(e, reply.replyId)}
                                            >
                                                <div className={styles.replyIndicator}>↳</div>
                                                <input
                                                    type="text"
                                                    className={styles.commentInput}
                                                    placeholder="대댓글을 입력해 주세요..."
                                                    value={replyInputs[reply.replyId] || ''}
                                                    onChange={(e) => handleReplyInputChange(reply.replyId, e.target.value)}
                                                />
                                                <button type="submit" className={styles.btnCommentSubmit} style={{ background: '#6C757D' }}>등록</button>
                                            </form>
                                        )}

                                        {getChildReplies(reply.replyId).map((child) => (
                                            <div className={styles.commentItem} key={child.replyId} style={{ marginLeft: '24px' }}>
                                                <div className={styles.commentInfo}>
                                                    <span className={styles.commentAuthor}>{child.writerNickname}</span>
                                                    <span className={styles.commentDate}>{child.createDate.split('T')[0]}</span>
                                                </div>

                                                {editingReplyId === child.replyId ? (
                                                    <div className={styles.commentForm}>
                                                        <input
                                                            type="text"
                                                            className={styles.commentInput}
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                        />
                                                        <button type="button" className={styles.btnCommentSubmit} onClick={() => submitEdit(child.replyId)}>저장</button>
                                                        <button type="button" className={styles.actionBtn} onClick={cancelEdit}>취소</button>
                                                    </div>
                                                ) : (
                                                    <div className={styles.commentText}>{child.replyContent}</div>
                                                )}

                                                {currentMemberId === child.memberId && editingReplyId !== child.replyId && (
                                                    <div className={styles.commentActions}>
                                                        <button className={styles.actionBtn} onClick={() => startEdit(child)}>수정</button>
                                                        <span className={styles.metaDivider}>|</span>
                                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteReply(child.replyId)}>삭제</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={styles.pagination}>
                            <button
                                className={styles.pageItem}
                                onClick={() => replyPage > 1 && setReplyPage(replyPage - 1)}
                                disabled={replyPage <= 1}
                            >
                                &lt;
                            </button>
                            {Array.from({ length: replyEndPage }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    className={`${styles.pageItem} ${p === replyPage ? styles.active : ''}`}
                                    onClick={() => setReplyPage(p)}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                className={styles.pageItem}
                                onClick={() => replyPage < replyEndPage && setReplyPage(replyPage + 1)}
                                disabled={replyPage >= replyEndPage}
                            >
                                &gt;
                            </button>
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