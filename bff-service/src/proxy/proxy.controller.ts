import { Controller, All, Req, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

enum EndpointsMap {
  cart = 'cart',
}

@Controller()
export class ProxyController {
  constructor(private proxyService: ProxyService) {}

  @All()
  proxyRequest(@Req() req: Request): any {
    const originalUrl = req.originalUrl;
    const firstEl = originalUrl.split('/')[1];
    const endpoint = process.env[firstEl];

    let restUrl: string;

    switch (firstEl) {
      case EndpointsMap.cart:
        restUrl = originalUrl.slice(
          originalUrl.indexOf(`/${firstEl}`) + `/${firstEl}`.length,
        );
        break;
      default:
        restUrl = originalUrl;
    }

    if (endpoint) {
      return this.proxyService.makeRequest(`${endpoint}${restUrl}`, req);
    }

    return {
      statusCode: HttpStatus.BAD_GATEWAY,
      message: 'Cannot process request',
    };
  }
}
