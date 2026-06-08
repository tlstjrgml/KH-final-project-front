import React from 'react';
import styles from './AdminPage.module.css';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminPage = () => {
  const userTrendData = [
    { date: '05-26', users: 8000 }, { date: '05-27', users: 8800 },
    { date: '05-28', users: 10500 }, { date: '05-29', users: 12500 },
    { date: '05-30', users: 14000 }, { date: '05-31', users: 14200 },
    { date: '06-01', users: 14458 },
  ];

  const categoryData = [
    { name: '주거', views: 12300 }, { name: '취업', views: 9850 },
    { name: '교육', views: 7420 }, { name: '복지', views: 5670 },
    { name: '문화', views: 3980 }, { name: '기타', views: 2150 },
  ];

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>대시보드</h1>
        <p className={styles.subtitle}>복지플랫폼 운영 현황을 한눈에 확인하세요.</p>
      </div>

      {/* 요약 카드 */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>총 가입자 수</span></div>
          <div className={styles.cardValue}>12,458<span className={styles.unit}>명</span></div>
          <div className={styles.cardCompare}>전일 대비 ▲ 320 (2.63%)</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>오늘 방문자 수</span></div>
          <div className={styles.cardValue}>1,256<span className={styles.unit}>명</span></div>
          <div className={styles.cardCompare}>전일 대비 ▲ 89 (7.62%)</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>미처리 신고</span></div>
          <div className={styles.cardValue}>23<span className={styles.unit}>건</span></div>
          <div className={styles.cardCompare}>전일 대비 ▼ 5 (17.86%)</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.cardHeader}><span className={styles.cardTitle}>인기 복지 (1위)</span></div>
          <div className={styles.cardValueText}>청년 월세 지원 사업</div>
          <div className={styles.cardCompare}>조회수 12,345</div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 (리스트 + 차트) */}
      <div className={styles.mainContent}>
        
        {/* 리스트 영역 */}
        <div className={styles.listGrid}>
          <div className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>인기 복지 TOP 5</h2>
              <button className={styles.btnText}>전체 보기 &gt;</button>
            </div>
            <ul className={styles.topList}>
              <li className={styles.listItem}><div className={styles.itemLeft}><span className={styles.rankBadge}>1</span> 청년 월세 지원 사업</div><div className={styles.itemRight}>조회수 12,345</div></li>
              <li className={styles.listItem}><div className={styles.itemLeft}><span className={styles.rankBadge}>2</span> 청년 교통비 지원 사업</div><div className={styles.itemRight}>조회수 11,827</div></li>
              <li className={styles.listItem}><div className={styles.itemLeft}><span className={styles.rankBadge}>3</span> 국민취업지원제도</div><div className={styles.itemRight}>조회수 10,254</div></li>
              <li className={styles.listItem}><div className={styles.itemLeft}><span className={styles.rankBadge}>4</span> 청년내일채움공제</div><div className={styles.itemRight}>조회수 9,527</div></li>
              <li className={styles.listItem}><div className={styles.itemLeft}><span className={styles.rankBadge}>5</span> 기초생활 수급자 지원</div><div className={styles.itemRight}>조회수 8,912</div></li>
            </ul>
          </div>

          <div className={styles.sectionBox}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>최근 신고 현황</h2>
              <button className={styles.btnText}>전체 보기 &gt;</button>
            </div>
            <table className={styles.reportTable}>
              <thead>
                <tr><th>신고 대상</th><th>신고 사유</th><th>신고일</th><th>상태</th></tr>
              </thead>
              <tbody>
                <tr><td>게시글 #125</td><td>광고 및 홍보성 글</td><td>2024-06-01</td><td><span className={`${styles.statusBadge} ${styles.processing}`}>처리중</span></td></tr>
                <tr><td>댓글 #532</td><td>욕설 포함</td><td>2024-05-31</td><td><span className={`${styles.statusBadge} ${styles.waiting}`}>대기</span></td></tr>
                <tr><td>게시글 #123</td><td>허위 정보</td><td>2024-05-30</td><td><span className={`${styles.statusBadge} ${styles.completed}`}>처리완료</span></td></tr>
                <tr><td>댓글 #531</td><td>비방 및 욕설</td><td>2024-05-30</td><td><span className={`${styles.statusBadge} ${styles.completed}`}>처리완료</span></td></tr>
                <tr><td>게시글 #122</td><td>기타</td><td>2024-05-29</td><td><span className={`${styles.statusBadge} ${styles.waiting}`}>대기</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className={styles.chartGrid}>
          <div className={styles.sectionBox}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>가입자 추이</h2>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#378ADD" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={styles.sectionBox}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>카테고리별 조회수</h2>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} barSize={30}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="views" fill="#378ADD" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPage;