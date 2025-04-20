<script lang="ts">
  import { onMount } from 'svelte';
  import { calculateBAC, calculateTotalBAC } from '$lib/utils/bacCalculator';
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

  // Register Chart.js components
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

  // Form state
  let drinkName = '';
  let alcoholByVolume = '';
  let volumeInOunces = '';
  let consumedAtTimestamp = '';

  // Data from API
  let drinksList: any[] = [];
  let errorMessage = '';
  let isLoading = false;

  // User data
  export let data;
  let user = { ...data.user };

  // Total BAC
  let totalBAC: number | null = null;

  // Load all drinks when page mounts
  onMount(loadUserDrinks);

  let newEmail = '';
  let confirmEmail = '';
  let newPassword = '';
  let confirmPassword = '';

  async function updateEmail() {
    if (newEmail !== confirmEmail) {
      alert('Emails do not match.');
      return;
    }

    const res = await fetch('/api/users/email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail })
    });

    const result = await res.json();
    alert(result.message);
  }

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const res = await fetch('/api/users/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    });

    const result = await res.json();
    alert(result.message);
  }

  async function submitUserUpdate() {
    console.log('Updating user:', user); // Debugging: Log the user object

    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      alert('Profile updated!');
    } else {
      alert('Failed to update profile');
    }
  }

  async function loadUserDrinks() {
    isLoading = true;
    const response = await fetch('/api/drinks');
    if (response.ok) {
      drinksList = await response.json();
    } else {
      errorMessage = 'Failed to load drinks';
    }
    isLoading = false;
  }

  async function submitNewDrink() {
    const response = await fetch('/api/drinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: drinkName,
        abv: parseFloat(alcoholByVolume),
        volumeOz: parseFloat(volumeInOunces),
        consumedAt: consumedAtTimestamp
      })
    });

    if (response.ok) {
      drinkName = '';
      alcoholByVolume = '';
      volumeInOunces = '';
      consumedAtTimestamp = '';
      await loadUserDrinks();
    } else {
      errorMessage = 'Failed to add drink';
    }
  }

  async function removeDrink(drinkId: string) {
    const response = await fetch('/api/drinks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drinkId })
    });

    if (response.ok) {
      await loadUserDrinks();
    } else {
      errorMessage = 'Failed to delete drink';
    }
  }

  async function handleLogout() {
    const confirmLogout = confirm('Are you sure you want to log out?');
    if (!confirmLogout) return;

    const response = await fetch('/api/users/logout', { method: 'POST' });

    if (response.ok) {
      alert('You have been logged out successfully.');
      window.location.href = '/'; // Redirect to the home page
    } else {
      alert('Failed to log out. Please try again.');
    }
  }

  // BAC form state
  let abv = '';
  let volumeOz = '';
  let hoursSinceDrinking = '';
  let bac: number | null = null; // Explicitly define the type of bac

  function calculateUserBAC() {
    if (!abv || !volumeOz || !hoursSinceDrinking) {
      alert('Please fill in all fields.');
      return;
    }

    bac = calculateBAC({
      abv: parseFloat(abv),
      volumeOz: parseFloat(volumeOz),
      weightLbs: user.weight_lbs,
      gender: user.gender,
      hoursSinceDrinking: parseFloat(hoursSinceDrinking)
    });
  }

  function calculateTotalBACHandler() {
    try {
      totalBAC = calculateTotalBAC({ drinksList, user });
      renderBACChart(); // Render the chart after calculating BAC
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message); // Access the error message safely
      } else {
        alert('An unknown error occurred.');
      }
    }
  }

  let canvas: HTMLCanvasElement | null = null; // Explicitly type canvas
  let chartInstance: Chart | null = null; // Store the chart instance

  function renderBACChart() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy the previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Use a fallback value of 0 if totalBAC is null
    const bacValue = totalBAC ?? 0;

    // Determine the color based on the BAC level
    let bacColor;
    if (bacValue <= 0.08) {
      bacColor = '#1db954'; // Green for safe BAC
    } else if (bacValue > 0.08 && bacValue <= 0.15) {
      bacColor = '#f1c40f'; // Yellow for medium risk
    } else {
      bacColor = '#e74c3c'; // Red for high risk
    }

    // Create a new chart instance
    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['BAC', 'Remaining'],
        datasets: [
          {
            data: [
              bacValue,
              Math.max(0, 0.3 - bacValue), // Adjust the remaining BAC threshold
            ],
            backgroundColor: [bacColor, '#ccc'], // Dynamic color for BAC, gray for remaining
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%', // Inner radius for the doughnut
        plugins: {
          tooltip: { enabled: false }, // Disable tooltips
          legend: { display: false }, // Hide legend
        },
      },
    });
  }
</script>

