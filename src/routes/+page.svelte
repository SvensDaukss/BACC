<script lang="ts">
  import { page } from '$app/stores';

  let user = null;
  $: user = $page.data?.user || null;
</script>

<main>
  {#if !user}
    <h1>Welcome to the Blood Alcohol Concentration Calculator</h1>
    <p>
      Track your drinks, monitor your estimated BAC over time, and learn more about responsible alcohol consumption.
    </p>
    <p>
      Please <a href="/register">Register</a> or <a href="/login">Login</a> to get started.
    </p>
  {:else}
    <h1>Welcome back!</h1>
    <p>
      You are already logged in. Visit your <a href="/dashboard">Dashboard</a> to view your BAC tracking history.
    </p>
  {/if}
</main>
