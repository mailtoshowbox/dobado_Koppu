import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { urlencoded, json } from 'express';
async function bootstrap() {
  //console.log("ENTRY");
  const app = await NestFactory.create(AppModule); 

  var whitelist = ['http://localhost:3001', 'http://localhost:3001/', 'http://localhost:3000', 'undefined'];
  app.enableCors({
  origin: function (origin, callback) {
    //console.log("origin-->>-",origin);
    if (whitelist.indexOf(origin) !== -1) {
     // console.log("allowed cors for:", origin)
      callback(null, true)
    } else {
     // console.log("blocked cors for:", origin)
      callback(null, true)
      //callback(new Error('Not allowed by CORS'))
    }
  },
  
  allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Authorization',
  methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS",
  credentials: true,
  });
   
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(3000);

  console.log(`Application is running on: ${await app.getUrl()}`);

  
}
bootstrap();
