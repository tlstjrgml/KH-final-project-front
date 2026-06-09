import styles from './Main.module.css'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <main className={styles.page}>

      {/* 히어로 */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <span></span>
            정부 공식 복지 데이터 연동
          </div>
          <h1 className={styles.heroTitle}>
            내게 맞는 복지 서비스를,<br/>
            <em>한 곳에서 찾아보세요</em>
          </h1>
          <p className={styles.heroSub}>주거, 일자리, 교육, 금융까지 — 청년을 위한 모든 복지 정보</p>
          <form className={styles.heroSearch} action="#" method="get">
            <input type="text" name="q" placeholder="복지 서비스를 검색해보세요" autoComplete="off"/>
            <button type="submit">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              검색
            </button>
          </form>
        </div>

      </section>

      {/* 카테고리 */}
      <nav className={styles.catRow} aria-label="복지 카테고리">
        <Link to="#" className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          주거
        </Link>
        <Link to="#" className={styles.catChip}>
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          일자리
        </Link>
        <Link to="#" className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"/></svg>
          생활
        </Link>
        <Link to="#" className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          교육
        </Link>
        <Link to="#" className={styles.catChip}>
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          금융
        </Link>
      </nav>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>

          {/* 복지 추천 */}
          <div className={styles.recBox}>
            <div className={styles.recBoxHd}>
              <div className={styles.recBoxIcon}>
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <span className={styles.recBoxTitle}>나에게 맞는 복지 추천</span>
              <span className={styles.recBoxSub}>프로필 기반 자동 매칭</span>
            </div>
            <div className={styles.recChips}>
              <span className={styles.recChip}>청년 월세 특별지원</span>
              <span className={styles.recChip}>청년도약계좌</span>
              <span className={styles.recChip}>국가장학금</span>
              <span className={styles.recChip}>취업성공패키지</span>
              <span className={`${styles.recChip} ${styles.recChipMuted}`}>+ 더 보기 →</span>
            </div>
          </div>

          {/* 복지 서비스 */}
          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>복지 서비스</h2>
              <Link to="/welfarelist" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className={styles.welfareGrid}>
              <Link to="#" className={styles.welfareCard}>
                <div className={styles.welfareIcon}><svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                <span className={styles.welfareBadge}>주거</span>
                <p className={styles.welfareTitle}>청년 월세 한시 특별지원</p>
                <div className={styles.welfareMeta}>
                  <span>지원대상: 만 19~34세</span>
                  <span>신청기간: 2025.03~06</span>
                </div>
              </Link>
              <Link to="#" className={styles.welfareCard}>
                <div className={styles.welfareIcon}><svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                <span className={styles.welfareBadge}>금융</span>
                <p className={styles.welfareTitle}>청년도약계좌 가입 지원</p>
                <div className={styles.welfareMeta}>
                  <span>지원대상: 만 19~34세</span>
                  <span>신청기간: 상시</span>
                </div>
              </Link>
              <Link to="#" className={styles.welfareCard}>
                <div className={styles.welfareIcon}><svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                <span className={styles.welfareBadge}>일자리</span>
                <p className={styles.welfareTitle}>청년 일자리 도약 장려금</p>
                <div className={styles.welfareMeta}>
                  <span>지원대상: 취업 취약청년</span>
                  <span>신청기간: 2025.01~12</span>
                </div>
              </Link>
              <Link to="#" className={styles.welfareCard}>
                <div className={styles.welfareIcon}><svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
                <span className={styles.welfareBadge}>교육</span>
                <p className={styles.welfareTitle}>국가장학금 1유형 지원</p>
                <div className={styles.welfareMeta}>
                  <span>지원대상: 대학생</span>
                  <span>신청기간: 2025.02~03</span>
                </div>
              </Link>
            </div>
          </section>

          {/* 인기 게시글 */}
          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>인기 게시글</h2>
              <Link to="#" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className={styles.boardTabs}>
              <button className={`${styles.boardTab} ${styles.active}`} onClick={() => {}}>자유게시판</button>
              <button className={styles.boardTab} onClick={() => {}}>복지</button>
              <button className={styles.boardTab} onClick={() => {}}>후기</button>
            </div>
            <div className={styles.boardList}>
              <Link to="#" className={styles.boardItem}>
                <div className={styles.boardItemLeft}>
                  <span className={styles.boardNum}>1</span>
                  <span className={styles.boardItemTitle}>청년 월세 지원 신청 후기 공유합니다</span>
                </div>
                <div className={styles.boardItemMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>1.2k</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>48</span>
                </div>
              </Link>
              <Link to="#" className={styles.boardItem}>
                <div className={styles.boardItemLeft}>
                  <span className={styles.boardNum}>2</span>
                  <span className={styles.boardItemTitle}>청년도약계좌 가입 조건 정리해봤어요</span>
                </div>
                <div className={styles.boardItemMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>980</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>32</span>
                </div>
              </Link>
              <Link to="#" className={styles.boardItem}>
                <div className={styles.boardItemLeft}>
                  <span className={styles.boardNum}>3</span>
                  <span className={styles.boardItemTitle}>취준생인데 받을 수 있는 복지 뭐가 있나요?</span>
                </div>
                <div className={styles.boardItemMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>756</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>21</span>
                </div>
              </Link>
              <Link to="#" className={styles.boardItem}>
                <div className={styles.boardItemLeft}>
                  <span className={styles.boardNum}>4</span>
                  <span className={styles.boardItemTitle}>국가장학금 1차 탈락했는데 이의신청 해봤어요</span>
                </div>
                <div className={styles.boardItemMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>634</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>17</span>
                </div>
              </Link>
              <Link to="#" className={styles.boardItem}>
                <div className={styles.boardItemLeft}>
                  <span className={styles.boardNum}>5</span>
                  <span className={styles.boardItemTitle}>청년 일자리 도약 장려금 면접 합격했습니다!</span>
                </div>
                <div className={styles.boardItemMeta}>
                  <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>521</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>15</span>
                </div>
              </Link>
            </div>
          </section>

        </div>

        <div className={styles.rightCol}>

          <section className={styles.sideSection}>
            <h2 className={styles.sideTitle}>
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              인기 복지 TOP 10
            </h2>
            <div className={styles.top10List}>
              <Link to="#" className={styles.top10Item}><span className={`${styles.top10Rank} ${styles.high}`}>1</span><span className={styles.top10Name}>청년 월세 한시 특별지원</span></Link>
              <Link to="#" className={styles.top10Item}><span className={`${styles.top10Rank} ${styles.high}`}>2</span><span className={styles.top10Name}>청년도약계좌</span></Link>
              <Link to="#" className={styles.top10Item}><span className={`${styles.top10Rank} ${styles.high}`}>3</span><span className={styles.top10Name}>국가장학금 1유형</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>4</span><span className={styles.top10Name}>청년 일자리 도약 장려금</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>5</span><span className={styles.top10Name}>중소기업 청년 소득세 감면</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>6</span><span className={styles.top10Name}>청년내일저축계좌</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>7</span><span className={styles.top10Name}>취업성공패키지</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>8</span><span className={styles.top10Name}>청년 창업 지원 프로그램</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>9</span><span className={styles.top10Name}>주거급여 청년 특례</span></Link>
              <Link to="#" className={styles.top10Item}><span className={styles.top10Rank}>10</span><span className={styles.top10Name}>청년 문화누리카드</span></Link>
            </div>
          </section>

          <section className={styles.sideSection}>
            <h2 className={styles.sideTitle}>
              <svg viewBox="0 0 24 24"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
              공지사항
            </h2>
            <div className={styles.noticeList}>
              <Link to="#" className={styles.noticeItem}><div className={styles.noticeDot}></div><span className={styles.noticeTitle}>2025년 복지 서비스 데이터 업데이트 안내</span></Link>
              <Link to="#" className={styles.noticeItem}><div className={styles.noticeDot}></div><span className={styles.noticeTitle}>청년복지MOA 서비스 오픈 안내</span></Link>
              <Link to="#" className={styles.noticeItem}><div className={styles.noticeDot}></div><span className={styles.noticeTitle}>개인정보 처리방침 개정 안내</span></Link>
              <Link to="#" className={styles.noticeItem}><div className={styles.noticeDot}></div><span className={styles.noticeTitle}>복지 서비스 신청 기간 안내</span></Link>
              <Link to="#" className={styles.noticeItem}><div className={styles.noticeDot}></div><span className={styles.noticeTitle}>시스템 점검 안내 (3/15 02:00~04:00)</span></Link>
            </div>
          </section>

        </div>
      </div>

    </main>
  )
}

export default Main