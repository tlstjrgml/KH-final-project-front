import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './AdminDashboard.module.css'; // 나중에 일괄 세팅할 CSS

// 차트용 임시 더미 데이터
const signupData = [
    { date: '06-05', users: 12 }, { date: '06-06', users: 19 },
    { date: '06-07', users: 15 }, { date: '06-08', users: 22 },
    { date: '06-09', users: 30 }, { date: '06-10', users: 28 },
    { date: '06-11', users: 35 },
];

const categoryData = [
    { name: '주거', views: 400 }, { name: '금융', views: 300 },
    { name: '교육', views: 550 }, { name: '건강', views: 200 },
    { name: '취업', views: 700 },
];

function AdminDashboard() {
    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <h2>대시보드</h2>
            <div className={styles['dashboard-grid']}>
                
                {/* 가입자 추이 (꺾은선 그래프) */}
                <div className={`${styles.card} ${styles['chart-card']}`}>
                    <h3>최근 7일 가입자 추이</h3>
                    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signupData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E9ECEF" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6C757D' }} tickMargin={10} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#6C757D' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="users" name="신규 가입자" stroke="#0d6efd" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
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
                                <Bar dataKey="views" name="조회수" fill="#198754" radius={[6, 6, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default AdminDashboard;