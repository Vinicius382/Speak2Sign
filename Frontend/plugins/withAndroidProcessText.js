const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

const ACTIVITY_NAME = '.ProcessTextActivity';
const ACTION_PROCESS_TEXT = 'android.intent.action.PROCESS_TEXT';
const EXTRA_PROCESS_TEXT = 'android.intent.extra.PROCESS_TEXT';
const MENU_LABEL = 'Traduzir em Libras';

const getAndroidPackage = (config) => {
  const packageName = config.android?.package;

  if (!packageName) {
    throw new Error('withAndroidProcessText requires expo.android.package in app.json.');
  }

  return packageName;
};

const hasProcessTextIntent = (activity) => {
  const filters = activity['intent-filter'] ?? [];

  return filters.some((filter) =>
    (filter.action ?? []).some((action) => action.$?.['android:name'] === ACTION_PROCESS_TEXT)
  );
};

const createProcessTextIntentFilter = () => ({
  action: [{ $: { 'android:name': ACTION_PROCESS_TEXT } }],
  category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
  data: [{ $: { 'android:mimeType': 'text/plain' } }],
});

const withProcessTextManifest = (config) =>
  withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application?.[0];

    if (!application) {
      throw new Error('AndroidManifest.xml does not contain an application node.');
    }

    application.activity = application.activity ?? [];

    let activity = application.activity.find(
      (item) => item.$?.['android:name'] === ACTIVITY_NAME
    );

    if (!activity) {
      activity = {
        $: {
          'android:name': ACTIVITY_NAME,
          'android:label': MENU_LABEL,
          'android:exported': 'true',
        },
        'intent-filter': [],
      };
      application.activity.push(activity);
    }

    activity.$ = {
      ...activity.$,
      'android:name': ACTIVITY_NAME,
      'android:label': MENU_LABEL,
      'android:exported': 'true',
    };
    activity['intent-filter'] = activity['intent-filter'] ?? [];

    if (!hasProcessTextIntent(activity)) {
      activity['intent-filter'].push(createProcessTextIntentFilter());
    }

    return config;
  });

const getProcessTextActivitySource = (packageName) => `package ${packageName};

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

public class ProcessTextActivity extends Activity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    CharSequence selectedText = getIntent().getCharSequenceExtra("${EXTRA_PROCESS_TEXT}");
    String text = selectedText == null ? "" : selectedText.toString().trim();

    if (!text.isEmpty()) {
      Uri deepLink = Uri.parse("speak2sign://process-text")
        .buildUpon()
        .appendQueryParameter("text", text)
        .build();

      Intent intent = new Intent(Intent.ACTION_VIEW, deepLink);
      intent.setPackage(getPackageName());
      intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
      startActivity(intent);
    }

    finish();
  }
}
`;

const withProcessTextActivity = (config) =>
  withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = getAndroidPackage(config);
      const packagePath = packageName.split('.').join(path.sep);
      const activityPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        ...packagePath.split(path.sep),
        'ProcessTextActivity.java'
      );

      fs.mkdirSync(path.dirname(activityPath), { recursive: true });
      fs.writeFileSync(activityPath, getProcessTextActivitySource(packageName));

      return config;
    },
  ]);

module.exports = (config) => withProcessTextActivity(withProcessTextManifest(config));
