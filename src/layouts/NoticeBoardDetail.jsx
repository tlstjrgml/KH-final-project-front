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

    useEffect(() => {
        const token = localStorage.getItem("token");

        // JWT 토큰 디코딩 후 현재 유저의 관리자(Admin) 권한 여부 확인
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

        // 백엔드 API로부터 공지사항 상세 데이터 조회
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

    // 게시글 좋아요 등록 및 취소 토글 처리
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

    // 현재 공지사항 게시글 삭제 처리
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

    // 첨부파일을 Blob으로 받아와 강제 다운로드시키는 함수 (다른 도메인 URL에서도 동작하도록)
    const handleFileDownload = async (fileUrl, fileName) => {
        try {
            const res = await fetch(fileUrl);
            if (!res.ok) throw new Error('파일을 가져오지 못했습니다.');

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error(err);
            alert('파일 다운로드 중 오류가 발생했습니다.');
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
                                {/* 관리자(Admin) 권한 유저에게만 수정 및 삭제 버튼 노출 */}
                                {isAdminUser && (
                                    <>
                                        <button className={styles.actionBtn} onClick={() => navigate(`/noticeboard/edit/${id}`)}>수정</button>
                                        <span className={styles.metaDivider}>|</span>
                                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDeletePost}>삭제</button>
                                        <span className={styles.metaDivider}>|</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.postContent}>
                        {post.boardContent}
                    </div>

                    {/* 서버에서 받아온 첨부파일 목록 렌더링, 이미지는 미리보기 표시, 클릭 시 Blob 방식으로 다운로드 */}
                    <div className={styles.attachmentBox}>
                        <div className={styles.attachmentTitle}>
                            <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                            첨부파일 {post.attachments && post.attachments.length > 0 ? `(${post.attachments.length})` : ''}
                        </div>
                        <ul className={styles.attachmentList}>
                            {post.attachments && post.attachments.length > 0 ? (
                                post.attachments.map((file, index) => {
                                    const fileId = file.attmId || file.fileId || index;
                                    const fileName = file.originalName || file.originName || '첨부파일';
                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);

                                    return (
                                        <li key={fileId}>
                                            {isImage ? (
                                                <div className={styles.imagePreviewBox}>
                                                    <img
                                                        src={file.attmPath}
                                                        alt={fileName}
                                                        className={styles.previewImage}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.attachmentLink}
                                                        onClick={() => handleFileDownload(file.attmPath, fileName)}
                                                    >
                                                        {fileName}
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className={styles.attachmentLink}
                                                    onClick={() => handleFileDownload(file.attmPath, fileName)}
                                                >
                                                    {fileName}
                                                </button>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                <li>
                                    <a href="#" className={styles.attachmentLink} onClick={(e) => e.preventDefault()}>
                                        등록된 첨부파일이 없습니다.
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

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
        </main>
    );
};

export default NoticeBoardDetail;