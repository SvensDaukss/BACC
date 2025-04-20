<script lang="ts">
  let email = '';
  let password = '';
  let error = '';
  let success = '';

  async function handleLogin() {
    error = '';
    success = '';

    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (result.success) {
      success = `Welcome back, ${result.user.first_name}!`;
      window.location.href = `/dashboard`;
    } else {
      error = result.error || 'Invalid email or password';
    }
  }
</script>

<main>
  <div class="container">
    <h1>Login</h1>

    <form on:submit|preventDefault={handleLogin} class="form">
      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" bind:value={email} type="email" placeholder="Enter your email" required />
      </div>

      <div class="form-row">
        <label for="password">Password</label>
        <input id="password" bind:value={password} type="password" placeholder="Enter your password" required />
      </div>

      <button type="submit" class="primary-button">Login</button>

      {#if success}
        <p class="success">{success}</p>
      {/if}
      {#if error}
        <p class="error">{error}</p>
      {/if}
    </form>
  </div>
</main>

<style>
  /* Container Styling */
  .container {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--secondary-color);
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.5s ease-in-out;
  }

  h1 {
    color: var(--primary-color);
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
  }

  /* Form Styling */
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 2fr; /* Label takes 1/3, input takes 2/3 */
    align-items: center;
    gap: 1rem;
  }

  label {
    font-size: 1rem;
    color: var(--text-color);
    text-align: right;
    font-weight: 500;
  }

  input {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  input::placeholder {
    color: var(--text-muted-color);
  }

  input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
  }

  /* Button Styling */
  .primary-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: bold;
    color: var(--foreground-color);
    background-color: var(--primary-color);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .primary-button:hover {
    background-color: #1aa34a;
    transform: scale(1.05);
  }

  .primary-button:active {
    background-color: #148c3a;
    transform: scale(0.95);
  }

  /* Success and Error Messages */
  .success {
    color: var(--success-color);
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
  }

  .error {
    color: var(--error-color);
    font-size: 0.9rem;
    text-align: center;
    margin-top: 1rem;
  }

  /* Animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
