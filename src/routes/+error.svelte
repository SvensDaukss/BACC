<script>
    export let error;
    export let status;
</script>

<h1>
  {#if status === 404}
    Oops! That page doesn't exist.
  {:else}
    Something went wrong :(
  {/if}
</h1>

<p>
  {#if error?.message}
    {error.message}
  {/if}
</p>

<div style="margin-top: 1rem;">
  <a href="/" style="display: block;">← Go Home</a>
</div>
