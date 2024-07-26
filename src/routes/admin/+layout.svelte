<script lang="ts">
    import { initialiseApp, userStore } from '$lib/appwrite'
    import Login from './components/Login.svelte'
    import Header from './components/Header.svelte'
    import Footer from './components/Footer.svelte'
    import { onMount } from 'svelte'
    
    onMount(async () => {        
        await initialiseApp()
    })
</script>

{#if $userStore}
    <Header />
    <main class="container max-w-screen-lg mx-auto min-h-screen">
        <slot />
    </main>
    <Footer />
{:else}
    <Login />
{/if}

