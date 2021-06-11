import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocDepartmentsController } from './docDepartment.controller';
import { DocDepartmentService } from './docDepartment.service';
import { DocDepartments, DocDepartmentsSchema } from './schemas/docDepartment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocDepartments.name, schema: DocDepartmentsSchema },
    ]),
  ],
  controllers: [DocDepartmentsController],
  providers: [DocDepartmentService],
})
export class DocDepartmentModule {}
