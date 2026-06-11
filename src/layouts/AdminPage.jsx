import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ReportModals from './ReportModals';
import NoticeModal from './NoticeModal';
import styles from './AdminPage.module.css';

// 1. Recharts 라이브러리 추가
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 2. 차트용 임시 더미 데이터 (마운트 시마다 재생성되지 않도록 컴포넌트 밖에 선언)
const signupData = [
    { date: '06-05', users: 12 },
    { date: '06-06', users: 19 },
    { date: '06-07', users: 15 },
    { date: '06-08', users: 22 },
    { date: '06-09', users: 30 },
    { date: '06-10', users: 28 },
    { date: '06-11', users: 35 },
];

const categoryData = [
    { name: '주거', views: 400 },
    { name: '금융', views: 300 },
    { name: '교육', views: 550 },
    { name: '건강', views: 200 },
    { name: '취업', views: 700 },
];

function AdminPage() {
    const navigate = useNavigate();

    // -------------------------------------------------------------
    // [1] 상태 (State) 선언부 (DB 물리명 매핑)
    // -------------------------------------------------------------
    const [activeTab, setActiveTab] = useState('dashboard');
    const rowsPerPage = 5;

    // --- (A) 회원 관리 상태 (MEMBER 테이블) ---
    const [searchMemberKeyword, setSearchMemberKeyword] = useState('');
    const [currentMemberPage, setCurrentMemberPage] = useState(1);
    const [memberSort, setMemberSort] = useState('latest');
    const [members, setMembers] = useState(() => {
        const initialMembers = [];
        for (let i = 1; i <= 15; i++) {
            initialMembers.push({
                memberId: i,
                email: `user${i.toString().padStart(2, '0')}`,
                name: `테스터${i}`,
                signupDate: `2026-06-${i.toString().padStart(2, '0')}`,
                reportCount: i % 4 === 0 ? 3 : i % 3
            });
        }
        return initialMembers;
    });

    // --- (B) 공지사항 관리 상태 (BOARD 테이블) ---
    const [currentNoticePage, setCurrentNoticePage] = useState(1);
    const [searchNoticeKeyword, setSearchNoticeKeyword] = useState('');
    const [noticeSort, setNoticeSort] = useState('latest');
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const [viewingNotice, setViewingNotice] = useState(null);
    const [notices, setNotices] = useState(() => {
        const initialNotices = [];
        for (let i = 1; i <= 15; i++) {
            initialNotices.push({
                boardId: i,
                boardTitle: `청년복지 MOA 시스템 정기 점검 안내 (${i})`,
                boardContent: `이것은 ${i}번째 더미 공지사항 내용입니다.\n시스템 점검으로 인해 서비스 이용이 제한될 수 있습니다.`,
                createDate: `2026-06-${(16 - i).toString().padStart(2, '0')}`,
                views: Math.floor(Math.random() * 200),
                isPinned: i <= 2
            });
        }
        return initialNotices;
    });

    // --- (C) 신고 관리 상태 (REPORT 테이블) ---
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [searchReportKeyword, setSearchReportKeyword] = useState('');
    const [reportReasonFilter, setReportReasonFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);
    const [reports, setReports] = useState(() => {
        const initialReports = [];
        const reasonList = ["욕설 / 비방", "스팸 / 광고", "음란물 / 혐오", "기타"];
        for (let i = 1; i <= 15; i++) {
            initialReports.push({
                reportId: i,
                memberId: `user${i.toString().padStart(2, '0')}`,
                targetId: `target${(i + 5).toString().padStart(2, '0')}`,
                reason: reasonList[i % 4],
                reportResult: `${i}번 신고 접수건입니다.\n사용자가 부적절한 언어를 사용하였습니다.`
            });
        }
        return initialReports;
    });

    // -------------------------------------------------------------
    // [2] 로직 (Logic) 선언부
    // -------------------------------------------------------------

    // --- (A) 회원 관리 로직 ---
    let processedMembers = members.filter(m =>
        m.email.includes(searchMemberKeyword) || m.name.includes(searchMemberKeyword)
    );
    processedMembers.sort((a, b) => {
        if (memberSort === 'latest') return new Date(b.signupDate) - new Date(a.signupDate);
        if (memberSort === 'oldest') return new Date(a.signupDate) - new Date(b.signupDate);
        if (memberSort === 'report') return b.reportCount - a.reportCount;
        if (memberSort === 'name') return a.name.localeCompare(b.name);
        return 0;
    });
    const totalMemberPages = Math.ceil(processedMembers.length / rowsPerPage);
    const currentMembersList = processedMembers.slice((currentMemberPage - 1) * rowsPerPage, currentMemberPage * rowsPerPage);

    const handleKickMember = (memberId) => {
        if (window.confirm(`${memberId}번 회원을 강제 탈퇴 처리하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
            const updatedMembers = members.filter(m => m.memberId !== memberId);
            setMembers(updatedMembers);
            const newFiltered = updatedMembers.filter(m => m.email.includes(searchMemberKeyword) || m.name.includes(searchMemberKeyword));
            const newTotalPages = Math.ceil(newFiltered.length / rowsPerPage);
            if (currentMemberPage > newTotalPages && newTotalPages > 0) setCurrentMemberPage(newTotalPages);
            alert('성공적으로 탈퇴 처리되었습니다.');
        }
    };

    // --- (B) 공지사항 관리 로직 ---
    let processedNotices = notices.filter(n =>
        n.boardTitle.includes(searchNoticeKeyword)
    );
    processedNotices.sort((a, b) => {
        if (noticeSort === 'latest') return new Date(b.createDate) - new Date(a.createDate);
        if (noticeSort === 'oldest') return new Date(a.createDate) - new Date(b.createDate);
        if (noticeSort === 'views') return b.views - a.views;
        return 0;
    });
    const totalNoticePages = Math.ceil(processedNotices.length / rowsPerPage);
    const currentNoticesList = processedNotices.slice((currentNoticePage - 1) * rowsPerPage, currentNoticePage * rowsPerPage);

    const handleTogglePin = (boardId) => {
        setNotices(notices.map(notice =>
            notice.boardId === boardId ? { ...notice, isPinned: !notice.isPinned } : notice
        ));
    };

    const handleDeleteNotice = (boardId) => {
        if (window.confirm('해당 공지사항을 정말 삭제하시겠습니까?')) {
            const updatedNotices = notices.filter(n => n.boardId !== boardId);
            setNotices(updatedNotices);
            const newProcessed = updatedNotices.filter(n => n.boardTitle.includes(searchNoticeKeyword));
            const newTotalPages = Math.ceil(newProcessed.length / rowsPerPage);
            if (currentNoticePage > newTotalPages && newTotalPages > 0) setCurrentNoticePage(newTotalPages);
        }
    };

    const handleSaveNotice = (noticeData) => {
        if (editingNotice) {
            setNotices(notices.map(n =>
                n.boardId === editingNotice.boardId
                    ? { ...n, boardTitle: noticeData.boardTitle, boardContent: noticeData.boardContent, isPinned: noticeData.isPinned }
                    : n
            ));
            alert("공지사항이 성공적으로 수정되었습니다.");
        } else {
            const newId = notices.length > 0 ? Math.max(...notices.map(n => n.boardId)) + 1 : 1;
            const today = new Date();
            const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            const newNotice = {
                boardId: newId,
                boardTitle: noticeData.boardTitle,
                boardContent: noticeData.boardContent,
                createDate: dateString,
                views: 0,
                isPinned: noticeData.isPinned
            };
            setNotices([newNotice, ...notices]);
            alert("새 공지사항이 등록되었습니다.");
            setCurrentNoticePage(1);
        }
        setIsNoticeModalOpen(false);
        setEditingNotice(null);
    };

    const openCreateModal = () => { setEditingNotice(null); setIsNoticeModalOpen(true); };
    const openEditModal = (notice) => { setEditingNotice(notice); setIsNoticeModalOpen(true); };
    const openViewModal = (notice) => { setViewingNotice(notice); };

    // --- (C) 신고 관리 로직 ---
    let processedReports = reports.filter(r =>
        (reportReasonFilter === 'all' || r.reason === reportReasonFilter) &&
        r.memberId.includes(searchReportKeyword)
    );
    const totalReportPages = Math.ceil(processedReports.length / rowsPerPage);
    const currentReportsList = processedReports.slice((currentReportPage - 1) * rowsPerPage, currentReportPage * rowsPerPage);

    // [핵심 로직 연결] 모달에서 넘겨준 상태코드와 처리사유 수신
    const handleProcessComplete = (reportId, statusCode, processReason) => {
        const updatedReports = reports.filter(r => r.reportId !== reportId);
        setReports(updatedReports);
        const newProcessed = updatedReports.filter(r =>
            (reportReasonFilter === 'all' || r.reason === reportReasonFilter) &&
            r.memberId.includes(searchReportKeyword)
        );
        const newTotalPages = Math.ceil(newProcessed.length / rowsPerPage);
        if (currentReportPage > newTotalPages && newTotalPages > 0) setCurrentReportPage(newTotalPages);
        alert("성공적으로 처리되었습니다. (목록에서 제거됨)");
        setSelectedReport(null);
    };

    // -------------------------------------------------------------
    // [3] 화면 (Render) 선언부
    // -------------------------------------------------------------
    return (
        <div className={styles['admin-page-wrapper']}>
            <Navbar isLoggedIn={true} nickname="관리자" />

            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <ul>
                        <li className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}>대시보드</li>
                        <li className={activeTab === 'member' ? styles.active : ''} onClick={() => setActiveTab('member')}>회원관리</li>
                        <li className={activeTab === 'welfare' ? styles.active : ''} onClick={() => setActiveTab('welfare')}>복지게시판관리</li>
                        <li className={activeTab === 'notice' ? styles.active : ''} onClick={() => setActiveTab('notice')}>공지사항관리</li>
                        <li className={activeTab === 'report' ? styles.active : ''} onClick={() => setActiveTab('report')}>신고관리</li>
                    </ul>
                </aside>

                <main className={styles.content}>

                    {/* 1. 대시보드 탭 (Recharts 적용 완료) */}
                    {activeTab === 'dashboard' && (
                        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
                            <h2>대시보드</h2>
                            <div className={styles['dashboard-grid']}>
                                
                                {/* 가입자 추이 (꺾은선 그래프) */}
                                <div className={`${styles.card} ${styles['chart-card']}`}>
                                    <h3>최근 7일 가입자 추이</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={signupData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                {/* 배경 가로선만 표시되도록 vertical=false 설정 */}
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6C757D' }} tickMargin={10} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="users" 
                                                    name="신규 가입자" 
                                                    stroke="#0d6efd" 
                                                    strokeWidth={3} 
                                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                                                    activeDot={{ r: 6 }} 
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* 카테고리별 조회수 (막대 그래프) */}
                                <div className={`${styles.card} ${styles['chart-card']}`}>
                                    <h3>카테고리별 복지 조회수</h3>
                                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                                                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6C757D' }} tickMargin={10} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                                <Tooltip cursor={{ fill: '#F8F9FA' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                                {/* 막대 상단 모서리를 둥글게(radius) 처리하고 두께 제한(maxBarSize) */}
                                                <Bar 
                                                    dataKey="views" 
                                                    name="조회수" 
                                                    fill="#198754" 
                                                    radius={[6, 6, 0, 0]} 
                                                    maxBarSize={50} 
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                            </div>
                        </section>
                    )}

                    {/* 2. 회원 관리 탭 */}
                    {activeTab === 'member' && (
                        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
                            <div className={styles['header-controls']}>
                                <h2>회원관리</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        value={memberSort}
                                        onChange={(e) => { setMemberSort(e.target.value); setCurrentMemberPage(1); }}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CED4DA', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
                                    >
                                        <option value="latest">최신 가입순</option>
                                        <option value="oldest">오래된 가입순</option>
                                        <option value="report">신고 많은 순</option>
                                        <option value="name">이름 가나다순</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="아이디 또는 이름 검색"
                                        className={styles['search-input']}
                                        value={searchMemberKeyword}
                                        onChange={(e) => { setSearchMemberKeyword(e.target.value); setCurrentMemberPage(1); }}
                                    />
                                </div>
                            </div>

                            <div className={styles.card}>
                                <table className={styles['report-table']}>
                                    <thead>
                                        <tr>
                                            <th>회원번호</th>
                                            <th>아이디</th>
                                            <th>이름</th>
                                            <th>가입일</th>
                                            <th>누적 신고</th>
                                            <th>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentMembersList.length === 0 ? (
                                            <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6C757D' }}>데이터가 없습니다.</td></tr>
                                        ) : (
                                            currentMembersList.map(member => (
                                                <tr key={member.memberId}>
                                                    <td>{member.memberId}</td>
                                                    <td>{member.email}</td>
                                                    <td>{member.name}</td>
                                                    <td>{member.signupDate}</td>
                                                    <td><span className={member.reportCount >= 3 ? styles['text-danger'] : ''}>{member.reportCount}회</span></td>
                                                    <td>
                                                        <button
                                                            className={member.reportCount >= 3 ? styles['danger-btn'] : styles['disabled-btn']}
                                                            onClick={() => handleKickMember(member.memberId)}
                                                            disabled={member.reportCount < 3}
                                                        >강제 탈퇴</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {totalMemberPages > 0 && (
                                    <div className={styles.pagination}>
                                        {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map(page => (
                                            <button key={page} className={`${styles['page-btn']} ${currentMemberPage === page ? styles['active-page'] : ''}`} onClick={() => setCurrentMemberPage(page)}>{page}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* 3. 복지게시판 관리 탭 */}
                    {activeTab === 'welfare' && (
                        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
                            <h2>복지게시판관리</h2>
                            <div className={styles.card} style={{ textAlign: 'center', padding: '80px 20px' }}>
                                <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.2rem' }}>복지 서비스 관리 안내</h3>
                                <p style={{ marginBottom: '30px', color: '#6C757D', lineHeight: '1.6' }}>
                                    복지 서비스 신규 등록 및 기존 게시글의 수정/삭제는<br />
                                    실제 서비스되는 <strong>복지 게시판 페이지</strong>에서 관리자 권한으로 직접 수행하실 수 있습니다.
                                </p>
                                <button className={styles['primary-btn']} onClick={() => navigate('/welfare')}>
                                    메인 복지 게시판으로 이동하기 ➔
                                </button>
                            </div>
                        </section>
                    )}

                    {/* 4. 공지사항 관리 탭 */}
                    {activeTab === 'notice' && (
                        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
                            <div className={styles['header-controls']}>
                                <h2>공지사항관리</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        value={noticeSort}
                                        onChange={(e) => { setNoticeSort(e.target.value); setCurrentNoticePage(1); }}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CED4DA', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
                                    >
                                        <option value="latest">최신순</option>
                                        <option value="oldest">오래된순</option>
                                        <option value="views">조회수순</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="제목 검색"
                                        className={styles['search-input']}
                                        value={searchNoticeKeyword}
                                        onChange={(e) => { setSearchNoticeKeyword(e.target.value); setCurrentNoticePage(1); }}
                                    />
                                    <button className={styles['primary-btn']} onClick={openCreateModal}>
                                        + 새 공지 작성
                                    </button>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <table className={styles['report-table']}>
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>제목</th>
                                            <th>등록일</th>
                                            <th>조회수</th>
                                            <th>메인 노출</th>
                                            <th>관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentNoticesList.length === 0 ? (
                                            <tr><td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6C757D' }}>등록된 공지사항이 없습니다.</td></tr>
                                        ) : (
                                            currentNoticesList.map(notice => (
                                                <tr key={notice.boardId}>
                                                    <td>{notice.boardId}</td>
                                                    <td className={styles['clickable-title']} onClick={() => openViewModal(notice)}>{notice.boardTitle}</td>
                                                    <td>{notice.createDate}</td>
                                                    <td>{notice.views}</td>
                                                    <td>
                                                        <button
                                                            className={notice.isPinned ? styles['badge-on'] : styles['badge-off']}
                                                            onClick={() => handleTogglePin(notice.boardId)}
                                                            title="클릭하여 노출 상태 변경"
                                                        >
                                                            {notice.isPinned ? 'ON' : 'OFF'}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button className={styles['detail-btn']} onClick={() => openEditModal(notice)}>수정</button>
                                                            <button className={styles['danger-btn']} onClick={() => handleDeleteNotice(notice.boardId)}>삭제</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {totalNoticePages > 0 && (
                                    <div className={styles.pagination}>
                                        {Array.from({ length: totalNoticePages }, (_, i) => i + 1).map(page => (
                                            <button key={page} className={`${styles['page-btn']} ${currentNoticePage === page ? styles['active-page'] : ''}`} onClick={() => setCurrentNoticePage(page)}>{page}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* 5. 신고 관리 탭 */}
                    {activeTab === 'report' && (
                        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
                            <div className={styles['header-controls']}>
                                <h2>신고관리</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <select
                                        value={reportReasonFilter}
                                        onChange={(e) => { setReportReasonFilter(e.target.value); setCurrentReportPage(1); }}
                                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CED4DA', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
                                    >
                                        <option value="all">전체 사유</option>
                                        <option value="욕설 / 비방">욕설 / 비방</option>
                                        <option value="스팸 / 광고">스팸 / 광고</option>
                                        <option value="음란물 / 혐오">음란물 / 혐오</option>
                                        <option value="기타">기타</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="신고자 검색"
                                        className={styles['search-input']}
                                        value={searchReportKeyword}
                                        onChange={(e) => { setSearchReportKeyword(e.target.value); setCurrentReportPage(1); }}
                                    />
                                </div>
                            </div>

                            <div className={styles.card}>
                                <table className={styles['report-table']}>
                                    <thead>
                                        <tr>
                                            <th>번호</th>
                                            <th>신고자</th>
                                            <th>신고대상</th>
                                            <th>신고사유</th>
                                            <th>처리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentReportsList.length === 0 ? (
                                            <tr><td colSpan="5" style={{ padding: '30px', color: '#6C757D', textAlign: 'center' }}>현재 처리할 신고 내역이 없습니다.</td></tr>
                                        ) : (
                                            currentReportsList.map(report => (
                                                <tr key={report.reportId}>
                                                    <td>{report.reportId}</td>
                                                    <td>{report.memberId}</td>
                                                    <td>{report.targetId}</td>
                                                    <td>{report.reason}</td>
                                                    <td>
                                                        <button className={styles['detail-btn']} onClick={() => setSelectedReport(report)}>처리</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                                {totalReportPages > 0 && (
                                    <div className={styles.pagination}>
                                        {Array.from({ length: totalReportPages }, (_, i) => i + 1).map(page => (
                                            <button key={page} className={`${styles['page-btn']} ${currentReportPage === page ? styles['active-page'] : ''}`} onClick={() => setCurrentReportPage(page)}>{page}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}
                </main>
            </div>

            {/* 신고 처리 모달 */}
            {selectedReport && (
                <ReportModals
                    report={{
                        no: selectedReport.reportId,
                        reporter: selectedReport.memberId,
                        target: selectedReport.targetId,
                        reason: selectedReport.reason,
                        content: selectedReport.reportResult
                    }}
                    onClose={() => setSelectedReport(null)}
                    onComplete={(id, status, reason) => handleProcessComplete(id, status, reason)}
                />
            )}

            {/* 공지사항 작성/수정 모달 */}
            {isNoticeModalOpen && (
                <NoticeModal
                    notice={editingNotice}
                    onClose={() => { setIsNoticeModalOpen(false); setEditingNotice(null); }}
                    onSave={handleSaveNotice}
                />
            )}

            {/* 공지사항 조회(읽기 전용) 모달 */}
            {viewingNotice && (
                <NoticeModal
                    notice={viewingNotice}
                    isReadOnly={true}
                    onClose={() => setViewingNotice(null)}
                />
            )}
        </div>
    );
}

export default AdminPage;