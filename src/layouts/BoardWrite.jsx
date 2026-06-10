import { useNavigate } from 'react-router-dom';
import styles from './BoardWrite.module.css';

const BoardWrite = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>

                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 작성</h2>
                </div>

                <form id="attmForm" action="/board/write" method="POST" encType="multipart/form-data">

                    <input type="hidden" name="board_type" value="FRE" />

                    <div className={styles.field}>
                        <label htmlFor="board_title">제목<span className={styles.req}>*</span></label>
                        <input type="text" id="board_title" name="board_title" placeholder="게시글 제목을 입력해주세요" required />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="board_content">내용<span className={styles.req}>*</span></label>
                        <textarea id="board_content" name="board_content" placeholder="청년복지 관련 자유로운 이야기를 나누어보세요. (욕설, 비방 등은 삭제될 수 있습니다.)" required></textarea>
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>파일 첨부 <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--text-hint)', marginLeft: '6px' }}>(최대 5MB)</span></label>
                            <button type="button" id="addFile" className={styles.btnAddFile} onClick={() => { }}>+ 파일 추가</button>
                        </div>
                        <div id="fileArea">
                            <div className={styles.fileRow}>
                                <input type="file" name="file" className={styles.fileInputHidden} multiple />
                                <input type="hidden" name="attm_id" value="" />
                                <input type="hidden" name="original_name" className={styles.originalNameHidden} value="" />
                                <input type="hidden" name="rename_name" value="" />
                                <input type="hidden" name="attm_path" value="" />
                                <input type="hidden" name="attm_status" value="Y" />
                                <input type="hidden" name="board_id" value="" />
                                <div className={styles.fileCustomBox} onClick={() => { }}>
                                    <button type="button" className={styles.btnFile}>파일 선택</button>
                                    <span className={styles.fileName}>선택된 파일 없음</span>
                                </div>
                                <button type="button" className={styles.btnRemoveFile} style={{ display: 'none' }} title="삭제" onClick={() => { }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>
                            취소
                        </button>
                        <button type="button" id="submitAttm" className={styles.btnSubmit} onClick={() => { }}>
                            
                             등록
                        </button>
                    </div>

                </form>
            </div>

            {/* 첨부파일 없음 모달 */}
            <div id="modalChoice" className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <p>첨부파일이 하나도 첨부되지 않았습니다.<br />이대로 게시글을 등록하시겠습니까?</p>
                    <div className={styles.modalActions}>
                        <button type="button" className={`${styles.modalBtn} ${styles.cancel}`} id="closeModal" onClick={() => { }}>취소</button>
                        <button type="button" className={`${styles.modalBtn} ${styles.confirm}`} id="moveBoard" onClick={() => { }}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardWrite;