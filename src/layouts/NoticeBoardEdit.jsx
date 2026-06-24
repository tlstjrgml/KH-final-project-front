import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './NoticeBoardEdit.module.css';

const NoticeBoardEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // 1. 기본 폼 상태 관리
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // 2. 첨부파일 상태 관리 (BoardReviewEdit 방식 연동)
    const [existingFiles, setExistingFiles] = useState([]);
    const [deletedExistingFiles, setDeletedExistingFiles] = useState([]); // 삭제할 기존 파일 ID 배열

    const [fileRows, setFileRows] = useState([{ id: 0, files: [] }]); // 새 첨부파일 배열
    const nextRowId = useRef(1);

    // [데이터 불러오기 및 파일 바인딩]
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

                    // 기존 첨부파일 데이터 매핑하여 바인딩
                    if (data.attachments && data.attachments.length > 0) {
                        const mappedFiles = data.attachments.map(file => ({
                            id: file.attmId || file.fileId,
                            name: file.originalName || file.originName || '첨부파일',
                            size: file.fileSize ? `${(file.fileSize / 1024 / 1024).toFixed(1)}MB` : '0.0MB'
                        }));
                        setExistingFiles(mappedFiles);
                    }
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

    // [기존 첨부파일 삭제 목록에 추가]
    const handleDeleteExisting = (fileId) => {
        if (window.confirm("기존 첨부파일을 삭제하시겠습니까? (수정 완료 시 최종 반영됩니다)")) {
            setDeletedExistingFiles([...deletedExistingFiles, fileId]);
        }
    };

    // [새 첨부파일 행 추가/삭제/변경]
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

    // [FormData를 이용한 수정 완료 폼 제출]
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('boardTitle', title);
            formData.append('boardContent', content);

            // 삭제된 기존 파일 ID 목록 추가
            deletedExistingFiles.forEach(fileId => {
                formData.append('deleteFileIds', fileId);
            });

            // 새로 추가된 파일 데이터 추가 (다중 파일 대응)
            fileRows.forEach(row => {
                if (row.files && row.files.length > 0) {
                    row.files.forEach(file => {
                        formData.append('newFiles', file); // 백엔드 수신 변수명(newFiles)에 맞춤
                    });
                }
            });

            const response = await fetch(`/react/board/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // 'Content-Type'은 FormData 객체 전송 시 브라우저가 boundary를 포함해 자동 설정하므로 절대 작성 금지
                },
                body: formData
            });

            if (response.ok) {
                alert('수정이 성공적으로 완료되었습니다!');
                navigate(`/noticeboard/detail/${id}`); // 기존 공지사항 상세 주소 규칙에 맞춤
            } else {
                const errMsg = await response.text();
                throw new Error(errMsg || '게시글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('수정 통신 오류:', error);
            alert(`수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '100px' }}>데이터를 불러오는 중입니다...</div>;
    }

    // 실제 화면에 표시될 기존 파일 개수 계산 (전체 - 삭제 예정 개수)
    const visibleExistingCount = existingFiles.filter(file => !deletedExistingFiles.includes(file.id)).length;

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>공지사항 글 수정</h2>
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

                    {/* 파일 첨부 전체 영역 */}
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
                            {visibleExistingCount === 0 ? (
                                <div className={styles.replyItem} style={{ textAlign: 'center', padding: '15px 0', color: '#adb5bd', fontSize: '13px' }}>
                                    등록된 첨부파일이 없습니다.
                                </div>
                            ) : (
                                existingFiles.map((file) => (
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
                                ))
                            )}
                        </div>

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

export default NoticeBoardEdit;