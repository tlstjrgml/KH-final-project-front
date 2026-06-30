import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './WelfareList.module.css'
import Pagination from '../components/common/Pagination'

const AGE_OPTIONS = ['19~24세', '25~29세', '30~34세', '35~39세']

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

const CATEGORIES = ['주거', '일자리', '교육', '참여･기반', '금융･복지･문화']

const isExpired = (aplyYmd) => {
  if (!aplyYmd || !aplyYmd.includes('~')) return false
  const endStr = aplyYmd.split('~')[1].trim()
  if (!/^\d{8}$/.test(endStr)) return false
  const endDate = new Date(
    Number(endStr.slice(0, 4)),
    Number(endStr.slice(4, 6)) - 1,
    Number(endStr.slice(6, 8))
  )
  return endDate < new Date()
}

const WelfareList = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = localStorage.getItem('token')

  const [regionList, setRegionList] = useState([]) 
  const [jobOptions, setJobOptions] = useState([])  
  const [schoolOptions, setSchoolOptions] = useState([]) 
  const [incomeOptions, setIncomeOptions] = useState([]) 
  const [codesLoaded, setCodesLoaded] = useState(false)

  const [selectedCats, setSelectedCats] = useState(searchParams.getAll('lclsfNm'))
  const [selectedRegions, setSelectedRegions] = useState(['전국'])
  const [selectedAge, setSelectedAge] = useState(() => {
    const ageMin = searchParams.get('ageMin')
    const ageMax = searchParams.get('ageMax')
    if (!ageMin || !ageMax) return ''
    return Object.entries(AGE_RANGE).find(([_, v]) => v.min == ageMin && v.max == ageMax)?.[0] || ''
  })
  const [selectedIncomes, setSelectedIncomes] = useState([])
  const [selectedJobs, setSelectedJobs] = useState([])
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
    Promise.all([
      fetch('http://localhost:8080/api/welfare/regions').then(res => res.json()),
      fetch('http://localhost:8080/api/welfare/categories').then(res => res.json())
    ]).then(([regions, categories]) => {
      setRegionList(regions)
      setJobOptions(categories.filter(c => c.mainId === 'jobCd'))
      setSchoolOptions(categories.filter(c => c.mainId === 'schoolCd'))
      setIncomeOptions(categories.filter(c => c.mainId === 'earnCndSeCd'))
      setCodesLoaded(true)
    })
  }, [])

  useEffect(() => {
    if (!codesLoaded) return

    const regionCodes = searchParams.getAll('region')
    if (regionCodes.length > 0) {
      const names = regionList
        .filter(r => regionCodes.includes(r.zipCd))
        .map(r => r.regionName)
      setSelectedRegions(names.length > 0 ? names : ['전국'])
    }

    const incomeCodes = searchParams.getAll('income')
    if (incomeCodes.length > 0) {
      const names = incomeOptions
        .filter(i => incomeCodes.includes(i.subId))
        .map(i => i.subName)
      setSelectedIncomes(names)
    }

    const jobCodes = searchParams.getAll('job')
    const schoolCodes = searchParams.getAll('school')
    const jobNames = jobOptions.filter(j => jobCodes.includes(j.subId)).map(j => j.subName)
    const schoolNames = schoolOptions.filter(s => schoolCodes.includes(s.subId)).map(s => s.subName)
    setSelectedJobs([...jobNames, ...schoolNames])
  }, [codesLoaded])

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
    if (!codesLoaded) return

    const regionCodeMap = Object.fromEntries(regionList.map(r => [r.regionName, r.zipCd]))
    const jobCodeMap = Object.fromEntries(jobOptions.map(j => [j.subName, j.subId]))
    const schoolCodeMap = Object.fromEntries(schoolOptions.map(s => [s.subName, s.subId]))
    const incomeCodeMap = Object.fromEntries(incomeOptions.map(i => [i.subName, i.subId]))
    const schoolNames = schoolOptions.map(s => s.subName)

    const params = new URLSearchParams()
    params.append('keyword', keyword)
    params.append('page', currentPage)
    selectedCats.forEach(c => params.append('lclsfNm', c))
    selectedRegions.filter(r => r !== '전국').forEach(r => params.append('region', regionCodeMap[r]))
    selectedIncomes.forEach(i => params.append('income', incomeCodeMap[i]))
    selectedJobs.filter(j => !schoolNames.includes(j)).forEach(j => params.append('job', jobCodeMap[j]))
    selectedJobs.filter(j => schoolNames.includes(j)).forEach(j => params.append('school', schoolCodeMap[j]))
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
  }, [keyword, selectedCats, selectedRegions, selectedAge, selectedIncomes, selectedJobs, sort, currentPage, codesLoaded])

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

  const regionNames = ['전국', ...regionList.map(r => r.regionName)]

  const jobCheckOptions = [
    ...jobOptions.filter(j => ['재직자', '자영업자', '미취업자'].includes(j.subName)),
    ...schoolOptions.filter(s => s.subName === '대학 재학')
  ]

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
                {regionNames.map(r => (
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
              {incomeOptions.map(i => (
                <label key={i.subId} className={styles.fopt}>
                  <input type="checkbox" checked={selectedIncomes.includes(i.subName)} onChange={() => toggleCheck(i.subName, setSelectedIncomes)} />
                  {i.subName}
                </label>
              ))}
            </div>

            <div className={styles.fgLast}>
              <div className={styles.flabel}>취업 여부</div>
              {jobCheckOptions.map(j => (
                <label key={j.subId} className={styles.fopt}>
                  <input type="checkbox" checked={selectedJobs.includes(j.subName)} onChange={() => toggleCheck(j.subName, setSelectedJobs)} />
                  {j.subName}
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
                <option>진행중</option>
                <option>마감됨</option>
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
                    <div className={styles.wcardRightGroup}>
                    {isExpired(w.aplyYmd) && (
                      <span className={styles.expiredBadge}>마감</span>
                    )}
                    <button className={`${styles.heartBtn} ${isWished ? styles.on : ''}`} onClick={(e) => toggleWish(w.welfareId, e)}>
                      {isWished ? '♥' : '♡'}
                    </button>
                  </div>
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