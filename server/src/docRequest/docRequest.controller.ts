import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,UseGuards
} from '@nestjs/common';
import { CreateDocRequestDto } from './dto/create-docRequest.dto';
import { CreateDocApprovalHistoryDto } from './dto/create-docApprovalHistoryi.dto';
import { DocRequest } from './interfaces/docRequest.interface';
import { DocApprovalHistory } from './interfaces/docApprovalHistoryinterface ';
import { DocRequestService } from './docRequest.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('DocRequests')
@UseGuards(AuthGuard('jwt'))
export class DocRequestsController {
  constructor(private readonly DocRequestsService: DocRequestService,) {}

  @Get(':mode/:empl_id')
  findAll(@Param('mode') mode: string, @Param('empl_id') empl_id: string): Promise<DocRequest[]> {
      return this.DocRequestsService.findAll(mode, empl_id); 
   
  }
 


  @Get(':id')
  findOne(@Param('id') id: string): Promise<DocRequest> {
    return this.DocRequestsService.findOne(id);
  }


  

  @Post()
  create(@Body() createDocRequestsDto: CreateDocRequestDto): Promise<DocRequest> {
 
    const d=  this.DocRequestsService.create(createDocRequestsDto);
    d.then((res)=>{
      const {} = res; 

    })
    
    return d;
  }


  @Post(':history')
  initiateApprovalHistory(@Body() createDocRequestsDto: CreateDocApprovalHistoryDto): void {
 
    const d=  this.DocRequestsService.checkInitialHistory(createDocRequestsDto).then((rest)=>{
      if(!rest){ 
        this.DocRequestsService.createInitialHistory(createDocRequestsDto)
      } else{
        this.DocRequestsService.checkRecentHistory(createDocRequestsDto).then((rec)=>{

          if(!rec){
            this.DocRequestsService.createRecentHistory(createDocRequestsDto)
          }else{ 
            this.DocRequestsService.updateRecentHistory(createDocRequestsDto, rec._id)
          }

        });
      }
      return rest;
    }); 
    
   
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<DocRequest> {
    return this.DocRequestsService.delete(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDocRequestsDto: CreateDocRequestDto,
  ): Promise<DocRequest> { 
    console.log("updateDocRequestsDto---", updateDocRequestsDto);
    return this.DocRequestsService.update(id, updateDocRequestsDto);
  }
}
