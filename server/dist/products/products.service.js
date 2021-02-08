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
exports.DocumentsService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const product_schema_1 = require("./schemas/product.schema");
const box_schema_1 = require("./schemas/box.schema");
const rack_schema_1 = require("./schemas/rack.schema");
var QRCode = require('qrcode');
let DocumentsService = class DocumentsService {
    constructor(productModel, boxModel, rackModel) {
        this.productModel = productModel;
        this.boxModel = boxModel;
        this.rackModel = rackModel;
    }
    async findAll() {
        return await this.productModel.aggregate([
            { $match: { category: { "$ne": "" }, rack: { "$ne": "" } }, },
            {
                $project: {
                    rack: {
                        $toObjectId: "$rack"
                    },
                    category: {
                        $toObjectId: "$category"
                    }, box: {
                        $toObjectId: "$box"
                    },
                    boxInfo: 1,
                    name: 1,
                    manufacturedate: 1,
                    expiredate: 1,
                    qr_code: 1,
                    type_of_space: 1,
                    _id: 1
                }
            },
            {
                $lookup: {
                    from: "boxes",
                    localField: "box",
                    foreignField: "_id",
                    as: "box_info"
                }
            },
            { $match: { "box_info": { $ne: [] } } },
            {
                $lookup: {
                    from: "racks",
                    localField: "rack",
                    foreignField: "_id",
                    as: "rack_info"
                }
            },
            {
                $lookup: {
                    from: "doccategories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category_info"
                }
            },
        ]);
    }
    async findOne(id) {
        return await this.productModel.findOne({ _id: id });
    }
    async create(product) {
        const newProduct = new this.productModel(product);
        return await newProduct.save();
    }
    async delete(id) {
        return await this.productModel.findByIdAndRemove(id);
    }
    async update(id, product) {
        return await this.productModel.findByIdAndUpdate(id, product, {
            new: true,
        });
    }
    async getQRCode(qrData) {
        return await this.runAsyncFunctions(qrData).then((result) => {
            let string = result.box + '/' + qrData.rack + '/' + qrData.name;
            return QRCode.toDataURL(string)
                .then(url => {
                return { qrImage: url };
            })
                .catch(err => {
            });
        });
    }
    async runAsyncFunctions(qrData) {
        const loopdat = [{ field: 'box' }, { field: 'rack' }];
        const resiluSet = qrData;
        return Promise.all(loopdat.map(async ({ field }, ind) => {
            if (field === 'box') {
                await this.boxModel.findOne({ _id: qrData.box }).then(({ name = "" }) => {
                    resiluSet.box = name;
                }).catch((err) => {
                });
            }
            else if (field === 'rack') {
                await this.rackModel.findOne({ _id: qrData.rack }).then(({ name = "" }) => {
                    resiluSet.rack = name;
                }).catch((err) => {
                });
            }
        })).then(() => {
            return resiluSet;
        });
    }
};
DocumentsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(product_schema_1.Documents.name)),
    __param(1, mongoose_2.InjectModel(box_schema_1.Boxes.name)),
    __param(2, mongoose_2.InjectModel(rack_schema_1.Racks.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], DocumentsService);
exports.DocumentsService = DocumentsService;
//# sourceMappingURL=products.service.js.map