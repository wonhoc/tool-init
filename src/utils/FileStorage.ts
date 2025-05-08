import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'; // 고유 ID 생성을 위한 패키지

export class FileStorage {
  private basePath: string;

  constructor(basePath: string = path.join(process.cwd(), 'uploads')) {
    this.basePath = basePath;
    this.ensureDirectory(this.basePath);
  }

  /**
   * 디렉토리 확인 및 생성
   * @param dirPath 확인할 디렉토리 경로
   */
  private ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 파일 버퍼를 디스크에 저장
   * @param file Express.Multer.File 객체 또는 유사한 형태의 파일 객체
   * @param filename 저장할 파일명
   * @param subDir 저장할 하위 디렉토리 (기본값: 루트)
   * @returns 저장된 파일의 상대 경로
   */
  saveBufferToFile(file: Express.Multer.File, filename: string, subDir: string = ''): string {
    // subDir이 '/'로 시작하면 맨 앞의 '/'를 제거
    const normalizedSubDir = subDir.startsWith('/') ? subDir.substring(1) : subDir;

    // 저장 디렉토리 경로 설정
    const saveDir = path.join(this.basePath, normalizedSubDir);
    
    this.ensureDirectory(normalizedSubDir);

    // 파일 확장자 추출
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);
    
    // 고유한 파일명 생성 (UUID + 원본 확장자)
    const uniqueFilename = `${uuidv4()}${ext}`;
    const filePath = path.join(normalizedSubDir, uniqueFilename);

    // 파일 버퍼를 파일 시스템에 저장
    fs.writeFileSync(filePath, file.buffer);

    // 저장된 파일의 상대 경로 반환
    return path.join(normalizedSubDir, uniqueFilename);
  }

  /**
   * 파일 삭제
   * @param filePath 삭제할 파일의 상대 경로
   * @returns 삭제 성공 여부
   */
  deleteFile(filePath: string): boolean {
    try {
      const fullPath = path.join(this.basePath, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('파일 삭제 오류:', error);
      return false;
    }
  }

/**
 * 파일 읽기
 * @param filePath 파일의 상대 경로
 * @returns Multer.File 형식의 객체 또는 없는 경우 null
 */
readFile(filePath: string): Express.Multer.File | null {
  try {
    const fullPath = path.join(filePath);

    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const filename = path.basename(filePath);
      
      // Multer.File 객체 형태로 변환
      const multerFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: filename,
        encoding: '7bit',
        mimetype: this.getMimeType(filename),
        buffer: buffer,
        size: buffer.length,
        stream: null as any,
        destination: this.basePath,
        filename: filename,
        path: fullPath
      };
      
      return multerFile;
    }
    
    return null;
  } catch (error) {
    console.error('파일 읽기 오류:', error);
    return null;
  }
}

  /**
   * 파일 경로 생성
   * @param relativePath 상대 경로
   * @returns 전체 파일 경로
   */
  getFullPath(relativePath: string): string {
    return path.join(this.basePath, relativePath);
  }

  // MIME 타입 추측
private getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  
  switch(ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.pdf':
      return 'application/pdf';
    case '.txt':
      return 'text/plain';
    case '.pem':
    case '.key':
      return 'application/x-pem-file';
    default:
      return 'application/octet-stream';
  }
}
}
