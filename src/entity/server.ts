import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique, Table } from "typeorm";

@Entity("server_info")
@Unique(["username"])
@Unique(["host"])
export class Server {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 50, nullable: false })
  username!: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  host!: string;

  @Column({ type: "int", nullable: false })
  port!: number;

  @Column({ type: "varchar", length: 500, nullable: false })
  privateKey: string;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ 
    type: "timestamp", 
    precision: 0, // 정밀도 제거 또는 0으로 설정
    default: () => "CURRENT_TIMESTAMP" 
  })
  createdAt?: Date;

  @Column({ 
    type: "timestamp", 
    precision: 0,
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP"  // ON UPDATE 구문 수정
  })
  updatedAt?: Date;
}