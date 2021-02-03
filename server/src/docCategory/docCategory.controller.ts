import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,UseGuards
} from '@nestjs/common';
import { CreateDocCategoryDto } from './dto/create-docCategory.dto';
import { DocCategory } from './interfaces/docCategory.interface';
import { DocCategoryService } from './docCategory.service';
import { AuthGuard } from '../../node_modules/@nestjs/passport';

@Controller('DocCategory')
@UseGuards(AuthGuard('jwt'))
export class DocCategoryController {
  constructor(private readonly DocCategoryService: DocCategoryService) {}

  @Get()
  findAll(): Promise<DocCategory[]> {
    return this.DocCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DocCategory> {
    return this.DocCategoryService.findOne(id);
  }

  @Post()
  create(@Body() createDocCategoryDto: CreateDocCategoryDto): Promise<DocCategory> {
    return this.DocCategoryService.create(createDocCategoryDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DocCategory> {
    return this.DocCategoryService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocCategoryDto: CreateDocCategoryDto,
  ): Promise<DocCategory> {
    return this.DocCategoryService.update(id, updateDocCategoryDto);
  }
}
