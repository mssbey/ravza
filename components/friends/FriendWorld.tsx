'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PF = "'Playfair Display',Georgia,serif"
const CO = "'Cormorant Garamond',Georgia,serif"
const IN = "'Inter',sans-serif"
const HW = "'Dancing Script', cursive"

const SEDA_PHOTOS = Array.from({length: 99}, (_, i) => i + 1)
  .filter(n => ![18, 19, 29, 36, 66].includes(n))
  .map(n => `/photos/friends/seda/${n}.jpg`)

const SEDA2_PHOTOS = [
  '/seda 2/ilk fotoğraf.jpeg',
  '/seda 2/WhatsApp Image 2026-06-21 at 18.36.14.jpeg',
  ...Array.from({length: 27}, (_, i) => i + 1)
    .filter(n => n !== 26)
    .map(n => `/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (${n}).jpeg`),
]

const CEMILE_PHOTOS = Array.from({length: 55}, (_, i) => i + 1)
  .filter(n => ![18, 22, 25, 26, 27].includes(n))
  .map(n => `/photos/friends/cemile/${n}.jpg`)

const ILAYDA_PHOTOS = Array.from({length: 100}, (_, i) => i + 1)
  .filter(n => ![4, 6, 11, 45, 60, 87].includes(n))
  .map(n => `/photos/friends/ilayda/${n}.jpg`)

/* ─────────────── Types ─────────────── */
interface LockedPhoto { file: string; caption: string; date: string }
interface DiaryEntry  { date: string; title: string; content: string }
interface VoiceEntry  { hint: string; audioSrc: string; duration: string }

interface FriendData {
  name: string; emoji: string; sectionTitle: string; mood: string
  color: string; glowRgb: string; bg: string; accent: string
  word: { text: string; color: string }
  message: string; voiceHints: string[]
  memories: Array<{ emoji: string; text: string; date: string }>
  secret: string; polaroidCaptions: string[]; polaroidImages?: string[]
  lockedAlbum?: { pin: string; photos: LockedPhoto[] }
  diary?: DiaryEntry[]
  voices?: VoiceEntry[]
  photos?: string[]
}

type FriendId = 'seda' | 'ilayda' | 'cemile'

