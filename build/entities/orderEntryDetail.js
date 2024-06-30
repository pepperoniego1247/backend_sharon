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
exports.OrderEntryDetail = void 0;
const typeorm_1 = require("typeorm");
const orderEntry_1 = require("./orderEntry");
const product_1 = require("./product");
let OrderEntryDetail = class OrderEntryDetail extends typeorm_1.BaseEntity {
};
exports.OrderEntryDetail = OrderEntryDetail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], OrderEntryDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderEntryDetail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrderEntryDetail.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orderEntry_1.OrderEntry, (orderEntry) => orderEntry.orderEntryDetails),
    __metadata("design:type", orderEntry_1.OrderEntry)
], OrderEntryDetail.prototype, "orderEntry", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_1.Product, (product) => product.orderEntryDetails),
    __metadata("design:type", product_1.Product)
], OrderEntryDetail.prototype, "product", void 0);
exports.OrderEntryDetail = OrderEntryDetail = __decorate([
    (0, typeorm_1.Entity)()
], OrderEntryDetail);
