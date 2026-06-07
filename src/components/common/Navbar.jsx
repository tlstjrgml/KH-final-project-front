import React from 'react';
import './Navbar.css'; 

function Navbar({ isLoggedIn = false, nickname = '' }) {
  return (
    <header className="gnb">
      
      <div className="inner">
        
        {/* 로고 영역 (.logo) */}
        <a href="#" className="logo">
          <div className="logoIcon">
            
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff">
              <path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z" />
            </svg>
          </div>
          <span className="logoText">청년복지 MOA</span>
        </a>

        {/* 내비 링크 메뉴 영역 (.navList, .navLink) */}
        <ul className="navList">
          <li><a href="#" className="navLink">복지서비스</a></li>
          <li><a href="#" className="navLink">커뮤니티</a></li>
          <li><a href="#" className="navLink">공지사항</a></li>
        </ul>

        {/* 우측 액션 버튼 영역 (.actions) */}
        <div className="actions">
          {isLoggedIn ? (
            <>
              <span className="welcome">{nickname}님 환영합니다</span>
              
              <button className="btn btnOutline">마이페이지</button>
              <button className="btn btnGhost">로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn btnOutline">로그인</button>
              <button className="btn btnFill">회원가입</button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;