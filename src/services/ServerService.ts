import { ServerInfo, RtnTestConnection, ServerList } from "../types/serverType";
import { NodeSSH } from "node-ssh";
import { ServerRepository } from "../repository/ServerRepository";
import { AppDataSource } from "../config/database";
import { Server } from "../entity/server";
import { FileStorage } from '../utils/FileStorage';

export class ServerService {

  private serverRepository: ServerRepository;
  private fileStorage = new FileStorage();

  constructor() {
    const repository = AppDataSource.getRepository(Server);
    
    this.serverRepository = new ServerRepository();
  }

  async connectServer(
    serverInfo: ServerInfo,
    privateKey: Express.Multer.File,
    command: string  // 오타 수정: commend -> command
  ): Promise<RtnTestConnection & { output?: {} }> { // 출력 결과 추가
    if (!serverInfo.host || !serverInfo.username) {
      return {
        result: false,
        message: "호스트 정보가 부족합니다.",
      };
    }
  
    const ssh = new NodeSSH();
    try {
      const privateKeyContent = privateKey.buffer.toString("utf8");
  
      await ssh.connect({
        host: serverInfo.host,
        username: serverInfo.username,
        port: serverInfo.port,
        privateKey: privateKeyContent,
        readyTimeout: 10000,
      });
      
      // 명령어 실행
      if (command) {
        const result = await ssh.execCommand(command, {
          cwd: '/', // 작업 디렉토리 (필요에 따라 변경)
          onStdout: (chunk) => {
            console.log('stdoutChunk', chunk.toString('utf8'));
          },
          onStderr: (chunk) => {
            console.error('stderrChunk', chunk.toString('utf8'));
          }
        });
  
        ssh.dispose();
        return {
          result: true,
          message: "명령 실행 완료",
          output: {
            stdout: result.stdout,
            stderr: result.stderr,
            code: result.code
          }
        };
      }
    
      // 명령어가 없는 경우 - 연결 테스트만 수행
      ssh.dispose();
      return {
        result: true,
        message: "연결 성공",
      };
    } catch (error: any) {
      return {
        result: false,
        message: `연결 실패: ${error.message || '알 수 없는 오류'}`,
      };
    } finally {
      // 이미 dispose 호출했을 수 있으므로 에러 처리
      try {
        ssh.dispose();
      } catch (e) {
        // 이미 연결이 종료된 경우 무시
      }
    }
  }

  async findAll(): Promise<Server[] | null> {

    return this.serverRepository.findAll();
  }

  saveServerRegister(serverInfo: ServerInfo, privateKey: Express.Multer.File) {

    const privateKeyPath: string = this.fileStorage.saveBufferToFile(privateKey, privateKey.originalname, "C:/ssh/privateKey")

    const server = new Server(); 
    server.port = serverInfo.port;
    server.host = serverInfo.host;
    server.username = serverInfo.username;
    server.privateKey = privateKeyPath;

    this.serverRepository.save(server)

  }

  async inputCommand(command: string) {

    const server: Server | null = await this.serverRepository.findById(1);

    if (server === null) {
      throw new Error("서버를 찾을 수 없습니다.");
    }

    const serverInfo: ServerInfo = {
      host: server.host,
      port: server.port,
      username: server.username,
      privateKey: server.privateKey
    }

    const privateKey: Express.Multer.File | null = this.fileStorage.readFile(serverInfo.privateKey);


    if (privateKey != null) {
      const privateKeyContent = privateKey.buffer.toString("utf8");
      const { result, message } = await this.connectServer(serverInfo, privateKey, "");

      if (result) {

        const response = await this.connectServer(serverInfo, privateKey, command);
        
        console.log(response)

        return response;
      }

    } 

  }
}
