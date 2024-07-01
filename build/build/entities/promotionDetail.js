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
exports.PromotionDetail = void 0;
const typeorm_1 = require("typeorm");
const service_1 = require("./service");
const promotion_1 = require("./promotion");
let PromotionDetail = class PromotionDetail extends typeorm_1.BaseEntity {
};
exports.PromotionDetail = PromotionDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], PromotionDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_1.Service, (service) => service.promotionDetails),
    __metadata("design:type", service_1.Service)
], PromotionDetail.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => promotion_1.Promotion, (promotion) => promotion.promotionDetails),
    __metadata("design:type", promotion_1.Promotion)
], PromotionDetail.prototype, "promotion", void 0);
exports.PromotionDetail = PromotionDetail = __decorate([
    (0, typeorm_1.Entity)()
], PromotionDetail);
