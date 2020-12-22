import { Test, TestingModule } from '@nestjs/testing';
import { BoxService } from './box.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Boxes, BoxSchema } from './schemas/box.schema';
import DbModule, {
  closeMongoConnection,
} from '../../test/utils/db-test-module';

describe('ProductService', () => {
  let service: BoxService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([
          { name: Boxes.name, schema: BoxSchema },
        ]),
      ],
      providers: [BoxService],
    }).compile();

    service = module.get<BoxService>(BoxService);
    connection = await module.get(getConnectionToken());
  });

  afterEach(async () => {
    await connection.close();
    await closeMongoConnection();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
