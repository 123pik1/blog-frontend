<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { token, username, currentUser } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import './layout.css'; // upewnij się, że tu jest Twój plik z @import 'tailwindcss'

	let { children } = $props();
	onMount(() => {
		authService.me();
	});
</script>

<div class="grid h-screen grid-cols-[250px_1fr] grid-rows-[80px_1fr]">
	<aside class="sidebar row-span-2 border-r-2 border-red-500 p-6">
		<h3 class="mb-6 text-xl font-bold text-gray-100">Menu</h3>
		<nav class="flex flex-col gap-2">
			<a href="/" class="rounded p-2 hover:bg-gray-100">Homepage</a>
			<a href="/articles" class="rounded p-2 hover:bg-gray-100">Articles</a>

			<div class="mt-4 border-t pt-4">
				{#if $token}
					{#if $currentUser && $currentUser.role === 'ADMIN'}
						<a href="/admin" class="block p-2 text-gray-600">Admin panel</a>
					{/if}
					<a href="/auth/logout" class="p-2 text-gray-600">Logout</a>
				{:else}
					<a href="/auth/login" class="block p-2 text-gray-600">Login</a>
					<a href="/auth/register" class="block p-2 text-gray-600">Register</a>
				{/if}
			</div>
		</nav>
	</aside>

	<header class="topbar flex items-center border-b-2 border-orange-500 px-8">
		<h2 class="text-2xl font-semibold text-gray-200">
			{#if $username}
				Witaj, <span class="text-blue-400">{$username}</span>
			{:else}
				Blog 123pik1
			{/if}
		</h2>
	</header>

	<main class="main-content overflow-y-auto p-8">
		{@render children?.()}
	</main>
</div>
