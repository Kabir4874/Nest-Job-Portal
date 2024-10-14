import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async registerCompany(
    userId: string,
    registerCompanyDto: RegisterCompanyDto,
  ) {
    const { name, description, website, location, logo } = registerCompanyDto;

    const existingCompany = await this.prisma.company.findUnique({
      where: { name },
    });

    if (existingCompany) {
      throw new BadRequestException("Can't add same company");
    }

    const company = await this.prisma.company.create({
      data: {
        name,
        description,
        website,
        location,
        logo,
        userId,
      },
    });
    return company;
  }

  async getCompanies(userId: string) {
    const companies = await this.prisma.company.findMany({ where: { userId } });
    if (companies.length === 0) {
      throw new NotFoundException('Companies not found');
    }
    return companies;
  }
}
