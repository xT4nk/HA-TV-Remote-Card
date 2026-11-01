// ═════════════════════════════════════════════════════════════════════════
//  glass-tv-remote-card.js — full-screen TV remote for Home Assistant
// ═════════════════════════════════════════════════════════════════════════
//  Lovelace custom card: vanilla Web Component, ES module, no build step,
//  no dependencies. "Liquid glass" look: VOL/CH rockers, mute / channel list,
//  round d-pad with a glass OK button, number pad that replaces the d-pad
//  ("123" toggle), bottom row back / home / 123 / exit / power, and app
//  shortcuts on top.
//
//  Built for a phone in portrait. Out of the box it targets a Samsung TV
//  (Samsung Smart TV integration, KEY_* codes via remote.send_command), but
//  every key, the service used to send it and every shortcut can be changed
//  from YAML: see README.md.
//
//  At runtime it only uses the `hass` object (no token, no polling).
// ═════════════════════════════════════════════════════════════════════════

const VERSION = '1.0.0';

// Service logos (monochrome SVG; Netflix and Prime Video from Simple Icons, CC0;
// Disney+ from Wikimedia Commons), drawn on the brand colour like app icons.
// Logos are trademarks of their owners and are used only to identify the service.
const BRAND = {
  netflix:{bg:'#000', fg:'#e50914', vb:'0 0 24 24', pad:20, d:["M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.312 4.715-.398v-9.22z"]},
  prime:  {bg:'#00a8e1', fg:'#fff', vb:'0 0 24 24', pad:10, d:["M0 9.508c0-.043.01-.073.028-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.127.101l.032.119c.091-.088.202-.159.33-.21a1.04 1.04 0 0 1 .396-.079c.294 0 .528.109.7.326.171.217.257.51.257.88 0 .254-.042.475-.127.665-.086.19-.201.335-.347.437a.85.85 0 0 1-.502.154c-.125 0-.243-.02-.355-.06a.857.857 0 0 1-.288-.164v1.003c0 .043-.008.073-.025.09-.017.016-.046.025-.09.025H.115c-.04 0-.068-.009-.086-.025-.019-.017-.028-.047-.028-.09zm1.113.32a.868.868 0 0 0-.447.124v1.206a.834.834 0 0 0 .447.124c.17 0 .296-.058.376-.174.081-.117.121-.3.121-.55 0-.254-.04-.439-.118-.555-.08-.116-.206-.174-.379-.174zm2.248-.087c.121-.134.236-.23.344-.286a.733.733 0 0 1 .345-.085h.063c.043 0 .073.009.092.025.018.017.027.047.027.09v.385c0 .04-.008.068-.025.087-.017.018-.046.027-.089.027a.923.923 0 0 1-.082-.004 1.369 1.369 0 0 0-.383.025c-.1.02-.186.045-.256.076v1.54c0 .04-.008.069-.025.087-.016.018-.046.028-.089.028h-.437c-.04 0-.069-.01-.087-.028-.018-.018-.028-.047-.028-.087V9.508c0-.043.01-.073.028-.09.018-.017.047-.025.087-.025h.328c.07 0 .112.034.128.1zm1.526-.71a.396.396 0 0 1-.278-.096.338.338 0 0 1-.105-.262c0-.11.035-.197.105-.26a.395.395 0 0 1 .278-.097c.116 0 .208.032.278.096.07.064.105.151.105.261a.34.34 0 0 1-.105.262.396.396 0 0 1-.278.096zm-.333.477c0-.043.01-.073.027-.09.019-.017.048-.025.087-.025h.438c.043 0 .072.008.089.025s.025.047.025.09v2.113c0 .04-.008.069-.025.087-.017.018-.046.028-.09.028h-.437c-.04 0-.068-.01-.087-.028-.018-.018-.027-.047-.027-.087zm1.837.11c.161-.107.306-.183.435-.227.13-.045.263-.067.4-.067.273 0 .466.098.579.294.155-.104.3-.18.438-.225.137-.046.278-.069.424-.069.213 0 .377.06.495.179.117.12.175.286.175.5v1.618c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.04 0-.068-.008-.086-.027-.018-.018-.028-.047-.028-.087V10.15c0-.208-.092-.312-.278-.312-.164 0-.33.04-.497.119v1.664c0 .04-.008.069-.025.087-.017.019-.046.027-.09.027h-.437c-.04 0-.068-.008-.086-.027-.019-.018-.028-.047-.028-.087V10.15c0-.208-.093-.312-.278-.312-.17 0-.337.04-.502.123v1.66c0 .04-.008.069-.025.087-.017.019-.046.027-.089.027h-.438c-.039 0-.068-.008-.086-.027-.018-.018-.027-.047-.027-.087V9.508c0-.043.009-.073.027-.09.018-.017.047-.025.086-.025h.329c.07 0 .112.034.128.101zm4.387 1.16a1.81 1.81 0 0 1-.451-.05c.018.204.08.35.185.44.105.088.263.132.476.132.085 0 .168-.005.249-.016a3.08 3.08 0 0 0 .362-.078.143.143 0 0 1 .023-.002c.052 0 .078.035.078.105v.211c0 .049-.007.083-.02.103a.169.169 0 0 1-.08.053 1.953 1.953 0 0 1-.708.128c-.377 0-.666-.103-.868-.312-.203-.207-.304-.505-.304-.893 0-.398.104-.71.31-.935.207-.227.494-.34.862-.34.283 0 .504.069.664.206a.69.69 0 0 1 .24.55c0 .23-.087.403-.258.52-.172.119-.425.177-.76.177zm.064-.99c-.292 0-.46.18-.506.54.122.025.257.037.406.037.155 0 .267-.024.337-.071.07-.047.105-.12.105-.218 0-.193-.114-.289-.342-.289zm2.948 1.946a.21.21 0 0 1-.075-.011.119.119 0 0 1-.05-.037.274.274 0 0 1-.038-.071l-.777-2.04a1.863 1.863 0 0 1-.023-.063.162.162 0 0 1-.009-.05c0-.047.03-.07.091-.07h.454c.049 0 .084.01.107.028.023.018.04.049.052.092l.468 1.622.477-1.622a.175.175 0 0 1 .052-.092c.023-.018.058-.027.107-.027h.44c.061 0 .091.022.091.068a.16.16 0 0 1-.009.05l-.022.065-.777 2.039a.274.274 0 0 1-.039.07.122.122 0 0 1-.047.038.207.207 0 0 1-.078.01zm2.02-2.703a.393.393 0 0 1-.277-.097.338.338 0 0 1-.105-.26c0-.11.035-.198.105-.262a.393.393 0 0 1 .277-.096c.115 0 .207.032.277.096.07.064.104.151.104.261 0 .11-.034.197-.104.261a.393.393 0 0 1-.277.097zm-.218 2.703c-.04 0-.068-.01-.086-.028-.019-.018-.028-.047-.028-.087V9.507c0-.043.01-.072.028-.09.018-.016.047-.024.086-.024h.436c.042 0 .072.008.089.025.016.017.024.046.024.09v2.111c0 .04-.008.07-.024.087-.017.019-.047.028-.09.028zm1.948.05a.869.869 0 0 1-.513-.153.97.97 0 0 1-.334-.426 1.6 1.6 0 0 1-.116-.63c0-.38.09-.682.268-.91a.856.856 0 0 1 .709-.341.98.98 0 0 1 .622.206V8.458c0-.043.01-.073.027-.09.018-.016.047-.025.087-.025h.436c.042 0 .071.009.088.025.017.017.025.047.025.09v3.161c0 .04-.008.07-.025.087-.017.019-.046.028-.088.028h-.364a.135.135 0 0 1-.084-.023.137.137 0 0 1-.043-.078l-.027-.105a.958.958 0 0 1-.668.256zm.218-.504a.762.762 0 0 0 .418-.128v-1.21a.872.872 0 0 0-.45-.114c-.16 0-.28.06-.358.18-.08.121-.118.304-.118.548 0 .245.041.426.124.546.084.119.212.178.384.178zm2.588-.51c-.169 0-.315-.016-.44-.05.018.201.078.345.18.432.103.087.257.13.465.13.083 0 .164-.005.242-.016a2.997 2.997 0 0 0 .354-.076.135.135 0 0 1 .022-.002c.05 0 .075.035.075.103v.207c0 .048-.007.082-.02.101a.165.165 0 0 1-.077.052 1.895 1.895 0 0 1-.69.126c-.367 0-.65-.102-.846-.306-.197-.204-.296-.496-.296-.876 0-.39.1-.695.302-.917.202-.222.482-.333.84-.333.276 0 .492.068.647.203a.678.678 0 0 1 .234.539c0 .225-.084.395-.251.51-.168.115-.415.173-.74.173zm.063-.97c-.285 0-.45.176-.494.53.119.024.25.036.396.036.15 0 .26-.024.329-.07.068-.046.102-.117.102-.213 0-.19-.111-.284-.333-.284zm2.442 2.003c-.36 0-.642-.11-.845-.328-.203-.218-.304-.523-.304-.914 0-.388.101-.691.304-.91.203-.218.485-.327.845-.327s.642.109.845.327c.203.219.304.522.304.91 0 .39-.101.696-.304.914-.203.218-.485.328-.845.328zm0-.514c.318 0 .477-.242.477-.728 0-.483-.16-.724-.477-.724-.318 0-.477.241-.477.724 0 .486.16.728.477.728zm-6.844 1.886c.405-.306.944-.408 1.39-.408.418 0 .756.09.828.185.15.2-.039 1.584-.775 2.244-.112.102-.22.047-.17-.087.166-.442.536-1.436.36-1.677-.175-.242-1.158-.115-1.6-.058-.068.008-.107-.02-.112-.061v-.023c.004-.036.03-.078.079-.115zm-10.184-.172a.105.105 0 0 1 .106-.091c.027 0 .057.009.089.028a11.778 11.778 0 0 0 6.194 1.772c1.52 0 3.19-.34 4.726-1.043.232-.105.426.164.2.346-1.371 1.09-3.359 1.67-5.07 1.67-2.397 0-4.557-.956-6.191-2.547a.173.173 0 0 1-.054-.097Z"]},
  disney: {bg:'linear-gradient(160deg,#1b3d93,#06123f)', fg:'#fff', vb:'60 60 921 445', pad:9, d:["M735.8 365.7 C721.4 369 683.5 370.9 683.5 370.9 L678.7 385.9 C678.7 385.9 697.6 384.3 711.4 385.7 711.4 385.7 715.9 385.2 716.4 390.8 716.6 396 716 401.6 716 401.6 716 401.6 715.7 405 710.9 405.8 705.7 406.7 670.1 408 670.1 408 L664.3 427.5 C664.3 427.5 662.2 432 667 430.7 671.5 429.5 708.8 422.5 713.7 423.5 718.9 424.8 724.7 431.7 723 438.1 721 445.9 683.8 469.7 661.1 468 661.1 468 649.2 468.8 639.1 452.7 629.7 437.4 642.7 408.3 642.7 408.3 642.7 408.3 636.8 394.7 641.1 390.2 641.1 390.2 643.7 387.9 651.1 387.3 L660.2 368.4 C660.2 368.4 649.8 369.1 643.6 361.5 637.8 354.2 637.4 350.9 641.8 348.9 646.5 346.6 689.8 338.7 719.6 339.7 719.6 339.7 730 338.7 738.9 356.7 738.8 356.7 743.2 364 735.8 365.7 Z M623.7 438.3 C619.9 447.3 609.8 456.9 597.3 450.9 584.9 444.9 565.2 404.6 565.2 404.6 565.2 404.6 557.7 389.6 556.3 389.9 556.3 389.9 554.7 387 553.7 403.4 552.7 419.8 553.9 451.7 547.4 456.7 541.2 461.7 533.7 459.7 529.8 453.8 526.3 448 524.8 434.2 526.7 410 529 385.8 534.6 360 541.8 351.9 549 343.9 554.8 349.7 557 351.8 557 351.8 566.6 360.5 582.5 386.1 L585.3 390.8 C585.3 390.8 599.7 415 601.2 414.9 601.2 414.9 602.4 416 603.4 415.2 604.9 414.8 604.3 407 604.3 407 604.3 407 601.3 380.7 588.2 336.1 588.2 336.1 586.2 330.5 587.6 325.3 588.9 320 594.2 322.5 594.2 322.5 594.2 322.5 614.6 332.7 624.4 365.9 634.1 399.4 627.5 429.3 623.7 438.3 Z M523.5 353 C521.8 356.4 520.8 361.3 512.2 362.6 512.2 362.6 429.9 368.2 426 374 426 374 423.1 377.4 427.6 378.4 432.1 379.3 450.7 381.8 459.7 382.3 469.3 382.4 501.7 382.7 513.3 397.2 513.3 397.2 520.2 404.1 519.9 419.7 519.6 435.7 516.8 441.3 510.6 447.1 504.1 452.5 448.3 477.5 412.3 439.1 412.3 439.1 395.7 420.6 418 406.6 418 406.6 434.1 396.9 475 408.3 475 408.3 487.4 412.8 486.8 417.3 486.1 422.1 476.6 427.2 462.8 426.9 449.4 426.5 439.6 420.1 441.5 421.1 443.3 421.8 427.1 413.3 422.1 419.1 417.1 424.4 418.3 427.7 423.2 431 435.7 438.1 484 435.6 498.4 419.6 498.4 419.6 504.1 413.1 495.4 407.8 486.7 402.8 461.8 399.8 452.1 399.3 442.8 398.8 408.2 399.4 403.2 390.2 403.2 390.2 398.2 384 403.7 366.4 409.5 348 449.8 340.9 467.2 339.3 467.2 339.3 515.1 337.6 523.9 347.4 523.8 347.4 525 349.7 523.5 353 Z M387.5 460.9 C381.7 465.2 369.4 463.3 365.9 458.5 362.4 454.2 361.2 437.1 361.9 410.3 362.6 383.2 363.2 349.6 369 344.3 375.2 338.9 379 343.6 381.4 347.3 384 350.9 387.1 354.9 387.8 363.4 388.4 371.9 390.4 416.5 390.4 416.5 390.4 416.5 393 456.7 387.5 460.9 Z M400 317.1 C383.1 322.7 371.5 320.8 361.7 316.6 357.4 324.1 354.9 326.4 351.6 326.9 346.8 327.4 342.5 319.7 341.7 317.2 340.9 315.3 338.6 312.1 341.4 304.5 331.8 295.9 331.1 284.3 332.7 276.5 335.1 267.5 351.3 233.3 400.6 229.3 400.6 229.3 424.7 227.5 428.8 240.4 L429.5 240.4 C429.5 240.4 452.9 240.5 452.4 261.3 452.1 282.2 426.4 308.2 400 317.1 Z M354 270.8 C349 278.8 348.8 283.6 351.1 286.9 356.8 278.2 367.2 264.5 382.5 254.1 370.7 255.1 360.8 260.2 354 270.8 Z M422.1 257.4 C406.6 259.7 382.6 280.5 371.2 297.5 388.7 300.7 419.6 299.5 433.3 271.6 433.2 271.6 439.8 254.3 422.1 257.4 Z M842.9 418.5 C833.6 434.7 807.5 468.5 772.7 460.6 761.2 488.5 751.6 516.6 746.1 558.8 746.1 558.8 744.9 567 738.1 564.1 731.4 561.7 720.2 550.5 718 535 715.6 514.6 724.7 480.1 743.2 440.6 737.8 431.8 734.1 419.2 737.3 401.3 737.3 401.3 742 368.1 775.3 338.1 775.3 338.1 779.3 334.6 781.6 335.7 784.2 336.8 783 347.6 780.9 352.8 778.8 358 763.9 383.8 763.9 383.8 763.9 383.8 754.6 401.2 757.2 414.9 774.7 388 814.5 333.7 839.2 350.8 847.5 356.7 851.3 369.6 851.3 383.5 851.2 395.8 848.3 408.8 842.9 418.5 Z M835.7 375.9 C835.7 375.9 834.3 365.2 823.9 377 814.9 386.9 798.7 405.6 785.6 430.9 799.3 429.4 812.5 421.9 816.5 418.1 823 412.3 838.1 396.7 835.7 375.9 Z M350.2 389.5 C348.3 413.7 339 454.4 273.1 474.5 229.6 487.6 188.5 481.3 166.1 475.6 165.6 484.5 164.6 488.3 163.2 489.8 161.3 491.7 147.1 499.9 139.3 488.3 135.8 482.8 134 472.8 133 463.9 82.6 440.7 59.4 407.3 58.5 405.8 57.4 404.7 45.9 392.7 57.4 378 68.2 364.7 103.5 351.4 135.3 346 136.4 318.8 139.6 298.3 143.4 288.9 148 278 153.8 287.8 158.8 295.2 163 300.7 165.5 324.4 165.7 343.3 186.5 342.3 198.8 343.8 222 348 252.2 353.5 272.4 368.9 270.6 386.4 269.3 403.6 253.5 410.7 247.5 411.2 241.2 411.7 231.4 407.2 231.4 407.2 224.7 404 230.9 401.2 239 397.7 247.8 393.4 245.8 389 245.8 389 242.5 379.4 203.3 372.7 164.3 372.7 164.1 394.2 165.2 429.9 165.7 450.7 193 455.9 213.4 454.9 213.4 454.9 213.4 454.9 313 452.1 316 388.5 319.1 324.8 216.7 263.7 141 244.3 65.4 224.5 22.6 238.3 18.9 240.2 14.9 242.2 18.6 242.8 18.6 242.8 18.6 242.8 22.7 243.4 29.8 245.8 37.3 248.2 31.5 252.1 31.5 252.1 18.6 256.2 4.1 253.6 1.3 247.7 -1.5 241.8 3.2 236.5 8.6 228.9 14 220.9 19.9 221.2 19.9 221.2 113.4 188.8 227.3 247.4 227.3 247.4 334 301.5 352.2 364.9 350.2 389.5 Z M68 386.2 C57.4 391.4 64.7 398.9 64.7 398.9 84.6 420.3 109.1 433.7 132.4 442 135.1 405.1 134.7 392.1 135 373.5 98.6 376 77.6 381.8 68 386.2 Z", "M1040.9 378.6 L1040.9 391.8 C1040.9 394.7 1038.6 397 1035.7 397 L972.8 397 C972.8 400.3 972.9 403.2 972.9 405.9 972.9 425.4 972.1 441.3 970.2 459.2 969.9 461.9 967.7 463.9 965.1 463.9 L951.5 463.9 C950.1 463.9 948.8 463.3 947.9 462.3 947 461.3 946.5 459.9 946.7 458.5 948.6 440.7 949.5 425 949.5 405.9 949.5 403.1 949.5 400.2 949.4 397 L887.2 397 C884.3 397 882 394.7 882 391.8 L882 378.6 C882 375.7 884.3 373.4 887.2 373.4 L948.5 373.4 C947.2 351.9 944.6 331.2 940.4 310.2 940.2 308.9 940.5 307.6 941.3 306.6 942.1 305.6 943.3 305 944.6 305 L959.3 305 C961.6 305 963.5 306.6 964 308.9 968.1 330.6 970.7 351.7 972 373.4 L1035.7 373.4 C1038.5 373.4 1040.9 375.8 1040.9 378.6 Z", "M955.3 273.9 C922.8 194 867.9 125.9 796.5 76.9 723.4 26.8 637.7 0.3 548.7 0.3 401.5 0.3 264.9 73.4 183.4 195.9 182.5 197.2 182.3 198.9 182.8 200.4 183.3 202 184.5 203.1 186 203.6 L197.4 207.5 C198.1 207.7 198.8 207.8 199.4 207.8 201.5 207.8 203.5 206.7 204.7 205 242.1 150 292.7 104.3 351.1 72.7 411.4 40.1 479.7 22.8 548.6 22.8 631.9 22.8 712.2 47.4 781 93.8 848.1 139.1 900.2 202.4 931.7 276.7 932.6 278.9 934.8 280.4 937.2 280.4 L950.8 280.4 C952.4 280.4 953.9 279.6 954.7 278.3 955.7 277 955.9 275.4 955.3 273.9 Z M199.4 204.4 C199.1 204.4 198.8 204.3 198.5 204.2 198.8 204.3 199.1 204.4 199.4 204.4 L199.6 204.4 C199.6 204.4 199.5 204.4 199.4 204.4 Z M934.4 278.6 C934.7 278.8 935 279 935.3 279.1 935 278.9 934.7 278.8 934.4 278.6 Z"]},
};