/* ─────────────── FRIEND DATA ─────────────── */
const DATA: Record<FriendId, FriendData> = {
  seda: {
    name: 'Seda', emoji: '🌸', sectionTitle: 'Onun Güvenli Limanı',
    mood: 'Güven · Sıcaklık · Ev',
    color: '#FFD700', glowRgb: '255,215,0',
    bg: 'radial-gradient(ellipse at 40% 0%, rgba(60,40,0,.95) 0%, #000 65%)',
    accent: '#ffe87a',
    word: { text: 'GÜVEN', color: '#FFD700' },
    message: `Okulun ilk günü dikkatimi çok güzel bir kız çekmişti. Sıranın en önünde oturuyordun. Normalde belki fark etmeyeceğim bir noktadaydın ama nedense gözüm sende kalmıştı. Demek ki o gün içimde bir yerde, hayatımın en güzel dört yılını seninle geçireceğimi hissetmişim.\n\nO zamanlar birbirimize bu kadar bağlanacağımızı, beraber sayısız anı biriktireceğimizi bilmiyordum. Ama şimdi dönüp baktığımda iyi ki o gün yollarımız kesişmiş diyorum.\n\nYıllar sonra üniversite hayatımı düşündüğümde aklıma sınavlar, ödevler ya da notlar gelmeyecek. Beraber yürüdüğümüz yollar, attığımız kahkahalar, saatlerce süren sohbetlerimiz, sebepli sebepsiz ağlamalarımız ve en çok da birbirimize verdiğimiz o destekler, gazlar gelecek. Hayatımın en zor zamanlarında yanımda oldun, en mutlu anlarımda benimle sevindin. Bazen tek bir cümlenle, bazen sadece varlığınla bana güç verdin. Sadece sarılman, bakman bile yetti.\n\nSen olmasaydın bu dört yılım nasıl geçerdi gerçekten bilmiyorum. Belki de birçok şeyi bu kadar güzel hatırlamazdım. Çünkü üniversite benim için sadece bir okul olmadı; seninle birlikte büyüdüğüm, öğrendiğim ve unutulmaz anılar biriktirdiğim bir dönem oldu.\n\nBir gün dönüp bu satırları tekrar okursan şunu hatırla; hayatımın en güzel anlarında sen vardın. İyi ki karşıma çıktın, iyi ki dostum oldun, iyi ki her anımda yanımdaydın.\n\nHayat bizi nereye götürür bilmiyorum ama sen hep benimle ol istiyorum. Sayende gerçek arkadaşlıklar kurulabileceğini öğrendim. İyi ki vardın, iyi ki varsın kız kardeşim.\n\nSeni çok seviyorum. 🤍`,
    voiceHints: ['Sana söyleyemediklerim 🌸', 'O gün ne hissettim', 'Seni en çok ne zaman düşündüm'],
    memories: [],
    secret: 'Bu mesajı bulacağını biliyordum. Seni çok seviyorum.',
    polaroidCaptions: ['Seda&ben', 'O anı hatırlıyorum', 'Her zaman gülersin', 'Teşekkürler'],
    polaroidImages: [
      '/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (1).jpeg',
      '/seda 2/ilk fotoğraf.jpeg',
      '/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (2).jpeg',
      '/seda 2/WhatsApp Image 2026-06-21 at 18.36.14 (3).jpeg',
    ],

    /* 🔒 KİLİTLİ ALBÜM */
    lockedAlbum: {
      pin: '1234',
      photos: [
        { file:'/photos/friends/seda/locked/1.jpg', caption:'O güzel parti gecesi',    date:'2022' },
        { file:'/photos/friends/seda/locked/2.jpg', caption:'Barın ışıklarında',       date:'2022' },
        { file:'/photos/friends/seda/locked/3.jpg', caption:'Şişe ve gülüşler',        date:'2023' },
        { file:'/photos/friends/seda/locked/4.jpg', caption:'Shot anı',                date:'2023' },
        { file:'/photos/friends/seda/locked/5.jpg', caption:'Tuborg ve pembe kokteyl', date:'2023' },
      ],
    },

    /* 📔 GÜNLÜK */
    diary: [
      {
        date: '15 Nisan 2026',
        title: 'Hepimizin beklediği en unutulmaz o gün…',
        content: `Ertesi gün en kritik sınavımız olmasına rağmen bir sözümle hiç düşünmeden hemen benimle gelmeyi kabul ettin. Daha ne olsun dateimde bile birlikteydik. Ama sonrası daha güzel, daha unutulmaz, daha komikti.\n\nBirlikte ilk sabahlamamız. Bir işe de yarasaydı bari ahshshshsh.\n\nBuraya yazamıyorum ama çektiğimiz o videodaki o ilk kelime. Kızlar Seda…`,
      },
      {
        date: '15 Ekim',
        title: 'Yine biz…',
        content: `Yine biz ve yine bir günde yaşadığımız 50 farklı günden biri aslında bugün de. Sabah bir baktım ki bir istek. E tabi yine kabul ettim. Şaşırdık mı? Hayır.\n\nSonra sen tekrar aramıza hoşgeldi diye kahve ısmarlamıştın bana. Sonra da süslenip doğum günümüzü kutlamaya gitmiştik. Kutladığım en güzel doğum günüydü.\n\nSizinle daha nicesine girlssss ♥️`,
      },
      {
        date: '27 Haziran',
        title: "Musti'nin deyişiyle…",
        content: `"Seda cım 262'de en unutulmaz anın neydi?" Öylesine söylediğim bir şeydi aslında. Ama kankim koşa koşa yine bir şeyler halletme peşindeymiş.\n\nAbimin doğum gününde kendi doğum günümmüş gibi pasta üfledim ya. Bir de o pastayı yemeye çalışmıştık hope ta. Off en unutulmaz anlarımda ilk üç.\n\nİyi ki varsınız best couple.`,
      },
    ],

    /* 🎙 SES KAYITLARI */
    voices: [
      { hint:'Sana söyleyemediklerim 🌸', audioSrc:'/seda ses/seda ses1.ogg', duration:'' },
      { hint:'O gün ne hissettim',        audioSrc:'/seda ses/seda ses 2.mp3', duration:'' },
    ],

    photos: [...SEDA_PHOTOS, ...SEDA2_PHOTOS],
  },

  ilayda: {
    name: 'İlayda', emoji: '✨', sectionTitle: 'Birlikte Yazılan Hikayeler',
    mood: 'Macera · Kahkaha · Serbestlik',
    color: '#FF6B9D', glowRgb: '255,107,157',
    bg: 'radial-gradient(ellipse at 65% 0%, rgba(80,10,40,.95) 0%, #000 65%)',
    accent: '#ffc2d1',
    word: { text: 'KAHKAHA', color: '#FF6B9D' },
    message: `Seni ilk gördüğüm zaman, o soğuk ve sert duvarının altında sıcacık kalbinin en derin köşelerine dokunabildiğimi hissettim. İlk zamanlar hepimiz korkmuştuk; kanadı kırık kuşlar gibi nereye uçacağımızı, nasıl yol bulacağımızı bilmiyorduk. Yepyeni bir şehir, yepyeni insanlar ve hiç tanımadığımız bir hayat vardı karşımızda.\n\nZaman geçtikçe, anılarımızı ve hayatlarımızı paylaşmaya başladıkça kanatlarımız güçlendi. O zaman anladım ki benim ne zaman kanadım kırılsa, sen hep orada olacaksın; ne zaman yönümü kaybetsem elimi tutacaksın. Seni mutlulukla ararken de benimle mutlu oldun, üzülerek aradığımda da üzüntümü yaşadın. Bu hayatta böyle bir arkadaşlığa sahip olduğum için kendimi çok ama çok şanslı hissediyorum. Bana dostluğun en nadide, en ulaşılması güzel şekilde yaşattın. Birlikte güldüğümüz, dertleştiğimiz ve bazen tek bir bakışla bile birbirimizi anladığımız o kadar güzel anılar biriktirdik ki. Zaten birebir de çok benziyoruz. Üstelik aynı gün doğmuşuz — bundan daha güzel bir tesadüf olabilir mi?\n\nVe Ravza'm, unutma ki sen beni ne zaman arasan, ne zaman ihtiyaç duysan, ben nerede olursam olayım her zaman yanında olurum. Telefonunu her zaman açarım ve senin için elimden gelen ne varsa yaparım. Çünkü sen benim sadece arkadaşım değil, kız kardeşimsin. Şehirler değişse de, hayat bizi farklı yerlere savursa da aramızdaki bağın hiç değişmeyeceğini biliyorum.\n\nİyi ki varsın. İyi ki yollarımız kesişmiş. İyi ki seni tanımışım. Seni çok seviyorum. ❤️`,
    voiceHints: ['O seyahati hiç unutmadım ✨', 'Seninle güldüğüm en çılgın an', 'Seni özlediğimde ne dinlerim'],
    memories: [],
    secret: 'Eğer bunu okuyorsan, bil ki en çok senin yanında kahkaha attım.',
    polaroidCaptions: ['İlayda&ben', 'O macera', 'Her yerde güleriz', 'Özgürlük'],
    polaroidImages: [
      '/ilayda/WhatsApp Image 2026-06-21 at 15.49.55.jpeg',
      '/ilayda/WhatsApp Image 2026-06-21 at 15.49.55 (1).jpeg',
      '/ilayda/WhatsApp Image 2026-06-21 at 15.49.55 (2).jpeg',
      '/ilayda/WhatsApp Image 2026-06-21 at 15.49.55 (3).jpeg',
    ],

    lockedAlbum: {
      pin: '1234',
      photos: [
        { file:'/photos/friends/ilayda/locked/1.jpg', caption:'Şarap kadehleri', date:'2022' },
        { file:'/photos/friends/ilayda/locked/2.jpg', caption:'O barın ışıkları', date:'2022' },
        { file:'/photos/friends/ilayda/locked/3.jpg', caption:'Kadehler kalktı', date:'2023' },
        { file:'/photos/friends/ilayda/locked/4.jpg', caption:'Bar gecesi', date:'2023' },
        { file:'/photos/friends/ilayda/locked/5.jpg', caption:'Yılbaşı gecesi', date:'2024' },
        { file:'/photos/friends/ilayda/locked/6.jpg', caption:'Bira ve gülüşler', date:'2024' },
      ],
    },

    diary: [
      {
        date: '3 Aralık 2024',
        title: '"İzmitli Dadaşlar" pozları…',
        content: `Bizim için kaç yaşına gelirsek gelelim klasik olacak "İzmitli Dadaşlar Dayanışma Derneği" pozlarımızın ilk çekildiği gün.\n\nEee azıcık da sarhoştuk, sen çok tatlı şeyler itiraf etmiştin 🥹`,
      },
      {
        date: '16 Ocak 2025',
        title: 'Sabahladığımız gece…',
        content: `Seninle sınav için sabahladığımız günlerden biri bu — bunun daha nicesi nicesi var. Ama o gün yurt odasında kahve bile yedik.\n\nBütün stresli sınav sabahlarımıza, gerekirse mescitte yarı ağlamalı yarı uyumalı sınav çalıştığımız günler için bu günü ithaf ediyorum. Evet bu dönemler çok stresliydi ama bence birlikte çok güzel atlattık ve yönettik 🫠`,
      },
      {
        date: 'Her 9 Ekim',
        title: 'Ve bütün 9 Ekimler…',
        content: `Her yılda bir kere aynı gün doğacağız ve benim her zaman aklıma ilk gelen sen olacaksın. Çünkü biz arkadaşlığımızın en güzel gününü başka yerlerde aynı gün doğarak başarmışız 🩷`,
      },
    ],

    voices: [
      { hint:'O seyahati hiç unutmadım ✨', audioSrc:'/ilayda ses/ses.mp4', duration:'' },
    ],

    photos: ILAYDA_PHOTOS,
  },

  cemile: {
    name: 'Cemile', emoji: '🌙', sectionTitle: 'Gece Yarısı Sohbetleri',
    mood: 'Derinlik · Sır · Güven',
    color: '#C4884A', glowRgb: '196,136,74',
    bg: 'radial-gradient(ellipse at 30% 10%, rgba(40,20,5,.95) 0%, #000 65%)',
    accent: '#e8c49a',
    word: { text: 'CESARET', color: '#C4884A' },
    message: `Bebeğim, neredeyse dört senedir hayatımdasın ve bu dört senenin bana düşünebildiğimden daha da çok şey kattın. Bazen insan bunu yaşarken fark etmiyor ama şimdi geriye, 4 yılımıza dönüp baktığımda senin hayatımda ne kadar yer kapladığını daha iyi görebiliyorum. Sen benim için sadece öylesine konuştuğum biri değil, hayatımın içinde 4 senedir her güne iz bırakmış, her gününde bir yerlerinde olmuş birisin. Beraber bu 4 senede bir sürü şeye üzülmüşüz, ağlamışız, endişelenmişiz ama sonunda geçmiş her şey. Gülmeye başlamışız. Her kötü günü hep beraber atlatmışız — bizim en büyük şansımız birbirimize sahip olmakmış.\n\nHayatımda ne olursa olsa seninle konuştuğum zaman konuştuğum şeylerin o kadar da kötü olmadığını, bir şeylerin daha katlanılabilir olduğunu biliyorum. Bana bu hayatta o kadar güven veriyorsun ki. Bir yandan sana çok hayranlık duyuyorum. Çünkü sen çok güçlü bir insansın. Hayatında ne olursa olsun belki üzülüyorsun, belki duygusal olarak çok yoruluyorsun ama gün sonunda o güçlü karakterinle her şeyi yoluna koymak için çabalıyorsun. Dışarıdan çok güçlü, kendi ayakları üzerine basan, zeki, güzel bir Ravza var — ama bu Ravza sanki içindeki minik Ravza'nın hayallerini, dileklerini en iyi şekilde gerçekleştirmek için uğraşıyor. Bunu o kadar kendinden emin adımlarla yapıyor ki. İşte bu özelliğin bende hep hayranlık uyandırıyor.\n\nBazen hayatta bir şeylerden şüphelenirsen, yorulursan, bazen de güçlü olmak istemezsen — ben o gün senin yanında olacağım ve sana her şeyimle kucak açacağım. Bunu sakın aklından çıkartma. Ben hep buradayım ve seni sevgiyle bekliyorum.`,
    voiceHints: ['O gece yarısı konuşması 🌙', 'Bana anlattığın o şey', 'Seninle en son ne konuştum'],
    memories: [],
    secret: 'Bu gece seni düşündük. Ve bunun için buraya bir şey bıraktık.',
    polaroidCaptions: ['Cemile&ben', 'Gece yarısı', 'Derin sohbet', 'Ay ışığında'],
    polaroidImages: [
      '/cemile/WhatsApp Image 2026-06-20 at 21.25.05.jpeg',
      '/cemile/WhatsApp Image 2026-06-20 at 21.25.05 (1).jpeg',
      '/cemile/WhatsApp Image 2026-06-20 at 21.25.06.jpeg',
      '/cemile/WhatsApp Image 2026-06-20 at 21.25.06 (1).jpeg',
    ],

    lockedAlbum: {
      pin: '1234',
      photos: [
        { file:'/photos/friends/cemile/locked/1.jpg', caption:'Bar masasında', date:'2022' },
        { file:'/photos/friends/cemile/locked/2.jpg', caption:'Amber içki', date:'2023' },
        { file:'/photos/friends/cemile/locked/3.jpg', caption:'Rooftop gecesi', date:'2023' },
        { file:'/photos/friends/cemile/locked/4.jpg', caption:'Tuborg anı', date:'2023' },
        { file:'/photos/friends/cemile/locked/5.jpg', caption:'Yılbaşı partisi', date:'2023' },
      ],
    },

    diary: [
      {
        date: '19 Eylül 2022',
        title: 'İlk gün, ilk bakış…',
        content: `Seninle alakalı aklımdan çıkmayan ilk an galiba tanıştığımız ilk gün. Bu günün tarihini çok hatırlamaya çalıştım ama hatırlayamadım. Tam da burada mutlu oldum çünkü ne kadar uzun zaman olduğunu, bu arkadaşlığın başlangıç tarihinin bile hatırlanamayacak kadar eskiymiş gibi olması bana çok iyi hissettirdi.\n\nSeni ilk gördüğüm gün birinci sınıfın ilk günüydü. Kapı tarafında birinci sırada oturuyordun. İlk gün çekingenliği vardı üstünde. Kapıdan girip çıkarken gözüm sana takılıyordu ve yalan yok biraz sessiz bir insan olduğunu düşünmüştüm.\n\nSonra bir gün denk geldik ve beraber oturmaya karar verdik. Sen konuştukça seninle arkadaş olmayı o gün o kadar çok istemiştim ki. Cümlelerini güzel seçiyor, ne konuşacağını çok iyi biliyor. Eğlenceli, komik olmasının yanında ne kadar zeki ve tatlı. Sonra laboratuvar günümüzün aynı olduğunu duydum ve daha çok mutlu oldum. Çünkü seninle beraber zaman geçirebileceğim ve seninle çok iyi arkadaş olabileceğim diye düşünmüştüm. Yanılmamışım.\n\nSeninle geçirdiğim her günde, her laboratuvarda, her sınavda, her şenlikte, her birada ve her kahvede çok eğlendim Ravza. Umarım ben de seni bir nebze eğlendirebilmişimdir. Biraz yüzünü güldürebilmişimdir.`,
      },
      {
        date: '12 Mart 2026',
        title: 'O birkaç gün…',
        content: `Seninle ilgili son olarak 12 Mart 2026 tarihini yazmak istiyorum. O gün o kadar hastaydın ki, bize bunu hiç belli etmemeye çalışıyordun. Dışarıdan çok güçlü görünüyordun ve biz senin ne kadar hasta olduğunu gerçekten anlayamamıştık. Galiba iki tane serum yemesen, durumunun bu kadar ciddi olduğunu yine de fark edemezdik.\n\nO gün seni İstanbul'a götürürken de, gece uyuduğunda da, ertesi gün kan testi verirken de, Caddebostan'da bir kafede kediden korktuğunda da — kendimi sana adanmış bir halde buldum. Bu his garip bir şekilde hoşuma gitti. Kan verirken etkilendiğini biliyordum ve seni o odadan en az etkilenmiş şekilde çıkarmak sanki benim bilinçsiz görevimdi. Aynı şekilde, Ravza'nın etrafında herhangi bir kedi olmaması gerektiğini de hep biliyormuşum gibi davranıyordum.\n\nBu yüzden o kafede de algılarım hep açıktı. Etrafta kedi arıyor, yaklaşmaması için bir şekilde onu uzaklaştırmaya çalışıyordum. Sen rahat edesin diye uğraşıyordum. Çünkü senin o an biraz bile rahatlaman benim için önemliydi.\n\nO akşam Deniz ablanın yaptığı magnolyayı yiyememen beni sandığımdan daha çok üzdü. Aslında o an tek istediğim şey senin bir an önce iyileşmen, kendine dönmen ve yine bildiğim Ravza olmandı. Galiba o günü, hatta o birkaç günü bu kadar sevmemin nedenlerinden biri de sana yardımcı olabilmenin bana iyi hissettirmesiydi.\n\nSana herhangi bir şekilde iyi gelebilmek bana gerçekten çok iyi geliyor. Çünkü seni çok seviyorum ve hayatına ufacık bile dokunabiliyorsam bu benim için çok kıymetli. Hayatım boyunca bunu sana her zaman yapabileceğimi bilmeni isterim. Her zaman bir adım uzağındayım. O günden daha kötü bir gün geçirsen bile ben yine orada olurum. Seni yine o iğneden, o kediden korumaya çalışırım. Senin o magnolyayı sağlıklı ve güzel bir şekilde yiyebilmeni sağlarım.`,
      },
      {
        date: '1 Ocak 2025',
        title: "Saat 4.20'de…",
        content: `Şimdi seni hangi güne götürücem biliyor musun? 1 Ocak 2025. Tam saat 4.20 falan. Çok eğlenceli ve çok keyifli bir gece geçirmişiz. Beraber inanılmaz eğlenerek ve içerek yeni yıla girmişiz. O kadar alkol almışız ki ne yaptığımızı hatırlamıyoruz.\n\nTek bildiğim o an ikimiz yan yana yatıyoruz ve sadece konuşuyoruz. Ravza, ben seninle alakalı en net o anı hatırlıyorum. Hiçbir şey düşünmeden — dünyanın dertlerini, koşturmacalarını, yorgunluklarını asla sallamadan — tek düşündüğümüz biraz konuşmak ve biraz kıkırdamakken ne kadar da güzeldik.\n\nBen seninle bir sürü gece çok eğlendim ama galiba en çok o gece eğlendim. Birbirimize sarılıp sevgimizi sonuna kadar verdik ve sadece birbirimiz hakkında konuşup birbirimize güldük o anlarda.\n\nO bizim ilk kendimizi bilmez kahkahalarımız değildi ve son da olmayacak. Hayatımız boyunca bir sürü şeye kayıtsız şartsız, dalağımız yokmuş gibi gülmek ve bir mekandan kovulana kadar konuşmak bizim en büyük özelliğimiz olsun.`,
      },
    ],

    voices: [
      { hint:'O gece yarısı konuşması 🌙', audioSrc:'/ses1.mp4', duration:'' },
    ],

    photos: CEMILE_PHOTOS,
  },
}

