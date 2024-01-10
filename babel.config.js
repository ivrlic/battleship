module.exports = api => {
  const isTest = api.env('test');

  const commonBabelConfig = {
    presets: [
      ['@babel/preset-env', { targets: 'current node' }],
    ],
    plugins: [],
  };

  if (isTest) {
    const testBabelConfig = {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
      ],
      plugins: [],
    };

    return {
      ...commonBabelConfig,
      ...testBabelConfig,
    };
  }

  return commonBabelConfig;
};