import adapter from '@sveltejs/adapter-auto';
import path from 'path';

export default {
  kit: {
    adapter: adapter(),
    alias: {
      $database: path.resolve('src/database'),
      $logic: path.resolve('src/logic'),
      $lib: path.resolve('src/lib'),
      $routes: path.resolve('src/routes')
    }
  }
};