/* ─────────────── Polaroid ─────────────── */
function Polaroid({ caption, gradient, rotation, delay, imageSrc }: { caption: string; gradient: string; rotation: number; delay: number; imageSrc?: string }) {
  return (
    <motion.div
      initial={{ opacity:0, scale:.7, rotate:rotation }}
      animate={{ opacity:1, scale:1, rotate:rotation, y:[0,-6,0] }}
      transition={{ opacity:{ delay, duration:.5 }, scale:{ delay, type:'spring', stiffness:200, damping:20 }, y:{ duration:4+delay*.5, repeat:Infinity, ease:'easeInOut' } }}
      drag dragMomentum={false}
      whileTap={{ cursor:'grabbing', scale:1.05 }}
      style={{ cursor:'grab', width:'clamp(110px,16vw,150px)', flexShrink:0 }}
    >
      <div style={{ background:'#f5f0e8', borderRadius:'.3rem', padding:'.5rem .5rem .4rem', boxShadow:'0 4px 20px rgba(0,0,0,.5)', overflow:'hidden' }}>
        <div style={{ height:'clamp(80px,12vw,110px)', borderRadius:'.15rem', background:gradient, marginBottom:'.4rem', overflow:'hidden', position:'relative' }}>
          {imageSrc ? (
            <img src={imageSrc} alt={caption} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', position:'absolute', inset:0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <div style={{ width:'100%', height:'100%', background:'rgba(255,255,255,.03)' }} />
          )}
        </div>
        <p style={{ fontFamily:HW, fontSize:'.7rem', color:'#2a1a1a', textAlign:'center', lineHeight:1.3 }}>{caption}</p>
      </div>
    </motion.div>
  )
}

