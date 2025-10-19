import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        team: 'team.html',
        teams: 'teams.html',
        proTeams: 'pro-teams.html',
        collegiate: 'collegiate.html',
        olympicTeams: 'olympic-teams.html',
        tactical: 'tactical.html',
        science: 'science.html',
        press: 'press.html',
        news: 'news.html',
        article: 'article.html',
      },
    },
  },
});
