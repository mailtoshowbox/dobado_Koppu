import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxController } from './box.controller';
import { BoxService } from './box.service';
import { BoxClass, BoxSchema } from './schemas/box.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoxClass.name, schema: BoxSchema },
    ]),
  ],
  controllers: [BoxController],
  providers: [BoxService],
})
export class BoxModule {}
