import { Request, Response } from "express";
import { ServerService } from "../services/ServerService";
import { ServerInfo, ServerList } from "../types/serverType";

export class ServerController {
  private serverService: ServerService;

  constructor() {
    this.serverService = new ServerService();
  }

  /**
 * @swagger
 * /api/ssh/registerServerInfo:
 *   post:
 *     summary: 서버 연결 테스트
 *     description: SSH 서버 연결을 위해 서버 정보를 등록하고 연결을 테스트합니다.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - host
 *               - port
 *               - username
 *               - privateKey
 *             properties:
 *               host:
 *                 type: string
 *                 description: 서버 IP
 *                 example: "192.168.116.128"
 *               port:
 *                 type: integer
 *                 description: 포트 번호
 *                 example: 22
 *               username:
 *                 type: string
 *                 description: 로그인 사용자 이름
 *                 example: "root"
 *               privateKey:
 *                 type: string
 *                 format: binary
 *                 description: 개인 키 파일
 *     responses:
 *       200:
 *         description: 연결 성공
 *       400:
 *         description: 요청 오류
 *       500:
 *         description: 서버 오류
 */
  registerServerInfo = async (req: Request, res: Response) => {
    console.log("🔥 SSH 요청 도착");
  
    const serverInfo: ServerInfo = req.body;
    const privateKey = req.file;
  
    if (!privateKey) {
      return res.status(400).json({
        result: "false",
        message: "파일이 없습니다.",
      });
    }
  
    try {
      await this.serverService.saveServerRegister(serverInfo, privateKey);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  };

  /**
 * @swagger
 * /api/ssh/getServerList:
 *   get:
 *     summary: serverList를 받음
 *     responses:
 *       200:
 *         description: 응답 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "안녕하세요! 무엇을 도와드릴까요?"
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 오류
 */
  getServerList = async (req: Request, res: Response) => {

    try {
      const serverList : ServerList | null = await this.serverService.findAll();

      return res.json({ serverList });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  };

/**
 * @swagger
 * /api/ssh/inputCommand:
 *   post:
 *     summary: SSH 서버에 명령어 실행
 *     description: 등록된 SSH 서버에 명령어를 실행하고 결과를 반환합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - command
 *             properties:
 *               command:
 *                 type: string
 *                 description: 실행할 명령어
 *     responses:
 *       200:
 *         description: 명령 실행 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 output:
 *                   type: object
 *                   properties:
 *                     stdout:
 *                       type: string
 *                     stderr:
 *                       type: string
 *                     code:
 *                       type: number
 *       400:
 *         description: 요청 오류
 *       404:
 *         description: 서버 또는 키 파일을 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
inputCommand = async (req: Request, res: Response) => {
  // 요청 본문(body)에서 command 속성 추출
  const { command } = req.body;
  
  // command가 문자열인지 확인
  if (!command || typeof command !== 'string') {
    return res.status(400).json({ 
      result: false, 
      message: "명령어는 필수이며 문자열이어야 합니다." 
    });
  }
  
  try {
    // 서비스 메소드 호출
    const response = await this.serverService.inputCommand(command);
    
    // 응답이 없는 경우 처리
    if (!response) {
      return res.status(404).json({ 
        result: false, 
        message: "서버를 찾을 수 없거나 연결할 수 없습니다." 
      });
    }
    
    // 성공 시 응답 반환
    return res.status(200).json(response);
  } catch (err: any) {
    console.error("SSH 명령 실행 중 오류:", err);
    
    // 에러 유형에 따른 응답
    if (err.message && err.message.includes("찾을 수 없습니다")) {
      return res.status(404).json({ 
        result: false, 
        message: err.message 
      });
    }
    
    return res.status(500).json({ 
      result: false, 
      message: "명령 실행 중 오류가 발생했습니다.", 
      error: err.message 
    });
  }
};
  
}
