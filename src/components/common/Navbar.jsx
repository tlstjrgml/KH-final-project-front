import React from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom'

function Navbar({ isLoggedIn = false, nickname = '' }) {
  return (
    <header className={styles.gnb}>
      
      <div className={styles.inner}>
        
        {/* 로고 영역 (.logo) */}
        <Link to="#" className={styles.logo}>
          <div className={styles.logoIcon}>
            
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
              <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
            </svg>
          </div>
          <span className={styles.logoText}>청년복지 MOA</span>
        </Link>

        {/* 내비 링크 메뉴 영역 (.navList, .navLink) */}
        <ul className={styles.navList}>
          <li><Link to="#" className={styles.navLink}>복지서비스</Link></li>
          <li><Link to="#" className={styles.navLink}>커뮤니티</Link></li>
          <li><Link to="#" className={styles.navLink}>공지사항</Link></li>
        </ul>

        {/* 우측 액션 버튼 영역 (.actions) */}
        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              <span className={styles.welcome}>{nickname}님 환영합니다</span>
              
              <button className={`${styles.btn} ${styles.btnOutline}`}>마이페이지</button>
              <button className={`${styles.btn} ${styles.btnGhost}`}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className={`${styles.btn} ${styles.btnOutline}`}>로그인</button></Link>
              <Link to="/signup"><button className={`${styles.btn} ${styles.btnFill}`}>회원가입</button></Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;