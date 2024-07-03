import "reflect-metadata";
import app from "./app";
import { appDataSource } from "./dataBase";
import { cleanTokens } from "./scripts/cleanTokens";

async function main() {
    await appDataSource.initialize()
    .then(() => {
        app.listen(4000);
        console.log(appDataSource.isInitialized);
        setInterval(cleanTokens, 60000);
    })
    .catch((error) => {
        console.log(error);
    });
}

main();
