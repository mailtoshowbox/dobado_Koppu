import { Test, TestingModule } from '@nestjs/testing';
import { DocRequestService } from './docRequest.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DocRequestsSchema, DocRequests } from './schemas/docRequest.schema';
import DbModule, {
  closeMongoConnection,
} from '../../test/utils/db-test-module';

describe('ProductService', () => {
  let service: DocRequestService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([
          { name: DocRequests.name, schema: DocRequestsSchema },
        ]),
      ],
      providers: [DocRequestService],
    }).compile();

    service = module.get<DocRequestService>(DocRequestService);
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
