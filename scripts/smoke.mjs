const base = process.argv[2];
if (!base?.startsWith('https://')) throw new Error('Pass the HTTPS deployment URL');
for (const file of ['', 'assets/HarshitSaini.pdf', 'favicon.svg', 'sitemap.xml']) {
  const url = new URL(file, base.endsWith('/') ? base : base + '/');
  let response;
  for (let attempt = 0; attempt < 5; attempt++) {
    response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (response.ok) break;
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  if (!response?.ok) throw new Error(`Deployment smoke check failed: ${url} ${response?.status}`);
  if (!file && !(await response.text()).includes('Harshit Saini')) throw new Error('Unexpected homepage');
  console.log(`OK ${url}`);
}
