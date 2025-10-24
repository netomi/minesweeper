<script lang="ts">
  import type { MineFieldModel } from '$lib/models/minefield.svelte';
  import face from '$lib/assets/face.svg';
  import faceDown from '$lib/assets/face-down.svg';
  import faceLost from '$lib/assets/face-lost.svg';

  interface Props {
    model: MineFieldModel;
  }

  let { model }: Props = $props();

  let pressed = $state(false);

  const click = (e: MouseEvent) => {
    if (e.button === 0) {
      model.reset();
    }
  };

  const press = (e: MouseEvent) => {
    if (e.button === 0) {
      pressed = true;
    }
  };

  const unpress = (_: MouseEvent) => {
    pressed = false;
  };
</script>

<button
  class="h-12 w-12"
  onclick={click}
  onmousedown={press}
  onmouseup={unpress}
  oncontextmenu={(e) => e.preventDefault()}
>
  <img src={pressed ? faceDown : model.lost ? faceLost : face} alt="Game Status" />
</button>
