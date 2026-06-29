import { useState, useEffect } from 'react';
import styles from './MyReports.module.css';

const PAGE_SIZE = 10;

const typeLabel = {
    FRE: '자유게시판',
    REV: '후기게시판',
    REP: '댓글'
};

const statusLabel = {
    PENDING: '처리중',
    DONE: '신고 처리 완료',
    REJECT: '신고 처리 거부'
};

const badgeClass = {
    PENDING: styles.badgePending,
    DONE: styles.badgeDone,
    REJECT: styles.badgeReject
};

const MyReports = () => {
    const [activeTab, setActiveTab] = useState('my');
    const [allData, setAllData] = useState([]);
    const [list, setList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState(1);
    const [pages, setPages] = useState([1]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const url = activeTab === 'my' ? '/react/report/my' : '/react/report/received';
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setAllData(data);
        };
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        const total = Math.ceil(allData.length / PAGE_SIZE) || 1;
        setEndPage(total);
        setPages(Array.from({ length: total }, (_, i) => i + 1));
        setList(allData.slice(0, PAGE_SIZE));
    }, [allData]);

    useEffect(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        setList(allData.slice(start, start + PAGE_SIZE));
    }, [currentPage, allData]);

    return (
        <main className={styles.page}>
            <div className={styles.reportCard}>
                <div className={styles.reportHeader}>
                    <h2 className={styles.reportTitle}>신고 히스토리</h2>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'my' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('my'); setCurrentPage(1); }}
                    >내가 신고한 내역</button>
                    <button
                        className={`${styles.tab} ${activeTab === 'received' ? styles.active : ''}`}
                        onClick={() => { setActiveTab('received'); setCurrentPage(1); }}
                    >신고당한 내역</button>
                </div>

                <table className={styles.reportTable}>
                    <thead>
                        <tr>
                            <th className={styles.colId}>신고번호</th>
                            <th className={styles.colType}>대상 유형</th>
                            <th className={styles.colDate}>신고일자</th>
                            <th className={styles.colStatus}>처리상태</th>
                            <th className={styles.colResult}>처리결과</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={styles.empty}>신고 내역이 없습니다.</td>
                            </tr>
                        ) : (
                            list.map((report) => (
                                <tr key={report.reportId}>
                                    <td className={styles.colId}>{report.reportId}</td>
                                    <td className={styles.colType}>{typeLabel[report.targetType]}</td>
                                    <td className={styles.colDate}>{report.reportDate?.split('T')[0]}</td>
                                    <td className={styles.colStatus}>
                                        <span className={badgeClass[report.status]}>{statusLabel[report.status]}</span>
                                    </td>
                                    <td className={styles.colResult}>{report.reportResult || '—'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <a
                        className={styles.pageItem}
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto', opacity: currentPage <= 1 ? 0.4 : 1, cursor: 'pointer' }}
                    >&lt;</a>

                    {pages.map((p) => (
                        <a
                            key={p}
                            className={`${styles.pageItem} ${p === currentPage ? styles.active : ''}`}
                            onClick={() => setCurrentPage(p)}
                            style={{ cursor: 'pointer' }}
                        >{p}</a>
                    ))}

                    <a
                        className={styles.pageItem}
                        onClick={() => currentPage < endPage && setCurrentPage(currentPage + 1)}
                        style={{ pointerEvents: currentPage >= endPage ? 'none' : 'auto', opacity: currentPage >= endPage ? 0.4 : 1, cursor: 'pointer' }}
                    >&gt;</a>
                </div>

            </div>
        </main>
    );
};

export default MyReports;