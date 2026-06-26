import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardFreeDetail.module.css';
import { useEffect, useState } from 'react';

const BoardFreeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. 상태(State) 정의
    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const [replyInputs, setReplyInputs] = useState({});
    const [activeReplyForm, setActiveReplyForm] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [editContent, setEditContent] = useState('');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [reportTarget, setReportTarget] = useState(null);

    

    // 2. 게시글 상세 조회 함수
    const fetchBoardDetail = async (token) => {
        try {
            const response = await fetch(`/react/board/${id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!response.ok) throw new Error("게시글 조회 실패");
            const data = await response.json();
            
            console.log("서버에서 받아온 게시글 데이터:", data); 
            
            setPost(data);
            setIsLiked(data.isLiked);
            setLikes(data.likeCount);
        } catch (err) { console.error(err); }
    };
    // 3. 댓글 목록 조회 함수
    const fetchReplies = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/react/reply/list/${id}`, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (!res.ok) throw new Error('댓글 조회 실패');
            const data = await res.json();
            setReplies(data.content || data);
        } catch (err) { console.error(err); }
    };

    const startEdit = (reply) => {
        setEditingReplyId(reply.replyId);
        setEditContent(reply.replyContent);
        setActiveReplyForm(null)
    };

    const cancelEdit = () => {
        setEditingReplyId(null);
        setEditContent('');
    };

    const toggleReplyForm = (replyId) => {
        setActiveReplyForm(activeReplyForm === replyId ? null : replyId);
        setEditingReplyId(null); 
    };



    // 4. 통합 초기화 useEffect (데이터 로드 오케스트레이터)
    useEffect(() => {
        const token = localStorage.getItem("token");
        
        // 현재 유저 정보 세팅
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUser({ id: payload.memberId, nickname: payload.nickname });
            } catch (err) { console.error(err); }
        }

        const init = async () => {
            await fetchBoardDetail(token); // 게시글 먼저 로드
            await fetchReplies();          // 그 다음 댓글 로드
        };
        
        if (id) init();
    }, [id]);

    // 5. 서버 통신 함수들 

    const handleDeletePost = async () => {
        if (!window.confirm('정말 이 게시글을 삭제하시겠습니까?')) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        try {
            const res = await fetch(`/react/board/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                alert('게시글이 성공적으로 삭제되었습니다.');
                navigate('/boardfree'); // 삭제 후 자유게시판 목록으로 이동
            } else {
                const errorText = await res.text();
                alert(`게시글 삭제 실패: ${errorText}`);
            }
        } catch (err) {
            console.error(err);
            alert('서버와의 통신에 실패하였습니다.');
        }
    };

    const handleReplySubmit = async (e, parentId = null, code = 'B') => {
        e.preventDefault();
        const content = parentId ? replyInputs[parentId] : replyContent;
        if (!content?.trim()) return alert('내용을 입력해주세요.');

        const token = localStorage.getItem('token');
        if (!token) return alert('로그인이 필요합니다.');

        try {
            const res = await fetch('/react/reply/write', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ replyContent: content, refId: parentId || id, code: code })
            });

            if (res.ok) {
                parentId ? setReplyInputs({...replyInputs, [parentId]: ''}) : setReplyContent('');
                setActiveReplyForm(null);
                fetchReplies();
            } else {
                alert('등록 실패');
            }
        } catch (err) { console.error(err); }
    };

    const handleDeleteReply = async (replyId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/react/reply/${replyId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) fetchReplies();
    };

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
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('좋아요 처리 실패');

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

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const res = await fetch('/react/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    targetId: reportTarget.targetId,
                    targetType: reportTarget.targetType,
                    reason: reportReason
                })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '신고 접수 실패');
            }

            alert('신고가 접수되었습니다.');
            setIsReportModalOpen(false);
            setReportReason('');
            setReportTarget(null);
        } catch (err) {
            console.error(err);
            alert(`신고 접수 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    const openReportModal = (targetId, targetType) => {
        setReportTarget({ targetId, targetType });
        setIsReportModalOpen(true);
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
                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDeletePost}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => openReportModal(post.boardId || id, 'REV')}>신고</button>
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
                            <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            첨부파일 ({post?.attachments?.length || 0})
                        </div>
                        <ul className={styles.attachmentList}>
                            {post?.attachments && post.attachments.length > 0 ? (
                                post.attachments.map((file) => (
                                    <li key={file.attmId}>
                                        <a 
                                            href={`/react/board/download/${file.attmId}`} 
                                            className={styles.attachmentLink}
                                            download={file.originalName} 
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {file.originalName || '첨부파일'}
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
                    <div className={styles.replySection} style={{ marginTop: '30px' }}>
                        <div className={styles.attachmentTitle} style={{ borderBottom: '1px solid #E9ECEF', paddingBottom: '15px', marginBottom: '15px' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '18px', height: '18px', marginRight: '6px' }}>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                            댓글 <span style={{ color: '#378ADD', marginLeft: '5px' }}>{replies.filter(r => r.code === 'B').length}</span>
                        </div>

                        {/* 댓글 작성 폼 */}
                        <form onSubmit={(e) => handleReplySubmit(e, null, 'B')} className={styles.replyForm} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input 
                                type="text" 
                                className={styles.replyInput} 
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="댓글을 입력해 주세요..." 
                                required 
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <button type="submit" className={styles.btnreplySubmit} style={{ padding: '0 20px', borderRadius: '8px', background: '#378ADD', color: '#fff', border: 'none' }}>댓글 등록</button>
                        </form>

                        <div className={styles.replyList}>
                            {replies.filter(r => r.code === 'B').length > 0 ? (
                                replies.filter(r => r.code === 'B').map(parent => (
                                    <div key={parent.replyId} style={{ padding: '20px 0', borderBottom: '1px solid #f1f3f5' }}>
                                        {/* 작성자 및 날짜 */}
                                        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'center' }}>
                                            <strong style={{ fontSize: '15px' }}>{parent.writerNickname}</strong>
                                            <span style={{ fontSize: '13px', color: '#888' }}>{parent.createDate?.split('T')[0]}</span>
                                        </div>
                                        
                                        {/* 댓글 수정폼 */}
                                        {editingReplyId === parent.replyId ? (
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    value={editContent}
                                                    onChange={(e) => setEditContent(e.target.value)}
                                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                                                    autoFocus
                                                />
                                                <button type="button" onClick={() => submitEdit(parent.replyId)} style={{ padding: '0 20px', borderRadius: '8px', background: '#378ADD', color: '#fff', border: 'none', cursor: 'pointer' }}>저장</button>
                                                <button type="button" onClick={cancelEdit} style={{ padding: '0 20px', borderRadius: '8px', background: '#6C757D', color: '#fff', border: 'none', cursor: 'pointer' }}>취소</button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className={styles.replyText} style={{ margin: '5px 0' }}>{parent.replyContent}</div>

                                            </>
                                        )}

                                        {/*  버튼 */}
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => setActiveReplyForm(activeReplyForm === parent.replyId ? null : parent.replyId)} style={{ fontSize: '13px', border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}>대댓글</button>
                                            <span className={styles.metaDivider}>|</span>
                                            {currentUser?.id === parent.memberId && (
                                                <>
                                                    <button onClick={() => {setEditingReplyId(parent.replyId); setEditContent(parent.replyContent);}} style={{ fontSize: '13px', border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}>수정</button>
                                                    <span className={styles.metaDivider}>|</span>
                                                    <button onClick={() => handleDeleteReply(parent.replyId)} style={{ fontSize: '13px', border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}>삭제</button>
                                                    <span className={styles.metaDivider}>|</span>      
                                                </>
                                            )}
                                            <button onClick={() => openReportModal(parent.replyId, 'REP')} style={{ fontSize: '13px', border: 'none', background: 'none', color: '#666', cursor: 'pointer' }}>신고</button>
                                        </div>

                                        {activeReplyForm === parent.replyId && (
                                            <form onSubmit={(e) => handleReplySubmit(e, parent.replyId, 'R')} style={{ marginTop: '10px', display: 'flex', gap: '8px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <span style={{ alignSelf: 'center', color: '#aaa' }}>↳</span>
                                                <input 
                                                    value={replyInputs[parent.replyId] || ''} 
                                                    onChange={(e) => setReplyInputs({...replyInputs, [parent.replyId]: e.target.value})} 
                                                    placeholder="대댓글을 입력해 주세요..." 
                                                    style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} 
                                                />
                                                <button type="submit" style={{ padding: '0 20px', borderRadius: '4px', background: '#888', color: '#fff', border: 'none' }}>등록</button>
                                            </form>
                                        )}


                                        {/* 대댓글 입력 및 목록 */}
                                        {replies.filter(r => r.code === 'R' && r.refId === parent.replyId).map(child => (
                                            <div className={styles.replyItem} key={child.replyId} style={{ marginLeft: '40px', marginTop: '10px', padding: '10px', background: '#f8f9fa', borderRadius: '8px' }}>
                                                <div className={styles.replyInfo}>
                                                    <span className={styles.replyAuthor}>↳ {child.writerNickname}</span>
                                                    <span className={styles.replyDate}>{child.createDate?.split('T')[0]}</span>
                                                </div>

                                                {/* 대댓글 수정 폼 */}
                                                {editingReplyId === child.replyId ? (
                                                    <div className={styles.replyForm} style={{ marginTop: '5px' }}>
                                                        <input
                                                            type="text"
                                                            className={styles.replyInput}
                                                            value={editContent}
                                                            onChange={(e) => setEditContent(e.target.value)}
                                                            style={{ padding: '5px' }}
                                                        />
                                                        <button type="button" style={{ padding: '0 10px', borderRadius: '4px', background: '#888', color: '#fff', border: 'none' }} onClick={() => submitEdit(child.replyId)}>저장</button>
                                                        <button type="button" className={styles.actionBtn} onClick={cancelEdit}>취소</button>
                                                    </div>
                                                ) : (
                                                    <div className={styles.replyText} style={{ margin: '5px 0' }}>{child.replyContent}</div>
                                                )}

                                                    <div className={styles.replyActions}>
                                                        {currentUser?.id === child.memberId && editingReplyId !== child.replyId && (
                                                            <>
                                                                <button className={styles.actionBtn} onClick={() => startEdit(child)} > 수정 </button>
                                                                <span className={styles.metaDivider}>|</span>
                                                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteReply(child.replyId)} > 삭제 </button>
                                                                <span className={styles.metaDivider}>|</span>
                                                            </>                                                           
                                                        )}
                                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => openReportModal(child.replyId, 'REP')}> 신고 </button>

                                                    </div>
                                                </div>
                                        ))}

                                    </div>
                                ))
                            ) : (<div style={{ textAlign: 'center', padding: '40px', color: '#adb5bd' }}>등록된 댓글이 없습니다.</div> )}
                        </div>
                    </div>

                </div>

                <div className={styles.bottomActions}>
                    <button className={styles.btnList} onClick={() => navigate('/boardfree')}>목록으로</button>
                </div>

            </div>

            {/* 신고 영역 */}
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
                        <h3 style={{ marginBottom: '16px' }}>{reportTarget?.targetType === 'REP' ? '댓글 신고' : '게시글 신고'}</h3>

                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="신고 사유를 직접 입력해주세요."
                            style={{
                                width: '100%', height: '120px', borderRadius: '8px',
                                border: '1px solid #ddd', padding: '12px',
                                marginBottom: '16px', fontSize: '15px', resize: 'none',
                                boxSizing: 'border-box', fontFamily: 'inherit'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => { setIsReportModalOpen(false); setReportReason(''); setReportTarget(null); }}
                                style={{
                                    padding: '10px 20px', borderRadius: '8px',
                                    border: '1px solid #ddd', background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                취소
                            </button>
                            <button
                                type="button"
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