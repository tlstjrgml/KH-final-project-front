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