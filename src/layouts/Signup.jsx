import styles from './Signup.module.css'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <main className={styles.page}>
      <div className={styles.card}>

        <h1 className={styles.cardTitle}>회원가입</h1>
        <p className={styles.cardSub}>서비스 이용을 위한 기본 정보를 입력해주세요</p>

        <form onSubmit={(e)=>e.preventDefault()}>

          <div className={styles.field}>
            <label htmlFor="userId">아이디<span className={styles.req}>*</span></label>
            <div className={styles.inputRow}>
              <input type="text" id="userId" name="userId" placeholder="영문, 숫자 조합 6~20자" autoComplete="username"/>
              <button type="button" className={styles.btnInline} onClick={() => checkDuplicate('userId')}>중복확인</button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="password">비밀번호<span className={styles.req}>*</span></label>
            <input type="password" id="password" name="password" placeholder="8자 이상, 영문 + 숫자 + 특수문자" autoComplete="new-password"/>
          </div>

          <div className={styles.field}>
            <label htmlFor="passwordConfirm">비밀번호 확인<span className={styles.req}>*</span></label>
            <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="비밀번호를 다시 입력해주세요" autoComplete="new-password"/>
          </div>

          <div className={styles.field}>
            <label htmlFor="nickname">닉네임<span className={styles.req}>*</span></label>
            <div className={styles.inputRow}>
              <input type="text" id="nickname" name="nickname" placeholder="2~10자"/>
              <button type="button" className={styles.btnInline} onClick={() => checkDuplicate('nickname')}>중복확인</button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="email">이메일<span className={styles.req}>*</span></label>
            <div className={styles.inputRow}>
              <input type="email" id="email" name="email" placeholder="이메일 주소"/>
              <button type="button" className={styles.btnInline} onClick={() => sendVerifyCode()}>
                <svg style={{width:'14px', height:'14px', fill:'none', stroke:'currentColor', strokeWidth:'2', verticalAlign:'-2px', marginRight:'3px'}} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                인증
              </button>
            </div>
            <div className={styles.verifyRow}>
              <input type="text" id="verifyCode" placeholder="인증코드 6자리 입력" maxLength="6"/>
              <button type="button" className={styles.btnVerify} onClick={() => confirmCode()}>확인</button>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="birthDate">생년월일<span className={styles.req}>*</span></label>
            <input type="date" id="birthDate" name="birthDate"/>
          </div>

          <div className={styles.field}>
            <label>성별<span className={styles.req}>*</span></label>
            <div className={styles.genderRow}>
              <div className={styles.genderChip} id="chip-male" onClick={() => selectGender('M')}>
                <svg viewBox="0 0 24 24"><circle cx="10" cy="14" r="5"/><line x1="15" y1="9" x2="20" y2="4"/><polyline points="16 4 20 4 20 8"/></svg>
                남자
              </div>
              <div className={styles.genderChip} id="chip-female" onClick={() => selectGender('F')}>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="9" y1="20" x2="15" y2="20"/></svg>
                여자
              </div>
            </div>
            <input type="hidden" id="gender" name="gender"/>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            회원가입
          </button>
        </form>

        <div className={styles.footerLinks}>
          <span className={styles.muted}>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </main>
  )
}

export default Signup