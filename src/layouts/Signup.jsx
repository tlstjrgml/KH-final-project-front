import { useEffect, useState } from 'react'
import styles from './Signup.module.css'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    gender: ''
  });
  const [verifyCode, setVerifyCode] = useState('');
  const [token, setToken] = useState('');
  const [expireTime, setExpireTime] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const[emailError, setEmailError] = useState('');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // 이메일 바뀌면 중복확인 초기화
    if (name === 'email') {
      setIsEmailChecked(false);
      setIsVerified(false);
    }
  };

  const pwChecks = {
    hasLower: /[a-z]/.test(form.password),
    hasUpper: /[A-Z]/.test(form.password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password),
    hasLength: form.password.length >= 9
  };
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  useEffect(()=>{
    if(!form.email){
      return;
    }
    const timer = setTimeout(()=>{
      if(EMAIL_REGEX.test(form.email)){
        setEmailError('');
      }else{
        setEmailError('올바르지 않은 형식의 이메일입니다');
      }
    },1000);
    return () =>{
      clearTimeout(timer);
    };
  },[form.email]);

  // 1. 이메일 중복확인
  
  const checkEmailDuplicate = () => {
    if (!form.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if(!EMAIL_REGEX.test(form.email)){
      alert('부적절한 형식의 이메일입니다.');
      return;
    }
    fetch(`http://localhost:8080/member/check-email?email=${form.email}`)
      .then(res => {
        if (res.ok) {
          alert('사용 가능한 이메일입니다.');
          setIsEmailChecked(true);
        } else {
          alert('이미 사용중인 이메일입니다.');
          setIsEmailChecked(false);
        }
      });
  };

  // 2. 인증 이메일 발송
  const sendVerifyCode = () => {
    if (!isEmailChecked) {
      alert('이메일 중복확인을 먼저 해주세요.');
      return;
    }
    fetch('http://localhost:8080/member/echeck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email })
    })
      .then(res => res.json())
      .then(data => {
        setToken(data.token);
        setExpireTime(data.expireTime);
        alert('인증번호가 발송되었습니다.');
      });
  };

  // 3. 인증코드 확인
  const confirmCode = () => {
    if (!verifyCode) {
      alert('인증코드를 입력해주세요.');
      return;
    }
    fetch('http://localhost:8080/member/everify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        inputCode: verifyCode,
        expireTime: String(expireTime),
        token: token
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsVerified(true);
          alert('이메일 인증이 완료되었습니다.');
        } else {
          alert(data.message);
        }
      });
  };

  // 4. 회원가입
  const handleSubmit = (e) => {
    e.preventDefault();

    // 필수항목 체크
    if (!form.email || !form.password || !form.passwordConfirm || !form.nickname || !form.gender) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    // 이메일 중복확인 체크
    if (!isEmailChecked) {
      alert('이메일 중복확인을 해주세요.');
      return;
    }
    // 이메일 인증 체크
    if (!isVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }
    // 비밀번호 형식 체크
    if (!Object.values(pwChecks).every(v => v === true)) {
      alert('비밀번호 형식을 확인해주세요.');
      return;
    }
    // 비밀번호 일치 체크
    if (form.password !== form.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    fetch('http://localhost:8080/member/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
        inputCode: verifyCode,
        expireTime: String(expireTime),
        token: token
      })
    })
      .then(res => res.text())
      .then(data => {
        if (data === '회원가입 성공') {
          alert('회원가입이 완료되었습니다.');
          navigate('/login');
        } else {
          alert(data);
        }
      });
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.cardTitle}>회원가입</h1>
        <p className={styles.cardSub}>서비스 이용을 위한 기본 정보를 입력해주세요</p>

        <form onSubmit={handleSubmit}>

          <div className={styles.field}>
            <label htmlFor="email">이메일<span className={styles.req}>*</span></label>
            <div className={styles.inputRow}>
              <input type="email" id="email" name="email" placeholder="이메일 주소를 입력해주세요"
                autoComplete="email" value={form.email} onChange={handleChange} />
              <button type="button" className={styles.btnInline} onClick={checkEmailDuplicate}>중복확인</button>
            </div>
            {emailError && <p style={{color: '#E03101', fontSize:'13px', marginTop: '6px'}}>{emailError}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="password">비밀번호<span className={styles.req}>*</span></label>
            <input type="password" id="password" name="password"
              placeholder="영문 소문자+대문자+특수문자 9자리 이상"
              autoComplete="new-password" value={form.password} onChange={handleChange} />
          </div>
          {form.password && (
            <ul className={styles.pwChecklist}>
              <li className={pwChecks.hasLower ? styles.valid : styles.invalid}>✓ 영문 소문자 포함</li>
              <li className={pwChecks.hasUpper ? styles.valid : styles.invalid}>✓ 영문 대문자 1자리 이상</li>
              <li className={pwChecks.hasSpecial ? styles.valid : styles.invalid}>✓ 특수문자 1자리 이상</li>
              <li className={pwChecks.hasLength ? styles.valid : styles.invalid}>✓ 9자리 이상</li>
            </ul>
          )}

          <div className={styles.field}>
            <label htmlFor="passwordConfirm">비밀번호 확인<span className={styles.req}>*</span></label>
            <input type="password" id="passwordConfirm" name="passwordConfirm"
              placeholder="비밀번호를 다시 입력해주세요"
              autoComplete="new-password" value={form.passwordConfirm} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label htmlFor="nickname">닉네임<span className={styles.req}>*</span></label>
            <input type="text" id="nickname" name="nickname"
              placeholder="2~10자" value={form.nickname} onChange={handleChange} />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">이메일 인증<span className={styles.req}>*</span></label>
            <div className={styles.inputRow}>
              <input type="text" readOnly value={form.email} style={{ background: '#F8F9FA', color: '#ADB5BD' }} />
              <button type="button" className={styles.btnInline} onClick={sendVerifyCode}>
                <svg style={{ width: '14px', height: '14px', fill: 'none', stroke: 'currentColor', strokeWidth: '2', verticalAlign: '-2px', marginRight: '3px' }} viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                인증
              </button>
            </div>
            <div className={styles.verifyRow}>
              <input type="text" placeholder="인증코드 6자리 입력" maxLength="6"
                value={verifyCode} onChange={(e) => setVerifyCode(e.target.value)} />
              <button type="button" className={styles.btnVerify} onClick={confirmCode}>확인</button>
            </div>
            {isVerified && <p style={{ color: '#1D9E75', fontSize: '13px', marginTop: '6px' }}>✓ 이메일 인증이 완료되었습니다.</p>}
          </div>

          <div className={styles.field}>
            <label>성별<span className={styles.req}>*</span></label>
            <div className={styles.genderRow}>
              <div className={`${styles.genderChip} ${form.gender === 'M' ? styles.active : ''}`}
                onClick={() => setForm(prev => ({ ...prev, gender: 'M' }))}>
                <svg viewBox="0 0 24 24"><circle cx="10" cy="14" r="5" /><line x1="15" y1="9" x2="20" y2="4" /><polyline points="16 4 20 4 20 8" /></svg>
                남자
              </div>
              <div className={`${styles.genderChip} ${form.gender === 'F' ? styles.active : ''}`}
                onClick={() => setForm(prev => ({ ...prev, gender: 'F' }))}>
                <svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="9" y1="20" x2="15" y2="20" /></svg>
                여자
              </div>
            </div>
          </div>

          <button type="submit" className={styles.btnPrimary}>
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            회원가입
          </button>
        </form>

        <div className={styles.footerLinks}>
          <span className={styles.muted}>이미 계정이 있으신가요?</span>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </main>
  );
}

export default Signup;