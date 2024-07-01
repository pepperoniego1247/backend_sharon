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
exports.Process = void 0;
const typeorm_1 = require("typeorm");
const anamnesis_1 = require("./anamnesis");
const pigment_process_1 = require("./pigment_process");
let Process = class Process extends typeorm_1.BaseEntity {
};
exports.Process = Process;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Process.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Process.prototype, "procedimiento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Process.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => anamnesis_1.Anamnesis, (anamnesis) => anamnesis.procedimientos),
    __metadata("design:type", anamnesis_1.Anamnesis)
], Process.prototype, "anamnesis", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pigment_process_1.ProcessPigment, (processPigment) => processPigment.proceso),
    __metadata("design:type", Array)
], Process.prototype, "pigmentoProcesos", void 0);
exports.Process = Process = __decorate([
    (0, typeorm_1.Entity)()
], Process);
