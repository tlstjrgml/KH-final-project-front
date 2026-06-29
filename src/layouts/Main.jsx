import { useState, useEffect } from 'react'
import styles from './Main.module.css'
import { Link, useNavigate } from 'react-router-dom'
import ExtraInfoModal from './ExtraInfoModal'

const Main = () => {
  const navigate = useNavigate()
  const [welfareList, setWelfareList] = useState([])
  const [top10, setTop10] = useState([])
  const [recommend, setRecommend] = useState([])
  const [memberInfo, setMemberInfo] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [boardType, setBoardType] = useState('FRE')
  const [boardTop5, setBoardTop5] = useState([])
  const [noticeTop5, setNoticeTop5] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetch('http://localhost:8080/api/welfare/main')
      .then(res => res.json())
      .then(data => setWelfareList(data))

    fetch('http://localhost:8080/api/welfare/topten')
      .then(res => res.json())
      .then(data => setTop10(data))

    if (token) {
      fetch('http://localhost:8080/member/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setMemberInfo(data)
          if (!data.jobStatus && !data.incomeLevel && !data.region) {
            const modalShown = sessionStorage.getItem('extraInfoModalShown')
            if (!modalShown) {
              setShowModal(true)
              sessionStorage.setItem('extraInfoModalShown', 'true')
            }
          } else {
            const params = new URLSearchParams()
            if (data.region) params.append('region', data.region)
            if (data.jobStatus) params.append('jobStatus', data.jobStatus)
            if (data.incomeLevel) params.append('incomeLevel', data.incomeLevel)
            fetch(`http://localhost:8080/api/welfare/recommend?${params.toString()}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
              .then(res => res.json())
              .then(data => {
                setRecommend(data)
          })
                
          }
        })
    }
  }, [])

      useEffect(() => {
      fetch(`http://localhost:8080/board/top5?boardType=${boardType}`)
        .then(res => res.json())
        .then(data => setBoardTop5(data))
    }, [boardType])

    useEffect(() => {
      fetch('http://localhost:8080/board/notice/recent')
        .then(res => res.json())
        .then(data => setNoticeTop5(data))
    }, [])

    const handleSearch = (e) => {
      e.preventDefault()
      if (searchInput.trim()) {
        navigate(`/welfarelist?keyword=${encodeURIComponent(searchInput)}`)
      }
    }

  const renderRecBox = () => {
    if (!token) return null

    if (memberInfo && !memberInfo.jobStatus && !memberInfo.incomeLevel && !memberInfo.region) {
      return (
        <div className={styles.recBox}>
          <div className={styles.recBoxHd}>
            <div className={styles.recBoxIcon}>
              <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className={styles.recBoxTitle}>나에게 맞는 복지 추천</span>
          </div>
          <div style={{ filter: 'blur(4px)', pointerEvents: 'none' }} className={styles.recChips}>
            <span className={styles.recChip}>청년 월세 특별지원</span>
            <span className={styles.recChip}>청년도약계좌</span>
            <span className={styles.recChip}>국가장학금</span>
            <span className={styles.recChip}>취업성공패키지</span>
          </div>
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <p style={{ fontSize: '13px', color: '#6C757D', marginBottom: '8px' }}>상세정보를 입력하지 않아 추천이 불가합니다</p>
            <button
              style={{ fontSize: '13px', padding: '8px 16px', background: '#378ADD', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              onClick={() => navigate('/edit-profile')}
            >
              상세정보 입력하기
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className={styles.recBox}>
        <div className={styles.recBoxHd}>
          <div className={styles.recBoxIcon}>
            <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span className={styles.recBoxTitle}>나에게 맞는 복지 추천</span>
          <span className={styles.recBoxSub}>프로필 기반 자동 매칭</span>
        </div>
        <div className={styles.recChips}>
          {recommend.map(w => (
            <span key={w.welfareId} className={styles.recChip} onClick={() => navigate(`/welfaredetail/${w.welfareId}`)}>
              {w.plcyNm}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <main className={styles.page}>

      <ExtraInfoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={() => {
        setShowModal(false)
        navigate('/edit-profile')
        }}
      />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <span></span>
            정부 공식 복지 데이터 연동
          </div>
          <h1 className={styles.heroTitle}>
            내게 맞는 복지 서비스를<br/>
            <em>한 곳에서 찾아보세요</em>
          </h1>
          <p className={styles.heroSub}>주거, 일자리, 교육, 금융까지 — 청년을 위한 모든 복지 정보</p>
          <form className={styles.heroSearch} onSubmit={handleSearch}>
            <input
              type="text"
              name="q"
              placeholder="복지 서비스를 검색해보세요"
              autoComplete="off"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">
              <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              검색
            </button>
          </form>
        </div>
      </section>

      <nav className={styles.catRow} aria-label="복지 카테고리">
        <div onClick={() => navigate(`/welfarelist?lclsfNm=${encodeURIComponent('주거')}`)} className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          주거
        </div>
        <div onClick={() => navigate(`/welfarelist?lclsfNm=${encodeURIComponent('일자리')}`)} className={styles.catChip}>
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
          일자리
        </div>
        <div onClick={() => navigate(`/welfarelist?lclsfNm=${encodeURIComponent('참여･기반')}`)} className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M12 21C12 21 3 14 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 13-9 13z"/></svg>
          참여･기반
        </div>
        <div onClick={() => navigate(`/welfarelist?lclsfNm=${encodeURIComponent('교육')}`)} className={styles.catChip}>
          <svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          교육
        </div>
        <div onClick={() => navigate(`/welfarelist?lclsfNm=${encodeURIComponent('금융･복지･문화')}`)} className={styles.catChip}>
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          금융･복지･문화
        </div>
      </nav>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>

          {renderRecBox()}

          <section className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>복지 서비스</h2>
              <Link to="/welfarelist" className={styles.sectionMore}>
                더 보러가기
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </Link>
            </div>
            <div className={styles.welfareGrid}>
              {welfareList.map(w => (
                <Link to={`/welfaredetail/${w.welfareId}`} key={w.welfareId} className={styles.welfareCard}>
                  <span className={styles.welfareBadge}>{w.lclsfNm}</span>
                  <p className={styles.welfareTitle}>{w.plcyNm}</p>
                  <div className={styles.welfareMeta}>
                    <span>{w.sprvsnInstCdNm}</span>
                    <span>신청: {w.aplyYmd || '상시'}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

                <section className={styles.sectionBox}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>인기 게시글</h2>
          <Link to={boardType === 'FRE' ? '/boardfree' : '/boardreview'} className={styles.sectionMore}>
            더 보러가기
            <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
          </Link>
        </div>
        <div className={styles.boardTabs}>
          <button
            className={`${styles.boardTab} ${boardType === 'FRE' ? styles.active : ''}`}
            onClick={() => setBoardType('FRE')}
          >
            자유게시판
          </button>
          <button
            className={`${styles.boardTab} ${boardType === 'REV' ? styles.active : ''}`}
            onClick={() => setBoardType('REV')}
          >
            후기게시판
          </button>
        </div>

        <div className={styles.boardList}>
      {boardTop5.map((b, idx) => (
        <Link
          to={boardType === 'FRE' ? `/boardfree/detail/${b.boardId}` : `/boardreview/detail/${b.boardId}`}
          key={b.boardId}
          className={styles.boardItem}
        >
          <div className={styles.boardItemLeft}>
            <span className={styles.boardNum}>{idx + 1}</span>
            <span className={styles.boardItemTitle}>{b.boardTitle}</span>
          </div>
          <div className={styles.boardItemMeta}>
            <span><svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>{b.views}</span>
            <span><svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>{b.likeCount}</span>
          </div>
        </Link>
      ))}
    </div>
      </section>
        </div>

        <div className={styles.rightCol}>
          <section className={styles.sideSection}>
            <h2 className={styles.sideTitle}>
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              인기 복지 TOP 10
            </h2>
            <div className={styles.top10List}>
              {top10.map((w, index) => (
                <Link to={`/welfaredetail/${w.welfareId}`} key={w.welfareId} className={styles.top10Item}>
                  <span className={`${styles.top10Rank} ${index < 3 ? styles.high : ''}`}>{index + 1}</span>
                  <span className={styles.top10Name}>{w.plcyNm}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.sideSection}>
            <h2 className={styles.sideTitle}>
              <svg viewBox="0 0 24 24"><path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0"/></svg>
              공지사항
            </h2>
            <div className={styles.noticeList}>
              {noticeTop5.map(n => (
                <Link to={`/notice/detail/:id/${n.boardId}`} key={n.boardId} className={styles.noticeItem}>
                  <div className={styles.noticeDot}></div>
                  <span className={styles.noticeTitle}>{n.boardTitle}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Main