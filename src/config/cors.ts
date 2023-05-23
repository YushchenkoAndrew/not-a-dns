import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export default {
  origin: ['http://localhost:3002', 'http://127.0.0.1:3002'],
  methods: 'GET,POST,PUT,DELETE,PATCH',
} as CorsOptions;
