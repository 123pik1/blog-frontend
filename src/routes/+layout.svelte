<script lang="ts">
	import { authService } from '$lib/services/AuthService';
	import { token, username, currentUser } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import './layout.css';

	export const ssr = false;
	export const prerenderer = false;

	let { children } = $props();

	let isMenuOpen = $state(false);
	let isMobile = $state(false);

	// Funkcja do sprawdzania rozmiaru ekranu
	function updateMobileStatus() {
		isMobile = window.innerWidth < 1024; // 1024px to standardowy breakpoint 'lg' w Tailwind
		if (!isMobile) isMenuOpen = false; // Zamyka menu mobilne przy powrocie na desktop
	}

	onMount(() => {
		authService.me();
		updateMobileStatus();

		window.addEventListener('resize', updateMobileStatus);
		return () => window.removeEventListener('resize', updateMobileStatus);
	});

	// Obliczamy szerokość pierwszej kolumny (sidebar)
	// Jeśli nie Mobile -> 250px
	// Jeśli Mobile i otwarte -> 40%
	// Jeśli Mobile i zamknięte -> 0px
	let sidebarWidth = $derived(!isMobile ? '250px' : isMenuOpen ? '40%' : '0px');

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
</script>

<div
	class="grid h-screen w-full transition-[grid-template-columns] duration-300 ease-in-out"
	style="grid-template-columns: {sidebarWidth} 1fr; grid-template-rows: 80px 1fr;"
>
	<aside
		class="sidebar row-span-2 overflow-hidden border-r-2 border-red-500 bg-[#111] transition-all"
	>
		<div class="w-[250px] p-6">
			<div class="mb-8 flex items-center justify-between">
				<h3 class="text-xl font-bold text-gray-100">Menu</h3>
				{#if isMobile}
					<button onclick={toggleMenu} class="text-2xl text-gray-400">✕</button>
				{/if}
			</div>

			<nav class="flex flex-col gap-2">
				<a
					href="/"
					class="rounded p-2 text-gray-300 hover:bg-gray-800"
					onclick={() => isMobile && (isMenuOpen = false)}>Homepage</a
				>
				<a
					href="/articles"
					class="rounded p-2 text-gray-300 hover:bg-gray-800"
					onclick={() => isMobile && (isMenuOpen = false)}>Articles</a
				>

				<div class="mt-4 border-t border-gray-700 pt-4">
					{#if $token}
						{#if $currentUser && $currentUser.role === 'ADMIN'}
							<a href="/admin" class="block p-2 text-blue-400 hover:bg-gray-800">Admin panel</a>
						{/if}
						<a href="/auth/logout" class="p-2 text-red-400 hover:bg-gray-800">Logout</a>
					{:else}
						<a href="/auth/login" class="block p-2 text-gray-400 hover:bg-gray-800">Login</a>
						<a href="/auth/register" class="block p-2 text-gray-400 hover:bg-gray-800">Register</a>
					{/if}
				</div>
			</nav>
		</div>
	</aside>

	<header class="flex items-center border-b-2 border-orange-500 bg-[#111] px-8">
		{#if isMobile}
			<button onclick={toggleMenu} class="mr-4 p-2 text-white"> ☰ </button>
		{/if}
		<h2 class="text-2xl font-semibold text-gray-200">
			{#if $username}
				Witaj, <span class="text-blue-400">{$username}</span>
			{:else}
				Blog 123pik1
			{/if}
		</h2>
	</header>

	<main class="overflow-y-auto bg-[#0a0a0a] p-8 text-white">
		{@render children?.()}
	</main>
</div>
