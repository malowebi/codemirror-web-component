module.exports = function babelConfig(api) {
  api.cache(false);

  return {
    presets: [
      ['@babel/preset-typescript', {
        allowDeclareFields: true
      }],
      ['@babel/preset-env', {
        targets: 'defaults'
      }]
    ]
  };
};
