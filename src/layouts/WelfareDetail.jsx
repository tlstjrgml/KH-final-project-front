import { useState } from 'react'
import styles from './WelfareDetail.module.css'

const MOCK_DETAIL = {
  id: 1,
  lclsfNm: '주거',
  regionNm: '전국',
  plcyNm: '청년 월세 한시 특별지원',
  sprvsnInstCdNm: '국토교통부',
  lastMdfcnDt: '2025.03.01',
  sprtTrgt: '만 19~34세 무주택 청년 (부모와 별도 거주)',
  earnEtcCn: '가구 중위소득 60% 이하, 청년 본인 소득 50% 이하',
  plcySprtCn: '월 최대 20만원 · 최대 12개월 지원',
  aplyYmd: '2025.03.01 ~ 2025.05.31',
  plcyAplyMthdCn: '복지로 온라인 신청 또는 거주지 주민센터 방문',
  contact: 'LH 콜센터 1600-1004 / 국토교통부 1599-0001',
  plcyExplnCn: '월세 부담 경감을 위해 실제 월세액의 일부를 최대 월 20만원씩 최대 12개월간 지원하는 제도입니다. 지원금은 임차인 본인 계좌로 직접 지급되며, 보증금 월세 환산액과 실제 월세액의 합산액을 기준으로 산정합니다.',
  srngMthdCn: '① 복지로(www.bokjiro.go.kr) 온라인 신청 또는 거주지 읍·면·동 주민센터 방문 신청\n② 신청서 + 임대차계약서 사본 + 신분증 + 통장 사본 제출\n③ 소득·재산 조회 및 서류 심사 (약 2~3주 소요)\n④ 지원 결정 통보 → 매월 25일 지정 계좌로 입금',
  aplyUrlAddr: 'https://www.bokjiro.go.kr',
  wished: true,
}

const RELATED = [
  { id: 2, lclsfNm: '주거', plcyNm: '청년 전용 보증금 대출',  wcardMeta: '최대 3,500만원 · 상시 접수',  wished: false },
  { id: 3, lclsfNm: '주거', plcyNm: '행복주택 청년형',         wcardMeta: '시세 60~80% 임대 · 상시 접수', wished: true  },
  { id: 4, lclsfNm: '주거', plcyNm: '청년 주거급여 분리지급',  wcardMeta: '최대 월 33만원 · 상시 접수',  wished: false },
]

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
  const w = MOCK_DETAIL
  const [wished,    setWished]    = useState(w.wished)
  const [relWished, setRelWished] = useState(
    Object.fromEntries(RELATED.map(r => [r.id, r.wished]))
  )

  const toggleRelWish = (rid, e) => {
    e.stopPropagation()
    setRelWished(prev => ({ ...prev, [rid]: !prev[rid] }))
  }

  return (
    <div className={styles.pageBg}>
      <div className={styles.detailWrap}>
        <div className={styles.dcard}>
          <div className={styles.detailBadgeRow}>
            <span className={`${styles.badge} ${BADGE_CLASS[w.lclsfNm] || styles.badgeGray}`}>{w.lclsfNm}</span>
            <span className={`${styles.badge} ${styles.badgeGray}`}>{w.regionNm}</span>
          </div>
          <div className={styles.detailTitle}>{w.plcyNm}</div>
          <div className={styles.detailOrg}>{w.sprvsnInstCdNm} · 최종 업데이트 {w.lastMdfcnDt}</div>
          <table className={styles.infoTable}>
            <tbody>
              <tr><td>지원대상</td><td>{w.sprtTrgt}</td></tr>
              <tr><td>소득기준</td><td>{w.earnEtcCn}</td></tr>
              <tr><td>지원금액</td><td>{w.plcySprtCn}</td></tr>
              <tr><td>신청기간</td><td>{w.aplyYmd || '상시'}</td></tr>
              <tr><td>신청방법</td><td>{w.plcyAplyMthdCn}</td></tr>
              <tr><td>문의처</td><td>{w.contact}</td></tr>
            </tbody>
          </table>
          <div className={styles.btnRow}>
            <button className={`${styles.btnHeart} ${wished ? styles.on : ''}`} onClick={() => setWished(p => !p)}>
              {wished ? '♥ 찜 해제' : '♡ 찜하기'}
            </button>
            <button className={styles.btnApply} onClick={() => w.aplyUrlAddr && window.open(w.aplyUrlAddr, '_blank')}>
              신청하러 가기 →
            </button>
          </div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>지원 내용</div>
          <div className={styles.detailContent}>{w.plcyExplnCn}</div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.detailSecTitle}>신청 방법 및 절차</div>
          <div className={styles.detailContent}>
            {w.srngMthdCn.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </div>
        </div>

        <div className={styles.dcard}>
          <div className={styles.secHd}>
            <span className={styles.secTitle}>
              <svg width="14" height="14" fill="none" stroke="#185FA5" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              관련 복지 추천
            </span>
            <span className={styles.relSub}>같은 카테고리 · {w.lclsfNm}</span>
          </div>
          <div className={styles.relGrid}>
            {RELATED.map(r => (
              <div key={r.id} className={styles.wcard} onClick={() => console.log('관련 복지 이동:', r.id)}>
                <div className={styles.wcardTop}>
                  <span className={`${styles.badge} ${BADGE_CLASS[r.lclsfNm] || styles.badgeGray}`}>{r.lclsfNm}</span>
                  <button className={`${styles.heartBtn} ${relWished[r.id] ? styles.on : ''}`} onClick={(e) => toggleRelWish(r.id, e)}>
                    {relWished[r.id] ? '♥' : '♡'}
                  </button>
                </div>
                <div className={styles.wcardTitle}>{r.plcyNm}</div>
                <div className={styles.wcardMeta}>{r.wcardMeta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelfareDetail
