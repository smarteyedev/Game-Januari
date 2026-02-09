<template>
    <div class="flex flex-col gap-4 p-8">
        <div class="flex justify-center items-center">
            <span class="text-h1">GBL Minigame List</span>
        </div>

        <div class="flex flex-col justify-center items-center gap-4">
            <div>
                <span class="text-h2">2026 - Januari</span>
            </div>
            <div class="flex gap-4">
                <RouterLink class="border px-8 text-h5" to="automation-spotter">
                    Automation Spotter
                </RouterLink>
                <RouterLink class="border px-8 text-h5" to="drag-and-drop">
                    Drag and Drop
                </RouterLink>
                <RouterLink class="border px-8 text-h5" to="memory-game">
                    Memory Game
                </RouterLink>
            </div>
        </div>
    </div>
</template>