import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';

@Module({
  imports: [ConfigModule, UserModule, CompanyModule, JobModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
