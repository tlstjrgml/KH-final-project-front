import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardReviewEdit.module.css';

const BoardReviewEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedWelfare, setSelectedWelfare] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [existingFiles, setExistingFiles] = useState([]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);
    const nextRowId = useRef(1);
    const [newFileRows, setNewFileRows] = useState([{ id: 0, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
    const fileInputRefs = useRef({});

    // 기존 게시글 및 첨부파일 데이터 불러오기
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (!res.ok) throw new Error('게시글 조회 실패');
                const data = await res.json();

                // 작성자 본인 검증
                if (!data.isOwner) {
                    alert('본인이 작성한 게시글만 수정할 수 있습니다.');
                    navigate(`/boardreview/detail/${id}`);
                    return;
                }

                setTitle(data.boardTitle);
                setContent(data.boardContent);

                // 첨부파일 데이터 바인딩
                if (data.attachments && data.attachments.length > 0) {
                    const mappedFiles = data.attachments.map(file => ({
                        id: file.attmId || file.fileId,
                        name: file.originalName || file.originName || '첨부파일',
                        size: file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(1)}MB` : '0.0MB'
                    }));
                    setExistingFiles(mappedFiles);
                }

                // 연결된 복지 서비스 정보 불러오기
                if (data.welfareId) {
                    const wRes = await fetch(`/api/welfare/detail/${data.welfareId}`);
                    if (wRes.ok) {
                        const wData = await wRes.json();
                        setSelectedWelfare({ welfareId: data.welfareId, plcyNm: wData.plcyNm });
                    } else {
                        setSelectedWelfare({ welfareId: data.welfareId, plcyNm: '복지서비스 정보를 불러올 수 없음' });
                    }
                }
            } catch (err) {
                console.error(err);
                alert('게시글을 불러오지 못했습니다.');
                navigate('/boardreview');
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
    }, [id, navigate]);

    // 복지 서비스 검색
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

    // 엔터키 검색 지원
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    // 검색된 복지 서비스 선택
    const selectWelfare = (item) => {
        setSelectedWelfare(item);
        setIsModalOpen(false);
        setSearchResults([]);
        setSearchKeyword('');
    };

    // 기존 첨부파일 삭제 목록에 추가
    const handleDeleteExisting = (fileId) => {
        setExistingFiles(existingFiles.filter(file => file.id !== fileId));
        setDeletedFileIds([...deletedFileIds, fileId]);
    };

    // 새 첨부파일 입력 행 추가
    const handleAddNewRow = () => {
        setNewFileRows([...newFileRows, { id: nextRowId.current, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
        nextRowId.current += 1;
    };

    // 새 첨부파일 입력 행 삭제
    const handleRemoveNewRow = (rowId) => {
        setNewFileRows(newFileRows.filter(row => row.id !== rowId));
    };

    // 파일 선택 창 트리거
    const triggerFileInput = (rowId) => { fileInputRefs.current[rowId]?.click(); };

    // 파일 선택 시 파일명 표시 업데이트
    const handleFileChange = (e, rowId) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewFileRows(newFileRows.map(row => row.id === rowId ? { ...row, fileNameDisplay: files[0].name, hasFile: true } : row));
        }
    };

    // 서버 전송
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        if (!selectedWelfare) {
            alert('연결할 복지 서비스를 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('boardTitle', title);
            formData.append('boardContent', content);
            formData.append('welfareId', selectedWelfare.welfareId);

            // 삭제할 파일 ID 추가
            deletedFileIds.forEach(id => {
                formData.append('deleteFileIds', id);
            });

            // 새로 추가된 파일 데이터 추가
            newFileRows.forEach(row => {
                if (row.hasFile) {
                    const file = fileInputRefs.current[row.id]?.files[0];
                    if (file) {
                        formData.append('newFiles', file);
                    }
                }
            });

            const res = await fetch(`/react/board/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '수정 실패');
            }

            alert('수정이 완료되었습니다!');
            navigate(`/boardreview/detail/${id}`);
        } catch (err) {
            console.error(err);
            alert(`수정 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 수정</h2>
                </div>

                {/* 복지 서비스 검색 모달 */}
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

                <form onSubmit={handleFormSubmit}>
                    <div className={styles.field}>
                        <label>연결된 복지 서비스</label>
                        <div className={styles.row}>
                            <input type="text" value={selectedWelfare ? selectedWelfare.plcyNm : ''} readOnly />
                            <button type="button" className={styles.btnLoad} onClick={() => setIsModalOpen(true)}>복지글 변경</button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>기존 첨부파일 목록</label>
                        <ul className={styles.existingFileList}>
                            {existingFiles.length === 0 ? (
                                <li className={styles.fileItem} style={{ color: '#999', fontSize: '14px' }}>첨부된 파일이 없습니다.</li>
                            ) : (
                                existingFiles.map(file => (
                                    <li key={file.id} className={styles.fileItem}>
                                        <span>{file.name} ({file.size})</span>
                                        <button type="button" className={styles.btnDeleteFile} onClick={() => handleDeleteExisting(file.id)}>삭제</button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className={styles.field}>
                        <label>새 파일 첨부</label>
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
                        <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>취소</button>
                        <button type="submit" className={styles.btnSubmit}>수정 완료</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default BoardReviewEdit;