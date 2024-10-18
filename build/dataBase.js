"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appDataSource = void 0;
const typeorm_1 = require("typeorm");
exports.appDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "pg-85c1262-nowni-db11.e.aivencloud.com",
    port: 26546,
    username: "avnadmin",
    password: "AVNS_6zbZES6l0oVfh_hUpZb",
    database: "defaultdb",
    synchronize: true,
    logging: false,
    entities: ["build/entities/*.js"],
    subscribers: [],
    migrations: [],
    ssl: {
        rejectUnauthorized: false, // Ignora certificados autofirmados
    }
});
