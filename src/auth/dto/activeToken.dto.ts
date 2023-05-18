import { ApiProperty } from "@nestjs/swagger";
import { types } from "util";

export class ActiveTokenDto {
    id:number;
    createdAt:Date;

    userid:number;
    token:string;                 //токен
    description:string;   //описание для кого выдан токен или кем CbAS(Created by AutoSystem)
    permissions:bigint;          //Какие права у токена. Права выше чем у пользователя не работают(если у толькователя права только 3, а тут выставлено 7, то права будут на уровне 3, НО если вдруг у пользователя права повысились до 15, то права его по этому токену будут 7)
    usedAt: Date;
    countOfUses: number;
}