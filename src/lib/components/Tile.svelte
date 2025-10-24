<script lang="ts">
  import type { MineFieldModel } from '$lib/models/minefield.svelte.js';
  import bomb from '$lib/assets/bomb.svg';
  import closed from '$lib/assets/closed.svg';
  import flag from '$lib/assets/flag.svg';
  import Proximity from '$lib/components/Proximity.svelte';

  interface Props {
    index: number;
    model: MineFieldModel;
  }

  let { index, model }: Props = $props();

  const click = (e: MouseEvent) => {
    if (model.lost) {
      return;
    }

    if (e.button === 2) {
      model.flag(index);
    } else if (e.button === 0) {
      model.open(index);
    }
  };
</script>

<button
  class="h-8 w-8 flex-none border border-gray-400 text-center align-middle {model.isOpen(index)
    ? 'bg-gray-500'
    : 'bg-white'}"
  onmousedown={click}
  oncontextmenu={(e) => e.preventDefault()}
>
  {#if model.isOpen(index)}
    {@const bombs = model.getBombsInVicinity(index)}
    {#if model.hasBomb(index)}
      <img src={bomb} alt="Bomb" />
    {:else}
      <Proximity count={bombs} />
    {/if}
  {:else if model.hasFlag(index)}
    <img src={flag} alt="Flag" />
  {:else}
    <img src={closed} alt="Closed Tile" />
  {/if}
</button>
