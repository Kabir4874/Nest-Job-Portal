import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDto } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async postJob(createdById: string, postJobDto: PostJobDto) {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      position,
      jobType,
      experienceLevel,
      companyId,
    } = postJobDto;

    const job = await this.prisma.job.create({
      data: {
        title,
        description,
        requirements,
        salary,
        location,
        position,
        jobType,
        experienceLevel,
        companyId,
        createdById,
      },
    });

    if (!job) {
      throw new BadRequestException('Job not created');
    }
    return job;
  }
}
