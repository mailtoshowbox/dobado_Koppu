"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    console.log("ENTRY");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    var whitelist = ['http://localhost:3001', 'http://localhost:3000', 'undefined'];
    app.enableCors({
        origin: function (origin, callback) {
            console.log("origin---", origin);
            if (whitelist.indexOf(origin) !== -1) {
                console.log("allowed cors for:", origin);
                callback(null, true);
            }
            else {
                console.log("blocked cors for:", origin);
                callback(null, true);
            }
        },
        allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
        methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
        credentials: true,
    });
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map