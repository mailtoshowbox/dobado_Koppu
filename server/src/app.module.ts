import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsModule } from './products/products.module';
import { BoxModule } from './box/box.module';
import { DocCategoryModule } from './docCategory/docCategory.module';
import config from './config/keys';
console.log("config---", config);

@Module({
  imports: [MongooseModule.forRoot(config.mongoURI), DocumentsModule,BoxModule, DocCategoryModule, ],
})
export class AppModule {}
