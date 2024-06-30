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
exports.Anamnesis = void 0;
const typeorm_1 = require("typeorm");
const customer_1 = require("./customer");
const process_1 = require("./process");
let Anamnesis = class Anamnesis extends typeorm_1.BaseEntity {
};
exports.Anamnesis = Anamnesis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("increment"),
    __metadata("design:type", Number)
], Anamnesis.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_1.Customer),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", customer_1.Customer)
], Anamnesis.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Anamnesis.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Anamnesis.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Anamnesis.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Anamnesis.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Anamnesis.prototype, "other", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "provenencia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "queloide", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "lentesDeContacto", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "aspirinas", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "depresion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "enfermedadesCardiovasculares", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "epilepsia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "hipertension", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "problemasIntestinales", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "problemasRenales", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "problemasRespiratorios", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "problemasCirculatorios", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "alergias", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "tatuajes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "hemofilia", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "cancer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "vihPlus", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "marcaPasos", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "diabetes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "glaucoma", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "embarazada", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "hepatitis", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "anemia", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "radioUno", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaUno", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "radioDos", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaDos", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "radioTres", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaTres", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "radioCuatro", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaCuatro", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], Anamnesis.prototype, "radioCinco", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaCinco", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Anamnesis.prototype, "respuestaSeis", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Anamnesis.prototype, "observacion", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => process_1.Process, (process) => process.anamnesis),
    __metadata("design:type", Array)
], Anamnesis.prototype, "procedimientos", void 0);
exports.Anamnesis = Anamnesis = __decorate([
    (0, typeorm_1.Entity)()
], Anamnesis);
