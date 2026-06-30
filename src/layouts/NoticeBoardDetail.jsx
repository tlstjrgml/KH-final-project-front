import { useNavigate, useParams } from 'react-router-dom';
import styles from './NoticeBoardDetail.module.css';
import { useEffect, useState } from 'react';

const NoticeBoardDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [isAdminUser, setIsAdminUser] = useState(false);

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const decoded = JSON.parse(jsonPayload);
                setIsAdminUser(decoded.isAdmin === 'Y');
            } catch (error) {
                console.error(error);
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
                setIsLiked(data.isLiked || false);
                setLikes(data.likeCount || 0);
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

            if (!res.ok) throw new Error('좋아요 처리 실패');
        } catch (err) {
            console.error(err);
            setIsLiked(prevLiked);
            setLikes(prevCount);
            alert('좋아요 처리 중 오류가 발생했습니다.');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('공지사항을 삭제하시겠습니까?')) return;

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

            alert('공지사항이 삭제되었습니다.');
            navigate('/noticeboard');
        } catch (err) {
            console.error(err);
            alert(`삭제 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
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
                    targetId: post.boardId || id,
                    targetType: 'NOT',
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
        } catch (err) {
            console.error(err);
            alert(`신고 접수 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    if (!post) return <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>

    return (
        <main className={styles.page}>
            <div className={styles.contentWrapper}>
                <span className={styles.categoryLabel}>공지사항</span>

                <div className={styles.detailCard}>
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
                                {isAdminUser && (
                                    <>
                                        <button className={styles.actionBtn} onClick={() => navigate(`/noticeboard/edit/${id}`)}>수정</button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDeletePost}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                            </div>
                            <div className={styles.postMetaRight}>
                                {isAdminUser && (
                                    <>
                                        <button className={styles.actionBtn} onClick={() => navigate(`/noticeboard/edit/${id}`)}>수정</button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDeletePost}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                                <button className={`${styles.actionBtn} ${styles.danger}`} onClick={openReportModal}>신고</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                    {/* 이미지 미리보기 영역 */}
                    {post.attachments && post.attachments.some(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.originalName || f.originName || '')) && (
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {post.attachments.map((file, idx) => {
                                const fileName = file.originalName || file.originName || '';
                                const isImg = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                                if (!isImg) return null;
                                return (
                                    <div key={file.attmId || idx} className={styles.imagePreviewBox}>
                                        <img
                                            src={file.attmPath}
                                            alt={fileName}
                                            className={styles.previewImage}
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 첨부파일 다운로드 영역 */}
                    {post.attachments && post.attachments.length > 0 && (
                        <div className={styles.attachmentBox}>
                            <div className={styles.attachmentTitle}>첨부파일</div>
                            <ul className={styles.attachmentList}>
                                {post.attachments.map((file, idx) => {
                                    const fileName = file.originalName || file.originName || '';
                                    return (
                                        <li key={file.attmId || idx}>
                                            <a href={file.attmPath} target="_blank" rel="noreferrer" className={styles.attachmentLink}>
                                                📎 {fileName}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    <div className={styles.likeActionArea}>
                        <button
                            id="btn-post-like"
                            className={`${styles.btnLike} ${isLiked ? styles.liked : ''}`}
                            onClick={togglePostLike}
                        >
                            <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                            좋아요 <span>{likes}</span>
                        </button>
                    </div>
                </div>

                <div className={styles.bottomActions}>
                    <button className={styles.btnList} onClick={() => navigate('/noticeboard')}>목록으로</button>
                </div>
            </div>
            {isReportModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ background: 'white', borderRadius: '12px', padding: '30px', width: '400px' }}>
                        <h3 style={{ marginBottom: '16px' }}>공지사항 신고</h3>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="신고 사유를 직접 입력해주세요."
                            style={{ width: '100%', height: '120px', borderRadius: '8px', border: '1px solid #ddd', padding: '12px', marginBottom: '16px', fontSize: '15px', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => { setIsReportModalOpen(false); setReportReason(''); }}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' }}>
                                취소
                            </button>
                            <button type="button" onClick={handleReport}
                                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#e53e3e', color: 'white', cursor: 'pointer' }}>
                                신고하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
};

export default NoticeBoardDetail;