import { useState } from 'react'
import styles from './Persona.module.css'

const PERSONA_TABS = [
  { key: 'student',   label: '대학생',    desc: '등록금 부담을 덜고 안정적인 대학 생활을 위한 맞춤 복지 정보' },
  { key: 'jobseeker', label: '취준생',    desc: '취업 준비에 필요한 지원금과 교육 혜택을 한눈에 확인하세요' },
  { key: 'newworker', label: '사회초년생', desc: '첫 직장 생활을 안정적으로 시작할 수 있도록 도와드립니다' },
]

const PERSONA_DATA = {
  student: [
    {
      groupTitle: '대학생이 가장 많이 찾는 복지',
      items: [
        { id: 1, lclsfNm: '교육', plcyNm: '국가장학금 1·2유형',    wished: true  },
        { id: 2, lclsfNm: '생활', plcyNm: '청년 마음건강 바우처',  wished: false },
        { id: 3, lclsfNm: '금융', plcyNm: '청년내일저축계좌',      wished: false },
        { id: 4, lclsfNm: '주거', plcyNm: '청년 전용 보증금 대출', wished: false },
      ],
    },
    {
      groupTitle: '등록금이 부담된다면',
      items: [
        { id: 5, lclsfNm: '교육', plcyNm: '국가장학금 1유형',        wished: true  },
        { id: 6, lclsfNm: '교육', plcyNm: '한국장학재단 학자금대출', wished: false },
        { id: 7, lclsfNm: '생활', plcyNm: '대학생 생활비 대출',      wished: false },
        { id: 8, lclsfNm: '금융', plcyNm: '청년 희망 적금',          wished: false },
      ],
    },
    {
      groupTitle: '자취/주거비용이 부담된다면',
      items: [
        { id: 9,  lclsfNm: '주거', plcyNm: '청년 월세 특별지원',    wished: false },
        { id: 10, lclsfNm: '주거', plcyNm: '행복주택 청년형',        wished: false },
        { id: 11, lclsfNm: '생활', plcyNm: '청년 주거급여 분리지급', wished: false },
        { id: 12, lclsfNm: '금융', plcyNm: '청년 전세자금 대출',     wished: false },
      ],
    },
  ],
  jobseeker: [
    {
      groupTitle: '취준생이 가장 많이 찾는 복지',
      items: [
        { id: 13, lclsfNm: '일자리', plcyNm: '국민취업지원제도',   wished: true  },
        { id: 14, lclsfNm: '일자리', plcyNm: '취업성공패키지',      wished: false },
        { id: 15, lclsfNm: '교육',   plcyNm: 'K-디지털 트레이닝', wished: false },
        { id: 16, lclsfNm: '금융',   plcyNm: '청년도약계좌',        wished: false },
      ],
    },
    {
      groupTitle: '취업 준비 중이라면',
      items: [
        { id: 17, lclsfNm: '일자리', plcyNm: '청년 일자리 도약 장려금', wished: false },
        { id: 18, lclsfNm: '교육',   plcyNm: '내일배움카드',            wished: true  },
        { id: 19, lclsfNm: '생활',   plcyNm: '청년 마음건강 바우처',    wished: false },
        { id: 20, lclsfNm: '주거',   plcyNm: '청년 월세 특별지원',      wished: false },
      ],
    },
  ],
  newworker: [
    {
      groupTitle: '사회초년생이 가장 많이 찾는 복지',
      items: [
        { id: 21, lclsfNm: '금융',   plcyNm: '청년도약계좌',              wished: true  },
        { id: 22, lclsfNm: '주거',   plcyNm: '청년 전용 보증금 대출',     wished: false },
        { id: 23, lclsfNm: '금융',   plcyNm: '청년내일저축계좌',          wished: false },
        { id: 24, lclsfNm: '일자리', plcyNm: '중소기업 청년 소득세 감면', wished: false },
      ],
    },
    {
      groupTitle: '주거 독립을 준비한다면',
      items: [
        { id: 25, lclsfNm: '주거', plcyNm: '청년 월세 특별지원', wished: false },
        { id: 26, lclsfNm: '주거', plcyNm: '행복주택 청년형',     wished: true  },
        { id: 27, lclsfNm: '주거', plcyNm: '청년 전세자금 대출',  wished: false },
        { id: 28, lclsfNm: '금융', plcyNm: '청년 희망 적금',      wished: false },
      ],
    },
  ],
}

const BADGE_CLASS = {
  '주거':           styles.badgeBlue,
  '일자리':         styles.badgeAmber,
  '생활':           styles.badgePink,
  '교육':           styles.badgeBlue,
  '금융':           styles.badgeGreen,
  '참여･기반':      styles.badgeGray,
  '금융･복지･문화': styles.badgeGreen,
}

const Persona = () => {
  const [activeTab, setActiveTab] = useState('student')
  const [wished,    setWished]    = useState({})

  const currentTab = PERSONA_TABS.find(t => t.key === activeTab)
  const groups     = PERSONA_DATA[activeTab] || []

  const toggleWish = (id, defaultWished, e) => {
    e.stopPropagation()
    setWished(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? !defaultWished : !prev[id],
    }))
  }

  const isWished = (item) =>
    wished[item.id] === undefined ? item.wished : wished[item.id]

  return (
    <div className={styles.pageBg}>
      <div className={styles.personaHero}>
        <div className={styles.phInner}>
            <div className={styles.phCard}>
            <div className={styles.phTitle}>{currentTab?.label}</div>
            <div className={styles.phDesc}>{currentTab?.desc}</div>
                <div className={styles.ptabs}>
                    {PERSONA_TABS.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.ptab} ${activeTab === tab.key ? styles.on : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </button>
                    ))}
                </div>
          </div>
        </div>
      </div>

      <div className={styles.pContent}>
        {groups.map((group, gi) => (
          <div key={gi} className={styles.pGroup}>
            <div className={styles.pgTitle}>{group.groupTitle}</div>
            <div className={styles.grid4}>
              {group.items.map(item => (
                <div key={item.id} className={styles.pcard} onClick={() => console.log('복지 상세 이동:', item.id)}>
                  <div>
                    <span className={`${styles.badge} ${BADGE_CLASS[item.lclsfNm] || styles.badgeGray}`}>
                      {item.lclsfNm}
                    </span>
                    <div className={styles.pcardTitle}>{item.plcyNm}</div>
                  </div>
                  <div className={styles.pcardBottom}>
                    <button
                      className={`${styles.heartBtn} ${isWished(item) ? styles.on : ''}`}
                      onClick={(e) => toggleWish(item.id, item.wished, e)}
                    >
                      {isWished(item) ? '♥' : '♡'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Persona
