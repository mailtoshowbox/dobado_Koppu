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
exports.BoxService = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("@nestjs/common");
const mongoose_2 = require("@nestjs/mongoose");
const box_schema_1 = require("./schemas/box.schema");
const rack_schema_1 = require("./schemas/rack.schema");
let BoxService = class BoxService {
    constructor(boxModel, rackModel) {
        this.boxModel = boxModel;
        this.rackModel = rackModel;
    }
    async findAll() {
        return await this.boxModel.find({ name: { "$ne": "" }, isActive: true }).exec();
    }
    async findOne(id) {
        return await this.boxModel.findOne({ _id: id });
    }
    async getRacks(id) {
        return await this.rackModel.find({ box: id });
    }
    async createRack(rack) {
        const newRack = new this.rackModel(rack);
        return await newRack.save();
    }
    async create(box) {
        const { racks = 0 } = box;
        const newBox = new this.boxModel(box);
        newBox.isActive = true;
        return await newBox.save().then((savedResult) => {
            const { _id = "" } = savedResult;
            if (racks > 0) {
                var n = 0;
                while (n < racks) {
                    let name = n + 1;
                    let rack = { name: name.toString(), status: "Available", box: _id, picked: false };
                    n++;
                    this.createRack(rack);
                }
            }
            return savedResult;
        });
    }
    async delete(id) {
        return await this.boxModel.findByIdAndRemove(id);
    }
    async update(id, box) {
        return await this.boxModel.findByIdAndUpdate(id, box, {
            new: true,
        });
    }
};
BoxService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_2.InjectModel(box_schema_1.Boxes.name)),
    __param(1, mongoose_2.InjectModel(rack_schema_1.Racks.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model])
], BoxService);
exports.BoxService = BoxService;
//# sourceMappingURL=box.service.js.map