import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/company.dto';

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
}
