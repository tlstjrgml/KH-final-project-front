import styles from './EditProfile.module.css'

const EditProfile = () =>{
    return(
        <main className={styles.page}>
            <h1 className={styles.pageTitle}>개인정보 수정</h1>

            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                계정 정보
                </h2>
            
                <div className={styles.field}>
                <label htmlFor="userId">아이디</label>
                <input type="text" id="userId" value="seokHee123" readOnly/>
                <p className={styles.fieldHint}>아이디는 변경할 수 없어요</p>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="email">이메일<span className={styles.req}>*</span></label>
                <input type="email" id="email" name="email" value="seok@gmail.com"/>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="password">비밀번호 <span className={styles.sectionHint}>(변경 시에만 입력)</span></label>
                <input type="password" id="password" name="password" placeholder="새 비밀번호 (8자 이상, 영문+숫자+특수문자)" autoComplete="new-password"/>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="passwordConfirm">비밀번호 확인 <span className={styles.sectionHint}>(변경 시에만 입력)</span></label>
                <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="새 비밀번호를 다시 입력해주세요" autoComplete="new-password"/>
                </div>
            </section>
            
            
            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                기본 정보
                </h2>
            
                <div className={styles.field}>
                <label htmlFor="nickname">닉네임<span className={styles.req}>*</span></label>
                <input type="text" id="nickname" name="nickname" value="석희"/>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="name">이름<span className={styles.req}>*</span></label>
                <input type="text" id="name" name="name" placeholder="실명을 입력해주세요"/>
                </div>
            
                <div className={styles.field}>
                <label>생년월일<span className={styles.req}>*</span></label>
                <div className={styles.birthRow}>
                    <select id="birthYear" name="birthYear">
                    <option value="">년도</option>
                    </select>
                    <select id="birthMonth" name="birthMonth">
                    <option value="">월</option>
                    </select>
                    <select id="birthDay" name="birthDay">
                    <option value="">일</option>
                    </select>
                </div>
                </div>
            
                <div className={styles.field}>
                <label>성별<span className={styles.req}>*</span></label>
                <div className={styles.genderRow}>
                    <div className={`${styles.genderChip} ${styles.active}`} id="chip-male" onClick={()=>{}}>
                    <svg viewBox="0 0 24 24"><circle cx="10" cy="14" r="5"/><line x1="15" y1="9" x2="20" y2="4"/><polyline points="16 4 20 4 20 8"/></svg>
                    남자
                    </div>
                    <div className={styles.genderChip} id="chip-female" onClick={()=>{}}>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="10" r="6"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="9" y1="20" x2="15" y2="20"/></svg>
                    여자
                    </div>
                </div>
                <input type="hidden" id="gender" name="gender" value="M"/>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="phone">전화번호<span className={styles.req}>*</span></label>
                <input type="tel" id="phone" name="phone" placeholder="010-0000-0000"/>
                </div>
            </section>
            
            
            <section className={styles.sectionBox}>
                <h2 className={styles.sectionBoxTitle}>
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                복지 추천 정보
                <span className={styles.sectionHint}>(맞춤 추천을 위한 정보예요)</span>
                </h2>
            
                <div className={styles.field}>
                <label>거주지역</label>
                <div className={styles.regionRow}>
                    <select id="sido" name="sido" onChange={()=>{}}>
                    <option value="">시/도 선택</option>
                    <option value="서울"  >서울특별시</option>
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
                    <select id="sigungu" name="sigungu">
                    <option value="">시/군/구 선택</option>
                    </select>
                </div>
                </div>
            
                <div className={styles.field}>
                <label>취업상태</label>
                <div className={styles.jobChips}>
                    <div className={`${styles.jobChip} ${styles.active}`} onClick={()=>{}}>대학생</div>
                    <div className={styles.jobChip} onClick={()=>{}}>취준생</div>
                    <div className={styles.jobChip} onClick={()=>{}}>사회초년생</div>
                </div>
                <input type="hidden" id="jobStatus" name="jobStatus" value="student"/>
                </div>
            
                <div className={styles.field}>
                <label htmlFor="incomeLevel">소득분위</label>
                <select className={styles.incomeSelect} id="incomeLevel" name="incomeLevel">
                    <option value="">소득분위 선택</option>
                    <option value="1">1분위 (최저 소득)</option>
                    <option value="2">2분위</option>
                    <option value="3">3분위</option>
                    <option value="4"  >4분위</option>
                    <option value="5">5분위 (중위 소득)</option>
                    <option value="6">6분위</option>
                    <option value="7">7분위</option>
                    <option value="8">8분위</option>
                    <option value="9">9분위</option>
                    <option value="10">10분위 (최고 소득)</option>
                </select>
                <p className={styles.fieldHint}>1분위(최저) ~ 10분위(최고) · 건강보험료 기준 중위소득 구간</p>
                </div>
            </section>
            
            
            <div className={styles.actions}>
                <button type="button" className={styles.btnCancel} onClick={()=>{}}>취소</button>
                <button type="button" className={styles.btnSave} onClick={()=>{}}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                저장하기
                </button>
            </div>
            
            </main>
    )
}

export default EditProfile