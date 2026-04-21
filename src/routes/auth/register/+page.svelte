<!-- REGISTER -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { authService } from '$lib/services/AuthService';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	async function handleRegister(e: SubmitEvent) {
		e.preventDefault();
		isLoading = true;
		errorMessage = '';
		try {
			const success = await authService.register({ username, password });
			if (success) await goto('/');
			else errorMessage = 'Invalid username or password';
		} catch (e) {
			errorMessage = 'Connection error. Is the backend running?';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-[60vh] items-center justify-center p-4">
	<div class="w-full max-w-md rounded-xl border-2 border-red-900 bg-[#1a1a1a] p-8 shadow-2xl">
		<div class="mb-8 text-center">
			<h1 class="text-3xl font-bold tracking-tight text-gray-100 uppercase">Register</h1>
			<p class="mt-2 text-sm text-gray-400">Want to comment?</p>
		</div>

		<form onsubmit={handleRegister} class="space-y-6">
			<div>
				<label
					for="username"
					class="block text-xs font-semibold tracking-wider text-gray-400 uppercase">Username</label
				>
				<input
					type="text"
					id="username"
					bind:value={username}
					required
					class="mt-1 block w-full rounded-md border border-gray-800 bg-[#252525] px-3 py-2 text-white shadow-sm transition-all placeholder:text-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
					placeholder="user"
				/>
			</div>

			<div>
				<label
					for="password"
					class="block text-xs font-semibold tracking-wider text-gray-400 uppercase">Password</label
				>
				<input
					type="password"
					id="password"
					bind:value={password}
					required
					class="mt-1 block w-full rounded-md border border-gray-800 bg-[#252525] px-3 py-2 text-white shadow-sm transition-all placeholder:text-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none"
					placeholder="••••••••"
				/>
			</div>

			{#if errorMessage}
				<div class="rounded-md border border-red-900 bg-red-950/30 p-3 text-sm text-red-400">
					{errorMessage}
				</div>
			{/if}

			<button
				type="submit"
				disabled={isLoading}
				class="w-full rounded-md bg-red-700 px-4 py-2 text-sm font-bold tracking-widest text-white uppercase shadow-lg transition-all hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:outline-none active:scale-95 disabled:opacity-50"
			>
				{#if isLoading}
					Registering and logging in...
				{:else}
					Register
				{/if}
			</button>
		</form>

		<div class="mt-6 text-center text-xs text-gray-600 italic">
			Forgot password? Contact your database administrator.
		</div>
	</div>
</div>