/* ─────────────── Voice Capsule ─────────────── */
function VoiceCapsule({ hint, color, glowRgb, index, audioSrc, duration }: { hint: string; color: string; glowRgb: string; index: number; audioSrc?: string; duration?: string }) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bars = useRef(Array.from({ length: 32 }, () => .2 + Math.random()*.8)).current

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
      transition={{ delay:index*.1, duration:.5 }}
      onClick={audioSrc ? toggle : undefined}
      style={{
        background:`rgba(${glowRgb},.06)`, border:`1px solid rgba(${glowRgb},.2)`,
        borderRadius:'1rem', padding:'1rem 1.2rem',
        cursor: audioSrc ? 'pointer' : 'default',
        display:'flex', alignItems:'center', gap:'1rem',
        backdropFilter:'blur(12px)',
      }}
    >
      {audioSrc && <audio ref={audioRef} src={audioSrc} onEnded={() => setPlaying(false)} preload="none" />}

      <motion.div
        animate={{ scale:playing?[1,1.2,1]:1, background:playing?color:`rgba(255,255,255,.12)` }}
        transition={{ duration:.5, repeat:playing?Infinity:0 }}
        style={{ width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.9rem', border:`1px solid rgba(${glowRgb},.3)` }}
      >
        {playing ? '⏸' : '▶'}
      </motion.div>

      <div style={{ flex:1, display:'flex', alignItems:'center', gap:2, height:32, overflow:'hidden' }}>
        {bars.map((h,i)=>(
          <motion.div key={i}
            animate={playing ? { scaleY:[h,.15+Math.random()*.85,h], opacity:[.6,1,.6] } : { scaleY:h }}
            transition={{ duration:.4+Math.random()*.4, repeat:playing?Infinity:0, delay:i*.02 }}
            style={{ width:3, height:'100%', borderRadius:2, background:color, transformOrigin:'center', opacity:.55, scaleY:h }}
          />
        ))}
      </div>

      <div style={{ flexShrink:0, textAlign:'right' }}>
        <p style={{ fontFamily:CO, fontSize:'.78rem', fontStyle:'italic', color:`rgba(${glowRgb},.8)`, marginBottom:'.15rem' }}>{hint}</p>
        <p style={{ fontFamily:IN, fontSize:'.56rem', letterSpacing:'.1em', color:'rgba(255,255,255,.2)' }}>
          {duration || 'Sesli not'}
        </p>
      </div>
    </motion.div>
  )
}

