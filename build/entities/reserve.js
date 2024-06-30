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
exports.Reserve = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
const customer_1 = require("./customer");
const reserveDetail_1 = require("./reserveDetail");
let Reserve = class Reserve extends typeorm_1.BaseEntity {
};
exports.Reserve = Reserve;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Reserve.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserve.prototype, "reserveDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserve.prototype, "initionDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Reserve.prototype, "expirationDate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_1.Employee, (employee) => employee.reserves),
    __metadata("design:type", employee_1.Employee)
], Reserve.prototype, "asignedEmployee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_1.Customer, (customer) => customer.reserves),
    __metadata("design:type", customer_1.Customer)
], Reserve.prototype, "asignedCustomer", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserveDetail_1.ReserveDetail, (reserveDetail) => reserveDetail.reserve),
    __metadata("design:type", Array)
], Reserve.prototype, "reserveDetails", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Reserve.prototype, "activo", void 0);
exports.Reserve = Reserve = __decorate([
    (0, typeorm_1.Entity)()
], Reserve);
