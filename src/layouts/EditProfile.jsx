import { useState, useEffect } from 'react'
import styles from './EditProfile.module.css'
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [profile, setProfile] = useState({
        nickname: '',
        email: '',
        name: '',
        birthDate: '',
        gender: '',
        phone: '',
        region: '',
        jobStatus: '',
        incomeLevel: '',
        password: '',
        passwordConfirm: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/member/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setProfile({
                nickname: data.nickname || '',
                email: data.email || '',
                name: data.name || '',
                birthDate: data.birthDate ? data.birthDate.substring(0, 10) : '',
                gender: data.gender || '',
                phone: data.phone || '',
                region: data.region || '',
                jobStatus: data.jobStatus || '',
                incomeLevel: data.incomeLevel || '',
                password: '',
                passwordConfirm: ''
            }));
    }, []);
    const rawParts = profile.birthDate ? profile.birthDate.substring(0, 10).split('-') : ['', '', ''];
    const birthParts = [
        rawParts[0] || '',
        rawParts[1] ? String(rawParts[1]).padStart(2, '0') : '',
        rawParts[2] ? String(rawParts[2]).padStart(2, '0') : ''
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleGender = (gender) => {
        setProfile(prev => ({ ...prev, gender }));
    };

    const handleJobStatus = (jobStatus) => {
        setProfile(prev => ({ ...prev, jobStatus }));
    };

    const handleBirthChange = (e) => {
        const { name, value } = e.target;
        const parts = [...birthParts];
        if (name === 'birthYear') parts[0] = value;
        if (name === 'birthMonth') parts[1] = value;
        if (name === 'birthDay') parts[2] = value;
        setProfile(prev => ({ ...prev, birthDate: parts.join('-') }));
    };

    const handleSave = () => {
        if(!profile.nickname || !profile.birthDate || !profile.phone || !profile.gender){
            alert('필수 항목을 모두 입력해주세요');
            return;
        }
        const token = localStorage.getItem('token');

        fetch('http://localhost:8080/member/me', {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nickname: profile.nickname,
                email: profile.email,
                name: profile.name,
                birthDate: profile.birthDate.substring(0,10),
                gender: profile.gender,
                phone: profile.phone,
                region: profile.region,
                jobStatus: profile.jobStatus,
                incomeLevel: profile.incomeLevel ? Number(profile.incomeLevel) : null
            })
        });

        if (profile.password) {
            fetch('http://localhost:8080/member/me/password', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newPassword: profile.password,
                    confirmPassword: profile.passwordConfirm
                })
            });
        }

        navigate(-1);
    };

    return (
        <main className={styles.page}>
            <h1 className={styles.pageTitle}>개인정보 수정</h1>

            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    계정 정보
                </h2>

                <div className={styles.field}>
                    <label htmlFor="email">이메일<span className={styles.req}></span></label>
                    <input type="email" id="email" name="email" value={profile.email} onChange={handleChange} />
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">비밀번호 <span className={styles.sectionHint}>(변경 시에만 입력)</span></label>
                    <input type="password" id="password" name="password" placeholder="새 비밀번호" autoComplete="new-password" value={profile.password} onChange={handleChange} />
                </div>

                <div className={styles.field}>
                    <label htmlFor="passwordConfirm">비밀번호 확인 <span className={styles.sectionHint}>(변경 시에만 입력)</span></label>
                    <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="새 비밀번호를 다시 입력해주세요" autoComplete="new-password" value={profile.passwordConfirm} onChange={handleChange} />
                </div>
            </section>

            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                    <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    기본 정보
                </h2>

                <div className={styles.field}>
                    <label htmlFor="nickname">닉네임<span className={styles.req}>*</span></label>
                    <input type="text" id="nickname" name="nickname" value={profile.nickname} onChange={handleChange} />
                </div>

                <div className={styles.field}>
                    <label>생년월일<span className={styles.req}>*</span></label>
                    <div className={styles.birthRow}>
                        <select id="birthYear" name="birthYear" value={birthParts[0]} onChange={handleBirthChange}>
                            <option value="">년도</option>
                            {Array.from({ length: 83 }, (_, i) => 2006 - i).map(year => (
                                <option key={year} value={year}>{year}년</option>
                            ))}
                        </select>
                        <select id="birthMonth" name="birthMonth" value={birthParts[1]} onChange={handleBirthChange}>
                            <option value="">월</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={String(month).padStart(2, '0')}>{month}월</option>
                            ))}
                        </select>
                        <select id="birthDay" name="birthDay" value={birthParts[2]} onChange={handleBirthChange}>
                            <option value="">일</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                <option key={day} value={String(day).padStart(2, '0')}>{day}일</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>성별<span className={styles.req}>*</span></label>
                    <div className={styles.genderRow}>
                        <div className={`${styles.genderChip} ${profile.gender === 'M' ? styles.active : ''}`} onClick={() => handleGender('M')}>
                            <svg viewBox="0 0 24 24"><circle cx="10" cy="14" r="5" /><line x1="15" y1="9" x2="20" y2="4" /><polyline points="16 4 20 4 20 8" /></svg>
                            남자
                        </div>
                        <div className={`${styles.genderChip} ${profile.gender === 'F' ? styles.active : ''}`} onClick={() => handleGender('F')}>
                            <svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6" /><line x1="12" y1="16" x2="12" y2="22" /><line x1="9" y1="20" x2="15" y2="20" /></svg>
                            여자
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="phone">전화번호<span className={styles.req}>*</span></label>
                    <input type="tel" id="phone" name="phone" placeholder="010-0000-0000" value={profile.phone} onChange={handleChange} />
                </div>
            </section>

            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                    <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    복지 추천 정보
                    <span className={styles.sectionHint}>(맞춤 추천을 위한 정보예요)</span>
                </h2>

                <div className={styles.field}>
                    <label>거주지역</label>
                    <div className={styles.regionRow}>
                        <select id="sido" name="region" value={profile.region} onChange={handleChange}>
                            <option value="">시/도 선택</option>
                            <option value="서울">서울특별시</option>
                            <option value="부산">부산광역시</option>
                            <option value="대구">대구광역시</option>
                            <option value="인천">인천광역시</option>
                            <option value="광주">광주광역시</option>
                            <option value="대전">대전광역시</option>
                            <option value="울산">울산광역시</option>
                            <option value="세종">세종특별자치시</option>
                            <option value="경기">경기도</option>
                            <option value="강원">강원특별자치도</option>
                            <option value="충북">충청북도</option>
                            <option value="충남">충청남도</option>
                            <option value="전북">전북특별자치도</option>
                            <option value="전남">전라남도</option>
                            <option value="경북">경상북도</option>
                            <option value="경남">경상남도</option>
                            <option value="제주">제주특별자치도</option>
                        </select>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>취업상태</label>
                    <div className={styles.jobChips}>
                        <div className={`${styles.jobChip} ${profile.jobStatus === '대학생' ? styles.active : ''}`} onClick={() => handleJobStatus('대학생')}>대학생</div>
                        <div className={`${styles.jobChip} ${profile.jobStatus === '취준생' ? styles.active : ''}`} onClick={() => handleJobStatus('취준생')}>취준생</div>
                        <div className={`${styles.jobChip} ${profile.jobStatus === '사회초년생' ? styles.active : ''}`} onClick={() => handleJobStatus('사회초년생')}>사회초년생</div>
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="incomeLevel">소득기준</label>
                    <select className={styles.incomeSelect} id="incomeLevel" name="incomeLevel" value={profile.incomeLevel} onChange={handleChange}>
                        <option value="">소득기준 선택</option>
                        <option value="0">무관</option>
                        <option value="1">연소득</option>
                        <option value="2">기타</option>
                    </select>
                    <p className={styles.fieldHint}>복지 서비스의 소득 조건 기준에 따라 추천돼요</p>
                </div>
            </section>

            <div className={styles.actions}>
                <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>취소</button>
                <button type="button" className={styles.btnSave} onClick={handleSave}>
                    <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
                    저장하기
                </button>
            </div>
        </main>
    );
}

export default EditProfile;