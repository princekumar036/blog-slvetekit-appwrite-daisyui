<script lang="ts">
    import { docStore } from '$lib/appwrite'
    export let ref:string
    const doc = docStore(ref)
</script>

{#if $doc}
    <slot data={$doc} />
{:else}
    <slot name="loading" />
{/if}