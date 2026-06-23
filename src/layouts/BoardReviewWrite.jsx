import React, { useState, useRef } from 'react';
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

    const nextRowId = useRef(1);
    const [newFileRows, setNewFileRows] = useState([{ id: 0, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
    const fileInputRefs = useRef({});

    const handleSearch = async () => {
        try {
            const res = await fetch(`/api/welfare/list?keyword=${encodeURIComponent(searchKeyword)}`);
            if (!res.ok) throw new Error('검색 실패');
            const data = await res.json();
            setSearchResults(data.content || []);
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

    const handleAddNewRow = () => {
        setNewFileRows([...newFileRows, { id: nextRowId.current, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
        nextRowId.current += 1;
    };

    const handleRemoveNewRow = (rowId) => {
        setNewFileRows(newFileRows.filter(row => row.id !== rowId));
    };

    const triggerFileInput = (rowId) => {
        fileInputRefs.current[rowId]?.click();
    };

    const handleFileChange = (e, rowId) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewFileRows(newFileRows.map(row =>
                row.id === rowId ? { ...row, fileNameDisplay: files[0].name, hasFile: true } : row
            ));
        }
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
            const formData = new FormData();
            formData.append('boardTitle', boardTitle);
            formData.append('boardContent', boardContent);
            formData.append('boardType', 'REV');
            formData.append('welfareId', selectedWelfare.welfareId);

            newFileRows.forEach(row => {
                if (row.hasFile) {
                    const file = fileInputRefs.current[row.id]?.files[0];
                    if (file) {
                        formData.append('files', file);
                    }
                }
            });

            const res = await fetch('/react/board/write', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
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
                            <button type="button" className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
                            <h3>복지 서비스 검색</h3>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="검색어를 입력하세요"
                                />
                                <button type="button" onClick={handleSearch}>검색</button>
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
                        {newFileRows.map((row) => (
                            <div key={row.id} className={styles.fileCustomBox} style={{ marginBottom: '8px' }}>
                                <input
                                    type="file"
                                    ref={el => fileInputRefs.current[row.id] = el}
                                    onChange={(e) => handleFileChange(e, row.id)}
                                    style={{ display: 'none' }}
                                />
                                <button type="button" className={styles.btnFile} onClick={() => triggerFileInput(row.id)}>파일 선택</button>
                                <span className={styles.fileName}>{row.fileNameDisplay}</span>
                                {row.id !== 0 && (
                                    <button type="button" className={styles.btnRemoveRow} onClick={() => handleRemoveNewRow(row.id)}>삭제</button>
                                )}
                            </div>
                        ))}
                        <button type="button" className={styles.btnAddRow} onClick={handleAddNewRow}>+ 파일 추가</button>
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