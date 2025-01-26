
import Swiper from 'swiper';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
Swiper.use([Navigation, Pagination, EffectCoverflow]);

const swiper = new Swiper(".swipr_world", {
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: true,
  initialSlide: 1,
  loop: true,
  autoplay: true,
  effect: 'coverflow', // カバーフロー効果を使用
  coverflowEffect: {
    rotate: 50, // スライドの回転角度
    stretch: 0, // スライド間の距離
    depth: 100, // カメラ距離に応じた奥行き
    modifier: 1, // 効果強度
    slideShadows: true, // スライドシャドウの有無
  },
  modules: [Navigation, Pagination],
  breakpoints: {
    900: {
      slidesPerView: 1.8,
      spaceBetween: 60,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});


// 衣装

const swiperCostume = new Swiper(".swipr_costume", {
  slidesPerView: 1,        // 1枚ずつ表示
  spaceBetween: 0,         // スライド間のスペース
  loop: true,              // ループを有効化
  pagination: {
    el: ".swiper-pagination",
    bulletClass: "custom-bullet",              // カスタムクラスを指定
    bulletActiveClass: "custom-bullet-active", // アクティブ用クラス
    clickable: true,
  },
});


// youtube
const API_KEY = 'AIzaSyAcOX7slshnepoVjqRcnbWmNyoXJ0CiI38'; // 取得したAPIキーを入力
const CHANNEL_ID = 'UCVqfD_FvaVtuuZCMEsgt5Ww';

async function getSubscriberCount() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const subscriberCount = data.items[0].statistics.subscriberCount;
      return subscriberCount;
    } else {
      console.error('チャンネル情報が見つかりませんでした。');
      return null;
    }
  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    return null;
  }
}

// 非同期関数の結果を代入
async function updateSubscriberCount() {
  const subscriberCount = await getSubscriberCount(); // 非同期処理を待つ
  const element = document.querySelector('.subscribes_js');

  if (element && subscriberCount !== null) {
    setTimeout(function () {
      $('.odometer').html(subscriberCount);
    }, 1000);
  } else if (element) {
    element.textContent = '登録者数を取得できませんでした。';
  }
}

// Intersection Observerを設定
function setupObserver() {
  const target = document.querySelector('.subscribes_js');

  if (target) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateSubscriberCount(); // 要素が表示されたら実行
          observer.unobserve(target); // 1回実行後、監視を解除
        }
      });
    });

    observer.observe(target); // 監視を開始
  }
}

document.addEventListener('DOMContentLoaded', setupObserver);




// タイピング
// itypedの初期化処理
function initTypingEffect() {
  const target = document.querySelector(".ityped_js");

  if (target) {
    ityped.init(target, {
      strings: ['チャンネル登録者数'],
      loop: false
    });
  }
}

// Intersection Observerを設定
function setupTypingObserver() {
  const target = document.querySelector(".ityped_js");

  if (target) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          initTypingEffect(); // 要素が表示されたら実行
          observer.unobserve(target); // 1回実行後、監視を解除
        }
      });
    });

    observer.observe(target); // 監視を開始
  }
}
document.addEventListener('DOMContentLoaded', setupTypingObserver);







// パーティクルの設定を初期化
particlesJS("particles", {
  particles: {
    number: {
      value: 80, // パーティクルの数
      density: {
        enable: true, // 密度によるパーティクル数の調整を有効化
        value_area: 800, // 密度のエリア範囲
      },
    },
    color: {
      value: "#ffffff", // パーティクルの色（白）
    },
    shape: {
      type: "circle", // パーティクルの形状（円）
      stroke: {
        width: 0, // 輪郭の幅
        color: "#000000", // 輪郭の色
      },
      polygon: {
        nb_sides: 5, // ポリゴンの辺の数
      },
      image: {
        src: "img/github.svg", // パーティクルに使用する画像
        width: 100, // 画像の幅
        height: 100, // 画像の高さ
      },
    },
    opacity: {
      value: 1, // パーティクルの不透明度
      random: true, // 不透明度をランダム化
      anim: {
        enable: true, // 不透明度アニメーションを有効化
        speed: 1, // アニメーション速度
        opacity_min: 0, // 不透明度の最小値
        sync: false, // 全パーティクルのアニメーションを同期しない
      },
    },
    size: {
      value: 3, // パーティクルのサイズ
      random: true, // サイズをランダム化
      anim: {
        enable: false, // サイズアニメーションを無効化
        speed: 4, // アニメーション速度
        size_min: 0.3, // サイズの最小値
        sync: false, // サイズアニメーションを同期しない
      },
    },
    line_linked: {
      enable: false, // パーティクル間の線を無効化
      distance: 150, // 線を引く最大距離
      color: "#ffffff", // 線の色
      opacity: 0.4, // 線の不透明度
      width: 1, // 線の幅
    },
    move: {
      enable: true, // パーティクルの移動を有効化
      speed: 1, // 移動速度
      direction: "none", // 移動方向（指定なし）
      random: true, // 移動方向をランダム化
      straight: false, // 直線移動を無効化
      out_mode: "out", // 画面外に出たパーティクルを削除
      bounce: false, // 画面端でのバウンドを無効化
      attract: {
        enable: false, // パーティクル同士の引力を無効化
        rotateX: 600, // X軸方向の回転
        rotateY: 600, // Y軸方向の回転
      },
    },
  },
  retina_detect: true, // Retinaディスプレイ対応を有効化
});

// パーティクルのカウントやパフォーマンスをモニタリング
var count_particles, stats, update;

// パフォーマンスモニタリング用のStats.jsオブジェクトを作成
stats = new Stats();
stats.setMode(0); // モード0はフレームレート表示
stats.domElement.style.position = "absolute";
stats.domElement.style.left = "0px";
stats.domElement.style.top = "0px";
document.body.appendChild(stats.domElement);

// パーティクルの数を表示する要素を取得
count_particles = document.querySelector(".js-count-particles");

// パーティクルの更新処理
update = function () {
  stats.begin(); // パフォーマンス計測開始
  stats.end(); // パフォーマンス計測終了

  // パーティクル数を更新
  if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) {
    count_particles.innerText = window.pJSDom[0].pJS.particles.array.length;
  }
  requestAnimationFrame(update); // 次フレームで再実行
};

// 初回の更新処理を呼び出し
requestAnimationFrame(update);
