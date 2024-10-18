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
exports.Payment_Detail = void 0;
const typeorm_1 = require("typeorm");
const payment_1 = require("./payment");
let Payment_Detail = class Payment_Detail extends typeorm_1.BaseEntity {
};
exports.Payment_Detail = Payment_Detail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Payment_Detail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => payment_1.Payment, (payment) => payment.paymentDetails),
    __metadata("design:type", payment_1.Payment)
], Payment_Detail.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment_Detail.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Payment_Detail.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Payment_Detail.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment_Detail.prototype, "extra", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Payment_Detail.prototype, "totalAmount", void 0);
exports.Payment_Detail = Payment_Detail = __decorate([
    (0, typeorm_1.Entity)()
], Payment_Detail);
