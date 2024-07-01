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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const person_1 = require("./person");
const reserve_1 = require("./reserve");
let Customer = class Customer extends typeorm_1.BaseEntity {
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: "1000" }),
    __metadata("design:type", String)
], Customer.prototype, "notation", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_1.Person),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", person_1.Person)
], Customer.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => reserve_1.Reserve, (reserve) => reserve.asignedCustomer),
    __metadata("design:type", Array)
], Customer.prototype, "reserves", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(["person"])
], Customer);
