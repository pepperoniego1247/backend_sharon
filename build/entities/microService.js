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
exports.MicroService = void 0;
const typeorm_1 = require("typeorm");
const reserveDetail_1 = require("./reserveDetail");
const service_1 = require("./service");
let MicroService = class MicroService extends typeorm_1.BaseEntity {
};
exports.MicroService = MicroService;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], MicroService.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MicroService.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], MicroService.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserveDetail_1.ReserveDetail, (reserveDetail) => reserveDetail.microServicio),
    __metadata("design:type", Array)
], MicroService.prototype, "reserveDetail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => service_1.Service, (service) => service.microServices),
    __metadata("design:type", service_1.Service)
], MicroService.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], MicroService.prototype, "activo", void 0);
exports.MicroService = MicroService = __decorate([
    (0, typeorm_1.Entity)()
], MicroService);
