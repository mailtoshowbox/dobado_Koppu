import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocCategoryController } from './docCategory.controller';
import { DocCategoryService } from './docCategory.service';
import { DocCategories, DocCategorySchema } from './schemas/docCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DocCategories.name, schema: DocCategorySchema },
    ]),
  ],
  controllers: [DocCategoryController],
  providers: [DocCategoryService],
})
export class DocCategoryModule {}
