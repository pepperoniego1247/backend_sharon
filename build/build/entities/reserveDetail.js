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
exports.ReserveDetail = void 0;
const typeorm_1 = require("typeorm");
const service_1 = require("./service");
const microService_1 = require("./microService");
const promotion_1 = require("./promotion");
const reserve_1 = require("./reserve");
let ReserveDetail = class ReserveDetail extends typeorm_1.BaseEntity {
};
exports.ReserveDetail = ReserveDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], ReserveDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reserve_1.Reserve, (reserve) => reserve.reserveDetails),
    __metadata("design:type", reserve_1.Reserve)
], ReserveDetail.prototype, "reserve", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => promotion_1.Promotion, (promotion) => promotion.reserveDetails),
    __metadata("design:type", promotion_1.Promotion)
], ReserveDetail.prototype, "promotion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_1.Service, (service) => service.reserveDetails),
    __metadata("design:type", service_1.Service)
], ReserveDetail.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => microService_1.MicroService, (microService) => microService.reserveDetail),
    __metadata("design:type", microService_1.MicroService)
], ReserveDetail.prototype, "microServicio", void 0);
exports.ReserveDetail = ReserveDetail = __decorate([
    (0, typeorm_1.Entity)()
], ReserveDetail);
