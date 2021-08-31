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

  @Put(':page_from/:id')
  update(
    @Param('page_from') page_from: string,
    @Param('id') id: string,
    @Body() updateDocRequestsDto: CreateDocRequestDto,
  ): Promise<DocRequest> { 
    if(page_from){
      let createDocRequestsDto : CreateDocApprovalHistoryDto = { 
       history: JSON.stringify(updateDocRequestsDto),
       updated_by: updateDocRequestsDto.empl_id,
       updated_on: new Date(),
       mode_of_access: "history",
       request_no: updateDocRequestsDto.request_no,
       page_from: "approve"
      }
      this.DocRequestsService.checkInitialHistory(createDocRequestsDto).then((rest)=>{       
        if(!rest){ 
          this.DocRequestsService.createInitialHistory(createDocRequestsDto)
        } else{
          this.DocRequestsService.checkRecentHistory(createDocRequestsDto).then((rec)=>{
          //  console.log("-----rec----",  createDocRequestsDto);           
          
              this.DocRequestsService.createDocRequestApprovalHistory(createDocRequestsDto).then((res)=>{
              //  console.log("createDocRequestApprovalHistory- res--", res);
              })
             });
        }        
      }); 
    }
    return this.DocRequestsService.update(id, updateDocRequestsDto, page_from);
  }
  @Put(':id/:uniquenum')
  issueGenaralIssuance(
    @Param('id') id: string,
    @Param('uniquenum') uniquenum: string,
    @Body() issueGenaralIssuanceDto: CreateDocRequestDto,
  ): Promise<DocRequest> { 



    if(id){

      

      /* 
      let createDocRequestsDto : CreateDocApprovalHistoryDto = { 
       history: JSON.stringify(updateDocRequestsDto),
       updated_by: updateDocRequestsDto.empl_id,
       updated_on: new Date(),
       mode_of_access: "history",
       request_no: updateDocRequestsDto.request_no,
       page_from: "approve"
      }
      this.DocRequestsService.checkInitialHistory(createDocRequestsDto).then((rest)=>{       
        if(!rest){ 
          this.DocRequestsService.createInitialHistory(createDocRequestsDto)
        } else{
          this.DocRequestsService.checkRecentHistory(createDocRequestsDto).then((rec)=>{
            console.log("-----rec----",  createDocRequestsDto);           
          
              this.DocRequestsService.createDocRequestApprovalHistory(createDocRequestsDto).then((res)=>{
                console.log("createDocRequestApprovalHistory- res--", res);
              })
             });
        }        
      }); */ 
    } 

   // console.log("issueGenaralIssuanceDto----", issueGenaralIssuanceDto);
   // return issueGenaralIssuanceDto;
    return this.DocRequestsService.update(id, issueGenaralIssuanceDto, 'test');
  }
}
