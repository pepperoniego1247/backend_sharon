import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "mssql",
    host: "sharon-vera-database.cxe6wmoymm2o.us-east-1.rds.amazonaws.com",
    port: 1433,
    username: "admin",
    password: "310152Po",
    database: "SistemaSharonVera",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
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
