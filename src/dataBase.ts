import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "mssql",
    host: "34.122.181.100",
    port: 1433,
    username: "pepperoni",
    password: "310152",
    database: "bd-sharon-vera",
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
