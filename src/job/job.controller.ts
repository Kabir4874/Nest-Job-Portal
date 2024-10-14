import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostJobDto } from './dto/job.dto';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postJob(@Req() req: any, @Body() postJobDto: PostJobDto) {
    const userId = req.user.id;
    const job = await this.jobService.postJob(userId, postJobDto);
    return { job, message: 'Job created successfully', success: true };
  }

  async getAllJobs(@Query() query: any) {
    const jobs = await this.jobService.getAllJobs(query);
    return { jobs, success: true };
  }
}
