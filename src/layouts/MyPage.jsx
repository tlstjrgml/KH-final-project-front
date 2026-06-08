import { useState } from 'react'
import styles from './MyPage.module.css'
import { Link } from 'react-router-dom'

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className={styles.page}>
      <div className={styles.pageGrid}>

        <aside className={styles.profileCard}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <button className={styles.avatarEdit} aria-label="프로필 사진 수정">
              <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>

          <p className={styles.profileName}>석희</p>
          <p className={styles.profileId}>@seokHee123</p>
          <p className={styles.profileEmail}>seok@gmail.com</p>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <p className={styles.statNum}>12</p>
              <p className={styles.statLabel}>게시글</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statNum}>34</p>
              <p className={styles.statLabel}>댓글</p>
            </div>
            <div className={styles.statItem}>
              <p className={styles.statNum}>8</p>
              <p className={styles.statLabel}>찜</p>
            </div>
          </div>

          <div className={styles.profileDivider}></div>

          <button className={`${styles.profileBtn} ${styles.btnEdit}`} onClick={() => {}}>
            <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            개인정보 수정
          </button>
          <button className={`${styles.profileBtn} ${styles.btnLogout}`} onClick={() => {}}>
            <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            로그아웃
          </button>
          <button className={`${styles.profileBtn} ${styles.btnWithdraw}`} onClick={() => setIsOpen(true)}>
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
            회원 탈퇴
          </button>
        </aside>

        <div className={styles.rightCol}>

          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>찜한 복지</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
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

          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>내가 쓴 글</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className={styles.postList}>
              <Link to="#" className={styles.postItem}>
                <div className={styles.postLeft}>
                  <span className={styles.postType}>자유</span>
                  <span className={styles.postTitle}>청년 월세 지원 신청 후기 공유합니다</span>
                </div>
                <div className={styles.postMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>1.2k</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>48</span>
                  <span>2025.03.12</span>
                </div>
              </Link>
              <Link to="#" className={styles.postItem}>
                <div className={styles.postLeft}>
                  <span className={styles.postType}>후기</span>
                  <span className={styles.postTitle}>청년도약계좌 가입 조건 정리해봤어요</span>
                </div>
                <div className={styles.postMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>980</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>32</span>
                  <span>2025.03.10</span>
                </div>
              </Link>
              <Link to="#" className={styles.postItem}>
                <div className={styles.postLeft}>
                  <span className={styles.postType}>자유</span>
                  <span className={styles.postTitle}>취준생인데 받을 수 있는 복지 뭐가 있나요?</span>
                </div>
                <div className={styles.postMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>756</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>21</span>
                  <span>2025.03.08</span>
                </div>
              </Link>
            </div>
          </section>

          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>내가 쓴 댓글</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className={styles.postList}>
              <Link to="#" className={styles.postItem}>
                <div className={styles.postLeft}>
                  <span className={styles.postType}>댓글</span>
                  <span className={styles.postTitle}>저도 신청해봤는데 생각보다 어렵지 않았어요!</span>
                </div>
                <div className={styles.postMeta}><span>2025.03.11</span></div>
              </Link>
              <Link to="#" className={styles.postItem}>
                <div className={styles.postLeft}>
                  <span className={styles.postType}>댓글</span>
                  <span className={styles.postTitle}>국가장학금은 소득분위 확인 먼저 하세요</span>
                </div>
                <div className={styles.postMeta}><span>2025.03.09</span></div>
              </Link>
            </div>
          </section>

        </div>
      </div>

      {/* 회원탈퇴 모달 */}
      {isOpen && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span className={styles.modalHeaderTitle}>회원 탈퇴</span>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalWarn}>
                탈퇴 시 계정 정보는 복구되지 않습니다.<br/>
                작성한 게시글/댓글은 익명 처리됩니다.
              </div>
              <div className={styles.modalField}>
                <label>비밀번호 확인</label>
                <input type="password" placeholder="비밀번호를 입력해주세요"/>
              </div>
              <div className={styles.modalActions}>
                <button className={styles.btnCancel} onClick={() => setIsOpen(false)}>취소</button>
                <button className={styles.btnDanger} onClick={() => {}}>
                  <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
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