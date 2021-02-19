"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const box_service_1 = require("../box/box.service");
let DocumentsController = class DocumentsController {
    constructor(productsService, boxService) {
        this.productsService = productsService;
        this.boxService = boxService;
    }
    getDashboardList(loginUser) {
        let dashboardItems = {};
        const pS = this.productsService.findAllDocuments();
        const bS = this.boxService.findAll();
        return Promise.all([pS, bS]).then(([docs, boxes]) => {
            dashboardItems['documents'] = { data: docs, status: 'Success' };
            dashboardItems['box'] = { data: boxes, status: 'Success' };
            return dashboardItems;
        }).catch((error) => {
            dashboardItems['documents'] = { data: [], status: 'Failed' + error };
            dashboardItems['box'] = { data: [], status: 'Failed' };
            return dashboardItems;
        });
    }
    findAll() {
        let res = this.productsService.findAll().then((succ = []) => {
            let onfo = succ.map((doc) => {
                const { box_info = [], rack_info = [], category_info = [], docType_info = [] } = doc;
                if (box_info.length > 0) {
                    doc.box = box_info[0].name;
                }
                if (box_info.length > 0) {
                    doc.rack = rack_info[0].name;
                }
                if (box_info.length > 0) {
                    doc.category = category_info[0].name;
                }
                if (docType_info.length > 0) {
                    doc.document_type = docType_info[0].name;
                }
                delete doc.box_info;
                delete doc.rack_info;
                delete doc.category_info;
                delete doc.docType_info;
                return doc;
            });
            return onfo;
        });
        return res;
    }
    findOne(id) {
        return this.productsService.findOne(id);
    }
    create(createProductDto) {
        return this.productsService.create(createProductDto);
    }
    delete(id) {
        return this.productsService.delete(id);
    }
    getQRCode(generateQrCode) {
        console.log("getRandomCode---");
        return this.productsService.getRandomCode(generateQrCode);
    }
    getRandomCode(generateQrCode) {
        console.log("getRandomCode---");
        return this.productsService.getRandomCode(generateQrCode);
    }
    update(id, updateProductDto) {
        console.log("updateProductDto----", updateProductDto);
        return this.productsService.update(id, updateProductDto);
    }
};
__decorate([
    common_1.Get('dashboard/:loginUser'),
    __param(0, common_1.Param('loginUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getDashboardList", null);
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "findAll", null);
__decorate([
    common_1.Get(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "findOne", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "create", null);
__decorate([
    common_1.Delete(':id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "delete", null);
__decorate([
    common_1.Post(':getQRCode'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getQRCode", null);
__decorate([
    common_1.Post(':getRandomCode'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "getRandomCode", null);
__decorate([
    common_1.Put(':id'),
    __param(0, common_1.Param('id')),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], DocumentsController.prototype, "update", null);
DocumentsController = __decorate([
    common_1.Controller('products'),
    __metadata("design:paramtypes", [products_service_1.DocumentsService,
        box_service_1.BoxService])
], DocumentsController);
exports.DocumentsController = DocumentsController;
//# sourceMappingURL=products.controller.js.map