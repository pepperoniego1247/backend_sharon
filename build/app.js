"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const employee_routes_1 = __importDefault(require("./routes/employee.routes"));
const role_routes_1 = __importDefault(require("./routes/role.routes"));
const microServices_routes_1 = __importDefault(require("./routes/microServices.routes"));
const person_routes_1 = __importDefault(require("./routes/person.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const reserve_routes_1 = __importDefault(require("./routes/reserve.routes"));
const saleReserve_routes_1 = __importDefault(require("./routes/saleReserve.routes"));
const promotion_routes_1 = __importDefault(require("./routes/promotion.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const provider_routes_1 = __importDefault(require("./routes/provider.routes"));
const saleProduct_routes_1 = __importDefault(require("./routes/saleProduct.routes"));
const anamnesis_routes_1 = __importDefault(require("./routes/anamnesis.routes"));
const dashBoard_routes_1 = __importDefault(require("./routes/dashBoard.routes"));
const orderEntry_routes_1 = __importDefault(require("./routes/orderEntry.routes"));
const pigment_routes_1 = __importDefault(require("./routes/pigment.routes"));
const process_routes_1 = __importDefault(require("./routes/process.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use((0, cors_1.default)({ origin: "*", methods: "GET, POST, PUT, DELETE", allowedHeaders: ['Authorization', 'Content-Type'] }));
app.use(express_1.default.json());
app.use(user_routes_1.default);
app.use(orderEntry_routes_1.default);
app.use(employee_routes_1.default);
app.use(provider_routes_1.default);
app.use(role_routes_1.default);
app.use(anamnesis_routes_1.default);
app.use(microServices_routes_1.default);
app.use(dashBoard_routes_1.default);
app.use(person_routes_1.default);
app.use(customer_routes_1.default);
app.use(service_routes_1.default);
app.use(reserve_routes_1.default);
app.use(saleReserve_routes_1.default);
app.use(promotion_routes_1.default);
app.use(product_routes_1.default);
app.use(saleProduct_routes_1.default);
app.use(pigment_routes_1.default);
app.use(process_routes_1.default);
app.use(payment_routes_1.default);
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'extras'));
exports.default = app;