<main>
  <div class="dashboard-container">
    <h1>{user.first_name}'s Dashboard</h1>

    <div class="dashboard-grid">
      <!-- Left Column: Profile Updates -->
      <div class="profile-section">
        <form on:submit|preventDefault={submitUserUpdate} class="form">
          <h2>Change Email</h2>
          <div class="form-row">
            <label for="newEmail">New Email</label>
            <input id="newEmail" bind:value={newEmail} placeholder="New Email" />
          </div>
          <div class="form-row">
            <label for="confirmEmail">Confirm Email</label>
            <input id="confirmEmail" bind:value={confirmEmail} placeholder="Confirm New Email" />
          </div>
          <button on:click={updateEmail} class="primary-button">Update Email</button>

          <h2>Change Password</h2>
          <div class="form-row">
            <label for="newPassword">New Password</label>
            <input id="newPassword" type="password" bind:value={newPassword} placeholder="New Password" />
          </div>
          <div class="form-row">
            <label for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" bind:value={confirmPassword} placeholder="Confirm New Password" />
          </div>
          <button on:click={updatePassword} class="primary-button">Update Password</button>

          <h2>Update Profile</h2>
          <div class="form-row">
            <label for="firstName">First Name</label>
            <input id="firstName" bind:value={user.first_name} placeholder="First Name" />
          </div>
          <div class="form-row">
            <label for="lastName">Last Name</label>
            <input id="lastName" bind:value={user.last_name} placeholder="Last Name" />
          </div>
          <div class="form-row">
            <label for="age">Age</label>
            <input id="age" type="number" bind:value={user.age} placeholder="Age" />
          </div>
          <div class="form-row">
            <label for="country">Country</label>
            <input id="country" bind:value={user.country} placeholder="Country" />
          </div>
          <div class="form-row">
            <label for="gender">Gender</label>
            <select id="gender" bind:value={user.gender}>
              <option disabled selected value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div class="form-row">
            <label for="weight">Weight (lbs)</label>
            <input id="weight" type="number" bind:value={user.weight_lbs} placeholder="Weight (lbs)" />
          </div>
          <div class="form-row">
            <label for="heightFt">Height (ft)</label>
            <input id="heightFt" type="number" bind:value={user.height_ft} placeholder="Height (ft)" />
          </div>
          <div class="form-row">
            <label for="heightIn">Height (in)</label>
            <input id="heightIn" type="number" bind:value={user.height_in} placeholder="Height (in)" />
          </div>
          <button type="submit" class="primary-button">Update Info</button>
        </form>
        <button on:click={handleLogout} class="logout-button">Logout</button>
      </div>

      <!-- Right Column: Drink Management -->
      <div class="drink-section">
        <section>
          <h2>Add a Drink</h2>
          <form on:submit|preventDefault={submitNewDrink} class="form">
            <div class="form-row">
              <label for="drinkName">Drink Name</label>
              <input id="drinkName" bind:value={drinkName} required />
            </div>
            <div class="form-row">
              <label for="alcoholByVolume">Alcohol by Volume (%)</label>
              <input id="alcoholByVolume" bind:value={alcoholByVolume} type="number" step="0.1" min="0" required />
            </div>
            <div class="form-row">
              <label for="volumeInOunces">Volume (oz)</label>
              <input id="volumeInOunces" bind:value={volumeInOunces} type="number" step="0.1" min="0" required />
            </div>
            <div class="form-row">
              <label for="consumedAtTimestamp">Time Consumed</label>
              <input id="consumedAtTimestamp" bind:value={consumedAtTimestamp} type="datetime-local" required />
            </div>
            <button type="submit" class="primary-button">Add Drink</button>
          </form>
        </section>

        <section>
          <h2>Logged Drinks</h2>
          {#if isLoading}
            <p>Loading drinks...</p>
          {:else if drinksList.length === 0}
            <p>No drinks added yet.</p>
          {:else}
            <ul>
              {#each drinksList as drink}
                <li>
                  <strong>{drink.name}</strong> — {drink.abv}% ABV, {drink.volume_oz} oz  
                  at {new Date(drink.consumed_at).toLocaleString()}
                  <button on:click={() => removeDrink(drink.drink_id)} class="delete-button">Delete</button>
                </li>
              {/each}
            </ul>
          {/if}
        </section>

        <section>
          <h2>Calculate Total BAC</h2>
          <button on:click={calculateTotalBACHandler} class="primary-button">Calculate BAC</button>

          {#if totalBAC !== null}
            <div style="position: relative; width: 200px; height: 200px; margin: 1rem auto;">
              <canvas bind:this={canvas}></canvas>
              <div
                style="
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 1.2rem;
                  font-weight: bold;
                  color: #fff;
                "
              >
                {totalBAC.toFixed(4)}<br />%BAC
              </div>
            </div>
            <p>Your total estimated BAC is: <strong>{totalBAC.toFixed(4)}</strong></p>
            {#if totalBAC >= 0.08}
              <p class="warning">Warning: Your BAC is above the legal limit for driving in most regions.</p>
            {/if}
          {/if}
        </section>
      </div>
    </div>
  </div>
</main>

<style>
  .dashboard-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    gap: 2rem;
  }

  .profile-section, .drink-section {
    background-color: var(--secondary-color);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: var(--primary-color);
  }

  h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
    color: var(--primary-color);
  }

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
  }

  input, select {
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background-color: var(--secondary-color);
    color: var(--text-color);
  }

  button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .primary-button {
    background-color: var(--primary-color);
    color: var(--foreground-color);
  }

  .primary-button:hover {
    background-color: #1aa34a;
  }

  .logout-button {
    margin-top: 2rem;
    background-color: #ff5252;
    color: white;
    font-weight: bold;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .logout-button:hover {
    background-color: #e04848;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  ul li {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ul li button {
    margin-left: 1rem;
  }

  .warning {
    color: red;
    font-weight: bold;
  }

  /* Responsive Styles */
  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr; /* Stack sections vertically */
    }

    .profile-section, .drink-section {
      padding: 1rem; /* Reduce padding for smaller screens */
    }

    h1 {
      font-size: 1.5rem; /* Adjust heading size */
    }

    button {
      font-size: 0.9rem; /* Adjust button size */
    }
  }
</style>
