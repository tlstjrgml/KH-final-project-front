import React, { useState } from 'react';
import ReportModals from './ReportModals';
import styles from './AdminReport.module.css'; // 나중에 일괄 세팅할 CSS

function AdminReport() {
    const rowsPerPage = 5;
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [searchReportKeyword, setSearchReportKeyword] = useState('');
    const [reportReasonFilter, setReportReasonFilter] = useState('all');
    const [selectedReport, setSelectedReport] = useState(null);

    // 기존 신고 더미 데이터
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

    // 검색 및 필터링 로직
    let processedReports = reports.filter(r =>
        (reportReasonFilter === 'all' || r.reason === reportReasonFilter) &&
        r.memberId.includes(searchReportKeyword)
    );
    const totalReportPages = Math.ceil(processedReports.length / rowsPerPage);
    const currentReportsList = processedReports.slice((currentReportPage - 1) * rowsPerPage, currentReportPage * rowsPerPage);

    // 모달에서 처리 완료 후 넘어온 데이터로 목록을 갱신하는 로직
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

    return (
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

            {/* 모달 연동 유지 */}
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
        </section>
    );
}

export default AdminReport;