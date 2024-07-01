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
exports.Inventory = void 0;
const typeorm_1 = require("typeorm");
const product_1 = require("./product");
const orderEntryDetail_1 = require("./orderEntryDetail");
const productSaleDetail_1 = require("./productSaleDetail");
let Inventory = class Inventory extends typeorm_1.BaseEntity {
};
exports.Inventory = Inventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Inventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventory.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Inventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Inventory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => product_1.Product),
    __metadata("design:type", product_1.Product)
], Inventory.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderEntryDetail_1.OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.inventory),
    __metadata("design:type", Array)
], Inventory.prototype, "orderEntryDetails", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productSaleDetail_1.ProductSaleDetail, (productSaleDetail) => productSaleDetail.inventory),
    __metadata("design:type", Array)
], Inventory.prototype, "productSaleDetails", void 0);
exports.Inventory = Inventory = __decorate([
    (0, typeorm_1.Entity)()
], Inventory);
