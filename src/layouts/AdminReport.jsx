import React, { useState, useEffect } from 'react';
import ReportModals from './ReportModals';
import styles from './AdminReport.module.css';

function AdminReport() {
    const [reports, setReports] = useState([]);
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [searchReportKeyword, setSearchReportKeyword] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    // 백엔드 Pagination 객체 구조를 담을 상태
    const [pageInfo, setPageInfo] = useState({
        startPage: 1,
        endPage: 1,
        hasPrev: false,
        hasNext: false,
        totalPages: 0
    });

    // 백엔드에 목록 및 페이징 정보 요청
    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = `http://localhost:8080/report/list?page=${currentReportPage}&keyword=${encodeURIComponent(searchReportKeyword)}&status=PENDING&t=${new Date().getTime()}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('신고 목록을 불러오는데 실패했습니다.');

            const data = await response.json();
            const pendingReports = (data.content || []).filter(item => item.status === 'PENDING');

            setReports(pendingReports);
            if (data.pagination) {
                setPageInfo(data.pagination);
            } else {
                setPageInfo({ startPage: 1, endPage: 1, hasPrev: false, hasNext: false, totalPages: 0 });
            }

        } catch (error) {
            console.error('API 호출 에러:', error);
            setReports([]);
            setPageInfo({ startPage: 1, endPage: 1, hasPrev: false, hasNext: false, totalPages: 0 });
        }
    };

    // 페이지 번호가 바뀔 때마다 재조회
    useEffect(() => {
        fetchReports();
    }, [currentReportPage]);

    // 검색 실행 로직
    const executeSearch = () => {
        setCurrentReportPage(1);
        fetchReports();
    };

    // 모달에서 처리 완료 후 백엔드에 업데이트 요청 및 목록 리패칭
    const handleProcessComplete = async (processData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/report/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(processData)
            });
            console.log("서버 응답 상태:", response.status);

            if (!response.ok) throw new Error('신고 처리 실패');

            alert("성공적으로 처리되었습니다. (목록에서 제거됨)");
            setSelectedReport(null);
            fetchReports(); // 백엔드 일괄 처리 후 최신 데이터를 다시 불러옴

        } catch (error) {
            console.error('신고 처리 에러:', error);
            alert('처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <div className={styles['header-controls']}>
                <h2>신고관리</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="신고자 검색"
                        className={styles['search-input']}
                        value={searchReportKeyword}
                        onChange={(e) => setSearchReportKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') executeSearch(); }}
                    />
                    <button className={styles['detail-btn']} onClick={executeSearch} style={{ backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '6px', padding: '0 15px', cursor: 'pointer' }}>
                        검색
                    </button>
                </div>
            </div>

            <div className={styles.card}>
                <table className={styles['report-table']}>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>신고자</th>
                            <th>신고대상</th>
                            <th>처리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '30px', color: '#6C757D', textAlign: 'center' }}>현재 처리할 신고 내역이 없습니다.</td></tr>
                        ) : (
                            reports.map(report => {
                                // 💡 1. 정상적인 카테고리(자유게시판/복지후기)인지 확인
                                const isValidCategory = report.targetCategory?.trim() === 'FRE' || report.targetCategory?.trim() === 'REV';
                                
                                // 💡 2. 삭제된 데이터인지 판별 (내용없음 OR 상태 N OR 부모글 삭제되어 카테고리 알 수 없음)
                                const isDeleted = !report.targetContent || report.targetStatus === 'N' || !isValidCategory;

                                return (
                                    <tr key={report.reportId}>
                                        <td>{report.reportId}</td>
                                        <td>{report.writerNickname || report.memberId}</td>
                                        <td>
                                            <span style={{ fontWeight: 'bold', color: '#0d6efd', marginRight: '5px' }}>
                                                {report.targetCategory?.trim() === 'FRE' ? '[자유게시판 ' :
                                                    report.targetCategory?.trim() === 'REV' ? '[복지후기 ' : '[삭제된 글의 '}
                                                {report.targetType?.trim() === 'REP' ? '댓글]' : '게시글]'}
                                            </span>
                                            
                                            <span style={{ fontSize: '0.9em', color: '#333' }}>
                                                {isDeleted
                                                    ? <span style={{ color: '#dc3545', fontWeight: 'bold' }}>이미 삭제된 데이터입니다.</span>
                                                    : (report.targetContent.length > 20 ? report.targetContent.substring(0, 20) + '...' : report.targetContent)
                                                }
                                            </span>

                                            <span style={{
                                                marginLeft: '8px',
                                                backgroundColor: '#f1f3f5',
                                                color: '#868e96',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '0.75em',
                                                verticalAlign: 'middle'
                                            }}>
                                                #{report.targetId}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className={styles['detail-btn']} 
                                                onClick={() => setSelectedReport(report)}
                                                disabled={isDeleted}
                                                style={isDeleted ? { backgroundColor: '#e9ecef', color: '#adb5bd', cursor: 'not-allowed', border: 'none' } : {}}
                                            >
                                                {isDeleted ? '처리불가' : '처리'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* 백엔드 페이지네이션 정보를 활용한 하단 네비게이션 */}
                {pageInfo.totalPages > 0 && (
                    <div className={styles.pagination}>
                        {pageInfo.hasPrev && (
                            <button className={styles['page-btn']} onClick={() => setCurrentReportPage(pageInfo.startPage - 1)}>
                                &lt;
                            </button>
                        )}

                        {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, i) => pageInfo.startPage + i).map(page => (
                            <button
                                key={page}
                                className={`${styles['page-btn']} ${currentReportPage === page ? styles['active-page'] : ''}`}
                                onClick={() => setCurrentReportPage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        {pageInfo.hasNext && (
                            <button className={styles['page-btn']} onClick={() => setCurrentReportPage(pageInfo.endPage + 1)}>
                                &gt;
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* 모달 연동 */}
            {selectedReport && (
                <ReportModals
                    report={{
                        no: selectedReport.reportId,
                        reporter: selectedReport.writerNickname || selectedReport.memberId,
                        target: selectedReport.targetId,
                        targetType: selectedReport.targetType,
                        targetCategory: selectedReport.targetCategory,
                        reason: selectedReport.reason,
                        content: selectedReport.targetContent
                    }}
                    onClose={() => setSelectedReport(null)}
                    onComplete={(data) => handleProcessComplete(data)}
                />
            )}
        </section>
    );
}

export default AdminReport;