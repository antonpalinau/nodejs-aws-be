import { HttpModule, Module, CacheModule } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';

@Module({
  imports: [HttpModule, CacheModule.register({ ttl: 120 })],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
