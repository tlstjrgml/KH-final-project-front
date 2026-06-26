import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Persona.module.css'

const PERSONA_TABS = [
  { key: '대학생', label: '대학생', desc: '등록금 부담을 덜고 안정적인 대학 생활을 위한 맞춤 복지 정보' },
  { key: '취준생', label: '취준생', desc: '취업 준비에 필요한 지원금과 교육 혜택을 한눈에 확인하세요' },
  { key: '사회초년생', label: '사회초년생', desc: '첫 직장 생활을 안정적으로 시작할 수 있도록 도와드립니다' },
]

const BADGE_CLASS = {
  '주거': styles.badgeBlue,
  '일자리': styles.badgeAmber,
  '생활': styles.badgePink,
  '교육': styles.badgeBlue,
  '금융': styles.badgeGreen,
  '참여･기반': styles.badgeGray,
  '금융･복지･문화': styles.badgeGreen,
}

const Persona = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [loading, setLoading] = useState(true)
  const [hasJobStatus, setHasJobStatus] = useState(false)
  const [myJobStatus, setMyJobStatus] = useState('')
  const [myRegion, setMyRegion] = useState('')
  const [activeTab, setActiveTab] = useState('대학생')
  const [groups, setGroups] = useState([]) 
  
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetch('http://localhost:8080/member/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.jobStatus) {
          setHasJobStatus(true)
          setMyJobStatus(data.jobStatus)
          setActiveTab(data.jobStatus)
        }
        setMyRegion(data.region || '')
        setLoading(false)
      })
  }, [])


  useEffect(() => {
    if (loading) return

    if (hasJobStatus) {
      const params = new URLSearchParams()
      params.append('myJobStatus', myJobStatus)
      if (myRegion) params.append('region', myRegion)
      fetch(`http://localhost:8080/api/welfare/persona?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          const newGroups = Object.entries(data).map(([category, items]) => ({
            groupTitle: category,
            items
          }))
          setGroups(newGroups)
        })
    } else {
      const params = new URLSearchParams()
      params.append('jobStatus', activeTab)
      fetch(`http://localhost:8080/api/welfare/persona?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          const newGroups = Object.entries(data).map(([category, items]) => ({
            groupTitle: category,
            items
          }))
          setGroups(newGroups)
        })
    }
  }, [loading, hasJobStatus, myJobStatus, myRegion, activeTab])

  if (loading) return <div className={styles.pageBg}></div>

  const currentTab = PERSONA_TABS.find(t => t.key === activeTab)

  return (
    <div className={styles.pageBg}>
      <div className={styles.personaHero}>
        <div className={styles.phInner}>
          <div className={styles.phCard}>
            <div className={styles.phTitle}>{currentTab?.label}</div>
            <div className={styles.phDesc}>{currentTab?.desc}</div>
            {!hasJobStatus && (
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
            )}
          </div>
        </div>
      </div>

      <div className={styles.pContent}>
        {groups.map((group, gi) => (
          <div key={gi} className={styles.pGroup}>
            <div className={styles.pgTitle}>{group.groupTitle}</div>
            {group.items.length > 0 ? (
            <div className={styles.grid4}>
              {group.items.map(item => (
                <div
                  key={item.welfareId}
                  className={styles.pcard}
                  onClick={() => navigate(`/welfaredetail/${item.welfareId}`)}
                >
                  <div>
                    <span className={`${styles.badge} ${BADGE_CLASS[item.lclsfNm] || styles.badgeGray}`}>
                      {item.lclsfNm}
                    </span>
                    <div className={styles.pcardTitle}>{item.plcyNm}</div>
                  </div>
                </div>
              ))}
              </div>
            ):(
              <div className={styles.emptyState}>아직 조건에 맞는 복지 정보가 없어요</div>
            )}
            </div>
        ))}
      </div>
    </div>
  )
}

export default Persona