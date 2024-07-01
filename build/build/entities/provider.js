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
exports.Provider = void 0;
const typeorm_1 = require("typeorm");
const person_1 = require("./person");
const orderEntry_1 = require("./orderEntry");
let Provider = class Provider extends typeorm_1.BaseEntity {
};
exports.Provider = Provider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Provider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Provider.prototype, "ruc", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Provider.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Provider.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Provider.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Provider.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => person_1.Person),
    __metadata("design:type", person_1.Person)
], Provider.prototype, "person", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => orderEntry_1.OrderEntry, (orderEntry) => orderEntry.provider),
    __metadata("design:type", Array)
], Provider.prototype, "orderEntrys", void 0);
exports.Provider = Provider = __decorate([
    (0, typeorm_1.Entity)()
], Provider);
