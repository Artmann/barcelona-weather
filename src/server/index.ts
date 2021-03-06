import 'reflect-metadata';

import app from './app';

(function(): void {
  const port = process.env.PORT || '3000';

  app.listen(port, () => {
    console.log(`Listening on port ${ port }.`);
  });
})();
