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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSchema = exports.Documents = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Documents = class Documents extends mongoose_2.Document {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Number)
], Documents.prototype, "qty", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "description", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "box", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "rack", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "category", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "qr_code", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Date)
], Documents.prototype, "manufacturedate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", Date)
], Documents.prototype, "expiredate", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Documents.prototype, "type_of_space", void 0);
Documents = __decorate([
    mongoose_1.Schema()
], Documents);
exports.Documents = Documents;
exports.DocumentSchema = mongoose_1.SchemaFactory.createForClass(Documents);
//# sourceMappingURL=product.schema.js.map