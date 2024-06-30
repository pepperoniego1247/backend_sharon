"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.appDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: "sharon-vera-database.cxe6wmoymm2o.us-east-1.rds.amazonaws.com",
    port: 1433,
    username: "admin",
    password: "310152Po",
    database: "SistemaSharonVera",
    synchronize: true,
    logging: false,
    entities: ["build/entities/*.js"],
    subscribers: [],
    migrations: [],
    extra: {
        options: {
            trustServerCertificate: true,
            connectionTimeout: 100000, // Tiempo de espera para la conexión
            requestTimeout: 100000, // Tiempo de espera para las solicitudes
        },
    },
    options: {
        connectTimeout: 100000,
    },
    connectionTimeout: 100000,
    requestTimeout: 100000
});
