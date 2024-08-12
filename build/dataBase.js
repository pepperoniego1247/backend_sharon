"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.appDataSource = new typeorm_1.DataSource({
    type: "mssql",
    host: "serversharonverabd.database.windows.net",
    port: 1433,
    username: "adminSQL",
    password: "310152Po",
    database: "B_D_Sharon_Vera",
    synchronize: true,
    logging: false,
    entities: ["build/entities/*.js"],
    subscribers: [],
    migrations: [],
    extra: {
        options: {
            trustServerCertificate: true,
            connectionTimeout: 50000, // Tiempo de espera para la conexión
            requestTimeout: 50000, // Tiempo de espera para las solicitudes
        },
    },
    options: {
        connectTimeout: 50000,
    },
    connectionTimeout: 50000,
    requestTimeout: 50000
});
