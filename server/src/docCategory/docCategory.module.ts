import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocCategoryController } from './docCategory.controller';
import { DocCategoryService } from './docCategory.service';
import { DocCategoryClass, DocCategorySchema } from './schemas/docCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocCategoryClass.name, schema: DocCategorySchema },
    ]),
  ],
  controllers: [DocCategoryController],
  providers: [DocCategoryService],
})
export class DocCategoryModule {}
