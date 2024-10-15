import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async applyJob(applicantId: string, jobId: string) {
    if (!jobId) {
      throw new BadRequestException('Job id required');
    }
    const existingApplication = await this.prisma.application.findFirst({
      where: { jobId, applicantId },
    });
    if (existingApplication) {
      throw new BadRequestException('You have already applied for this job');
    }
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      throw new BadRequestException('Job not found');
    }
    const newApplication = await this.prisma.application.create({
      data: { jobId, applicantId },
    });
    return newApplication;
  }

  async getAppliedJobs(applicantId: string) {
    const applications = await this.prisma.application.findMany({
      where: { applicantId },
      orderBy: { createdAt: 'desc' },
      include: { job: { include: { company: true } } },
    });
    if (applications.length === 0) {
      throw new NotFoundException('No application found');
    }
    return applications;
  }

  async getApplicants(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        Application: {
          orderBy: { createdAt: 'desc' },
          include: { applicant: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}
