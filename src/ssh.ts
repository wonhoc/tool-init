import { serverInfo, rtnTestConnection } from './types/ssh2Type';
import { NodeSSH } from 'node-ssh';

export function testConnection(serverInfo: serverInfo): rtnTestConnection {

    if (!serverInfo.host || !serverInfo.username || !serverInfo.privateKey) {
        
        return {
            result: false,
            message: '호스트 정보가 부족합니다.',
          };
      }
    
      const ssh = new NodeSSH();
      try {
        // 메모리 상에서만 키 사용
        ssh.connect({
            serverInfo
        });
    
        // 연결 성공
        ssh.dispose(); // 연결 종료
        return {
            result: true,
            message: '연결 성공',
        };
      } catch (error: any) {
        // 연결 실패
        return {
            result: false,
            message: '연결 실패',
        };
      } finally {
        // 혹시 연결이 안 끊긴 경우 안전하게 해제
        ssh.dispose();
      }

} 

