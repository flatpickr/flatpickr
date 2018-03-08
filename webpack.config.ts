import l10n from "./webpack.config.l10n";
import { main, unminified } from "./webpack.config.main";
import {
  minified as minifiedCSS,
  unminified as unminifiedCSS,
} from "./webpack.config.style";

import plugins from "./webpack.config.plugins";

export default [main, unminified, l10n, minifiedCSS, unminifiedCSS, ...plugins];
