import styles from './ExtraInfoModal.module.css'

const ExtraInfoModal = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <div className={styles.modalHeaderLeft}>
            <div className={styles.modalHeaderIcon}>
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className={styles.modalTitle}>추가 정보 입력</p>
              <p className={styles.modalSub}>맞춤 복지 추천에 활용돼요 · 나중에도 입력 가능</p>
            </div>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="닫기">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className={styles.modalBody}>

          <div className={styles.noticeBox}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>입력하지 않아도 서비스 이용은 가능하지만, 입력하면 내 상황에 맞는 복지 서비스를 더 정확하게 추천받을 수 있어요.</span>
          </div>

          <form onSubmit={(e)=>e.preventDefault()}>

            <div className={styles.field}>
              <label>거주지역</label>
              <div className={styles.regionRow}>
                <select id="sido" onChange={() => updateSigungu()}>
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
                <select id="sigungu">
                  <option value="">시/군/구 선택</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label>취업상태</label>
              <div className={styles.jobChips}>
                <div className={styles.jobChip} onClick={() => selectJob('student')}>대학생</div>
                <div className={styles.jobChip} onClick={() => selectJob('jobseeker')}>취준생</div>
                <div className={styles.jobChip} onClick={() => selectJob('newcomer')}>사회초년생</div>
              </div>
              <input type="hidden" id="jobStatus" name="jobStatus"/>
            </div>

            <div className={styles.field}>
              <label htmlFor="incomeLevel">소득분위</label>
              <select className={styles.incomeSelect} id="incomeLevel" name="incomeLevel">
                <option value="">소득분위 선택</option>
                <option value="1">1분위 (최저 소득)</option>
                <option value="2">2분위</option>
                <option value="3">3분위</option>
                <option value="4">4분위</option>
                <option value="5">5분위 (중위 소득)</option>
                <option value="6">6분위</option>
                <option value="7">7분위</option>
                <option value="8">8분위</option>
                <option value="9">9분위</option>
                <option value="10">10분위 (최고 소득)</option>
              </select>
              <p className={styles.incomeHint}>1분위(최저) ~ 10분위(최고) · 건강보험료 기준 중위소득 구간</p>
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.btnLater} onClick={onClose}>나중에 입력</button>
              <button type="button" className={styles.btnSave} onClick={onSave}>
                <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                저장
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  )
}

export default ExtraInfoModal