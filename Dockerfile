# 빌드 단계
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
# 모든 의존성 설치 (개발 의존성 포함)
RUN npm install

# 소스 파일 복사
COPY . .

# 실행 단계
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package*.json ./
# 모든 의존성 설치 (개발 의존성 포함)
RUN npm install

COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig*.json ./

EXPOSE 3001
CMD ["npm", "run", "dev"]