import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './WelfareDetail.module.css'

const BADGE_CLASS = {
  '주거':           styles.badgeBlue,
  '일자리':         styles.badgeAmber,
  '생활':           styles.badgePink,
  '교육':           styles.badgeBlue,
  '금융':           styles.badgeGreen,
  '참여･기반':      styles.badgeGray,
  '금융･복지･문화': styles.badgeGreen,
}

const WelfareDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [w, setW] = useState(null)
  const [wished, setWished] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:8080/api/welfare/detail/${id}`)
      .then(res => res.json())
      .then(data => setW(data))
  }, [id])

  if (!w) return <div>로딩 중...</div>

  return (
    <div className={styles.pageBg}>
      <div className={styles.detailWrap}>
        <div className={styles.dcard}>
          <div className={styles.detailBadgeRow}>
            <span className={`${styles.badge} ${BADGE_CLASS[w.lclsfNm] || styles.badgeGray}`}>{w.lclsfNm}</span>
          </div>
          <div className={styles.detailTitle}>{w.plcyNm}</div>
          <div className={styles.detailOrg}>{w.sprvsnInstCdNm} · 최종 업데이트 {w.lastMdfcnDt}</div>
          <table className={styles.infoTable}>
            <tbody>
              <tr><td>지원대상</td><td>만 {w.sprtTrgtMinAge}세 ~ {w.sprtTrgtMaxAge}세</td></tr>
              <tr><td>지원제한대상</td><td>{w.ptcpPrpTrgtCn || '-'}</td></tr>
              <tr><td>소득기준</td><td>{w.earnEtcCn || '-'}</td></tr>
              <tr><td>정책지원내용</td><td>{w.plcySprtCn || '-'}</td></tr>
              <tr><td>신청기간</td><td>{w.aplyYmd || '상시'}</td></tr>
              <tr><td>신청방법</td><td>{w.plcyAplyMthdCn || '-'}</td></tr>
            </tbody>
          </table>
          <div className={styles.btnRow}>
            <button className={`${styles.btnHeart} ${wished ? styles.on : ''}`} onClick={() => setWished(p => !p)}>
              {wished ? '♥ 찜 해제' : '♡ 찜하기'}
            </button>
            {w.aplyUrlAddr && (
              <button className={styles.btnApply} onClick={() => window.open(w.aplyUrlAddr, '_blank')}>
                신청하러 가기 →
              </button>
            )}
          </div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>지원 내용</div>
          <div className={styles.detailContent}>{w.plcyExplnCn || '-'}</div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>심사 방법</div>
          <div className={styles.detailContent}>
            {w.srngMthdCn
              ? w.srngMthdCn.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)
              : '-'
            }
          </div>
        </div>

        <div className={styles.dcard}>
          <button className={styles.btnList} onClick={() => navigate(-1)}>
            ← 목록으로
          </button>
        </div>

      </div>
    </div>
  )
}

export default WelfareDetail