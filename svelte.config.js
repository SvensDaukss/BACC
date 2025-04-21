import adapter from '@sveltejs/adapter-node';
import path from 'path';

export default {
  kit: {
    adapter: adapter(), // Use the Node.js adapter
    alias: {
      $database: path.resolve('src/database'),
      $logic: path.resolve('src/logic'),
      $lib: path.resolve('src/lib'),
      $routes: path.resolve('src/routes')
    }
  }
};