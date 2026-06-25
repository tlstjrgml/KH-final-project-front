import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './WelfareList.module.css'
import Pagination from '../components/common/Pagination'

const CATEGORIES = ['주거', '일자리', '교육', '참여･기반', '금융･복지･문화']
const REGIONS = ['전국', '서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주']
const AGE_OPTIONS = ['19~24세', '25~29세', '30~34세', '35~39세']
const INCOME_OPTIONS = ['무관', '연소득', '기타']
const JOB_OPTIONS = ['미취업', '재직중', '자영업', '대학생']

const BADGE_CLASS = {
  '주거': styles.badgeBlue,
  '일자리': styles.badgeAmber,
  '생활': styles.badgePink,
  '교육': styles.badgeBlue,
  '금융': styles.badgeGreen,
  '참여･기반': styles.badgeGray,
  '금융･복지･문화': styles.badgeGreen,
}

const AGE_RANGE = {
  '19~24세': { min: 19, max: 24 },
  '25~29세': { min: 25, max: 29 },
  '30~34세': { min: 30, max: 34 },
  '35~39세': { min: 35, max: 39 },
}

const INCOME_CODE = {
  '무관': '0043001',
  '연소득': '0043002',
  '기타': '0043003'
}

const JOB_CODE = {
  '미취업': '0013003',
  '재직중': '0013001',
  '자영업': '0013002'
}

const SCHOOL_CODE = {
  '대학생': '0049005'
}

const REGION_CODE = {
  '서울': '11', '부산': '26', '대구': '27', '인천': '28',
  '광주': '29', '대전': '30', '울산': '31', '세종': '36',
  '경기': '41', '강원': '42', '충북': '43', '충남': '44',
  '전북': '45', '전남': '46', '경북': '47', '경남': '48', '제주': '50'
}

const WelfareList = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = localStorage.getItem('token')

  const [selectedCats, setSelectedCats] = useState(searchParams.getAll('lclsfNm'))
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const regionCodes = searchParams.getAll('region')
    if (regionCodes.length === 0) return ['전국']
    return Object.entries(REGION_CODE)
      .filter(([_, code]) => regionCodes.includes(code))
      .map(([name]) => name)
  })
  const [selectedAge, setSelectedAge] = useState(() => {
    const ageMin = searchParams.get('ageMin')
    const ageMax = searchParams.get('ageMax')
    if (!ageMin || !ageMax) return ''
    return Object.entries(AGE_RANGE).find(([_, v]) => v.min == ageMin && v.max == ageMax)?.[0] || ''
  })
  const [selectedIncomes, setSelectedIncomes] = useState(() => {
    const codes = searchParams.getAll('income')
    return Object.entries(INCOME_CODE)
      .filter(([_, code]) => codes.includes(code))
      .map(([name]) => name)
  })
  const [selectedJobs, setSelectedJobs] = useState(() => {
  const jobCodes = searchParams.getAll('job')
  const schoolCodes = searchParams.getAll('school')
  const jobNames = Object.entries(JOB_CODE)
    .filter(([_, code]) => jobCodes.includes(code))
    .map(([name]) => name)
  const schoolNames = Object.entries(SCHOOL_CODE)
      .filter(([_, code]) => schoolCodes.includes(code))
      .map(([name]) => name)
    return [...jobNames, ...schoolNames]
  })
  const [sort, setSort] = useState(searchParams.get('sort') || '최신순')
  const [wished, setWished] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [searchInput, setSearchInput] = useState(searchParams.get('keyword') || '')
  const [welfareList, setWelfareList] = useState([])
  const [pageInfo, setPageInfo] = useState(null)

  const displayLclsf = (lclsfNm) => {
    if (!lclsfNm) return ''
    const parts = lclsfNm.split(',')
    const unique = [...new Set(parts.map(p => p.trim()))]
    return unique.join(',')
  }

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8080/api/wish', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          const wishMap = {}
          data.forEach(w => { wishMap[w.welfareId] = true })
          setWished(wishMap)
        })
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    params.append('keyword', keyword)
    params.append('page', currentPage)
    selectedCats.forEach(c => params.append('lclsfNm', c))
    selectedRegions.filter(r => r !== '전국').forEach(r => params.append('region', REGION_CODE[r]))
    selectedIncomes.forEach(i => params.append('income', INCOME_CODE[i]))
    selectedJobs.filter(j => j !== '대학생').forEach(j => params.append('job', JOB_CODE[j]))
    if (selectedJobs.includes('대학생')) params.append('school', SCHOOL_CODE['대학생'])
    if (selectedAge) {
      params.append('ageMin', AGE_RANGE[selectedAge].min)
      params.append('ageMax', AGE_RANGE[selectedAge].max)
    }
    if (sort && sort !== '최신순') params.append('sort', sort)

    window.history.replaceState(null, '', `/welfarelist?${params.toString()}`)

    fetch(`http://localhost:8080/api/welfare/list?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setWelfareList(data.content)
        setPageInfo(data.pagination)
      })
  }, [keyword, selectedCats, selectedRegions, selectedAge, selectedIncomes, selectedJobs, sort, currentPage])

  const toggleCheck = (val, setList) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSelectedCats([])
    setSelectedRegions(['전국'])
    setSelectedAge('')
    setSelectedIncomes([])
    setSelectedJobs([])
    setCurrentPage(1)
  }

  const toggleWish = async (id, e) => {
    e.stopPropagation()
    if (!token) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    const isWished = wished[id] || false
    const method = isWished ? 'DELETE' : 'POST'
    await fetch(`http://localhost:8080/api/wish/${id}`, {
      method,
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setWished(prev => ({ ...prev, [id]: !isWished }))
  }

  const activeTags = [
    ...selectedCats,
    ...selectedRegions.filter(r => r !== '전국'),
    ...(selectedAge ? [selectedAge] : []),
    ...selectedIncomes,
    ...selectedJobs,
  ]

  const removeTag = (tag) => {
    setSelectedCats(p => p.filter(v => v !== tag))
    setSelectedRegions(p => { const n = p.filter(v => v !== tag); return n.length ? n : ['전국'] })
    if (selectedAge === tag) setSelectedAge('')
    setSelectedIncomes(p => p.filter(v => v !== tag))
    setSelectedJobs(p => p.filter(v => v !== tag))
    setCurrentPage(1)
  }

  const handleSearch = () => {
    setKeyword(searchInput)
    setCurrentPage(1)
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
                  <input type="checkbox" checked={selectedAge === a} onChange={() => setSelectedAge(prev => prev === a ? '' : a)} />
                  {a}
                </label>
              ))}
            </div>

            <div className={styles.fg}>
              <div className={styles.flabel}>소득</div>
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
              <span className={styles.cnt}>총 <b>{pageInfo?.totalItems || 0}</b>개 복지 서비스</span>
              <select className={styles.sortSel} value={sort} onChange={e => { setSort(e.target.value);       setCurrentPage(1) }}>
                <option>최신순</option>
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
                      <span className={`${styles.badge} ${BADGE_CLASS[w.lclsfNm] || styles.badgeGray}`}>
                        {displayLclsf(w.lclsfNm)}
                      </span>
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
            <Pagination pageInfo={pageInfo} currentPage={currentPage} changePage={setCurrentPage} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default WelfareList