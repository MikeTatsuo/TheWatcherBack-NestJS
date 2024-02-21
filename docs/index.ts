import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('The Watcher')
  .setDescription('The Watcher API description')
  .setVersion('1.0')
  .build();
