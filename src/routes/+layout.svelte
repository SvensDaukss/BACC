<script>
  import Navbar from '$lib/components/Navbar.svelte';
  export let data; // Access layout data (e.g., session info)
</script>

<Navbar user={data.session?.userId} />

<slot />
<svelte:head>
  <!-- Standard favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">

  <!-- PNG fallbacks for various resolutions -->
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />

  <!-- Apple Touch icon for iOS home screen -->
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
</svelte:head>

