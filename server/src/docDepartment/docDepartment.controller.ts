import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,UseGuards
} from '@nestjs/common';
import { CreateDocDepartmentDto } from './dto/create-docDepartment.dto';
import { DocDepartment } from './interfaces/docDepartment.interface';
import { DocDepartmentService } from './docDepartment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('DocDepartments')
@UseGuards(AuthGuard('jwt'))
export class DocDepartmentsController {
  constructor(private readonly DocDepartmentsService: DocDepartmentService) {}

  @Get()
  findAll(): Promise<DocDepartment[]> {
    return this.DocDepartmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DocDepartment> {
    return this.DocDepartmentsService.findOne(id);
  }

  @Post()
  create(@Body() createDocDepartmentsDto: CreateDocDepartmentDto): Promise<DocDepartment> {
    return this.DocDepartmentsService.create(createDocDepartmentsDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DocDepartment> {
    return this.DocDepartmentsService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocDepartmentsDto: CreateDocDepartmentDto,
  ): Promise<DocDepartment> { 
    return this.DocDepartmentsService.update(id, updateDocDepartmentsDto);
  }
}
