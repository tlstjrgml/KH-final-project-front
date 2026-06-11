import styles from "./NoticeWrite.module.css";

const NoticeWrite = () =>{
    return(
        <>
        <main className={styles.page}>
            <div className={styles.writeCard}>

                <div className={styles.writeHeader}>
                <h2 className={styles.writeTitle}>공지사항 글 작성</h2>
                </div>

                <form id="attmForm" action="/notice/write" method="POST" encType="multipart/form-data">

                {/*  공지사항 게시판 타입 값 설정  */}
                <input type="hidden" name="board_type" value="NOT"/>

                <div className={styles.field}>
                    <label htmlFor="board_title">제목<span className={styles.req}>*</span></label>
                    <input type="text" id="board_title" name="board_title" placeholder="공지사항 제목을 입력해주세요" required/>
                </div>

                <div className={styles.field}>
                    <label htmlFor="board_content">내용<span className={styles.req}>*</span></label>
                    <textarea id="board_content" name="board_content" placeholder="공지사항 내용을 상세히 입력해주세요." required=""></textarea>
                </div>

                <div className={styles.field}>
                    <div className={styles.fileHeader}>
                    <label>파일 첨부 <span style={{fontSize: '12px', fontWeight: 'normal', color:' #ADB5BD ', marginLeft: '6px'}}>(최대 5MB)</span></label>
                    <button type="button" id="addFile" className={styles.btnAddFile}>+ 파일 추가</button>
                    </div>
                    <div id="fileArea">
                    <div className={styles.fileRow}>
                        <input type="file" name="file" className={styles.fileInputHidden} multiple/>
                        {/*  ERD 속성 매핑 hidden 태그들  */}
                        <input type="hidden" name="attm_id" value=""/>
                        <input type="hidden" name="original_name" className={styles.originalNameHidden} value=""/>
                        <input type="hidden" name="rename_name" value=""/>
                        <input type="hidden" name="attm_path" value=""/>
                        <input type="hidden" name="attm_status" value="Y"/>
                        <input type="hidden" name="board_id" value=""/>
                        
                        <div className={styles.fileCustomBox}>
                        <button type="button" className={styles.btnFile}>파일 선택</button>
                        <span className={styles.fileName}>선택된 파일 없음</span>
                        </div>
                        <button type="button" className={styles.btnRemoveFile} style={{display:'none'}} title="삭제">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.btnCancel} onClick={() => {window.history.back()}}>취소</button>
                    <button type="button" id="submitAttm" className={styles.btnSubmit}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path>
                    </svg>
                    공지 등록하기
                    </button>
                </div>

                </form>
            </div>
        </main>

        {/*  첨부파일 없음 모달 */}
        <div id="modalChoice" className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <p>첨부파일이 하나도 첨부되지 않았습니다.<br/>이대로 공지사항을 등록하시겠습니까?</p>
            <div className={styles.modalActions}>
            <button type="button" className={`${styles.modalBtn} ${styles.cancel}`}id="closeModal">취소</button>
            <button type="button" className={`${styles.modalBtn} ${styles.confirm}`} id="moveBoard">확인</button>
            </div>
        </div>
        </div>
    </>
    )
}

export default NoticeWrite;
