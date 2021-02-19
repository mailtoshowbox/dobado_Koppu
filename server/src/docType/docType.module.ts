import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocTypeController } from './docType.controller';
import { DocTypeService } from './docType.service';
import { DocTypes, DocTypeSchema } from './schemas/docType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocTypes.name, schema: DocTypeSchema },
    ]),
  ],
  controllers: [DocTypeController],
  providers: [DocTypeService],
})
export class DocTypeModule {}
