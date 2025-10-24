<script lang="ts">
  import MineField from '$lib/components/MineField.svelte';
  import { MineFieldModel } from '$lib/models/minefield.svelte.js';

  const model = new MineFieldModel(16, 16);
  model.initBombs(40);
</script>

<div class="mt-2 flex items-center justify-center">
  <MineField {model} />
</div>
