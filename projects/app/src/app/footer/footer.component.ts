import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <div class="rows">
      <p>
        ポケットモンスター・ポケモン・Pokémonは任天堂・クリーチャーズ・ゲームフリークの登録商標です。
        当サイトは個人ファンサイトであり、株式会社ポケモン他企業様とは一切関係ありません。
      </p>
      <p>
        また、このサイトで使用しているポケモンのデータは、<a href="https://yakkun.com/">ポケモン徹底攻略</a
        >様で公開されているものを使用しています。下記はサイト独自の内容にのみ関する著作権を示すものです。
      </p>

      <p>&copy; 2022 <a href="https://github.com/lacolaco">@lacolaco</a></p>
    </div>
  `,
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
