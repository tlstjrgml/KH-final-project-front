import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './BoardFreeEdit.module.css';

const BoardFreeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [existingFiles, setExistingFiles] = useState([]);
    const [deletedExistingFiles, setDeletedExistingFiles] = useState([]); 
    const [fileRows, setFileRows] = useState([{ id: 0, files: [] }]); 
    const nextRowId = useRef(1);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });

                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.boardTitle || "");
                    setContent(data.boardContent || "");
                } else {
                    alert("게시글 정보를 불러올 수 없거나 권한이 없습니다.");
                    navigate(-1);
                }
            } catch (err) {
                console.error("게시글 로딩 오류:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoardDetail();
    }, [id, navigate]);

    const handleDeleteExisting = (fileId) => {
        if (window.confirm("기존 첨부파일을 삭제하시겠습니까? (수정 완료 시 최종 반영됩니다)")) {
            setDeletedExistingFiles([...deletedExistingFiles, fileId]);
        }
    };

    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: nextRowId.current, files: [] }]);
        nextRowId.current += 1;
    };

    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter(row => row.id !== rowId));
    };

    const handleFileChange = (rowId, e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFileRows(fileRows.map(row => 
                row.id === rowId ? { ...row, files: selectedFiles } : row
            ));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`/react/board/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardTitle: title,
                    boardContent: content,
                    deletedFileIds: deletedExistingFiles 
                })
            });

            if (response.ok) {
                alert('수정이 성공적으로 완료되었습니다!');
                navigate(`/boardfree/detail/${id}`);
            } else {
                alert('게시글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('수정 통신 오류:', error);
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>데이터를 불러오는 중입니다...</div>;
    }

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 수정</h2>
                </div>

                <form onSubmit={handleFormSubmit}>
                    
                    {/* 제목 입력 필드 */}
                    <div className={styles.field}>
                        <label>제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="제목을 입력하세요"
                            required
                        />
                    </div>

                    {/* 내용 입력 필드 */}
                    <div className={styles.field}>
                        <label>내용</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            rows="12"
                            placeholder="내용을 입력하세요"
                            required
                        />
                    </div>

                    {/*  파일 첨부 전체 영역 시작 */}
                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>
                                파일 첨부 
                                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>
                                    (최대 5MB)
                                </span>
                            </label>
                        </div>

                        {/* 기존 첨부파일 영역 */}
                        <div className={styles.existingFiles} id="existingFilesArea">
                            <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                                <div className={styles.replyItem} style={{ textAlign: 'center', padding: '30px 0', color: '#adb5bd' }}>
                                        등록된 첨부파일이 없습니다.
                                </div>
                            </label>
                            
                            {existingFiles.map((file) => (
                                !deletedExistingFiles.includes(file.id) && (
                                    <div key={`existing-${file.id}`} className={styles.existingFileItem}>
                                        <div className={styles.existingFileName}>
                                            <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 2, fill: 'none' }}>
                                                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                            </svg>
                                            {file.name} <span style={{ color: '#ADB5BD', fontSize: '11px' }}>({file.size})</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.btnRemoveExisting}
                                            onClick={() => handleDeleteExisting(file.id)}
                                            title="삭제"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                )
                            ))}
                        </div>

                        {deletedExistingFiles.map((delId) => (
                            <input key={`del-${delId}`} type="hidden" name="deleteFileIds" value={delId} />
                        ))}

                        {/* 새로운 파일 첨부 영역 */}
                        <div className={styles.fileHeader} style={{ marginTop: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500 }}>
                                새 파일 추가하기
                            </label>
                            <button 
                                type="button" 
                                id="addFile" 
                                className={styles.btnAddFile} 
                                onClick={handleAddFileRow}
                            >
                                + 파일 추가
                            </button>
                        </div>
                        
                        <div id="fileArea">
                            {fileRows.map((row, index) => (
                                <div key={row.id} className={styles.fileRow}>
                                    <input 
                                        type="file" 
                                        name="file" 
                                        id={`file_input_${row.id}`}
                                        className={styles.fileInputHidden} 
                                        style={{ display: 'none' }} 
                                        multiple 
                                        onChange={(e) => handleFileChange(row.id, e)}
                                    />
                                    
                                    <div 
                                        className={styles.fileCustomBox} 
                                        onClick={() => document.getElementById(`file_input_${row.id}`).click()}
                                    >
                                        <button type="button" className={styles.btnFile}>파일 선택</button>
                                        <span className={styles.fileName} style={{ color: row.files.length > 0 ? '#1A1D23' : '#ADB5BD' }}>
                                            {row.files.length > 0 ? row.files.map(f => f.name).join(', ') : '선택된 파일 없음'}
                                        </span>
                                    </div>
                                    
                                    {index > 0 && (
                                        <button 
                                            type="button" 
                                            className={styles.btnRemoveFile} 
                                            title="삭제" 
                                            onClick={(e) => {
                                                e.stopPropagation(); 
                                                handleRemoveFileRow(row.id);
                                            }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className={styles.btnSubmit}>수정 완료</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default BoardFreeEdit;