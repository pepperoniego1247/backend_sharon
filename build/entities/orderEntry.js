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
exports.OrderEntry = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
const orderEntryDetail_1 = require("./orderEntryDetail");
const provider_1 = require("./provider");
let OrderEntry = class OrderEntry extends typeorm_1.BaseEntity {
};
exports.OrderEntry = OrderEntry;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrderEntry.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], OrderEntry.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => provider_1.Provider, (provider) => provider.orderEntrys),
    __metadata("design:type", provider_1.Provider)
], OrderEntry.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_1.Employee, (employee) => employee.orderEntrys),
    __metadata("design:type", employee_1.Employee)
], OrderEntry.prototype, "employee", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderEntryDetail_1.OrderEntryDetail, (orderEntryDetail) => orderEntryDetail.orderEntry),
    __metadata("design:type", Array)
], OrderEntry.prototype, "orderEntryDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], OrderEntry.prototype, "activo", void 0);
exports.OrderEntry = OrderEntry = __decorate([
    (0, typeorm_1.Entity)()
], OrderEntry);
