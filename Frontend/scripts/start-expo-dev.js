const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const DEFAULT_HOST = '192.168.15.5';
const DEFAULT_PORT = '8081';
const APP_PACKAGE = 'com.speak2sign';
const host = process.env.SPEAK2SIGN_DEV_HOST || DEFAULT_HOST;
const hostWithPort = `${host}:${process.env.SPEAK2SIGN_DEV_PORT || DEFAULT_PORT}`;
const forwardedArgs = process.argv.slice(2);

function runAdb(args) {
  const result = spawnSync('adb', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error) {
    return { ok: false, output: result.error.message };
  }

  return {
    ok: result.status === 0,
    output: `${result.stdout || ''}${result.stderr || ''}`.trim(),
  };
}

function getConnectedDevices() {
  const result = runAdb(['devices']);
  if (!result.ok) {
    console.warn(`[dev] adb indisponivel: ${result.output}`);
    return [];
  }

  return result.output
    .split(/\r?\n/)
    .map((line) => line.trim().split(/\s+/))
    .filter(([serial, state]) => serial && state === 'device')
    .map(([serial]) => serial);
}

function configureMetroHost() {
  const devices = getConnectedDevices();

  if (devices.length === 0) {
    console.warn(`[dev] Nenhum dispositivo adb conectado. Usando host ${host} no Expo.`);
    return;
  }

  for (const serial of devices) {
    const setHost = runAdb(['-s', serial, 'shell', 'setprop', 'metro.host', host]);
    if (!setHost.ok) {
      const prefsConfigured = configureDebugServerPreference(serial);
      if (!prefsConfigured) {
        console.warn(`[dev] Nao foi possivel configurar o host Metro em ${serial}: ${setHost.output}`);
        continue;
      }
    } else {
      console.log(`[dev] ${serial}: metro.host=${host}`);
    }

    runAdb(['-s', serial, 'shell', 'am', 'force-stop', APP_PACKAGE]);
  }
}

function configureDebugServerPreference(serial) {
  const localFile = path.join(os.tmpdir(), `${APP_PACKAGE}_preferences.xml`);
  const deviceFile = `/data/local/tmp/${APP_PACKAGE}_preferences.xml`;
  const preferencesFile = `shared_prefs/${APP_PACKAGE}_preferences.xml`;
  const preferencesXml =
    `<?xml version="1.0" encoding="utf-8" standalone="yes" ?>\n` +
    `<map>\n` +
    `    <string name="debug_http_host">${hostWithPort}</string>\n` +
    `</map>\n`;
  fs.writeFileSync(localFile, preferencesXml);

  const push = runAdb(['-s', serial, 'push', localFile, deviceFile]);
  if (!push.ok) {
    return false;
  }

  runAdb(['-s', serial, 'shell', 'chmod', '644', deviceFile]);

  const makePrefsDir = runAdb(['-s', serial, 'shell', 'run-as', APP_PACKAGE, 'mkdir', '-p', 'shared_prefs']);
  const copyPrefs = runAdb(['-s', serial, 'shell', 'run-as', APP_PACKAGE, 'cp', deviceFile, preferencesFile]);
  runAdb(['-s', serial, 'shell', 'rm', deviceFile]);

  if (!makePrefsDir.ok || !copyPrefs.ok) {
    return false;
  }

  console.log(`[dev] ${serial}: debug_http_host=${hostWithPort}`);
  return true;
}

configureMetroHost();

const env = {
  ...process.env,
  REACT_NATIVE_PACKAGER_HOSTNAME: host,
};

const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['expo', 'start', '--dev-client', '--host', 'lan', ...forwardedArgs];

console.log(`[dev] Iniciando Expo em modo dev-client com host ${host}`);

const child = spawn(command, args, {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
