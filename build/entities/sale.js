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
exports.Sale = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
const saleDetail_1 = require("./saleDetail");
const reserve_1 = require("./reserve");
let Sale = class Sale extends typeorm_1.BaseEntity {
};
exports.Sale = Sale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Sale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Sale.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sale.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => reserve_1.Reserve),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", reserve_1.Reserve)
], Sale.prototype, "reserva", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Sale.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "sunatDocumentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Sale.prototype, "fileNameDocumentSunat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_1.Employee, (employee) => employee.sales),
    __metadata("design:type", employee_1.Employee)
], Sale.prototype, "asignedEmployee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => saleDetail_1.SaleDetail, (saleDetail) => saleDetail.sale),
    __metadata("design:type", Array)
], Sale.prototype, "saleDetails", void 0);
exports.Sale = Sale = __decorate([
    (0, typeorm_1.Entity)()
], Sale);
