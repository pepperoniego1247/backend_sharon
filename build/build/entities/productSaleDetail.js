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
exports.ProductSaleDetail = void 0;
const typeorm_1 = require("typeorm");
const productSale_1 = require("./productSale");
const product_1 = require("./product");
let ProductSaleDetail = class ProductSaleDetail extends typeorm_1.BaseEntity {
};
exports.ProductSaleDetail = ProductSaleDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], ProductSaleDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ProductSaleDetail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductSaleDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductSaleDetail.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ProductSaleDetail.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_1.Product, (product) => product.productSaleDetails),
    __metadata("design:type", product_1.Product)
], ProductSaleDetail.prototype, "producto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => productSale_1.ProductSale, (productSale) => productSale.productSaleDetails),
    __metadata("design:type", productSale_1.ProductSale)
], ProductSaleDetail.prototype, "productSale", void 0);
exports.ProductSaleDetail = ProductSaleDetail = __decorate([
    (0, typeorm_1.Entity)()
], ProductSaleDetail);
