import { Test, TestingModule } from '@nestjs/testing';
import { DocCategoryService } from './docCategory.service';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DocCategorySchema, DocCategories } from './schemas/docCategory.schema';
import DbModule, {
  closeMongoConnection,
} from '../../test/utils/db-test-module';

describe('ProductService', () => {
  let service: DocCategoryService;
  let connection: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbModule({
          connectionName: (new Date().getTime() * Math.random()).toString(16),
        }),
        MongooseModule.forFeature([
          { name: DocCategories.name, schema: DocCategorySchema },
        ]),
      ],
      providers: [DocCategoryService],
    }).compile();

    service = module.get<DocCategoryService>(DocCategoryService);
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
