import { Module, Global } from '@nestjs/common';
import { ShellModule } from './shell/shell.module';
import { MobiController } from './mobi/mobi.controller';
import { MobiService } from './mobi/mobi.service';

@Global()
@Module({
  imports: [ShellModule],
  controllers: [MobiController],
  providers: [MobiService],
})
export class AppModule {}
