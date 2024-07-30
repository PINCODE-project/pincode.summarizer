import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {User} from "../../user/entities/user.entity";

@Entity()
export class Record {
    @ApiProperty()
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    fileName: string;

    @ApiProperty()
    @Column({default: "Recorded"})
    status: string;

    @ApiProperty()
    @Column({nullable: true})
    transcription: string;

    @ApiProperty()
    @Column({nullable: true})
    summarization: string;

    @ApiProperty()
    @Column({default: 0})
    durationInSeconds: number;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.id, {nullable: true})
    @JoinColumn({name: 'user'})
    user: User;
}
