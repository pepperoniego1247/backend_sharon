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
exports.ProductSale = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
const productSaleDetail_1 = require("./productSaleDetail");
let ProductSale = class ProductSale extends typeorm_1.BaseEntity {
};
exports.ProductSale = ProductSale;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], ProductSale.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], ProductSale.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductSale.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductSale.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSale.prototype, "sunatDocumentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ProductSale.prototype, "fileNameDocumentSunat", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_1.Employee, (employee) => employee.productSales),
    __metadata("design:type", employee_1.Employee)
], ProductSale.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productSaleDetail_1.ProductSaleDetail, (productSaleDetail) => productSaleDetail.productSale),
    __metadata("design:type", Array)
], ProductSale.prototype, "productSaleDetails", void 0);
exports.ProductSale = ProductSale = __decorate([
    (0, typeorm_1.Entity)()
], ProductSale);
