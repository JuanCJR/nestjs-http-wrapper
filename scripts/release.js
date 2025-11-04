const { execSync } = require('child_process');
const pkg = require('../package.json');
const version = pkg.version;
const tagName = `v${version}`;

// Verificar si el tag ya existe localmente
let tagExists = false;
try {
  const existingTags = execSync(`git tag -l "${tagName}"`, {
    encoding: 'utf8',
    stdio: 'pipe',
  }).trim();
  tagExists = existingTags === tagName;
} catch (error) {
  // Si hay error verificando, asumimos que no existe
  tagExists = false;
}

if (tagExists) {
  console.log(
    `Tag ${tagName} already exists locally, skipping tag creation...`,
  );
} else {
  console.log(`Creating tag ${tagName}...`);
  try {
    execSync(`git tag -a ${tagName} -m "Release version ${version}"`, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn(`Warning: Could not create tag ${tagName}:`, error.message);
    console.log('Continuing with push...');
  }
}

// Hacer push de tags (puede fallar si ya existe remoto, pero no es crítico)
console.log(`Pushing tags...`);
try {
  execSync('git push --tags', { stdio: 'inherit' });
} catch (error) {
  console.warn(`Warning: Could not push tags:`, error.message);
  console.log('Tag may already exist remotely, continuing...');
}

// Publicar en npm (puede fallar si la versión ya existe, pero continuamos)
console.log('Publishing to npm...');
try {
  execSync('npm publish', { stdio: 'inherit' });
  console.log('Release completed successfully!');
} catch (error) {
  const errorMessage = error.message || error.toString();
  // Verificar si falla por versión existente (mensajes comunes de npm)
  const isVersionExistsError =
    errorMessage.includes('cannot publish over') ||
    errorMessage.includes('already exists') ||
    errorMessage.includes('duplicate') ||
    errorMessage.includes('403') ||
    errorMessage.includes('EPUBLISHCONFLICT');

  if (isVersionExistsError) {
    console.warn(`Warning: Version ${version} already exists in npm registry.`);
    console.log(
      'Release process completed (tag handled, version already published).',
    );
  } else {
    console.error('Release failed during npm publish:', errorMessage);
    process.exit(1);
  }
}