// Logical buttons → key codes. Defaults are Samsung (samsungtv integration).
// Override any of them with `keys:` in the card config; set one to null to hide the button.
const DEFAULT_KEYS = {
  power:'KEY_POWER', vol_up:'KEY_VOLUP', vol_down:'KEY_VOLDOWN', mute:'KEY_MUTE',
  ch_up:'KEY_CHUP', ch_down:'KEY_CHDOWN', ch_list:'KEY_CH_LIST',
  up:'KEY_UP', down:'KEY_DOWN', left:'KEY_LEFT', right:'KEY_RIGHT', ok:'KEY_ENTER',
  back:'KEY_RETURN', home:'KEY_HOME', exit:'KEY_EXIT',
  ...Object.fromEntries([0,1,2,3,4,5,6,7,8,9].map(n => [`num_${n}`, `KEY_${n}`])),
};

const ON_WAIT_MS = 25000;   // max wait for the TV to turn on before launching a shortcut
const APP_SETTLE_MS = 2500; // right after power-on the TV app service answers a bit late
const OFF_STATES = ['off','standby','unavailable','unknown'];

const CSS = `
  /* "Liquid glass": blurred panes with a rim highlight, capsule controls, amber as the only accent.
     Glass needs something behind it: the background has two soft lights (amber/blue). */
  :host{
    display:block; box-sizing:border-box;
    --ink:rgba(255,255,255,.96); --ink-2:rgba(235,240,250,.68); --ink-3:rgba(225,232,245,.46);
    --amber:#ffb35c; --amber-2:#ffd29a; --amber-ink:#2a1606; --alert:#ffb0a8;
    --rim:inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(255,255,255,.05), inset 0 0 0 .5px rgba(255,255,255,.10);
    color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  *{box-sizing:border-box}
  /* classes below set display explicitly: without this, [hidden] would not hide them */
  [hidden]{display:none !important}
  button{font:inherit;color:inherit;border:0;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent}
  button:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
  .tc{
    min-height:calc(100vh - var(--header-height,56px));
    display:flex; flex-direction:column; align-items:center;
    gap:14px; padding:14px 16px 28px;
    background:
      radial-gradient(60% 34% at 85% 4%, rgba(255,166,77,.42), transparent 70%),
      radial-gradient(70% 40% at 0% 62%, rgba(70,110,190,.36), transparent 70%),
      radial-gradient(50% 30% at 100% 100%, rgba(255,120,80,.18), transparent 70%),
      linear-gradient(180deg, #121722, #0a0d13);
  }
  /* material: blurred glass + highlight from above */
  .g{position:relative;isolation:isolate;
    background:linear-gradient(180deg, rgba(255,255,255,.115), rgba(255,255,255,.045));
    -webkit-backdrop-filter:blur(26px) saturate(185%); backdrop-filter:blur(26px) saturate(185%);
    box-shadow:var(--rim), 0 10px 30px rgba(0,0,0,.28), 0 1px 2px rgba(0,0,0,.2)}
  .g::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:-1;
    background:radial-gradient(120% 60% at 30% -10%, rgba(255,255,255,.14), transparent 60%)}
  .g-in{background:rgba(255,255,255,.07);box-shadow:inset 0 .5px 0 rgba(255,255,255,.12), inset 0 0 0 .5px rgba(255,255,255,.06)}

  /* header: TV name + state */
  .tc-h{display:flex;align-items:center;gap:10px;width:100%;max-width:360px;padding:0 4px}
  .tc-h .nm{flex:1;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;
    font-size:30px;font-weight:700;letter-spacing:-.03em;line-height:1.1}
  .tc-h .stt{display:flex;align-items:center;gap:6px;height:28px;padding:0 11px;border-radius:999px;font-size:13px;color:var(--ink-2)}
  .tc-h .dot{width:7px;height:7px;border-radius:50%;background:var(--ink-3)}
  .tc-h .dot.on{background:var(--amber);box-shadow:0 0 8px rgba(255,179,92,.8)}

  /* shortcuts: apps and sources */
  .apps{width:100%;max-width:360px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  /* the button IS the app icon: rounded square in the brand colour, glass highlight on top */
  .app{position:relative;aspect-ratio:1;border-radius:24px;overflow:hidden;display:grid;place-items:center;padding:0;
    box-shadow:0 8px 20px rgba(0,0,0,.35), inset 0 0 0 .5px rgba(255,255,255,.2);transition:transform .12s, filter .2s}
  .app::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
    background:linear-gradient(180deg, rgba(255,255,255,.2), transparent 42%)}
  .app svg{width:100%;height:100%;display:block}
  .app ha-icon{--mdc-icon-size:38px;color:var(--ink)}
  /* status (waking… / opening… / error): pill over the logo, only when needed */
  .app .as{position:absolute;left:6px;right:6px;bottom:6px;height:20px;border-radius:10px;display:none;place-items:center;
    font-size:10.5px;font-weight:600;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}
  .app.busy .as, .app.err .as{display:grid}
  .app:active{transform:scale(.95)}
  .app.busy .as{color:var(--amber-2)}
  .app.err .as{color:var(--alert)}

  .tv-remote{width:100%;max-width:360px;padding:16px;border-radius:36px;display:flex;flex-direction:column;gap:12px}

  /* capsule button */
  .btn{height:52px;min-width:44px;padding:0 14px;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:8px;
    background:rgba(255,255,255,.09);box-shadow:inset 0 .5px 0 rgba(255,255,255,.22), inset 0 0 0 .5px rgba(255,255,255,.08);
    font-weight:590;font-size:14.5px;transition:background .15s, transform .12s, color .15s}
  .btn ha-icon{--mdc-icon-size:21px}
  .btn:active, .rock button:active, .dpad .d:active{transform:scale(.94);color:var(--amber)}
  .btn:active{background:rgba(255,179,92,.16)}

  /* VOL / CH rockers */
  .rocker{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  .rock{display:grid;grid-template-columns:48px 1fr 48px;align-items:center;text-align:center;border-radius:999px;padding:4px}
  .rock button{height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform .12s, color .15s, background .15s}
  .rock button:active{background:rgba(255,179,92,.16)}
  .rock button ha-icon{--mdc-icon-size:22px}
  .k{font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-2)}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:10px}

  /* d-pad / number pad (one at a time) */
  .rstage{display:flex;justify-content:center}
  .dpad{position:relative;width:236px;height:236px;margin:4px auto;border-radius:50%}
  .dpad .d{position:absolute;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink-2);
    transition:transform .12s, color .15s}
  .dpad .d ha-icon{--mdc-icon-size:30px}
  .dpad .up{left:88px;top:4px} .dpad .dn{left:88px;bottom:4px} .dpad .lf{left:4px;top:88px} .dpad .rt{right:4px;top:88px}
  .dpad .ok{position:absolute;left:68px;top:68px;width:100px;height:100px;border-radius:50%;
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;font-weight:600;font-size:20px;
    transition:transform .12s}
  .dpad .ok:active{transform:scale(.95);background:linear-gradient(180deg, rgba(255,190,110,.5), rgba(255,160,70,.3))}

  .numpad{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:4px 0}
  .numpad .btn{height:56px;font-size:22px;font-weight:500}
  .numpad .numtoggle{color:var(--ink-2)}
  .numpad .ok{color:var(--amber-2);font-size:15px;font-weight:600}

  /* bottom row: back / home / 123 / exit / power */
  .keys{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
  .keys .btn{padding:0}
  .keys .n123{font-size:14px;font-weight:700}
  .keys .n123.on{background:linear-gradient(180deg, rgba(255,190,110,.95), rgba(255,160,70,.92));color:var(--amber-ink);
    box-shadow:inset 0 1px 0 rgba(255,240,210,.7), 0 6px 18px rgba(255,150,50,.28)}
  .keys .pw{color:var(--alert)}

  @media (prefers-reduced-motion:reduce){ .btn,.rock button,.dpad .d,.dpad .ok{transition:none} }
`;

