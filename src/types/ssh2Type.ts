export type serverInfo = {
  host: string,      // 원격 서버 IP 또는 도메인
  port: number,      // 포트번호
  username: string,  // 사용자 이름          
  privateKey: string // 개인키 경로
}

// 연결 테스트트
export type rtnTestConnection = {
  result: boolean,    // 연결 테스트 결과
  message: string     // 메세지
}

export type getServerList = {
  host: string,      // 원격 서버 IP 또는 도메인
  port: number,      // 포트번호
  username: string,  // 사용자 이름          
}