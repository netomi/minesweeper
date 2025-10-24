<script lang="ts">
  import Tile from '$lib/components/Tile.svelte';
  import { MineFieldModel } from '$lib/models/minefield.svelte.js';
  import Face from '$lib/components/Face.svelte';

  interface Props {
    model: MineFieldModel;
  }

  let { model }: Props = $props();
</script>

<div class="flex flex-col">
  <div class="flex items-center justify-center">
    <div class="mb-2 h-12 w-12">
      <Face {model} />
    </div>
  </div>

  <div class="w-auto">
    {#each model.rowIndices as row (row)}
      <div class="flex">
        {#each model.colIndices as col (col)}
          <Tile index={model.getCellIndex(row, col)} {model}></Tile>
        {/each}
      </div>
    {/each}
  </div>
</div>
