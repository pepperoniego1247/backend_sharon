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
exports.Pigment = void 0;
const typeorm_1 = require("typeorm");
const pigment_process_1 = require("./pigment_process");
let Pigment = class Pigment extends typeorm_1.BaseEntity {
};
exports.Pigment = Pigment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Pigment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Pigment.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Pigment.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pigment_process_1.ProcessPigment, (processPigment) => processPigment.pigmento),
    __metadata("design:type", Array)
], Pigment.prototype, "pigmentoProcesos", void 0);
exports.Pigment = Pigment = __decorate([
    (0, typeorm_1.Entity)()
], Pigment);
