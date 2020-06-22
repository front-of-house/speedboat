import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class MagicLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128 })
  email: string;

  @Column({ length: 256 })
  token: string;

  @Column({ length: 36 })
  browser_id: string;

  @Column("timestamp")
  created_at: number;
}
