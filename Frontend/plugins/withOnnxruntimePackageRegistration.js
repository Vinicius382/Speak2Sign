const fs = require('fs');
const {
  withDangerousMod,
  AndroidConfig,
} = require('@expo/config-plugins');

const ONNXRUNTIME_IMPORT =
  'import ai.onnxruntime.reactnative.OnnxruntimePackage';
const ONNXRUNTIME_REGISTRATION = 'add(OnnxruntimePackage())';

const addImportIfMissing = (contents) => {
  if (contents.includes(ONNXRUNTIME_IMPORT)) {
    return contents;
  }

  const lines = contents.split(/\r?\n/);
  const lastImportIndex = lines.reduce((lastIndex, line, index) => {
    return line.startsWith('import ') ? index : lastIndex;
  }, -1);

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, ONNXRUNTIME_IMPORT);
    return lines.join('\n');
  }

  const packageLineIndex = lines.findIndex((line) => line.startsWith('package '));

  if (packageLineIndex >= 0) {
    lines.splice(packageLineIndex + 1, 0, '', ONNXRUNTIME_IMPORT);
    return lines.join('\n');
  }

  return `${ONNXRUNTIME_IMPORT}\n${contents}`;
};

const addPackageRegistrationIfMissing = (contents) => {
  if (contents.includes(ONNXRUNTIME_REGISTRATION)) {
    return contents;
  }

  const anchor = 'PackageList(this).packages.apply {';

  if (!contents.includes(anchor)) {
    throw new Error(
      'Unable to find PackageList(this).packages.apply { in MainApplication.kt.',
    );
  }

  return contents.replace(
    anchor,
    `${anchor}\n          ${ONNXRUNTIME_REGISTRATION}`,
  );
};

module.exports = function withOnnxruntimePackageRegistration(config) {
  return withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const mainApplicationPath = AndroidConfig.Paths.getProjectFilePath(
        modConfig.modRequest.projectRoot,
        'MainApplication',
      );

      let contents = await fs.promises.readFile(mainApplicationPath, 'utf8');
      contents = addImportIfMissing(contents);
      contents = addPackageRegistrationIfMissing(contents);
      await fs.promises.writeFile(mainApplicationPath, contents, 'utf8');

      return modConfig;
    },
  ]);
};
