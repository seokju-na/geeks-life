import fse from 'fs-extra';
import path from 'path';
import { NativeEmoji } from '../../core/domain';

export class EmojiService {
  public readonly nativeEmojiUrl = path.join(__dirname, 'assets/native-emojis.json');
  private nativeEmoji: NativeEmoji[] | null = null;

  async readNativeEmojis() {
    if (this.nativeEmoji !== null) {
      return this.nativeEmoji;
    }

    try {
      const data: Record<string, string> = await fse.readJson(this.nativeEmojiUrl, {
        throws: true,
      });

      this.nativeEmoji = Object.entries(data).map(([key, char]) => ({
        type: 'native',
        key,
        char,
      }));

      return this.nativeEmoji;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async readEmojis() {
    const [native] = await Promise.all([this.readNativeEmojis()]);

    return {
      native,
    } as const;
  }
}
