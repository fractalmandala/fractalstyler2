<script lang="ts">
	// The previews site chrome. Lives in its own group so full-bleed routes
	// (the orientation) can sit outside it without fighting the app-shell.
	let { children } = $props();
</script>

<div class="app-shell">
	<header class="app-header row xbetween">
		<a href="/">fractalstyler previews</a>
		<nav class="row gap-16 ycenter">
			<a class="link" href="/previews/containers">containers</a>
			<a class="link" href="/previews/layouts">layouts</a>
			<a class="link" href="/previews/shells">shells</a>
			<a class="link" href="/previews/shape">shape</a>
			<a class="link" href="/previews/layout">layout</a>
			<a class="link" href="/previews/color">color</a>
			<a class="link" href="/previews/motion">motion</a>
		</nav>
	</header>
	<main class="app-main">
		<aside class="sidebar-left">
			<nav class="navtree">
				<div class="navtree-title">presets</div>
				<a class="navtree-link" href="/previews/shape">shape — radius</a>
				<a class="navtree-link" href="/previews/layout">layout — density</a>
				<a class="navtree-link" href="/previews/color">color — tint</a>
				<a class="navtree-link" href="/previews/motion">motion — energy</a>
				<div class="navtree-title">vocabulary</div>
				<a class="navtree-link" href="/previews/containers">containers</a>
				<a class="navtree-link" href="/previews/markups">markups</a>
			</nav>
		</aside>
		<section class="main-section">
			{@render children()}
		</section>
		<aside class="sidebar-right">
			<nav class="toc">
				<div class="toc-title">on this site</div>
				<ul class="toc-list">
					<li><a class="toc-link" href="/previews/shape">shape presets</a></li>
					<li><a class="toc-link" href="/previews/layout">layout presets</a></li>
					<li><a class="toc-link" href="/previews/color">color presets</a></li>
					<li><a class="toc-link" href="/previews/motion">motion presets</a></li>
					<li><a class="toc-link" href="/previews/containers">containers</a></li>
					<li><a class="toc-link" href="/previews/markups">markups</a></li>
				</ul>
				<div class="toc-footer">fractalstyler2</div>
			</nav>
		</aside>
	</main>
	<footer class="app-footer">footer</footer>
</div>
