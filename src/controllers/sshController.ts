import { Request, Response } from "express";
import { testConnection } from "../services/sshService";
import { serverInfo } from "../types/ssh2Type";

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
export const registerServerInfo = async (req: Request, res: Response) => {
  console.log("🔥 SSH 요청 도착");

  const serverInfo: serverInfo = req.body;
  const privateKey = req.file;

  if (!privateKey) {
    return res.status(400).json({
      result: "false",
      message: "파일이 없습니다.",
    });
  }

  try {
    const { result, message } = await testConnection(serverInfo, privateKey);
    return res.json({ result, message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
