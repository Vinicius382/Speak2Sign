const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const patchVisionCameraCmakeVersion = () => {
  const buildGradlePath = path.join(
    root,
    'node_modules',
    'react-native-vision-camera',
    'android',
    'build.gradle',
  );

  if (!fs.existsSync(buildGradlePath)) {
    return;
  }

  const contents = fs.readFileSync(buildGradlePath, 'utf8');

  if (contents.includes('VisionCamera_cmakeVersion')) {
    return;
  }

  const patchedContents = contents.replace(
    '      path "CMakeLists.txt"',
    '      path "CMakeLists.txt"\n      version safeExtGet("VisionCamera_cmakeVersion", "3.31.6")',
  );

  if (patchedContents === contents) {
    throw new Error(
      'Nao foi possivel encontrar o bloco CMake da react-native-vision-camera.',
    );
  }

  fs.writeFileSync(buildGradlePath, patchedContents);
};

patchVisionCameraCmakeVersion();
