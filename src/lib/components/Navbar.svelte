<script>
  export let user = null; // Pass the logged-in user as a prop

  let menuOpen = false;

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST' });
    window.location.href = '/';
  }
</script>

<nav class="navbar">
  <div class="navbar-container">
    <a href="/" class="logo">BACC</a>
    <button class="menu-toggle" aria-label="Toggle Menu" on:click={() => (menuOpen = !menuOpen)}>
      ☰
    </button>
    <ul class="nav-links {menuOpen ? 'open' : ''}">
      <li><a href="/about">About</a></li>
      <li><a href="/information">Information</a></li>
      {#if user}
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/logout" on:click|preventDefault={handleLogout}>Logout</a></li>
      {:else}
        <li><a href="/login">Login</a></li>
        <li><a href="/register">Register</a></li>
      {/if}
    </ul>
  </div>
</nav>

<style>
  /* General Navbar Styles */
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--secondary-color);
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    z-index: 1000;
  }

  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
    text-decoration: none;
  }

  .nav-links {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin: 0;
    padding: 0;
  }

  .nav-links a {
    color: var(--text-color);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .nav-links a:hover {
    color: var(--primary-color);
  }

  /* Mobile Menu Toggle Button */
  .menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-color);
    cursor: pointer;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .menu-toggle {
      display: block; /* Show the menu toggle button on smaller screens */
    }

    .nav-links {
      display: none; /* Hide the nav links by default */
      flex-direction: column;
      gap: 1rem;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background-color: var(--secondary-color);
      padding: 1rem;
      border-top: 1px solid var(--border-color);
    }

    .nav-links.open {
      display: flex; /* Show the nav links when the menu is open */
    }
  }

  :global(body) {
    padding-top: 70px; /* Prevent content from overlapping the navbar */
  }
</style>