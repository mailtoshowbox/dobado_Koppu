import { Test, TestingModule } from '@nestjs/testing';
import { DocTypeService } from './docType.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DocTypeSchema, DocTypes } from './schemas/docType.schema';
import DbModule, {
  closeMongoConnection,
} from '../../test/utils/db-test-module';

describe('ProductService', () => {
  let service: DocTypeService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([
          { name: DocTypes.name, schema: DocTypeSchema },
        ]),
      ],
      providers: [DocTypeService],
    }).compile();

    service = module.get<DocTypeService>(DocTypeService);
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
