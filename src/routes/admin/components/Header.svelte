<script lang="ts">
    import Icon from '@iconify/svelte';
    import { goto } from '$app/navigation';
    import { userStore, userFunctions } from '$lib/appwrite';

    const handleLogout = async () => {
        try {
            await userFunctions.logout()
			goto('/admin')
        }
        catch(err) {
            console.log(err);
        }
    }
</script>

<header class="navbar bg-neutral">
	<div class="container max-w-screen-lg mx-auto">
		<div class="flex-1">
		<a class="btn btn-ghost text-xl" href="/admin"><img class="w-10" src="/favicon.png" alt="logo">Admin</a>
		</div>
		<nav class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/admin">Dashboard</a></li>
			<li><a href="/admin/blog-a">Blog A</a></li>
			<li><a href="/admin/blog-b">Blog B</a></li>
			<li><a href="/admin/create">Create Blog</a></li>
			<li class="mx-5"><a href="/" target="_blank">Main Site <Icon icon="ph:arrow-up-right-thin" /></a></li>
			<li><button class="btn btn-sm btn-outline btn-error" on:click={handleLogout}>Logout <Icon icon="hugeicons:logout-04" /></button></li>
		</ul>
		</nav>
	</div>
</header>