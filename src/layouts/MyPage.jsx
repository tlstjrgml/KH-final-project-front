import { useState, useEffect } from 'react'
import styles from './MyPage.module.css'
import { Link, useNavigate } from 'react-router-dom'

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [boards, setBoards] = useState([]);
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token')
    Promise.all([
      fetch('http://localhost:8080/member/me', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:8080/member/me/boards', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:8080/member/me/replies', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([profileData, boardsData, repliesData]) => {
      setProfile(profileData);
      setBoards(boardsData);
      setReplies(repliesData);
    })
  }, [])

  return (
    <main className={styles.page}>
      <div className={styles.pageGrid}>

        <aside className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </div>
            <button className={styles.avatarEdit} aria-label="프로필 사진 수정">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
          </div>

          <p className={styles.profileName}>{profile?.nickname}</p>
          <p className={styles.profileEmail}>{profile?.email}</p>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <p className={styles.statNum}>{profile?.boardCount}</p>
              <p className={styles.statLabel}>게시글</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statNum}>{profile?.replyCount}</p>
              <p className={styles.statLabel}>댓글</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statNum}>{profile?.wishCount}</p>
              <p className={styles.statLabel}>찜</p>
            </div>
          </div>

          <div className={styles.profileDivider}></div>

          <button className={`${styles.profileBtn} ${styles.btnEdit}`} onClick={() => { navigate('/edit-profile') }}>
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            개인정보 수정
          </button>
          <button className={`${styles.profileBtn} ${styles.btnLogout}`} onClick={() => {
            localStorage.removeItem('token')
            window.location.replace('/');
          }}>
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            로그아웃
          </button>
          <button className={`${styles.profileBtn} ${styles.btnWithdraw}`} onClick={() => setIsOpen(true)}>
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /><line x1="18" y1="8" x2="23" y2="13" /><line x1="23" y1="8" x2="18" y2="13" /></svg>
            회원 탈퇴
          </button>
        </aside>

        <div className={styles.rightCol}>

          {/* 찜한 복지 - 더미 데이터 유지 (WishResponseDto 작업 후 교체 예정) */}
          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>찜한 복지</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </div>
            <div className={styles.wishGrid}>
              <Link to="#" className={styles.wishCard}>
                <span className={styles.wishBadge}>주거</span>
                <p className={styles.wishTitle}>청년 월세 한시 특별지원</p>
                <p className={styles.wishDate}>찜한 날짜: 2025.03.12</p>
              </Link>
              <Link to="#" className={styles.wishCard}>
                <span className={styles.wishBadge}>금융</span>
                <p className={styles.wishTitle}>청년도약계좌 가입 지원</p>
                <p className={styles.wishDate}>찜한 날짜: 2025.03.10</p>
              </Link>
              <Link to="#" className={styles.wishCard}>
                <span className={styles.wishBadge}>교육</span>
                <p className={styles.wishTitle}>국가장학금 1유형 지원</p>
                <p className={styles.wishDate}>찜한 날짜: 2025.03.08</p>
              </Link>
            </div>
          </section>

          {/* 내가 쓴 글 - 실제 API 데이터 */}
          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>내가 쓴 글</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </div>
            <div className={styles.postList}>
              {boards.map((board) => (
                <Link to={`/board/${board.boardId}`} key={board.boardId} className={styles.postItem}>
                  <div className={styles.postLeft}>
                    <span className={styles.postType}>{board.boardType}</span>
                    <span className={styles.postTitle}>{board.boardTitle}</span>
                  </div>
                  <div className={styles.postMeta}>
                    <span>{board.views}</span>
                    <span>{board.likes}</span>
                    <span>{board.createDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 내가 쓴 댓글 - 실제 API 데이터 */}
          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>내가 쓴 댓글</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg>
              </Link>
            </div>
            <div className={styles.postList}>
              {replies.map((reply) => (
                <Link to={`/board/${reply.boardId}`} key={reply.replyId} className={styles.postItem}>
                  <div className={styles.postLeft}>
                    <span className={styles.postType}>{reply.code === 'B' ? '댓글' : '대댓글'}</span>
                    <span className={styles.postTitle}>{reply.replyContent}</span>
                  </div>
                  <div className={styles.postMeta}>
                    <span>{reply.createDate}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* 회원탈퇴 모달 */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span className={styles.modalHeaderTitle}>회원 탈퇴</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalWarn}>
                탈퇴 시 계정 정보는 복구되지 않습니다.<br />
                작성한 게시글/댓글은 익명 처리됩니다.
              </div>
              <div className={styles.modalField}>
                <label>비밀번호 확인</label>
                <input type="password" placeholder="비밀번호를 입력해주세요" />
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnCancel} onClick={() => setIsOpen(false)}>취소</button>
                <button className={styles.btnDanger} onClick={() => {}}>
                  <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                  탈퇴하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

export default MyPage