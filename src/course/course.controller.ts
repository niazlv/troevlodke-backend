import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ReturnDto } from 'src/dto';
import { CourseService } from './course.service';
import { GetCourceDto } from './dto';

@ApiTags("The Courses")
@Controller('course')
export class CourseController {
    constructor(
        private courseService: CourseService,
    ){}

    
    @ApiQuery({})
    //@UseGuards(JwtGuard)
    @Get("course")
    async getCourse(@Query() dto: GetCourceDto):Promise<ReturnDto> {
        return {
            statusCode: 200,
            data: await this.courseService.getCourse(dto)
        }
    }

    // model Cource {
    //     id Int @id @default(autoincrement())
    //     createdAt DateTime @default(now())
      
    //     description String?
    //     title String?
      
    //     active_icon String
    //     inactive_icon String
      
    //     stagesid Int[]
    //   }
}
