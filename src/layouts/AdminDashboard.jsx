import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [signupData, setSignupData] = useState([]);
    const [topWelfareData, setTopWelfareData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [totalRes, signupRes, topRes] = await Promise.all([
                fetch('http://localhost:8080/member/admin/dashboard/total-members', { headers }),
                fetch('http://localhost:8080/member/admin/dashboard/signup-trend', { headers }),
                fetch('http://localhost:8080/member/admin/dashboard/top-welfare', { headers })
            ]);

            if (totalRes.ok) setTotalUsers(await totalRes.json());
            if (signupRes.ok) setSignupData(await signupRes.json());
            if (topRes.ok) setTopWelfareData(await topRes.json());
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <h2>관리자 대시보드</h2>
            <div className={styles['dashboard-grid']}>
                
                {/* 가입자 현황 */}
                <div className={`${styles.card} ${styles['chart-card']}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>최근 7일 가입자 추이</h3>
                        <h2 style={{ margin: 0, color: '#0d6efd' }}>총 {totalUsers}명</h2>
                    </div>
                    <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signupData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="users" name="신규 가입자" stroke="#0d6efd" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 인기 복지 TOP 10 */}
                <div className={`${styles.card} ${styles['chart-card']}`}>
                    <h3>인기 복지 TOP 10 (조회수 + 찜)</h3>
                    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={topWelfareData} 
                                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="title" 
                                    interval={0} 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                    tick={{ fontSize: 11 }} 
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '40px' }} />
                                
                                {/* 조회수(왼쪽/녹색), 찜 횟수(오른쪽/빨간색) */}
                                <Bar dataKey="views" name="조회수" fill="#198754" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="wishes" name="찜 횟수" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default AdminDashboard;