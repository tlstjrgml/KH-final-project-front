import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardReviewWrite.module.css';

const BoardReviewWrite = () => {
    const navigate = useNavigate();
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');
    const [selectedWelfare, setSelectedWelfare] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            const res = await fetch(`/api/welfare/list?keyword=${encodeURIComponent(searchKeyword)}`);
            if (!res.ok) throw new Error('검색 실패');
            const data = await res.json();
            setSearchResults(data.list || []);
        } catch (err) {
            console.error(err);
            alert('검색 중 오류가 발생했습니다.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const selectWelfare = (item) => {
        setSelectedWelfare(item);
        setIsModalOpen(false);
        setSearchResults([]);
        setSearchKeyword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedWelfare) {
            alert('연결할 복지 서비스를 선택해주세요.');
            return;
        }
        if (!boardTitle.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!boardContent.trim()) {
            alert('후기 내용을 입력해주세요.');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/react/board/write', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardTitle: boardTitle,
                    boardContent: boardContent,
                    boardType: 'REV',
                    welfareId: selectedWelfare ? selectedWelfare.welfareId : null
                })
            });

            if (!res.ok) {
                throw new Error('등록 실패');
            }

            alert('등록되었습니다.');
            navigate('/boardreview');
        } catch (err) {
            console.error(err);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 작성</h2>
                </div>

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
                            <h3>복지 서비스 검색</h3>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="검색어를 입력하세요"
                                />
                                <button onClick={handleSearch}>검색</button>
                            </div>
                            <ul className={styles.resultList}>
                                {searchResults.map((item) => (
                                    <li key={item.welfareId} className={styles.resultItem} onClick={() => selectWelfare(item)}>
                                        {item.plcyNm}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="board_type" value="REV" />

                    <div className={styles.field}>
                        <label>연결할 복지 서비스명</label>
                        <input
                            type="text"
                            placeholder="상세조회 대상 복지 서비스 정보를 불러와주세요"
                            value={selectedWelfare ? selectedWelfare.plcyNm : ''}
                            readOnly
                        />
                    </div>

                    <div className={styles.field}>
                        <label>제목<span className={styles.req}>*</span></label>
                        <input
                            type="text"
                            placeholder="게시글 제목을 입력해주세요"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.field} style={{ flex: 1 }}>
                            <label>&nbsp;</label>
                            <button type="button" className={styles.btnLoad} onClick={() => setIsModalOpen(true)}>후기 해당 복지글 불러오기</button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>후기 내용<span className={styles.req}>*</span></label>
                        <textarea
                            placeholder="복지 서비스를 이용하신 소감을 작성해주세요."
                            value={boardContent}
                            onChange={(e) => setBoardContent(e.target.value)}
                        ></textarea>
                    </div>

                    <div className={styles.field}>
                        <label>파일 첨부</label>
                        <div className={styles.fileCustomBox}>
                            <button type="button" className={styles.btnFile}>파일 선택</button>
                            <span className={styles.fileName}>선택된 파일 없음</span>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className={styles.btnSubmit}>글 등록하기</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoardReviewWrite;