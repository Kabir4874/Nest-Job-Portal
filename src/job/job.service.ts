import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async getAllJobs(query: any) {
    const { keyword, location, jobType, salary } = query;
    const salaryRange = salary?.split('-');
    let jobs = [];
    if (keyword || location || jobType || salary) {
      jobs = await this.prisma.job.findMany({
        where: {
          ...(keyword && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          }),

          ...(location && {
            location: { contains: location, mode: 'insensitive' },
          }),

          ...(jobType && {
            jobType: { contains: jobType, mode: 'insensitive' },
          }),
          ...(salary &&
            salaryRange?.length && {
              salary: {
                gte: parseInt(salaryRange[0], 10),
                lte: parseInt(salaryRange[1], 10),
              },
            }),
        },
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      jobs = await this.prisma.job.findMany({
        skip: 0,
        take: 6,
        include: { company: true },
      });
    }

    if (jobs.length === 0) {
      throw new NotFoundException('Jobs not found');
    }

    return jobs;
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async getJobsByUserId(createdById: string) {
    try {
      const jobs = await this.prisma.job.findMany({
        where: { createdById },
        include: { company: true },
        orderBy: { createdAt: 'desc' },
      });
      if (jobs.length === 0) {
        throw new NotFoundException('Jobs not found');
      }
      return jobs;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async createFavorite(jobId: string, userId: string) {
    const fav = await this.prisma.favorites.findFirst({
      where: { jobId, userId },
    });
    if (fav) {
      throw new NotFoundException('This job is already in favorite');
    }
    const newFav = await this.prisma.favorites.create({
      data: { userId, jobId },
    });
    if (!newFav) {
      throw new NotFoundException('Job not added in favorite');
    }
    return newFav;
  }

  async getFavorites(userId: string) {
    const getJobs = await this.prisma.favorites.findMany({
      where: { userId },
      include: { job: { include: { company: true } } },
    });
    if (!getJobs) {
      throw new NotFoundException('Jobs not found');
    }
    return getJobs;
  }
}
