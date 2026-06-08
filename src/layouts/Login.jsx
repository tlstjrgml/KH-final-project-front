import styles from './Login.module.css'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardLogo}>
          <div className={styles.cardLogoIcon}>
            <svg viewBox="0 0 24 24"><path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"/></svg>
          </div>
          <span className={styles.cardLogoText}>청년복지 MOA</span>
        </div>

        <h1 className={styles.cardTitle}>로그인</h1>
        <p className={styles.cardSub}>청년 복지 서비스를 한눈에 확인하세요</p>

        <form onSubmit={(e)=>e.preventDefault()}>
          <div className={styles.field}>
            <label htmlFor="userId">아이디<span className={styles.req}>*</span></label>
            <input type="text" id="userId" name="userId" placeholder="아이디를 입력해주세요" autoComplete="username"/>
          </div>
          <div className={styles.field}>
            <label htmlFor="password">비밀번호<span className={styles.req}>*</span></label>
            <input type="password" id="password" name="password" placeholder="비밀번호를 입력해주세요" autoComplete="current-password"/>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            <svg viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            로그인
          </button>
        </form>

        <div className={styles.divider}>
          <div className={styles.dividerLine}></div>
          <span className={styles.dividerText}>또는</span>
          <div className={styles.dividerLine}></div>
        </div>

        <button className={styles.btnKakao} type="button">
          <svg className={styles.kakaoIcon} viewBox="0 0 20 20">
            <path d="M10 2C5.582 2 2 4.91 2 8.5c0 2.27 1.393 4.263 3.5 5.44l-.7 2.56 3.01-1.98A9.3 9.3 0 0010 15c4.418 0 8-2.91 8-6.5S14.418 2 10 2z" fill="#3C1E1E"/>
          </svg>
          카카오 로그인
        </button>

        <div className={styles.footerLinks}>
          <span className={styles.muted}>계정이 없으신가요?</span>
          <Link to="/signup">회원가입</Link>
          <span className={styles.sep}>·</span>
          <Link to="#">아이디 찾기</Link>
          <span className={styles.sep}>·</span>
          <Link to="#">비밀번호 찾기</Link>
        </div>
      </div>
    </main>
  )
}

export default Login