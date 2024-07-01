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
exports.Service = void 0;
const typeorm_1 = require("typeorm");
const reserveDetail_1 = require("./reserveDetail");
const microService_1 = require("./microService");
const promotionDetail_1 = require("./promotionDetail");
let Service = class Service extends typeorm_1.BaseEntity {
};
exports.Service = Service;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Service.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Service.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Service.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserveDetail_1.ReserveDetail, (reserveDetail) => reserveDetail.service),
    __metadata("design:type", Array)
], Service.prototype, "reserveDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => microService_1.MicroService, (microService) => microService.service),
    __metadata("design:type", Array)
], Service.prototype, "microServices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotionDetail_1.PromotionDetail, (promotionDetail) => promotionDetail.service),
    __metadata("design:type", Array)
], Service.prototype, "promotionDetails", void 0);
exports.Service = Service = __decorate([
    (0, typeorm_1.Entity)()
], Service);
