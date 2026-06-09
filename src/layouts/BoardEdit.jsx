import { useState, useRef } from 'react'
import styles from './BoardEdit.module.css'

const BoardEdit = () => {
    const [title, setTitle] = useState("청년 주거지원 정책 관련해서 질문 있습니다!")
    const [content, setContent] = useState(
        `안녕하세요, 이번에 주거지원 정책을 알아보려고 하는데 여러 가지 헷갈리는 부분이 있어서 질문 남깁니다.\n\n소득 분위 산정 기준이 세전인지 세후인지, 그리고 부모님과 떨어져 살아도 부모님 소득이 합산되는지 궁금합니다.\n혹시 최근에 신청해보신 분 계시면 답변 부탁드리겠습니다! 감사합니다.`
    )

    const [existingFiles, setExistingFiles] = useState([
        { id: 1, name: '주거지원_정책안내_가이드.pdf', size: '1.2MB' }
    ])
    const [deletedFileIds, setDeletedFileIds] = useState([])
    const nextRowId = useRef(1)
    const [newFileRows, setNewFileRows] = useState([
        { id: 0, fileNameDisplay: '선택된 파일 없음', hasFile: false }
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const maxFileSize = 5 * 1024 * 1024

    const handleDeleteExisting = (id) => {
        if (window.confirm("기존 첨부파일을 삭제하시겠습니까?")) {
            setExistingFiles(existingFiles.filter(file => file.id !== id))
            setDeletedFileIds([...deletedFileIds, id])
        }
    }

    const handleAddNewRow = () => {
        setNewFileRows([
            ...newFileRows,
            { id: nextRowId.current, fileNameDisplay: '선택된 파일 없음', hasFile: false }
        ])
        nextRowId.current += 1
    }

    const handleRemoveNewRow = (id) => {
        setNewFileRows(newFileRows.filter(row => row.id !== id))
    }

    const fileInputRefs = useRef({})
    const triggerFileInput = (id) => {
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click()
        }
    }

    const handleFileChange = (e, id) => {
        const files = e.target.files
        if (files && files.length > 0) {
            let fileNames = []
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxFileSize) {
                    alert('첨부파일 최대 용량을 넘었습니다. 다시 첨부해주세요.')
                    e.target.value = ''
                    updateRowState(id, '선택된 파일 없음', false)
                    return
                }
                fileNames.push(files[i].name)
            }
            updateRowState(id, fileNames.join(', '), true)
        } else {
            updateRowState(id, '선택된 파일 없음', false)
        }
    }

    const updateRowState = (id, text, hasFile) => {
        setNewFileRows(newFileRows.map(row =>
            row.id === id ? { ...row, fileNameDisplay: text, hasFile } : row
        ))
    }

    const handleFormSubmit = (e) => {
        if (e) e.preventDefault()

        if (!title.trim()) { alert('제목을 입력해주세요.'); return; }
        if (!content.trim()) { alert('내용을 입력해주세요.'); return; }

        const hasAnyNewFile = newFileRows.some(row => row.hasFile)
        const hasAnyExistingFile = existingFiles.length > 0

        if (!hasAnyNewFile && !hasAnyExistingFile) {
            setIsModalOpen(true)
        } else {
            submitDataToServer()
        }
    }

    const submitDataToServer = () => {
        alert('수정이 완료되었습니다!')
    }

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>

                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 수정</h2>
                </div>

                <form id="attmForm" onSubmit={(e) => handleFormSubmit(e)} encType="multipart/form-data">
                    <input type="hidden" name="board_type" value="FRE" />
                    <input type="hidden" name="board_id" value="123" />
                    {deletedFileIds.map(id => (
                        <input key={`del-${id}`} type="hidden" name="deleteFileIds" value={id} />
                    ))}

                    <div className={styles.field}>
                        <label htmlFor="board_title">제목<span className={styles.req}>*</span></label>
                        <input
                            type="text"
                            id="board_title"
                            name="board_title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="게시글 제목을 입력해주세요"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="board_content">내용<span className={styles.req}>*</span></label>
                        <textarea
                            id="board_content"
                            name="board_content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="청년복지 관련 자유로운 이야기를 나누어보세요. (욕설, 비방 등은 삭제될 수 있습니다.)"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>파일 첨부 <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>(최대 5MB)</span></label>
                        </div>

                        {existingFiles.length > 0 && (
                            <div className={styles.existingFiles} id="existingFilesArea">
                                <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500, marginBottom: '6px', display: 'block' }}>기존에 첨부된 파일</label>
                                {existingFiles.map(file => (
                                    <div className={styles.existingFileItem} key={`exist-${file.id}`}>
                                        <div className={styles.existingFileName}>
                                            <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 2, fill: 'none' }}><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                            {file.name} <span style={{ color: '#ADB5BD', fontSize: '11px' }}>({file.size})</span>
                                        </div>
                                        <button
                                            type="button"
                                            className={styles.btnRemoveExisting}
                                            onClick={() => handleDeleteExisting(file.id)}
                                            title="삭제"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.fileHeader} style={{ marginTop: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500 }}>새 파일 추가하기</label>
                            <button type="button" id="addFile" className={styles.btnAddFile} onClick={() => handleAddNewRow()}>+ 파일 추가</button>
                        </div>

                        <div id="fileArea">
                            {newFileRows.map((row, index) => (
                                <div className={styles.fileRow} key={`new-row-${row.id}`}>
                                    <input
                                        type="file"
                                        name="file"
                                        className={styles.fileInputHidden}
                                        multiple
                                        ref={el => fileInputRefs.current[row.id] = el}
                                        onChange={(e) => handleFileChange(e, row.id)}
                                    />
                                    <input type="hidden" name="attm_id" value="" />
                                    <input type="hidden" name="original_name" className={styles.originalNameHidden} value={row.hasFile ? row.fileNameDisplay : ""} />
                                    <input type="hidden" name="rename_name" value="" />
                                    <input type="hidden" name="attm_path" value="" />
                                    <input type="hidden" name="attm_status" value="Y" />
                                    <input type="hidden" name="board_id" value="" />

                                    <div className={styles.fileCustomBox} onClick={() => triggerFileInput(row.id)}>
                                        <button type="button" className={styles.btnFile}>파일 선택</button>
                                        <span
                                            className={styles.fileName}
                                            style={{ color: row.hasFile ? '#1A1D23' : '#ADB5BD' }}
                                            dangerouslySetInnerHTML={{ __html: row.fileNameDisplay.replace(/, /g, '<br>') }}
                                        />
                                    </div>
                                    {(index > 0 || row.hasFile) && (
                                        <button
                                            type="button"
                                            className={styles.btnRemoveFile}
                                            onClick={() => handleRemoveNewRow(row.id)}
                                            title="삭제"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>취소</button>
                        <button type="submit" id="submitAttm" className={styles.btnSubmit}>
                            <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', fill: 'none', stroke: '#fff', strokeWidth: 2 }}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>

            {isModalOpen && (
                <div id="modalChoice" className={styles.modalOverlay} style={{ display: 'flex' }}>
                    <div className={styles.modalContent}>
                        <p>첨부된 파일이 하나도 없습니다.<br />이대로 게시글을 수정하시겠습니까?</p>
                        <div className={styles.modalActions}>
                            <button type="button" className={`${styles.modalBtn} ${styles.cancel}`} id="closeModal" onClick={() => setIsModalOpen(false)}>취소</button>
                            <button type="button" className={`${styles.modalBtn} ${styles.confirm}`} id="moveBoard" onClick={() => submitDataToServer()}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default BoardEdit