import { Test, TestingModule } from '@nestjs/testing';
import { DocRequestService } from './requestedDocument.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DocumentSchema, RequestedDocuments } from './schemas/requestedDocument.schema';
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
          { name: RequestedDocuments.name, schema: DocumentSchema },
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
