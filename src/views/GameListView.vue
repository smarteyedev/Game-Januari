<script setup lang="ts">
import Background from '@/assets/img/bg.jpg'
</script>

<template>
  <div
    class="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
    :style="{
      backgroundImage: `url(${Background})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }"
  >
    <!-- Dark overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Main Menu Container -->
    <div class="relative z-10 w-full px-8 py-12">
      <!-- Title -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-extrabold text-white tracking-widest drop-shadow-lg">
          GBL MINIGAME HUB
        </h1>
        <p class="text-gray-300 mt-2 text-lg">SELECT GAME</p>
      </div>

      <div class="space-y-10">
        <!-- February -->
        <div class="menu-panel">
          <h2 class="panel-title">2026 — FEBRUARY</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RouterLink to="connections-game" class="menu-tile">
              <span class="menu-title">CONNECTIONS</span>
            </RouterLink>

            <RouterLink to="scrambles-game" class="menu-tile">
              <span class="menu-title">SCRAMBLES</span>
            </RouterLink>

            <RouterLink to="matrix-game" class="menu-tile">
              <span class="menu-title">MATRIX</span>
            </RouterLink>
          </div>
        </div>

        <!-- January -->
        <div class="menu-panel">
          <h2 class="panel-title">2026 — JANUARY</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RouterLink to="automation-spotter" class="menu-tile">
              <span class="menu-title">AUTOMATION SPOTTER</span>
            </RouterLink>

            <RouterLink to="drag-and-drop" class="menu-tile">
              <span class="menu-title">DRAG & DROP</span>
            </RouterLink>

            <RouterLink to="memory-game" class="menu-tile">
              <span class="menu-title">MEMORY</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-panel {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1.5rem;
  letter-spacing: 0.15em;
}

.menu-tile {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.2rem;
  border-radius: 1.25rem;
  cursor: pointer;
  user-select: none;

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));

  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 0.25s ease;

  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.5),
    inset 0 0 10px rgba(255, 255, 255, 0.05);
}

.menu-title {
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 0.25em;
  color: white;
  text-transform: uppercase;
  text-align: center;
}

.menu-tile:hover {
  transform: translateY(-6px) scale(1.04);
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(255, 255, 255, 0.2);

  background: linear-gradient(145deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
}

.menu-tile:active {
  transform: scale(0.98);
}
</style>
