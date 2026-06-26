import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminMember.module.css';

function AdminMember() {
    const rowsPerPage = 10;
    const [searchMemberKeyword, setSearchMemberKeyword] = useState('');
    const [currentMemberPage, setCurrentMemberPage] = useState(1);
    const [memberSort, setMemberSort] = useState('latest');
    const [memberStatusFilter, setMemberStatusFilter] = useState('ACTIVE'); // 추가

    const [members, setMembers] = useState([]);
    const [totalMemberPages, setTotalMemberPages] = useState(0);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/member/admin/list', {
                params: {
                    page: currentMemberPage,
                    limit: rowsPerPage,
                    keyword: searchMemberKeyword,
                    sort: memberSort,
                    status: memberStatusFilter // 추가
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            setMembers(response.data?.content || []);
            setTotalMemberPages(response.data?.pagination?.totalPages || 0);
        } catch (error) {
            console.error('회원 목록 조회 실패:', error);
            setMembers([]);
            setTotalMemberPages(0);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchMembers();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [currentMemberPage, memberSort, searchMemberKeyword, memberStatusFilter]); // status 추가

    const handleKickMember = async (memberId) => {
        if (window.confirm(`${memberId}번 회원을 강제 탈퇴 처리하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:8080/member/admin/${memberId}/withdraw`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('성공적으로 탈퇴 처리되었습니다.');
                fetchMembers();
            } catch (error) {
                console.error('탈퇴 처리 실패:', error);
                alert(error.response?.data || '탈퇴 처리에 실패했습니다.');
            }
        }
    };

    // 추가: 복구 처리
    const handleRestoreMember = async (memberId) => {
        if (window.confirm(`${memberId}번 회원을 다시 활성 상태로 복구하시겠습니까?`)) {
            try {
                const token = localStorage.getItem('token');
                await axios.patch(`http://localhost:8080/member/admin/${memberId}/restore`, null, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('복구 처리되었습니다.');
                fetchMembers();
            } catch (error) {
                console.error('복구 처리 실패:', error);
                alert(error.response?.data || '복구 처리에 실패했습니다.');
            }
        }
    };

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <div className={styles['header-controls']}>
                <h2>회원관리</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {/* 추가: 상태 토글 */}
                    <div className={styles['status-toggle']}>
                        <button
                            className={memberStatusFilter === 'ACTIVE' ? styles['status-btn-active'] : styles['status-btn']}
                            onClick={() => { setMemberStatusFilter('ACTIVE'); setCurrentMemberPage(1); }}
                        >
                            활성 회원
                        </button>
                        <button
                            className={memberStatusFilter === 'BANNED' ? styles['status-btn-active'] : styles['status-btn']}
                            onClick={() => { setMemberStatusFilter('BANNED'); setCurrentMemberPage(1); }}
                        >
                            탈퇴 회원
                        </button>
                    </div>

                    <select
                        value={memberSort}
                        onChange={(e) => { setMemberSort(e.target.value); setCurrentMemberPage(1); }}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #CED4DA', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' }}
                    >
                        <option value="latest">최신 가입순</option>
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
                            <th>회원번호</th><th>아이디</th><th>이름</th><th>가입일</th><th>신고 확정</th><th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members?.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '30px', textAlign: 'center', color: '#6C757D' }}>
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            members.map(member => (
                                <tr
                                    key={member.memberId}
                                    className={memberStatusFilter === 'BANNED' ? styles['banned-row'] : ''}
                                >
                                    <td>{member.memberId}</td>
                                    <td style={{ color: member.email ? 'inherit' : '#856A00', fontWeight: member.email ? 'normal' : 'bold' }}>{member.email || '카카오 연동 계정'}</td>
                                    <td>{member.nickname}</td>
                                    <td>{member.signupDate ? member.signupDate.substring(0, 10) : ''}</td>

                                    {/* 수정 1: 누적 신고 횟수 출력 (3회 이상이면 빨간색 굵은 글씨로 경고 표시) */}
                                    <td style={{
                                        color: (member.reportCount || 0) >= 3 ? '#DC3545' : '#6C757D',
                                        fontWeight: (member.reportCount || 0) >= 3 ? 'bold' : 'normal'
                                    }}>
                                        {member.reportCount || 0}
                                    </td>

                                    <td>
                                        {memberStatusFilter === 'ACTIVE' ? (
                                            /* 수정 2: 누적 신고 3회 이상 조건에 따른 버튼 제어 */
                                            <button
                                                className={(member.reportCount || 0) >= 3 ? styles['danger-btn'] : styles['disabled-btn']}
                                                onClick={() => handleKickMember(member.memberId)}
                                                disabled={(member.reportCount || 0) < 3}
                                            >
                                                강제 탈퇴
                                            </button>
                                        ) : (
                                            <button
                                                className={styles['restore-btn']}
                                                onClick={() => handleRestoreMember(member.memberId)}
                                            >
                                                복구
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {totalMemberPages > 0 && (
                    <div className={styles.pagination}>
                        {Array.from({ length: totalMemberPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`${styles['page-btn']} ${currentMemberPage === page ? styles['active-page'] : ''}`}
                                onClick={() => setCurrentMemberPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default AdminMember;