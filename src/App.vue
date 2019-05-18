<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>JSON</span>
        <span class="font-weight-light">PARSER</span>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <dashboard/>
    </v-content>
  </v-app>
</template>

<script>
import Dashboard from './components/Dashboard'

export default {
  name: 'App',
  components: {
    Dashboard
  }
}
</script>
