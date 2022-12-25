import { writeFile } from 'fs/promises';
import puppeteer, { Browser, Page, KnownDevices } from 'puppeteer';
import path from 'path';
import { PokemonData } from '@lib/data';

const dataDir = path.join(__dirname, '..', 'projects/data/src');

async function fetchAllPokemons(): Promise<PokemonData[]> {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const pokemons = await queryPokemons(browser);
  await browser.close();
  return pokemons;
}

async function queryPokemons(browser: Browser): Promise<PokemonData[]> {
  const baseUrl = new URL('https://yakkun.com/sv/zukan/search/?search=1&mega=2&sort=21');
  const page = await createPage(browser);
  await page.goto(baseUrl.toString(), { waitUntil: 'domcontentloaded' });

  const resultCount = await page.evaluate(() => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const resultText = document.body.querySelector<HTMLDivElement>('.clear + div')!.textContent!;
    const [resultCount] = /(\d+)件/.exec(resultText)!;
    return parseInt(resultCount, 10);
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  });

  const pageCount = Math.ceil(resultCount / 50) - 1;
  const pages = Array.from({ length: pageCount }, (_, i) => {
    return createPage(browser).then(async (page) => {
      const pageUrl = new URL(baseUrl);
      pageUrl.searchParams.set('page', `${(i + 1) * 50}`);
      await page.goto(pageUrl.toString(), { waitUntil: 'domcontentloaded' });
      return page;
    });
  });

  return (
    await Promise.all([
      queryPokemonsInPage(page),
      ...pages.map((pagePromise) => pagePromise.then((p) => queryPokemonsInPage(p))),
    ])
  ).flat();

  async function queryPokemonsInPage(p: Page): Promise<PokemonData[]> {
    const pokemons = await p.evaluate(() => {
      const pokemonBlocks = Array.from(document.body.querySelectorAll('.pokemon_list > .pokemon'));
      return pokemonBlocks.map((block) => {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        const iconAndName = block.querySelector('dl.pokemon > dt')!;
        const iconImg = iconAndName.querySelector<HTMLImageElement>('img')!;
        const nameLink = iconAndName.querySelector<HTMLAnchorElement>('a')!;
        const types = Array.from(block.querySelectorAll<HTMLImageElement>('dl.pokemon > dd.type img')).map(
          (a) => a.alt!,
        );
        const abilities = Array.from(
          block.querySelectorAll<HTMLAnchorElement>('dl.tokusei_and_group > dd.tokusei a'),
        ).map((a) => a.textContent!.replace('*', ''));
        const stats = block.querySelector('dl.pokemon > dd.stats')!.textContent!;
        const [H, A, B, C, D, S] = /^(\d+)-(\d+)-(\d+)-(\d+)-(\d+)-(\d+)\s.*$/.exec(stats)!.slice(1);

        return {
          url: nameLink.href,
          name: nameLink.textContent!,
          icon: iconImg.src,
          types,
          abilities,
          baseStats: [
            parseInt(H, 10),
            parseInt(A, 10),
            parseInt(B, 10),
            parseInt(C, 10),
            parseInt(D, 10),
            parseInt(S, 10),
          ] as const,
        };
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      });
    });
    await p.close();
    return pokemons;
  }
}

async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.emulate(KnownDevices['iPhone X']);
  return page;
}

async function updatePokemons(items: PokemonData[]) {
  const filePath = path.resolve(dataDir, 'pokemons.generated.ts');
  const lastUpdatedAt = new Date().toISOString();
  const content = `export default ${JSON.stringify({ items, lastUpdatedAt }, null, 2)} as const;\n`;
  await writeFile(filePath, content);
}

async function main() {
  console.time('main');
  const pokemons = await fetchAllPokemons();
  console.log(`Fetched ${pokemons.length} pokemons.`);
  await updatePokemons(pokemons);
  console.timeEnd('main');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