// data-a = logical button name (see DEFAULT_KEYS)
const HTML = `
  <div class="tc">
    <div class="tc-h">
      <span class="nm">TV</span>
      <span class="stt g-in"><span class="dot"></span><span class="slbl">—</span></span>
    </div>
    <div class="apps" role="group" aria-label="Shortcuts"></div>
    <div class="tv-remote g">
      <div class="rocker">
        <div class="rock g-in">
          <button data-a="vol_down" aria-label="Volume down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="k">Vol</span>
          <button data-a="vol_up" aria-label="Volume up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
        <div class="rock g-in">
          <button data-a="ch_down" aria-label="Channel down"><ha-icon icon="mdi:minus"></ha-icon></button>
          <span class="k">Ch</span>
          <button data-a="ch_up" aria-label="Channel up"><ha-icon icon="mdi:plus"></ha-icon></button>
        </div>
      </div>
      <div class="pair">
        <button class="btn" data-a="mute"><ha-icon icon="mdi:volume-off"></ha-icon>Mute</button>
        <button class="btn" data-a="ch_list"><ha-icon icon="mdi:format-list-numbered"></ha-icon>Channels</button>
      </div>
      <div class="rstage">
        <div class="dpad g-in">
          <button class="d up" data-a="up" aria-label="Up"><ha-icon icon="mdi:chevron-up"></ha-icon></button>
          <button class="d lf" data-a="left" aria-label="Left"><ha-icon icon="mdi:chevron-left"></ha-icon></button>
          <button class="ok g" data-a="ok">OK</button>
          <button class="d rt" data-a="right" aria-label="Right"><ha-icon icon="mdi:chevron-right"></ha-icon></button>
          <button class="d dn" data-a="down" aria-label="Down"><ha-icon icon="mdi:chevron-down"></ha-icon></button>
        </div>
        <div class="numpad" hidden>
          ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="btn" data-a="num_${n}">${n}</button>`).join('')}
          <button class="btn numtoggle" aria-label="Back to arrows"><ha-icon icon="mdi:gamepad-circle-outline"></ha-icon></button>
          <button class="btn" data-a="num_0">0</button>
          <button class="btn ok" data-a="ok">OK</button>
        </div>
      </div>
      <div class="keys">
        <button class="btn" data-a="back" aria-label="Back"><ha-icon icon="mdi:keyboard-return"></ha-icon></button>
        <button class="btn" data-a="home" aria-label="Home"><ha-icon icon="mdi:home-outline"></ha-icon></button>
        <button class="btn n123 numtoggle" aria-label="Number pad">123</button>
        <button class="btn" data-a="exit" aria-label="Exit"><ha-icon icon="mdi:close"></ha-icon></button>
        <button class="btn pw" data-a="power" aria-label="Power"><ha-icon icon="mdi:power"></ha-icon></button>
      </div>
    </div>
  </div>
`;

class GlassTvRemoteCard extends HTMLElement {
  static getStubConfig(){ return {remote:'remote.tv', media_player:'media_player.tv'}; }

  setConfig(config){
    const c = config || {};
    const send = c.send || {};
    if(!c.remote && !send.target) throw new Error('glass-tv-remote-card: set `remote` (or `send.target`)');
    this._cfg = c;
    this._mediaId = c.media_player || null;
    this._name = c.name || 'TV';
    this._keys = {...DEFAULT_KEYS, ...(c.keys || {})};
    // how a key is sent: default remote.send_command {entity_id: remote, command: <key>}
    const [dom, svc] = (send.service || 'remote.send_command').split('.');
    this._send = {domain:dom, service:svc, field:send.field || 'command', target:send.target || c.remote, data:send.data || {}};
    this._shortcuts = Array.isArray(c.shortcuts) ? c.shortcuts : [];
    this._appService = c.app_service || 'rest_command.samsung_tv_launch_app';
    this._powerOn = c.power_on || {key:'power'};
    if(this._built){ this._root.innerHTML = ''; this._built = false; this._build(); this._sync(); }
  }

  connectedCallback(){
    // draw right away (even before HA passes `hass`) so the card is never empty
    if(!this._built) this._build();
    this._sync();
  }

  set hass(hass){
    this._hass = hass;
    if(!this._built) this._build();
    this._sync();
  }

  _build(){
    const root = this._root || (this._root = this.attachShadow({mode:'open'}));
    const style = document.createElement('style'); style.textContent = CSS;
    const wrap = document.createElement('div'); wrap.innerHTML = HTML;
    root.append(style, wrap);

    root.querySelector('.nm').textContent = this._name;

    const dial   = root.querySelector('.dpad');
    const numpad = root.querySelector('.numpad');
    const n123   = root.querySelector('.n123');
    let numMode = false;
    const apply = () => {                         // the digits replace ONLY the d-pad
      dial.hidden = numMode;
      numpad.hidden = !numMode;
      n123.classList.toggle('on', numMode);
      n123.setAttribute('aria-pressed', numMode);
    };
    root.querySelectorAll('.numtoggle').forEach(b => b.onclick = () => { numMode = !numMode; apply(); });
    apply();

    root.querySelectorAll('[data-a]').forEach(b => {
      const key = this._keys[b.dataset.a];
      if(key == null || key === false){ b.hidden = true; return; }   // key: null → button hidden
      b.onclick = () => { if(navigator.vibrate) navigator.vibrate(8); this._sendKey(key).catch(() => {}); };
    });
    // hide a rocker / the number-pad toggle when all its keys are gone
    root.querySelectorAll('.rock').forEach(r => { r.hidden = [...r.querySelectorAll('button')].every(b => b.hidden); });
    if(this._cfg.numpad === false || [0,1,2,3,4,5,6,7,8,9].every(n => this._keys[`num_${n}`] == null)) n123.hidden = true;

    const apps = root.querySelector('.apps');
    apps.hidden = !this._shortcuts.length;
    apps.style.gridTemplateColumns = `repeat(${Math.min(this._shortcuts.length, 4) || 1},1fr)`;
    for(const a of this._shortcuts){
      const b = document.createElement('button');
      // the button is the icon: logo on the brand colour, or an MDI icon on glass
      const br = typeof a.brand === 'object' ? a.brand : BRAND[a.brand];
      b.className = br ? 'app' : 'app g';
      if(br) b.style.background = br.bg;
      b.innerHTML = (br
        ? `<svg viewBox="${br.vb}" style="padding:${br.pad ?? 12}px" fill="${br.fg || '#fff'}" aria-hidden="true">${[].concat(br.d).map(d => `<path d="${d}"/>`).join('')}</svg>`
        : `<ha-icon icon="${a.icon || 'mdi:application'}"></ha-icon>`) + '<span class="as"></span>';
      b.setAttribute('aria-label', `Open ${a.name || 'shortcut'}`);
      b.onclick = () => this._launch(a, b);
      apps.append(b);
    }

    this._built = true;
  }

  _sync(){
    if(!this._built || !this._hass) return;   // no DOM or no hass yet
    const stt = this._root.querySelector('.stt');
    stt.hidden = !this._mediaId;
    if(!this._mediaId) return;
    const m = this._hass.states[this._mediaId];
    const on = m && !OFF_STATES.includes(m.state);
    this._root.querySelector('.dot').classList.toggle('on', !!on);
    this._root.querySelector('.slbl').textContent = !m ? 'unavailable' : (on ? 'on' : 'standby');
  }

  _sendKey(key){
    if(!this._hass) return Promise.resolve();   // HA has not passed `hass` yet
    const s = this._send;
    return this._hass.callService(s.domain, s.service, {entity_id:s.target, ...s.data, [s.field]:key});
  }

  _call(service, data){
    const [dom, svc] = service.split('.');
    return this._hass.callService(dom, svc, data || {});
  }

  _isOn(){ return this._hass?.states[this._mediaId]?.state === 'on'; }

  // ── shortcuts: wake the TV if needed, then run the shortcut ──
  async _launch(a, btn){
    if(!this._hass || btn.classList.contains('busy')) return;
    const sub = btn.querySelector('.as');
    const show = (cls, txt) => { btn.classList.remove('busy','err'); if(cls) btn.classList.add(cls); sub.textContent = txt; };
    if(navigator.vibrate) navigator.vibrate(8);
    try{
      if(this._mediaId && !this._isOn()){
        show('busy', 'waking…');
        // Samsung: media_player.turn_on (Wake-on-LAN) does NOT wake the TV from standby, the power key does
        const p = this._powerOn;
        if(p.service) await this._call(p.service, {entity_id:this._mediaId, ...(p.data || {})});
        else await this._sendKey(this._keys[p.key] || p.key);
        if(!await this._waitOn(ON_WAIT_MS)){ show('err', 'TV off'); return this._clearLater(show); }
        await new Promise(r => setTimeout(r, APP_SETTLE_MS));
      }
      show('busy', 'opening…');
      if(a.service) await this._call(a.service, a.data);
      else if(a.key) await this._sendKey(this._keys[a.key] || a.key);
      else if(a.source) await this._call('media_player.select_source', {entity_id:a.entity || this._mediaId, source:a.source});
      // Samsung: play_media type "app" answers OK but opens nothing on some models →
      // the TV's local REST API is called through a rest_command (see README)
      else if(a.app) await this._call(this._appService, {app:a.app});
      show(null, '');
    }catch(e){
      console.warn('glass-tv-remote-card: shortcut failed', a, e);
      show('err', 'failed');
      this._clearLater(show);
    }
  }

  _waitOn(ms){
    return new Promise(res => {
      const t0 = Date.now();
      const tick = () => {
        if(this._isOn()) return res(true);
        if(Date.now() - t0 > ms) return res(false);
        setTimeout(tick, 400);
      };
      tick();
    });
  }

  _clearLater(show){ setTimeout(() => show(null, ''), 4000); }

  getCardSize(){ return 10; }
}

customElements.define('glass-tv-remote-card', GlassTvRemoteCard);
window.customCards = window.customCards || [];
window.customCards.push({type:'glass-tv-remote-card', name:'Glass TV Remote', description:'Full-screen phone remote for TVs (Samsung by default, any TV via key mapping).'});
console.info(`%c GLASS-TV-REMOTE-CARD %c ${VERSION} `, 'background:#ffb35c;color:#2a1606;font-weight:700', 'background:#222;color:#fff');
