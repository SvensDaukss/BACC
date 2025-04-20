<script>
  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let country = '';
  let age = '';
  let gender = '';
  let weightLbs = '';
  let heightFt = '';
  let heightIn = '';
  let message = '';
  let error = '';

  async function handleRegister() {
    error = '';
    message = '';

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        country,
        age: Number(age),
        gender,
        weightLbs: Number(weightLbs),
        heightFt: Number(heightFt),
        heightIn: Number(heightIn)
      })
    });

    const result = await response.json();

    if (result.success) {
      message = `Welcome, ${result.user.first_name}!`;
      window.location.href = `/dashboard`;
    } else {
      error = result.error || 'Registration failed. Try again.';
    }
  }
</script>

<main>
  <div class="container">
    <h1>Register</h1>

    <form on:submit|preventDefault={handleRegister} class="form">
      <div class="form-row">
        <label for="firstName">First Name</label>
        <input id="firstName" bind:value={firstName} required />
      </div>

      <div class="form-row">
        <label for="lastName">Last Name</label>
        <input id="lastName" bind:value={lastName} required />
      </div>

      <div class="form-row">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} required />
      </div>

      <div class="form-row">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required />
      </div>

      <div class="form-row">
        <label for="country">Country</label>
        <input id="country" bind:value={country} />
      </div>

      <div class="form-row">
        <label for="age">Age</label>
        <input id="age" type="number" bind:value={age} min="0" />
      </div>

      <div class="form-row">
        <label for="gender">Gender</label>
        <select id="gender" bind:value={gender} required>
          <option value="" disabled selected>Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="form-row">
        <label for="weightLbs">Weight (lbs)</label>
        <input id="weightLbs" type="number" bind:value={weightLbs} />
      </div>

      <div class="form-row">
        <label for="heightFt">Height (ft)</label>
        <input id="heightFt" type="number" bind:value={heightFt} />
      </div>

      <div class="form-row">
        <label for="heightIn">Height (in)</label>
        <input id="heightIn" type="number" bind:value={heightIn} />
      </div>

      <button type="submit" class="primary-button">Register</button>

      {#if message}
        <p class="success">{message}</p>
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
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--secondary-color);
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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

  input, select {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
  }

  input::placeholder, select::placeholder {
    color: var(--text-muted-color);
  }

  input:focus, select:focus {
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
</style>