/* ─────────────── Memory Card ─────────────── */
function MemoryCard({ memory, color, glowRgb, index }: { memory: { emoji:string; text:string; date:string }; color: string; glowRgb: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-40px' }}
      transition={{ delay:index*.1, duration:.55 }}
      style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.8rem' }}
    >
      <div style={{ flexShrink:0, width:42, height:42, borderRadius:'50%', background:`rgba(${glowRgb},.1)`, border:`1px solid rgba(${glowRgb},.3)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', boxShadow:`0 0 16px rgba(${glowRgb},.2)` }}>
        {memory.emoji}
      </div>
      <div>
        <p style={{ fontFamily:CO, fontSize:'clamp(.88rem,1.6vw,1rem)', fontStyle:'italic', color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:'.3rem' }}>{memory.text}</p>
        <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.14em', textTransform:'uppercase', color:`rgba(${glowRgb},.5)` }}>{memory.date}</p>
      </div>
    </motion.div>
  )
}

/* ─────────────── Diary Section ─────────────── */
function DiarySection({ entries, color, glowRgb }: { entries: DiaryEntry[]; color: string; glowRgb: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <section style={{ maxWidth:680, margin:'0 auto', padding:'0 clamp(1rem,5vw,2.5rem) 4rem' }}>
      <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'2rem' }}>
        <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:`rgba(${glowRgb},.4)`, marginBottom:'.5rem' }}>Günlük</p>
        <div style={{ width:30, height:1, background:color, opacity:.4, marginBottom:'.6rem' }} />
        <p style={{ fontFamily:CO, fontSize:'.85rem', fontStyle:'italic', color:'rgba(255,255,255,.18)' }}>
          Sana yazdıklarım, yalnızca seninle…
        </p>
      </motion.div>

      {/* Notebook shell — dark leather-like cover */}
      <motion.div
        initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        transition={{ duration:.6 }}
        style={{
          background:'linear-gradient(135deg, #2e1606 0%, #1e0d03 60%, #2b1204 100%)',
          borderRadius:'.25rem 1.4rem 1.4rem .25rem',
          padding:'.4rem .4rem .4rem .8rem',
          boxShadow:'-8px 0 0 #130801, -14px 4px 24px rgba(0,0,0,.6), 0 24px 80px rgba(0,0,0,.7)',
          position:'relative',
        }}
      >
        {/* Spine rings */}
        <div style={{ position:'absolute', left:-10, top:'8%', bottom:'8%', display:'flex', flexDirection:'column', justifyContent:'space-evenly', paddingBlock:'.5rem', pointerEvents:'none', zIndex:5 }}>
          {Array.from({length:9}).map((_,i) => (
            <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:'radial-gradient(circle at 35% 35%, #4a2e10, #1a0a02)', boxShadow:'inset 0 1px 2px rgba(255,180,80,.1), 0 1px 4px rgba(0,0,0,.8)', border:'1.5px solid #3a1e08' }} />
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'.35rem' }}>
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity:0, x:-16 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
              transition={{ delay:i*.06, duration:.45 }}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{
                background: openIdx === i
                  ? 'linear-gradient(168deg, #fefcf5 0%, #f9f2e1 50%, #f4ebcf 100%)'
                  : 'linear-gradient(168deg, #faf7ee 0%, #f3ebd6 100%)',
                borderRadius:'.15rem .9rem .9rem .15rem',
                cursor:'pointer', overflow:'hidden', position:'relative',
                boxShadow: openIdx === i
                  ? '0 6px 32px rgba(0,0,0,.4), inset 0 0 60px rgba(139,90,30,.03)'
                  : '0 2px 10px rgba(0,0,0,.3)',
                transition:'box-shadow .3s',
              }}
            >
              {/* Ruled lines when open */}
              {openIdx === i && Array.from({length:30}).map((_,li) => (
                <div key={li} style={{ position:'absolute', left:0, right:0, top:`${li*2.15+4.2}rem`, height:1, background:'rgba(80,50,20,.07)', pointerEvents:'none' }} />
              ))}
              {/* Red margin line when open */}
              {openIdx === i && (
                <div style={{ position:'absolute', left:56, top:0, bottom:0, width:1.5, background:'rgba(190,45,45,.28)', pointerEvents:'none' }} />
              )}

              <div style={{ padding: openIdx === i ? '1.5rem 1.6rem 1.8rem 1.8rem' : '1rem 1.3rem 1rem 1.5rem' }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: openIdx === i ? '1.3rem' : 0 }}>
                  <div>
                    <p style={{ fontFamily:HW, fontSize: openIdx === i ? '1.5rem' : '1.05rem', color:'#1e0e04', lineHeight:1.25, marginBottom:'.25rem', transition:'font-size .3s' }}>
                      {entry.title}
                    </p>
                    <div style={{ background:'rgba(160,55,55,.1)', border:'1px solid rgba(160,55,55,.2)', borderRadius:'.3rem', padding:'.1rem .45rem', display:'inline-block', fontFamily:IN, fontSize:'.5rem', letterSpacing:'.14em', color:'rgba(140,50,50,.7)', textTransform:'uppercase' }}>
                      {entry.date}
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openIdx === i ? 90 : 0 }}
                    transition={{ duration:.3 }}
                    style={{ color:'rgba(90,55,20,.3)', fontSize:'.58rem', flexShrink:0, paddingLeft:'1rem', marginTop:'.2rem' }}
                  >▶</motion.div>
                </div>

                <AnimatePresence initial={false}>
                  {openIdx === i ? (
                    <motion.div
                      key="open"
                      initial={{ opacity:0, height:0 }}
                      animate={{ opacity:1, height:'auto' }}
                      exit={{ opacity:0, height:0 }}
                      transition={{ duration:.4, ease:'easeInOut' }}
                      style={{ overflow:'hidden' }}
                    >
                      <div style={{ paddingTop:'.7rem', borderTop:'1px solid rgba(90,55,20,.1)' }}>
                        {entry.content.split('\n').map((line, li) => (
                          <p key={li} style={{
                            fontFamily:HW, fontSize:'1.02rem', color:'#190c03',
                            lineHeight:2.15, minHeight:'2.15rem', letterSpacing:'.008em',
                          }}>{line || ' '}</p>
                        ))}
                      </div>
                      {/* Signature */}
                      <div style={{ marginTop:'1.8rem', paddingTop:'.8rem', borderTop:'1px solid rgba(90,55,20,.08)', display:'flex', justifyContent:'flex-end', alignItems:'center', gap:'.5rem' }}>
                        <div style={{ flex:1, height:1, background:`linear-gradient(90deg, transparent, rgba(${glowRgb},.2))` }} />
                        <p style={{ fontFamily:HW, fontSize:'1.25rem', color:`rgba(${glowRgb},.55)`, fontStyle:'italic' }}>Ravza ♥</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="closed"
                      initial={{ opacity:0 }}
                      animate={{ opacity:1 }}
                      exit={{ opacity:0 }}
                      style={{ fontFamily:HW, fontSize:'.85rem', color:'rgba(30,14,3,.35)', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis', marginTop:'.3rem' }}
                    >
                      {entry.content.split('\n')[0]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ─────────────── Photo Gallery ─────────────── */
function PhotoGallery({ photos, color, glowRgb }: { photos: string[]; color: string; glowRgb: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section style={{ maxWidth:920, margin:'0 auto', padding:'0 clamp(.75rem,3vw,2rem) 4rem' }}>
      <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.8rem' }}>
        <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:`rgba(${glowRgb},.4)`, marginBottom:'.5rem' }}>Fotoğraflar</p>
        <div style={{ width:30, height:1, background:color, opacity:.4, marginBottom:'.6rem' }} />
        <p style={{ fontFamily:CO, fontSize:'.85rem', fontStyle:'italic', color:'rgba(255,255,255,.18)' }}>
          {photos.length} kare, {photos.length} an ✦
        </p>
      </motion.div>

      {/* Masonry via CSS columns */}
      <div style={{ columns:'3 140px', gap:'.5rem' }}>
        {photos.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity:0, scale:.92 }}
            whileInView={{ opacity:1, scale:1 }}
            viewport={{ once:true, margin:'-30px' }}
            transition={{ delay:(i % 9) * .025, duration:.35 }}
            onClick={() => setLightbox(i)}
            style={{ breakInside:'avoid', marginBottom:'.5rem', cursor:'pointer', borderRadius:'.55rem', overflow:'hidden', border:`1px solid rgba(${glowRgb},.07)`, display:'block' }}
          >
            <motion.img
              src={src}
              alt=""
              whileHover={{ scale:1.05 }}
              transition={{ duration:.3 }}
              style={{ width:'100%', display:'block', objectFit:'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.96)', backdropFilter:'blur(24px)' }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              key={lightbox}
              initial={{ opacity:0, scale:.9 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:.25 }}
              src={photos[lightbox]}
              alt=""
              onClick={e => e.stopPropagation()}
              style={{ maxWidth:'88vw', maxHeight:'88vh', objectFit:'contain', borderRadius:'.6rem', boxShadow:`0 0 80px rgba(${glowRgb},.15)` }}
            />
            {lightbox > 0 && (
              <motion.button whileHover={{ scale:1.1, x:-2 }} onClick={e => { e.stopPropagation(); setLightbox(lightbox-1) }}
                style={{ position:'fixed', left:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'50%', width:48, height:48, color:'#fff', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</motion.button>
            )}
            {lightbox < photos.length - 1 && (
              <motion.button whileHover={{ scale:1.1, x:2 }} onClick={e => { e.stopPropagation(); setLightbox(lightbox+1) }}
                style={{ position:'fixed', right:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'50%', width:48, height:48, color:'#fff', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</motion.button>
            )}
            <motion.button whileHover={{ rotate:90 }} onClick={() => setLightbox(null)}
              style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'50%', width:40, height:40, color:'rgba(255,255,255,.6)', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─────────────── Locked Album ─────────────── */
function LockedAlbum({ photos, pin, color, glowRgb }: { photos: LockedPhoto[]; pin: string; color: string; glowRgb: string }) {
  const [unlocked, setUnlocked] = useState(false)
  const [showPin, setShowPin]   = useState(false)
  const [entered, setEntered]   = useState('')
  const [shake, setShake]       = useState(false)
  const [success, setSuccess]   = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const attempt = (code: string) => {
    if (code === pin) {
      setSuccess(true)
      setTimeout(() => { setUnlocked(true); setShowPin(false); setEntered(''); setSuccess(false) }, 700)
    } else {
      setShake(true)
      setTimeout(() => { setShake(false); setEntered('') }, 600)
    }
  }

  const addDigit = (d: string) => {
    if (entered.length >= 4) return
    const next = entered + d
    setEntered(next)
    if (next.length === 4) setTimeout(() => attempt(next), 180)
  }

  return (
    <section style={{ maxWidth:700, margin:'0 auto', padding:'0 clamp(1rem,5vw,2.5rem) 4rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.6rem' }}>
        <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:`rgba(${glowRgb},.4)`, marginBottom:'.5rem' }}>
          {unlocked ? `Özel Albüm · ${photos.length} Fotoğraf Açıldı` : 'Kilitli Albüm'}
        </p>
        <div style={{ width:30, height:1, background:color, opacity:.4, marginBottom:'.6rem' }} />
        {!unlocked && (
          <p style={{ fontFamily:CO, fontSize:'.85rem', fontStyle:'italic', color:'rgba(255,255,255,.18)' }}>
            Sadece seninle paylaşılan {photos.length} kare burada saklanıyor ✦
          </p>
        )}
      </motion.div>

      {/* Photo grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px,1fr))', gap:'.75rem' }}>
        {photos.map((photo, i) => (
          <motion.div key={i}
            initial={{ opacity:0, scale:.85 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            transition={{ delay: i * .025, duration:.4 }}
            onClick={() => unlocked ? setLightbox(i) : setShowPin(true)}
            style={{
              aspectRatio:'1', borderRadius:'.7rem', overflow:'hidden', position:'relative',
              cursor:'pointer', border:`1px solid rgba(${glowRgb},.14)`,
            }}
          >
            {unlocked ? (
              <>
                <img src={photo.file} alt={photo.caption}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.background = `linear-gradient(135deg,rgba(${glowRgb},.1),rgba(${glowRgb},.28))` }}
                />
                <motion.div initial={{ opacity:0 }} whileHover={{ opacity:1 }}
                  style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.55)', display:'flex', alignItems:'center', justifyContent:'center', padding:'.4rem' }}>
                  <p style={{ fontFamily:CO, fontStyle:'italic', fontSize:'.68rem', color:'rgba(255,255,255,.85)', textAlign:'center', lineHeight:1.4 }}>{photo.caption}</p>
                </motion.div>
              </>
            ) : (
              <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,rgba(${glowRgb},.07),rgba(${glowRgb},.18))`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'.4rem' }}>
                <motion.span animate={{ opacity:[.4,.7,.4] }} transition={{ duration:2.5, repeat:Infinity, delay:i*.08 }} style={{ fontSize:'1.2rem' }}>🔒</motion.span>
                <p style={{ fontFamily:IN, fontSize:'.42rem', letterSpacing:'.1em', color:`rgba(${glowRgb},.35)`, textTransform:'uppercase' }}>{String(i+1).padStart(2,'0')}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Unlock button */}
      {!unlocked && (
        <motion.div initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ textAlign:'center', marginTop:'1.8rem' }}>
          <motion.button
            whileHover={{ scale:1.04, boxShadow:`0 0 32px rgba(${glowRgb},.38)` }}
            whileTap={{ scale:.96 }}
            onClick={() => setShowPin(true)}
            style={{ background:`rgba(${glowRgb},.1)`, border:`1px solid rgba(${glowRgb},.38)`, borderRadius:'3rem', padding:'.75rem 2.2rem', cursor:'pointer', fontFamily:IN, fontSize:'.65rem', letterSpacing:'.22em', textTransform:'uppercase', color }}>
            🔑 Kilidi Aç
          </motion.button>
        </motion.div>
      )}

      {/* PIN Modal */}
      <AnimatePresence>
        {showPin && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.9)', backdropFilter:'blur(28px)' }}
            onClick={() => { setShowPin(false); setEntered('') }}>
            <motion.div
              initial={{ scale:.82, y:32 }} animate={{ scale:1, y:0 }} exit={{ scale:.82 }}
              transition={{ type:'spring', stiffness:240, damping:24 }}
              onClick={e => e.stopPropagation()}
              style={{ background:`linear-gradient(160deg,rgba(${glowRgb},.09),rgba(${glowRgb},.04))`, border:`1px solid rgba(${glowRgb},.22)`, borderRadius:'1.6rem', padding:'2.5rem 2rem 2rem', minWidth:280, textAlign:'center', backdropFilter:'blur(40px)', position:'relative' }}
            >
              <div style={{ fontSize:'2rem', marginBottom:'.8rem', filter:`drop-shadow(0 0 14px rgba(${glowRgb},.6))` }}>🌸</div>
              <p style={{ fontFamily:IN, fontSize:'.58rem', letterSpacing:'.28em', textTransform:'uppercase', color:`rgba(${glowRgb},.55)`, marginBottom:'1.6rem' }}>
                {success ? 'Açılıyor…' : 'Şifreni gir'}
              </p>

              {/* PIN dots */}
              <motion.div
                animate={shake ? { x:[-10,10,-10,10,-5,0] } : {}}
                transition={{ duration:.45 }}
                style={{ display:'flex', justifyContent:'center', gap:'1rem', marginBottom:'2rem' }}
              >
                {[0,1,2,3].map(i => (
                  <motion.div key={i}
                    animate={{ scale: entered.length > i ? [1,1.25,1] : 1 }}
                    transition={{ duration:.25 }}
                    style={{
                      width:14, height:14, borderRadius:'50%',
                      background: success ? color : entered.length > i ? color : 'rgba(255,255,255,.12)',
                      border:`2px solid ${entered.length > i || success ? color : `rgba(${glowRgb},.25)`}`,
                      boxShadow: entered.length > i || success ? `0 0 10px rgba(${glowRgb},.55)` : 'none',
                      transition:'all .2s',
                    }}
                  />
                ))}
              </motion.div>

              {/* Numpad */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'.65rem', maxWidth:216, margin:'0 auto' }}>
                {[1,2,3,4,5,6,7,8,9,null,0,'⌫'].map((k, i) => (
                  <motion.button key={i}
                    whileHover={k !== null ? { scale:1.08, background:`rgba(${glowRgb},.22)` } : {}}
                    whileTap={k !== null ? { scale:.91 } : {}}
                    onClick={() => {
                      if (k === '⌫') setEntered(p => p.slice(0,-1))
                      else if (k !== null) addDigit(String(k))
                    }}
                    disabled={k === null}
                    style={{
                      background: k !== null ? `rgba(${glowRgb},.08)` : 'transparent',
                      border: k !== null ? `1px solid rgba(${glowRgb},.18)` : 'none',
                      borderRadius:'.75rem', padding:'.95rem',
                      fontFamily:IN, fontSize:'1.1rem',
                      color: k === '⌫' ? `rgba(${glowRgb},.7)` : 'rgba(255,255,255,.78)',
                      cursor: k !== null ? 'pointer' : 'default',
                    }}>
                    {k ?? ''}
                  </motion.button>
                ))}
              </div>

              <motion.button whileHover={{ rotate:90 }} onClick={() => { setShowPin(false); setEntered('') }}
                style={{ position:'absolute', top:'1rem', right:'1rem', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'50%', width:34, height:34, color:'rgba(255,255,255,.45)', fontSize:'.85rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && unlocked && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.94)', backdropFilter:'blur(28px)' }}
            onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale:.88 }} animate={{ scale:1 }} exit={{ scale:.92 }} transition={{ duration:.3 }}
              onClick={e => e.stopPropagation()}
              style={{ position:'relative', maxWidth:'82vw', maxHeight:'82vh', borderRadius:'1rem', overflow:'hidden', boxShadow:`0 0 80px rgba(${glowRgb},.22)` }}>
              <img src={photos[lightbox].file} alt={photos[lightbox].caption}
                style={{ maxWidth:'80vw', maxHeight:'76vh', objectFit:'contain', display:'block' }}
                onError={e => { (e.target as HTMLImageElement).style.background = `linear-gradient(135deg,rgba(${glowRgb},.12),rgba(${glowRgb},.3))`; (e.target as HTMLImageElement).style.minWidth = '200px'; (e.target as HTMLImageElement).style.minHeight = '200px' }}
              />
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'.9rem 1.3rem', background:'linear-gradient(to top,rgba(0,0,0,.88),transparent)' }}>
                <p style={{ fontFamily:CO, fontStyle:'italic', fontSize:'.9rem', color:'rgba(255,255,255,.8)' }}>{photos[lightbox].caption}</p>
                <p style={{ fontFamily:IN, fontSize:'.58rem', letterSpacing:'.12em', color, marginTop:'.2rem' }}>{photos[lightbox].date}</p>
              </div>
            </motion.div>

            {lightbox > 0 && (
              <motion.button whileHover={{ scale:1.1, x:-2 }} onClick={e => { e.stopPropagation(); setLightbox(lightbox-1) }}
                style={{ position:'fixed', left:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'50%', width:48, height:48, color:'#fff', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</motion.button>
            )}
            {lightbox < photos.length - 1 && (
              <motion.button whileHover={{ scale:1.1, x:2 }} onClick={e => { e.stopPropagation(); setLightbox(lightbox+1) }}
                style={{ position:'fixed', right:'1.5rem', top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:'50%', width:48, height:48, color:'#fff', fontSize:'1.2rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</motion.button>
            )}
            <motion.button whileHover={{ rotate:90 }} onClick={() => setLightbox(null)}
              style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'50%', width:40, height:40, color:'rgba(255,255,255,.6)', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ─────────────── Main Component ─────────────── */
export default function FriendWorld({ friend, onBack, onWhoAreYou }: { friend: FriendId; onBack: () => void; onWhoAreYou: () => void }) {
  const d  = DATA[friend]
  const scrollRef = useRef<HTMLDivElement>(null)
  const [secretOpen, setSecretOpen] = useState(false)

  const polaroidGradients = [
    `radial-gradient(circle at 35% 30%, ${d.accent}44, ${d.color}66 60%, #000 100%)`,
    `radial-gradient(circle at 50% 40%, ${d.color}33, ${d.accent}44 55%, #000 100%)`,
    `radial-gradient(circle at 30% 60%, ${d.color}55, #000 80%)`,
    `radial-gradient(circle at 65% 30%, ${d.accent}44, ${d.color}33 70%, #000 100%)`,
  ]

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:.97 }}
      transition={{ duration:.75 }}
      style={{ position:'fixed', inset:0, background:d.bg, overflow:'hidden' }}
    >
      {/* Ambient glow */}
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 60% 50% at 50% 0%, rgba(${d.glowRgb},.07) 0%, transparent 70%)`, pointerEvents:'none' }} />

      {/* Fixed back button — always visible regardless of scroll */}
      <motion.button
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.4 }}
        whileHover={{ opacity:1, x:-3 }}
        onClick={onBack}
        style={{ position:'fixed', top:'1.5rem', left:'1.5rem', zIndex:200, background:'none', border:'none', cursor:'pointer', fontFamily:IN, fontSize:'.65rem', letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,.38)' }}
      >
        ← Geri
      </motion.button>

      {/* Scrollable */}
      <div ref={scrollRef} style={{ position:'absolute', inset:0, overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:`rgba(${d.glowRgb},.3) transparent` }}>

        {/* HERO */}
        <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem', position:'relative' }}>

          <motion.div initial={{ opacity:0, scale:.75 }} animate={{ opacity:1, scale:1 }} transition={{ delay:.2, type:'spring', stiffness:140, damping:16 }}
            style={{ fontSize:'clamp(3rem,8vw,5rem)', marginBottom:'1.2rem', filter:`drop-shadow(0 0 28px rgba(${d.glowRgb},.75))` }}>
            {d.emoji}
          </motion.div>

          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:.4 }}>
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.4em', textTransform:'uppercase', color:`rgba(${d.glowRgb},.45)`, marginBottom:'.8rem' }}>
              {d.mood}
            </p>
            <h1 style={{ fontFamily:PF, fontSize:'clamp(1rem,2.5vw,1.4rem)', color:`rgba(${d.glowRgb},.7)`, marginBottom:'.4rem', letterSpacing:'.04em' }}>
              {d.sectionTitle}
            </h1>
            <h2 style={{ fontFamily:PF, fontSize:'clamp(2.8rem,8vw,5.5rem)', color:'#fff', marginBottom:'1rem', textShadow:`0 0 50px rgba(${d.glowRgb},.4)` }}>
              {d.name}
            </h2>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.2 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'.5rem', marginTop:'1.5rem' }}>
            <p style={{ fontFamily:IN, fontSize:'.58rem', letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(255,255,255,.15)' }}>Kaydır</p>
            <motion.div animate={{ y:[0,6,0] }} transition={{ duration:2, repeat:Infinity }}>
              <svg width="16" height="24" viewBox="0 0 16 24"><path d="M8 0 L8 18 M2 12 L8 20 L14 12" stroke={`rgba(${d.glowRgb},.35)`} strokeWidth="1.4" fill="none" /></svg>
            </motion.div>
          </motion.div>
        </section>

        {/* POLAROIDS */}
        <section style={{ padding:'0 clamp(1rem,5vw,3rem) 4rem', overflow:'hidden' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ width:50, height:1, background:`linear-gradient(90deg,transparent,${d.color},transparent)`, margin:'0 auto 1rem' }} />
            <p style={{ fontFamily:CO, fontSize:'.88rem', fontStyle:'italic', color:`rgba(${d.glowRgb},.4)` }}>Birlikte yaşananlar</p>
          </motion.div>
          <div style={{ display:'flex', gap:'clamp(.8rem,2vw,1.4rem)', overflowX:'auto', paddingBottom:'1rem', scrollbarWidth:'none', justifyContent:'center', flexWrap:'wrap' }}>
            {d.polaroidCaptions.map((cap,i)=>(
              <Polaroid key={i} caption={cap} gradient={polaroidGradients[i]} rotation={[-5,4,-7,3][i]} delay={.08*i} imageSrc={d.polaroidImages?.[i]} />
            ))}
          </div>
        </section>

        {/* PHOTO GALLERY — sadece Seda */}
        {d.photos && <PhotoGallery photos={d.photos} color={d.color} glowRgb={d.glowRgb} />}

        {/* PERSONAL MESSAGE */}
        <section style={{ maxWidth:640, margin:'0 auto', padding:'3rem clamp(1rem,5vw,2.5rem)' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'.8rem' }}>
            <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,rgba(${d.glowRgb},.3))` }} />
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:`rgba(${d.glowRgb},.45)`, whiteSpace:'nowrap' }}>Benden Sana</p>
            <div style={{ flex:1, height:1, background:`linear-gradient(90deg,rgba(${d.glowRgb},.3),transparent)` }} />
          </motion.div>

          <motion.div
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ background:`rgba(${d.glowRgb},.05)`, border:`1px solid rgba(${d.glowRgb},.14)`, borderRadius:'1.2rem', padding:'clamp(1.4rem,4vw,2.2rem)', position:'relative', overflow:'hidden' }}
          >
            <div style={{ position:'absolute', top:'1rem', right:'1.2rem', fontFamily:PF, fontSize:'4rem', opacity:.05, color:d.color }}>❝</div>
            {d.message.split('\n\n').map((para, i)=>(
              <p key={i} style={{ fontFamily:CO, fontSize:'clamp(.9rem,1.7vw,1.05rem)', fontStyle:'italic', color:'rgba(255,255,255,.65)', lineHeight:1.8, marginBottom:i<d.message.split('\n\n').length-1?'1.2rem':'0' }}>
                {para}
              </p>
            ))}
            <div style={{ marginTop:'1.4rem', display:'flex', alignItems:'center', gap:'.5rem' }}>
              <span style={{ fontSize:'1rem', filter:`drop-shadow(0 0 8px rgba(${d.glowRgb},.6))` }}>{d.emoji}</span>
              <p style={{ fontFamily:HW, fontSize:'1.1rem', color:`rgba(${d.glowRgb},.7)` }}>{d.name}</p>
            </div>
          </motion.div>
        </section>

        {/* MEMORIES */}
        {d.memories.length > 0 && (
          <section style={{ maxWidth:640, margin:'0 auto', padding:'2rem clamp(1rem,5vw,2.5rem) 4rem' }}>
            <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'2rem' }}>
              <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:`rgba(${d.glowRgb},.4)`, marginBottom:'.5rem' }}>Anılar</p>
              <div style={{ width:30, height:1, background:d.color, opacity:.4 }} />
            </motion.div>
            {d.memories.map((m,i)=><MemoryCard key={i} memory={m} color={d.color} glowRgb={d.glowRgb} index={i} />)}
          </section>
        )}

        {/* GÜNLÜK — sadece Seda */}
        {d.diary && <DiarySection entries={d.diary} color={d.color} glowRgb={d.glowRgb} />}

        {/* VOICE RECORDINGS */}
        <section style={{ maxWidth:640, margin:'0 auto', padding:'0 clamp(1rem,5vw,2.5rem) 4rem' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} style={{ marginBottom:'1.5rem' }}>
            <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.25em', textTransform:'uppercase', color:`rgba(${d.glowRgb},.4)`, marginBottom:'.5rem' }}>Ses Kayıtları</p>
            <div style={{ width:30, height:1, background:d.color, opacity:.4 }} />
          </motion.div>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {d.voices
              ? d.voices.map((v,i) => <VoiceCapsule key={i} hint={v.hint} color={d.color} glowRgb={d.glowRgb} index={i} audioSrc={v.audioSrc} duration={v.duration} />)
              : d.voiceHints.map((h,i) => <VoiceCapsule key={i} hint={h} color={d.color} glowRgb={d.glowRgb} index={i} />)
            }
          </div>
        </section>

        {/* KİLİTLİ ALBÜM — sadece Seda */}
        {d.lockedAlbum && (
          <LockedAlbum photos={d.lockedAlbum.photos} pin={d.lockedAlbum.pin} color={d.color} glowRgb={d.glowRgb} />
        )}

        {/* WORD CONTRIBUTION */}
        <section style={{ padding:'4rem clamp(1rem,5vw,2.5rem)', textAlign:'center' }}>
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-50px' }}>
            <p style={{ fontFamily:CO, fontSize:'.88rem', fontStyle:'italic', color:'rgba(255,255,255,.25)', marginBottom:'.8rem' }}>{d.name} gözünden sen bir kelime:</p>
            <motion.div
              whileHover={{ scale:1.05 }}
              style={{ display:'inline-block', padding:'.8rem 2.5rem', borderRadius:'3rem', border:`2px solid rgba(${d.glowRgb},.4)`, background:`rgba(${d.glowRgb},.07)`, cursor:'pointer' }}
              onClick={onWhoAreYou}
            >
              <p style={{ fontFamily:PF, fontSize:'clamp(1.5rem,4vw,2.2rem)', color:d.color, letterSpacing:'.08em', textShadow:`0 0 30px rgba(${d.glowRgb},.5)` }}>
                {d.word.text}
              </p>
            </motion.div>
            <p style={{ fontFamily:IN, fontSize:'.58rem', letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(255,255,255,.15)', marginTop:'.8rem' }}>
              Hepsini görmek için tıkla
            </p>
          </motion.div>
        </section>

        {/* SECRET */}
        <section style={{ maxWidth:400, margin:'0 auto', padding:'0 clamp(1rem,5vw,2.5rem) 6rem', textAlign:'center' }}>
          <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
            <motion.button
              whileHover={{ scale:1.03, boxShadow:`0 0 30px rgba(${d.glowRgb},.3)` }}
              whileTap={{ scale:.97 }}
              onClick={()=>setSecretOpen(true)}
              style={{ background:`rgba(${d.glowRgb},.06)`, border:`1px solid rgba(${d.glowRgb},.2)`, borderRadius:'1rem', padding:'1.2rem 2rem', cursor:'pointer', width:'100%' }}
            >
              <p style={{ fontFamily:IN, fontSize:'.6rem', letterSpacing:'.2em', textTransform:'uppercase', color:`rgba(${d.glowRgb},.45)`, marginBottom:'.4rem' }}>Gizli Mesaj</p>
              <p style={{ fontFamily:CO, fontSize:'.88rem', fontStyle:'italic', color:'rgba(255,255,255,.35)' }}>Bir şey saklandı burada… ✦</p>
            </motion.button>
          </motion.div>
        </section>

      </div>{/* end scrollable */}

      {/* Secret modal */}
      <AnimatePresence>
        {secretOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.88)', backdropFilter:'blur(24px)' }}
            onClick={()=>setSecretOpen(false)}>
            <motion.div initial={{ scale:.8, y:30 }} animate={{ scale:1, y:0 }} exit={{ scale:.8 }} transition={{ type:'spring', stiffness:200, damping:20 }}
              onClick={e=>e.stopPropagation()}
              style={{ maxWidth:'min(90vw,440px)', background:'linear-gradient(160deg, #fdf8f0, #f8f2e6)', borderRadius:'1.2rem', padding:'clamp(1.8rem,5vw,2.8rem)', boxShadow:`0 0 80px rgba(${d.glowRgb},.3), 0 32px 80px rgba(0,0,0,.6)`, textAlign:'center' }}>
              <div style={{ fontSize:'2.4rem', marginBottom:'1.2rem', filter:`drop-shadow(0 0 12px rgba(${d.glowRgb},.6))` }}>{d.emoji}</div>
              <p style={{ fontFamily:HW, fontSize:'clamp(1rem,2.2vw,1.25rem)', color:'#2a1a12', lineHeight:1.8, marginBottom:'1.2rem' }}>{d.secret}</p>
              <div style={{ width:40, height:1, background:d.color, margin:'0 auto', opacity:.4 }} />
            </motion.div>
            <motion.button whileHover={{ rotate:90 }} onClick={()=>setSecretOpen(false)}
              style={{ position:'fixed', top:'1.5rem', right:'1.5rem', background:'rgba(255,255,255,.07)', border:'1px solid rgba(255,255,255,.12)', borderRadius:'50%', width:40, height:40, color:'rgba(255,255,255,.6)', fontSize:'1rem', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              ✕
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position:'absolute', top:0, left:0, right:0, height:70, background:'linear-gradient(to bottom,#000 0%,transparent 100%)', pointerEvents:'none', zIndex:15 }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:70, background:'linear-gradient(to top,#000 0%,transparent 100%)', pointerEvents:'none', zIndex:15 }} />
    </motion.div>
  )
}
