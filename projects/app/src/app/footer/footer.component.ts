import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';

declare const twttr: { ready: () => void };

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <div class="flex flex-col items-start gap-y-2 text-gray-600 text-xs py-1">
      <!-- <div class="h-5">
        <a class="twitter-share-button" href="https://twitter.com/intent/tweet?{{ twitterShareParams }}"> Tweet</a>
      </div> -->
      <div>
        <p>
          ポケットモンスター・ポケモン・Pokémonは任天堂・クリーチャーズ・ゲームフリークの登録商標です。
          当サイトは個人ファンサイトであり、株式会社ポケモン他企業様とは一切関係ありません。
          また、このサイトで使用しているポケモンのデータは、<a href="https://yakkun.com/">ポケモン徹底攻略</a
          >様で公開されているものを使用しています。下記はサイト独自の内容にのみ関する著作権を示すものです。
        </p>
      </div>
      <p>&copy; 2022 <a href="https://github.com/lacolaco">@lacolaco</a></p>
    </div>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements AfterViewInit {
  get twitterShareParams() {
    return new URLSearchParams({
      hashtags: 'pokemonbattletools',
    }).toString();
  }

  ngAfterViewInit() {
    twttr?.ready();
  }
}
