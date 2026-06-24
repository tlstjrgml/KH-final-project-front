import { useState } from 'react'
import styles from './ExtraInfoModal.module.css'

const ExtraInfoModal = ({ isOpen, onClose, onSave }) => {
  const [form, setForm] = useState({
    region: '',
    jobStatus: '',
    incomeLevel: ''
  })

  if (!isOpen) return null

  const token = localStorage.getItem('token')

  const handleSave = () => {
    fetch('http://localhost:8080/member/me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        region: form.region,
        jobStatus: form.jobStatus,
        incomeLevel: form.incomeLevel ? Number(form.incomeLevel) : null
      })
    }).then(() => {
      onSave()
    })
  }

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

          <div className={styles.field}>
            <label>거주지역</label>
            <select className={styles.incomeSelect} value={form.region} onChange={(e) => setForm(prev => ({ ...prev, region: e.target.value }))}>
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

          <div className={styles.field}>
            <label>취업상태</label>
            <div className={styles.jobChips}>
              {['대학생', '취준생', '사회초년생'].map(job => (
                <div
                  key={job}
                  className={`${styles.jobChip} ${form.jobStatus === job ? styles.active : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, jobStatus: job }))}
                >
                  {job}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label>소득기준</label>
            <select className={styles.incomeSelect} value={form.incomeLevel} onChange={(e) => setForm(prev => ({ ...prev, incomeLevel: e.target.value }))}>
              <option value="">소득기준 선택</option>
              <option value="0">무관</option>
              <option value="1">연소득</option>
              <option value="2">기타</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnLater} onClick={onClose}>나중에 입력</button>
            <button type="button" className={styles.btnSave} onClick={handleSave}>
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtraInfoModal