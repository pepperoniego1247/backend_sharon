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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const role_1 = require("./role");
const person_1 = require("./person");
const reserve_1 = require("./reserve");
const sale_1 = require("./sale");
const orderEntry_1 = require("./orderEntry");
const payment_1 = require("./payment");
const productSale_1 = require("./productSale");
let Employee = class Employee extends typeorm_1.BaseEntity {
};
exports.Employee = Employee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_1.Role, (Role) => Role),
    __metadata("design:type", role_1.Role)
], Employee.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_1.Person),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", person_1.Person)
], Employee.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserve_1.Reserve, (reserve) => reserve.asignedEmployee),
    __metadata("design:type", Array)
], Employee.prototype, "reserves", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_1.Sale, (sale) => sale.asignedEmployee),
    __metadata("design:type", Array)
], Employee.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderEntry_1.OrderEntry, (orderEntry) => orderEntry.employee),
    __metadata("design:type", Array)
], Employee.prototype, "orderEntrys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_1.Payment, (payment) => payment.employee),
    __metadata("design:type", Array)
], Employee.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => productSale_1.ProductSale, (productSale) => productSale.employee),
    __metadata("design:type", Array)
], Employee.prototype, "productSales", void 0);
exports.Employee = Employee = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["person"])
], Employee);
