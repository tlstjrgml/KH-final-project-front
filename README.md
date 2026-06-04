# moa-frontend

청년복지MOA 프론트엔드 (React + Vite)

## 개발 환경
- Node.js 18+
- React
- Vite

## 시작하기

### 1. 패키지 설치
npm install

### 2. 실행
npm run dev

### 3. 백엔드 연결
백엔드 서버(moa-backend)가 8080 포트에서 실행 중이어야 합니다.

## 브랜치 전략
- `main` : 배포용
- `feature/기능명` : 기능 개발

예시)
- `feature/member` : 회원 기능
- `feature/welfare` : 복지서비스 기능
- `feature/board` : 게시판 기능
- `feature/admin` : 관리자 기능

## 커밋 메시지 규칙
- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `refactor` : 코드 리팩토링
- `docs` : 문서 수정
- `chore` : 빌드, 설정 파일 수정

예시)
- `feat: 회원가입 페이지 구현`
- `fix: 로그인 오류 수정`
