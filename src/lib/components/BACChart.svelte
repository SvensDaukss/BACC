<script>
  import { onMount } from 'svelte';
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

  // Register required Chart.js components
  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

  export let bac = 0; // BAC value passed as a prop

  let canvas;

  onMount(() => {
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['BAC', 'Remaining'],
        datasets: [
          {
            data: [bac, 0.08 - bac > 0 ? 0.08 - bac : 0], // BAC and remaining to legal limit
            backgroundColor: ['#1db954', '#ccc'], // Green for BAC, gray for remaining
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
  });
</script>

<div style="position: relative; width: 150px; height: 150px;">
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
    {bac.toFixed(4)}<br />%BAC
  </div>
</div>