import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsBooleanString } from 'class-validator'

export class HiddenModeDto {
    @ApiProperty({
        default: false,
        description:
            'Deteriorates the security of personal data by partially disabling encryption',
    })
    @IsBooleanString()
    isHidden: boolean
}
