import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        aboutUs: 'about-us.html',
        forAthletes: 'for-athletes.html',
        tactical: 'tactical.html',
        science: 'science.html',
        news: 'news.html',
        article: 'article.html',
      },
    },
  },
});
