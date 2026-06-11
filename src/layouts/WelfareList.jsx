import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './WelfareList.module.css'

const CATEGORIES = ['주거', '일자리', '생활', '교육', '금융', '참여･기반', '금융･복지･문화']
const REGIONS = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const AGE_OPTIONS = ['19~24세', '25~29세', '30~34세', '35~39세']
const INCOME_OPTIONS = ['기초/차상위', '1~3분위', '4~6분위', '7분위 이상']
const JOB_OPTIONS = ['미취업', '재직중', '자영업']

const BADGE_CLASS = {
  '주거': styles.badgeBlue,
  '일자리': styles.badgeAmber,
  '생활': styles.badgePink,
  '교육': styles.badgeBlue,
  '금융': styles.badgeGreen,
  '참여･기반': styles.badgeGray,
  '금융･복지･문화': styles.badgeGreen,
}

const WelfareList = () => {
  const navigate = useNavigate()
  const [selectedCats, setSelectedCats] = useState([])
  const [selectedRegions, setSelectedRegions] = useState(['전국'])
  const [selectedAges, setSelectedAges] = useState([])
  const [selectedIncomes, setSelectedIncomes] = useState([])
  const [selectedJobs, setSelectedJobs] = useState([])
  const [sort, setSort] = useState('최신순')
  const [wished, setWished] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [welfareList, setWelfareList] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const lclsfNm = selectedCats.length === 1 ? selectedCats[0] : ''
    fetch(`http://localhost:8080/api/welfare/list?keyword=${keyword}&lclsfNm=${encodeURIComponent(lclsfNm)}&page=${currentPage}`)
      .then(res => res.json())
      .then(data => {
        setWelfareList(data.list)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      })
  }, [keyword, selectedCats, currentPage])

  const toggleCheck = (val, setList) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSelectedCats([])
    setSelectedRegions(['전국'])
    setSelectedAges([])
    setSelectedIncomes([])
    setSelectedJobs([])
    setCurrentPage(1)
  }

  const toggleWish = (id, e) => {
    e.stopPropagation()
    setWished(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const activeTags = [
    ...selectedCats,
    ...selectedRegions.filter(r => r !== '전국'),
    ...selectedAges,
    ...selectedIncomes,
    ...selectedJobs,
  ]

  const removeTag = (tag) => {
    setSelectedCats(p => p.filter(v => v !== tag))
    setSelectedRegions(p => { const n = p.filter(v => v !== tag); return n.length ? n : ['전국'] })
    setSelectedAges(p => p.filter(v => v !== tag))
    setSelectedIncomes(p => p.filter(v => v !== tag))
    setSelectedJobs(p => p.filter(v => v !== tag))
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setKeyword(searchInput)
    setCurrentPage(1)
  }

  const renderPageButtons = () => {
    const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, start + 4)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className={styles.pageBg}>
      <div className={styles.pageContainer}>

        <div className={styles.searchCard}>
          <input
            className={styles.searchInput}
            placeholder="키워드로 검색 (예: 월세, 장학금, 취업)"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <button className={styles.searchBtn} onClick={handleSearch}>검색</button>
        </div>

        <div className={styles.listWrap}>

          <div className={styles.filterCard}>
            <div className={styles.fg}>
              <div className={styles.flabel}>카테고리</div>
              {CATEGORIES.map(cat => (
                <label key={cat} className={styles.fopt}>
                  <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleCheck(cat, setSelectedCats)} />
                  {cat}
                </label>
              ))}
            </div>

            <div className={styles.fg}>
              <div className={styles.flabel}>지역</div>
              <div className={styles.regionScroll}>
                {REGIONS.map(r => (
                  <label key={r} className={styles.fopt}>
                    <input type="checkbox" checked={selectedRegions.includes(r)} onChange={() => toggleCheck(r, setSelectedRegions)} />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.fg}>
              <div className={styles.flabel}>나이</div>
              {AGE_OPTIONS.map(a => (
                <label key={a} className={styles.fopt}>
                  <input type="checkbox" checked={selectedAges.includes(a)} onChange={() => toggleCheck(a, setSelectedAges)} />
                  {a}
                </label>
              ))}
            </div>

            <div className={styles.fg}>
              <div className={styles.flabel}>소득분위</div>
              {INCOME_OPTIONS.map(i => (
                <label key={i} className={styles.fopt}>
                  <input type="checkbox" checked={selectedIncomes.includes(i)} onChange={() => toggleCheck(i, setSelectedIncomes)} />
                  {i}
                </label>
              ))}
            </div>

            <div className={styles.fgLast}>
              <div className={styles.flabel}>취업 여부</div>
              {JOB_OPTIONS.map(j => (
                <label key={j} className={styles.fopt}>
                  <input type="checkbox" checked={selectedJobs.includes(j)} onChange={() => toggleCheck(j, setSelectedJobs)} />
                  {j}
                </label>
              ))}
            </div>

            <button className={styles.resetBtn} onClick={resetFilters}>↺ 필터 초기화</button>
          </div>

          <div className={styles.listMain}>
            <div className={styles.listHd}>
              <span className={styles.cnt}>총 <b>{total}</b>개 복지 서비스</span>
              <select className={styles.sortSel} value={sort} onChange={e => setSort(e.target.value)}>
                <option>최신순</option>
                <option>조회수순</option>
                <option>찜 많은순</option>
              </select>
            </div>

            {activeTags.length > 0 && (
              <div className={styles.atags}>
                {activeTags.map((tag, idx) => (
                  <div key={`${tag}-${idx}`} className={styles.atag}>
                    {tag} <span onClick={() => removeTag(tag)}>×</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.grid2}>
              {welfareList.map(w => {
                const isWished = wished[w.welfareId] || false
                return (
                  <div key={w.welfareId} className={styles.wcard} onClick={() => navigate(`/welfaredetail/${w.welfareId}`)}>
                    <div className={styles.wcardTop}>
                      <span className={`${styles.badge} ${BADGE_CLASS[w.lclsfNm] || styles.badgeGray}`}>{w.lclsfNm}</span>
                      <button className={`${styles.heartBtn} ${isWished ? styles.on : ''}`} onClick={(e) => toggleWish(w.welfareId, e)}>
                        {isWished ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className={styles.wcardTitle}>{w.plcyNm}</div>
                    <div className={styles.wcardMeta}>
                      <span>{w.sprvsnInstCdNm}</span>
                      <span>신청: {w.aplyYmd || '상시'}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.paging}>
              <button className={styles.pgbtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>‹</button>
              {renderPageButtons().map(p => (
                <button key={p} className={`${styles.pgbtn} ${currentPage === p ? styles.on : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
              <button className={styles.pgbtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>›</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default WelfareList