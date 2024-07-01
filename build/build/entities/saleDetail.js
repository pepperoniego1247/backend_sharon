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
exports.SaleDetail = void 0;
const typeorm_1 = require("typeorm");
const sale_1 = require("./sale");
const reserveDetail_1 = require("./reserveDetail");
let SaleDetail = class SaleDetail extends typeorm_1.BaseEntity {
};
exports.SaleDetail = SaleDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], SaleDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleDetail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleDetail.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_1.Sale, (sale) => sale.saleDetails),
    __metadata("design:type", sale_1.Sale)
], SaleDetail.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => reserveDetail_1.ReserveDetail),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", reserveDetail_1.ReserveDetail)
], SaleDetail.prototype, "reserveDetail", void 0);
exports.SaleDetail = SaleDetail = __decorate([
    (0, typeorm_1.Entity)()
], SaleDetail);
