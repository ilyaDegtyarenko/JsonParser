module.exports = {
    transpileDependencies: [/node_modules[/\\\\]vuetify[/\\\\]/],
    pages: {
        index: {
            entry: 'src/index.js',
            template: 'public/index.html',
            title: 'JsonParser'
        }
    },
    pluginOptions: {
        i18n: {
            locale: 'en',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableInSFC: true
        }
    }
};
