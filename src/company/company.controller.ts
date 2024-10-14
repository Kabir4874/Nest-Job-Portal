import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerCompany(
    @Req() req,
    @Body() registerCompanyDto: RegisterCompanyDto,
  ) {
    const userId = req.user.id;
    const result = await this.companyService.registerCompany(
      userId,
      registerCompanyDto,
    );
    return { message: 'Company created successfully', result, success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCompanies(@Req() req: any) {
    const userId = req.user.id;
    const result = await this.companyService.getCompanies(userId);
    return { result, success: true };
  }

  @Get(':id')
  async getCompanyById(@Param('id') companyId: string) {
    const company = await this.companyService.getCompanyById(companyId);
    return { company, success: true };
  }

  @Delete(':id')
  async deleteCompany(@Param('id') companyId: string) {
    const result = await this.companyService.deleteCompany(companyId);
    return { result, success: true, message: 'Company deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCompany(
    @Param('id') companyId: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companyService.updateCompany(
      companyId,
      updateCompanyDto,
    );
    return { company, success: true, message: 'Company updated successfully' };
  }
}
