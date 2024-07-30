import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Record} from "../../record/entities/record.entity";

@Entity()
export class User {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column()
    login: string;

    @ApiProperty()
    @Column()
    email: string;

    @ApiProperty()
    @Column()
    firstName: string;

    @ApiProperty()
    @Column()
    secondName: string;

    @Column()
    password: string;

    @ApiProperty()
    @Column({default: "avatars/0.png"})
    avatar: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Record, (record) => record.user, {nullable: true, onDelete: 'CASCADE',})
    records: Record[];
}
