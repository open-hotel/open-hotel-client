import { Module, Global } from '@nestjs/common';
import { ShellModule } from './shell/shell.module';

@Global()
@Module({
  imports: [ShellModule],
})
export class AppModule {}
