<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from './components/Home.vue'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

:root {
  color-scheme: light;
  font-family: "Avenir Next", "Segoe UI", sans-serif;
  --color-text: #2d2218;
  --color-text-muted: #6b5a4a;
  --color-accent-strong: #a64f28;
  --color-surface: rgba(255, 252, 247, 0.82);
  --color-surface-elevated: rgba(255, 255, 255, 0.68);
  --color-border: rgba(122, 85, 44, 0.14);
  --color-border-strong: rgba(122, 85, 44, 0.2);
  --radius-lg: 1.4rem;
  --radius-xl: 2rem;
  --shadow-soft: 0 18px 36px rgba(74, 45, 22, 0.1);
  --shadow-lg: 0 32px 60px rgba(74, 45, 22, 0.14);
  --transition-fast: 180ms ease;
}

html,
body {
  margin: 0;
  min-height: 100%;
}

body {
  background:
    radial-gradient(circle at top, rgba(255, 230, 208, 0.95), rgba(249, 241, 233, 0.85) 30%, rgba(243, 235, 226, 1) 72%),
    linear-gradient(180deg, #f8efe6 0%, #efe5da 100%);
  color: var(--color-text);
}

button,
input,
textarea,
select {
  font: inherit;
}

#app {
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
