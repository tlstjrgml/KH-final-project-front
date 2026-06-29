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
  const [related, setRelated] = useState([])
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch(`http://localhost:8080/api/welfare/detail/${id}`)
      .then(res => res.json())
      .then(data => {
        setW(data)
        return fetch(`http://localhost:8080/api/welfare/related?lclsfNm=${encodeURIComponent(data.lclsfNm)}&excludeId=${id}`)
      })
      .then(res => res.json())
      .then(data => setRelated(data))

    if (token) {
      fetch(`http://localhost:8080/api/wish/check/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setWished(data))
    }
  }, [id])

  const decodeHtml = (text) => {
    if (!text) return text
    const txt = document.createElement('textarea')
    txt.innerHTML = text
    let result = txt.value
    txt.innerHTML = result
    return txt.value
  }

  const toggleWish = async () => {
  if (!token) {
    alert('로그인이 필요합니다.')
    navigate('/login')
    return
  }
  const method = wished ? 'DELETE' : 'POST'
  await fetch(`http://localhost:8080/api/wish/${id}`, {
    method,
    headers: { 'Authorization': `Bearer ${token}` }
  })
  setWished(prev => !prev)
  setW(prev => ({ ...prev, wishCount: wished ? prev.wishCount - 1 : prev.wishCount + 1 }))
 } 

  if (!w) return <div>로딩 중...</div>

  return (
    <div className={styles.pageBg}>
      <div className={styles.detailWrap}>
        <div className={styles.dcard}>
          <button className={styles.btnBack} onClick={() => navigate('/welfarelist')}>←</button>
          <div className={styles.detailBadgeRow}>
            <span className={`${styles.badge} ${BADGE_CLASS[w.lclsfNm] || styles.badgeGray}`}>{w.lclsfNm}</span>
          </div>
          <div className={styles.detailTitle}>{w.plcyNm}</div>
          <div className={styles.detailOrg}>{w.sprvsnInstCdNm} · 최종 업데이트 {w.lastMdfcnDt}</div>
          <table className={styles.infoTable}>
            <tbody>
              <tr><td>지원대상</td><td>만 {w.sprtTrgtMinAge}세 ~ {w.sprtTrgtMaxAge}세</td></tr>
              <tr><td>지원제한대상</td><td>{decodeHtml(w.ptcpPrpTrgtCn) || '-'}</td></tr>
              <tr><td>소득기준</td><td>{decodeHtml(w.earnEtcCn) || '-'}</td></tr>
              <tr><td>정책지원내용</td><td>{decodeHtml(w.plcySprtCn) || '-'}</td></tr>
              <tr><td>신청기간</td><td>{decodeHtml(w.aplyYmd) || '상시'}</td></tr>
              <tr><td>신청방법</td><td>{decodeHtml(w.plcyAplyMthdCn) || '-'}</td></tr>
            </tbody>
          </table>
           {w.aplyUrlAddr ? (
              <>
                <div className={styles.btnRow}>
                   <button className={styles.btnApply} onClick={() => window.open(w.aplyUrlAddr, '_blank')}>
                    신청하러 가기 →
                  </button>
                  <button className={`${styles.btnHeart} ${wished ? styles.on : ''}`} onClick={toggleWish}>
                    {wished ? '♥ 찜 해제' : '♡ 찜하기'}
                  </button>  
                </div>
                <div className={styles.wishCount}>총 <span>{w.wishCount}</span>명이 찜했어요</div>
              </>
            ) : (
              <div className={styles.heartOnlyBox}>
                <button className={`${styles.btnHeart} ${wished ? styles.on : ''}`} onClick={toggleWish}>
                  {wished ? '♥ 찜 해제' : '♡ 찜하기'}
                </button>
                <div className={styles.wishCountInline}>총 <span>{w.wishCount}</span>명이 찜했어요</div>
              </div>
            )}
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>지원 내용</div>
          <div className={styles.detailContent}>{decodeHtml(w.plcyExplnCn) || '-'}</div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>심사 방법</div>
          <div className={styles.detailContent}>
            {w.srngMthdCn
              ? decodeHtml(w.srngMthdCn).split('\n').map((line, i) => <span key={i}>{line}<br /></span>)
              : '-'
            }
          </div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.secHd}>
            <span className={styles.secTitle}>관련 복지 추천</span>
            <span className={styles.relSub}>같은 카테고리 · {w.lclsfNm}</span>
          </div>
          <div className={styles.relGrid}>
            {related.map(r => (
              <div key={r.welfareId} className={styles.wcard} onClick={() => { window.scrollTo(0, 0); navigate(`/welfaredetail/${r.welfareId}`) }}>
                <div className={styles.wcardTitle}>{r.plcyNm}</div>
                <div className={styles.wcardMeta}>
                  <span>{r.sprvsnInstCdNm}</span>
                  <span>신청: {r.aplyYmd || '상시'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default WelfareDetail