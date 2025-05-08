import { Server } from "../entity/server";
import { AppDataSource } from "../config/database";

// 직접 리포지토리를 가져와서 사용하는 방식
export class ServerRepository {
  private repository = AppDataSource.getRepository(Server);

  async findById(id: number): Promise<Server | null> {
    return this.repository.findOneBy({ id });
  }

  async findAll(): Promise<Server[] | null> {
    return this.repository.find();
  }

  // 기본 메서드들은 내부 repository를 통해 호출
  async save(server: Server): Promise<Server> {
    return this.repository.save(server);
  }
  

  // 필요한 다른 메서드들도 추가 가능
}