const fs = require('fs');
const { component, page, barrel } = require('./templates');

// Error Handler
function writeFileErrorHandler(err) {
  if (err) throw err;
}

function generateComponent(path, type = 'component') {
  const name = path.split('/').pop();
  const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);

  const dir = `./src/ui/${path.split('/').length === 1 ? (type === 'component' ? 'components' : 'pages') : path.replace(name, '')}/${nameCapitalized}`;

  // Throw an error if the file already exists
  if (fs.existsSync(dir)) {
    throw new Error('A component with that name already exists.');
  }

  // Create the folder
  fs.mkdirSync(dir, { recursive: true });

  // Component.tsx
  fs.writeFile(
    `${dir}/${nameCapitalized}.tsx`,
    type === 'component' ? component(nameCapitalized) : page(nameCapitalized),
    writeFileErrorHandler
  );

  // Component.scss
  fs.writeFile(`${dir}/${nameCapitalized}.scss`, '', writeFileErrorHandler);

  // index.tsx
  fs.writeFile(`${dir}/index.tsx`, barrel(nameCapitalized), writeFileErrorHandler);
}

// Grab component type from terminal argument
let [p, c, cType, cPath] = process.argv;
const argPageAlias = ['p', 'page'];
const argCompAlias = ['c', 'component'];

cType = argPageAlias.includes(cType) ? 'page' : argCompAlias.includes(cType) ? 'component' : '';
if (!cType) {
  throw new Error('Unsupported parameter!');
}

// Grab component name from terminal argument
if (!cPath) {
  throw new Error('You must include a component name.');
}

// Generate component
generateComponent(cPath, cType);
