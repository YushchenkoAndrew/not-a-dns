<script lang="ts">
  import type { AlertProps } from "../../types";

  import Alert from "./Alert.svelte";

  const MAX_STACK = 5;
  let stack = [] as AlertProps[];

  export const push = (props: AlertProps) => {
    stack = [...stack, props].slice(-MAX_STACK);
    return stack.length - 1;
  };

  export const pop = (i: number = -1) => {
    if (i < 0) return stack.pop();
    stack = [...stack.slice(0, i), ...stack.slice(i + 1)];
  };

  export const update = (i: number, props: Partial<AlertProps>) => {
    stack = [
      ...stack.slice(0, i),
      { ...stack[i], ...props },
      ...stack.slice(i + 1),
    ];
  };
</script>

<div class="fixed bottom-2 right-4">
  {#each stack as alert, i}
    <Alert {...alert} onClose={() => pop(i)} />
  {/each}
</div>

<style></style>
