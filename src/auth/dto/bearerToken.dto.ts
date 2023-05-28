export class BearerTokenDto {
    sub: number //userid
    token: string //mastertoken
    secure_token_part_public: string // key
    v: number //version of token
}
