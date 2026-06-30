import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoticeBoardWrite.module.css';

const NoticeBoardWrite = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [fileRows, setFileRows] = useState([{ id: Date.now(), files: [] }]);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // JWT 토큰 디코딩 후 관리자(Admin) 권한 및 로그인 상태 검증
        if (token) {
            try {
                // 한글 등 특수문자 깨짐 방지를 위한 안전한 Base64 디코딩 방식 적용
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const payload = JSON.parse(jsonPayload);

                if (payload.isAdmin !== "Y") {
                    alert('관리자만 접근할 수 있는 페이지입니다.');
                    navigate('/noticeboard', { replace: true });
                    return;
                }

                setIsChecking(false);
            } catch (err) {
                console.error("토큰 검증 오류:", err);
                alert('인증 정보에 오류가 있습니다. 다시 로그인 해주세요.');
                navigate('/noticeboard', { replace: true });
            }
        } else {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/noticeboard', { replace: true });
        }
    }, [navigate]);

    // 첨부파일 행(Row) 추가 처리
    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: Date.now(), files: [] }]);
    };

    // 추가된 첨부파일 행(Row) 삭제 처리
    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter((row) => row.id !== rowId));
    };

    // 파일 선택 시 용량 제한(5MB) 체크 및 상태 업데이트
    const handleFileChange = (rowId, event) => {
        const selectedFiles = Array.from(event.target.files);
        const maxFileSize = 5 * 1024 * 1024;

        for (let file of selectedFiles) {
            if (file.size > maxFileSize) {
                alert('첨부파일 최대 용량(5MB)을 넘었습니다.');
                event.target.value = '';
                return;
            }
        }

        setFileRows(
            fileRows.map((row) =>
                row.id === rowId ? { ...row, files: selectedFiles } : row
            )
        );
    };

    // 입력된 데이터를 FormData에 실어 백엔드로 공지사항 등록 요청 전송
    const executeSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append('boardTitle', title);
            formData.append('boardContent', content);
            formData.append('boardType', 'NOT');

            fileRows.forEach(row => {
                if (row.files && row.files.length > 0) {
                    row.files.forEach(file => {
                        formData.append('files', file);
                    });
                }
            });

            const response = await fetch('/react/board/write', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                alert('공지사항이 성공적으로 등록되었습니다.');
                navigate('/noticeboard');
            } else {
                alert('게시글 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('서버와의 통신에 실패했습니다.');
        }
    };

    // 폼 전송 이벤트 발생 시 필수 데이터 유효성 검사 수행
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        executeSubmit();
    };

    if (isChecking) {
        return null;
    }

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>공지사항 글 작성</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="board_title">제목<span className={styles.req}>*</span></label>
                        <input
                            type="text"
                            id="board_title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="공지사항 제목을 입력해주세요"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="board_content">내용<span className={styles.req}>*</span></label>
                        <textarea
                            id="board_content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="공지할 내용을 작성해주세요."
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>파일 첨부 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>(최대 5MB)</span></label>
                            <button type="button" className={styles.btnAddFile} onClick={handleAddFileRow}>+ 파일 추가</button>
                        </div>

                        <div id="fileArea">
                            {fileRows.map((row, index) => (
                                <div key={row.id} className={styles.fileRow}>
                                    <input
                                        type="file"
                                        id={`file_input_${row.id}`}
                                        className={styles.fileInputHidden}
                                        multiple
                                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                                        onChange={(e) => handleFileChange(row.id, e)}
                                    />

                                    <div className={styles.fileCustomBox} onClick={() => document.getElementById(`file_input_${row.id}`).click()}>
                                        <button type="button" className={styles.btnFile}>파일 선택</button>
                                        <span className={styles.fileName} style={{ color: row.files.length > 0 ? '#1A1D23' : '#ADB5BD' }}>
                                            {row.files.length > 0 ? row.files.map(f => f.name).join(', ') : '선택된 파일 없음'}
                                        </span>
                                    </div>

                                    {index > 0 && (
                                        <button type="button" className={styles.btnRemoveFile} title="삭제" onClick={() => handleRemoveFileRow(row.id)}>
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
                        <button type="submit" className={styles.btnSubmit}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth={2}>
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            글 등록하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoticeBoardWrite;