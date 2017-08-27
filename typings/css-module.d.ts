/**
 * (c) 2017 Hajime Yamasaki Vukelic
 * All rights reserved.
 */

// Use this type as follows:
//
//     const style = require<CSSModule>("./path.to.styl");
//

interface CSSModule {
  [klass: string]: string
}
