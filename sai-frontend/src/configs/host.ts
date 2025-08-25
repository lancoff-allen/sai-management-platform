export default {
  mock: {
    API: '',
  },
  development: {
    // 修改：添加 /api 路径，匹配后端的 context-path
    API: 'http://localhost:8080/api',
  },
  test: {
    API: 'https://service-exndqyuk-1257786608.gz.apigw.tencentcs.com',
  },
  release: {
    API: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com',
  },
  site: {
    API: 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com',
  },
};
