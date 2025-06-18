<script>
  import { copyToClipboard } from './utils'
  import { CheckIcon, CopyIcon } from './icons'

  let {
    callbackFunction,
  } = $props()

  let hasJustBeenCopied = $state(false)

  const handleClick = () => {
    callbackFunction()
    hasJustBeenCopied = true

    setTimeout(() => {
      hasJustBeenCopied = false
    }, 2000);
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->

<div class="copy-button" onclick={handleClick}>
  {#if hasJustBeenCopied === true}
    <CheckIcon />
  {:else}
    <CopyIcon />
  {/if}
</div>