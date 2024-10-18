import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "postgres",
    host: "pg-85c1262-nowni-db11.e.aivencloud.com",
    port: 26546,
    username: "avnadmin",
    password: "AVNS_6zbZES6l0oVfh_hUpZb",
    database: "defaultdb",
    synchronize: true,
    logging: false,
    entities: ["src/entities/*.ts"],
    subscribers: [],
    migrations: [],
    ssl:{
        rejectUnauthorized: false, // Ignora certificados autofirmados
    }
});
