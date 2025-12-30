const base = process.env.BASE_URL || 'http://127.0.0.1:3020';

const routes = ['/diagnostics', '/brands', '/'];

(async () => {
	for (const route of routes) {
		const res = await fetch(base + route);
		console.log(route, res.status);
	}
})().catch((err) => {
	console.error(err);
	process.exit(1);
});
