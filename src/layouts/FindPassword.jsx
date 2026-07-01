import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './FindPassword.module.css';

const FindPassword = () => {
  const [email, setEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [token, setToken] = useState('');
  const [expireTime, setExpireTime] = useState(null);
  const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 완료
  const [isLoading, setIsLoading] = useState(false);

  // 1. 인증코드 발송
  const sendVerifyCode = () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    fetch('http://localhost:8080/member/find-pw/echeck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success === false) {
          alert(data.message);
          return;
        }
        setToken(data.token);
        setExpireTime(data.expireTime);
        setStep(2);
        alert('인증번호가 발송되었습니다.');
      })
      .catch(() => alert('서버 오류가 발생했습니다.'))
      .finally(() => setIsLoading(false));
  };

  // 2. 인증코드 검증 → 임시 비밀번호 발송
  const confirmCode = () => {
    if (!verifyCode) {
      alert('인증코드를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    fetch('http://localhost:8080/member/find-pw/everify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        inputCode: verifyCode,
        expireTime: String(expireTime),
        token
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStep(3);
        } else {
          alert(data.message);
        }
      })
      .catch(() => alert('서버 오류가 발생했습니다.'))
      .finally(() => setIsLoading(false));
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>

        {/* 상단 아이콘 + 제목 */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className={styles.title}>비밀번호 찾기</h1>
          <p className={styles.subtitle}>
            {step === 1 && '가입한 이메일로 임시 비밀번호를 받아보세요.'}
            {step === 2 && `${email}로 발송된 인증번호를 입력해주세요.`}
            {step === 3 && '임시 비밀번호가 이메일로 발송되었습니다.'}
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.done : ''}`}>
            <span className={styles.stepNum}>{step > 1 ? '✓' : '1'}</span>
            <span className={styles.stepLabel}>이메일 입력</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.done : ''}`}>
            <span className={styles.stepNum}>{step > 2 ? '✓' : '2'}</span>
            <span className={styles.stepLabel}>인증코드 확인</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
            <span className={styles.stepNum}>3</span>
            <span className={styles.stepLabel}>완료</span>
          </div>
        </div>

        {/* Step 1: 이메일 입력 */}
        {step === 1 && (
          <div className={styles.body}>
            <div className={styles.field}>
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                placeholder="가입 시 사용한 이메일을 입력해주세요"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendVerifyCode()}
                autoComplete="email"
              />
            </div>
            <button
              className={styles.btnPrimary}
              onClick={sendVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? '발송 중...' : '인증번호 받기'}
            </button>
          </div>
        )}

        {/* Step 2: 인증코드 입력 */}
        {step === 2 && (
          <div className={styles.body}>
            <div className={styles.field}>
              <label htmlFor="code">인증번호</label>
              <input
                type="text"
                id="code"
                placeholder="6자리 인증번호 입력"
                maxLength="6"
                value={verifyCode}
                onChange={e => setVerifyCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmCode()}
                autoComplete="one-time-code"
              />
            </div>
            <p className={styles.hint}>인증번호는 5분간 유효합니다.</p>
            <button
              className={styles.btnPrimary}
              onClick={confirmCode}
              disabled={isLoading}
            >
              {isLoading ? '확인 중...' : '확인'}
            </button>
            <button
              className={styles.btnSecondary}
              onClick={() => { setStep(1); setVerifyCode(''); }}
            >
              이메일 다시 입력
            </button>
          </div>
        )}

        {/* Step 3: 완료 */}
        {step === 3 && (
          <div className={styles.body}>
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <p>임시 비밀번호가 <strong>{email}</strong>로 발송되었습니다.</p>
              <p className={styles.successHint}>로그인 후 마이페이지에서 비밀번호를 변경해주세요.</p>
            </div>
            <Link to="/login" className={styles.btnPrimary} style={{ textDecoration: 'none', textAlign: 'center' }}>
              로그인하기
            </Link>
          </div>
        )}

        <div className={styles.footer}>
          <Link to="/login">로그인으로 돌아가기</Link>
          <span className={styles.dot}>·</span>
          <Link to="/signup">회원가입</Link>
        </div>

      </div>
    </main>
  );
};

export default FindPassword;