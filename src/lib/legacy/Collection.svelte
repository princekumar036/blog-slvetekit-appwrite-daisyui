<script lang="ts">
    import { collectionStore } from '$lib/appwrite'
    export let ref:string
    const collection = collectionStore(ref)
</script>

{#if $collection}
    <slot data={$collection} />
{:else}
    <slot name="loading" />
{/if}