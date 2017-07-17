// https://github.com/Nikku/karma-browserify
module.exports = function (config) {
  config.set({
    browsers: ['ChromeNoSandboxHeadless'],
    frameworks: ['browserify', 'jasmine'],
    files: [
      // 'vendor/aframe-master.js',
      // 'vendor/aframe-cubemap-component.js',
      // 'vendor/aframe-extras.js',
      // 'vendor/aframe-physics-system.js',
      // 'vendor/aframe-mouse-cursor-component.js',
      // 'vendor/aframe-ui-widgets.js',
      'vendor/Tone.js',
      // 'vendor/aframe-click-drag-component.min.js',
      // 'src/lib/audio-output-channel-selector.js',
      // 'src/lib/audio-input-channel-connector.js',
      'test/unit/*.js'
    ],
    reporters: ['spec'],
    preprocessors: {
      'test/unit/*.js': ['browserify']
    },
    plugins: [
      'karma-browserify',
      'karma-jasmine',
      'karma-spec-reporter',
      'karma-chrome-launcher'
    ],
    customLaunchers: {
      chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      },
      ChromeNoSandboxHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },
    browserify: {
      debug: true,
      // needed to enable mocks
      plugin: [require('proxyquireify').plugin]
    },
    // proxies: {
    //   '/': {
    //     'target': 'https://' + process.env.ESP_PROXY_HOST + '/',
    //     'changeOrigin': true
    //   }
    // },
    singleRun: true,
    // client: {
    //   args: [
    //     JSON.stringify({ username: process.env.ESP_USERNAME, password: process.env.ESP_PASSWORD })
    //   ]
    // }
  })
}
