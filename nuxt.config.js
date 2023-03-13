import words from "./static/dataset/words.json";
import tags from "./static/dataset/tags.json";

export default async () => {
  const config = {
    target: "server",
    components: true,
    modern: "client",

    head() {
      if (!this.$nuxtI18nHead) {
        return {};
      }

      const { htmlAttrs, meta, link } = this.$nuxtI18nHead({ addSeoAttributes: true });
      const { lang } = htmlAttrs;

      let siteName;
      let description;

      if (lang === "zh-CN") {
        siteName = "原神中英日辞典";
        description = "一个在线的中英日三语原神游戏用语辞典";
      } else if (lang === "ja") {
        siteName = "原神英語・中国語辞典";
        description = "原神の固有名詞等の英語表記、及び中国語表記の一覧を掲載しています。";
      } else {
        siteName = "Genshin Dictionary";
        description = "An online English-Chinese-Japanese dictionary for terms in Genshin Impact";
      }

      return {
        htmlAttrs,
        meta: [
          { charset: "utf-8" },
          { name: "viewport", content: "width=device-width, initial-scale=1" },
          { name: "format-detection", content: "telephone=no" },
          { hid: "description", name: "description", content: description },
          { hid: "og:description", property: "og:description", content: description },
          { hid: "og:type", property: "og:type", content: "website" },
          { hid: "og:site_name", property: "og:site_name", content: siteName },
          { hid: "twitter:card", property: "twitter:card", content: "summary" },
          { hid: "twitter:site", property: "twitter:site", content: "@xicri_gi" },
          { hid: "twitter:creator", property: "twitter:creator", content: "@xicri_gi" },
          { hid: "google-site-verification", name: "google-site-verification", content: "fPZCIib8QFE52LeBEGqBoapTwL6v9vqHl9lKqcreMDQ" },
          ...meta,
        ],
        link: [
          { rel: "icon", href: "/images/favicon.svg", type: "image/svg+xml" },
          ...link,
        ],
        script: [
          ...(process.env.SERVER_ENV === "production" ? [{
            hid: "cloudflare-wa",
            src: "https://static.cloudflareinsights.com/beacon.min.js",
            "data-cf-beacon": "{\"token\": \"1f401150384f4aaa9d14b208aac9fdba\"}",
            defer: true,
            body: true,
          }] : []),
        ],
      };
    },

    router: {
      trailingSlash: true,
      middleware: [
        "headers",
        "trailing-slash",
      ],
    },

    modules: [
      "@nuxtjs/i18n",
      "@nuxtjs/robots",
      "@nuxtjs/sitemap",
    ],
    buildModules: [
      "@nuxtjs/composition-api/module",
      "@pinia/nuxt",
    ],

    i18n: {
      locales: [
        {
          code: "en",
          iso: "en",
          name: "English",
        },
        {
          code: "ja",
          iso: "ja-JP",
          name: "日本語",
        },
        {
          code: "zh-CN",
          iso: "zh-CN",
          name: "简体中文",
        },
      ],
      strategy: "prefix",
      defaultLocale: "en",
      baseUrl: "https://genshin-dictionary.com",
      vueI18nLoader: true,
      detectBrowserLanguage: {
        useCookie: true,
        cookieSecure: true,
        fallbackLocale: "en",
        redirectOn: "no prefix",
      },
      vueI18n: {
        fallbackLocale: "en",
        messages: {
          en: {
            siteTitle: "Genshin Dictionary",
            indexTitleDesc: "An online English-Chinese-Japanese dictionary of the terms in Genshin Impact",
            aboutTitle: "About this website",
            aboutDescription: "About Genshin Dictionary. This website is an online English-Chinese-Japanese dictionary of the terms in Genshin Impact.",
            historyTitle: "Update History",
            opendataTitle: "Open Data / API (β)",
            langNameEn: "English",
            langNameJa: "Japanese",
            langNameZhCN: "Chinese",
          },
          ja: {
            siteTitle: "原神 英語・中国語辞典",
            indexTitleDesc: "原神の固有名詞等の英語表記、及び中国語表記の一覧を掲載しています。",
            aboutTitle: "このサイトについて",
            aboutDescription: "原神英語・中国語辞典についての説明です。このサイトは PC・スマートフォン・プレイステーション4/5用ゲーム「原神」で用いられる固有名詞等の日本語・英語・中国語対訳表です。",
            historyTitle: "更新履歴",
            opendataTitle: "オープンデータ・API (β)",
            langNameEn: "英語",
            langNameJa: "日本語",
            langNameZhCN: "中国語",
          },
          "zh-CN": {
            siteTitle: "原神中英日辞典",
            indexTitleDesc: "一个在线的中英日三语原神游戏用语辞典",
            aboutTitle: "关于本网站",
            aboutDescription: "关于原神中英日辞典。本网站是一个在线的中英日三语原神游戏用语辞典。",
            historyTitle: "更新记录",
            opendataTitle: "开放数据 · API (β)",
            langNameEn: "英语",
            langNameJa: "日语",
            langNameZhCN: "简体中文",
          },
        },
      },
    },

    robots: {
      UserAgent: "*",
      ...(process.env.SERVER_ENV === "production" ? {
        Allow: "/",
        Sitemap: "https://genshin-dictionary.com/sitemap.xml",
      } : {
        Disallow: "/",
      }),
    },

    sitemap: async () => ({
      hostname: "https://genshin-dictionary.com",
      // disable automatic sitemap generation to exclude URLs without locale:
      // e.g. https://genshin-dictionary.com/about/
      exclude: [ "/**" ],
      gzip: false,
      i18n: true,
      routes: [
        ...([ "en", "ja" , "zh-CN" ].map(lang => ([
          { url: `/${lang}/` },
          { url: `/${lang}/history/` },
          ...(words.map(word => ({ url: `/${lang}/${word.id}/`, lastmod: word.updatedAt }))),
          ...(Object.keys(tags).map(tagID => ({ url: `/${lang}/tags/${tagID}/` }))),
        ])).flat()),
        // Pages not translated yet
        { url: "/ja/about/" },
        { url: "/ja/opendata/" },
      ],
    }),
  };

  return config;
};
