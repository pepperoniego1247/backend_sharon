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
exports.Promotion = void 0;
const typeorm_1 = require("typeorm");
const reserveDetail_1 = require("./reserveDetail");
const promotionDetail_1 = require("./promotionDetail");
let Promotion = class Promotion extends typeorm_1.BaseEntity {
};
exports.Promotion = Promotion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Promotion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Promotion.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Promotion.prototype, "precio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserveDetail_1.ReserveDetail, (reserveDetail) => reserveDetail.promotion),
    __metadata("design:type", Array)
], Promotion.prototype, "reserveDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => promotionDetail_1.PromotionDetail, (promotionDetail) => promotionDetail.promotion),
    __metadata("design:type", Array)
], Promotion.prototype, "promotionDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Promotion.prototype, "activo", void 0);
exports.Promotion = Promotion = __decorate([
    (0, typeorm_1.Entity)()
], Promotion);
