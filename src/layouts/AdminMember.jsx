import React, { useState } from 'react';
import styles from './AdminMember.module.css'; // 나중에 일괄 세팅할 CSS

function AdminMember() {
    const rowsPerPage = 5;
    const [searchMemberKeyword, setSearchMemberKeyword] = useState('');
    const [currentMemberPage, setCurrentMemberPage] = useState(1);
    const [memberSort, setMemberSort] = useState('latest');
    
    // 회원 더미 데이터
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

    // 회원 관리 로직
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

    return (
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
                            <th>회원번호</th><th>아이디</th><th>이름</th><th>가입일</th><th>누적 신고</th><th>관리</th>
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
    );
}

export default AdminMember;