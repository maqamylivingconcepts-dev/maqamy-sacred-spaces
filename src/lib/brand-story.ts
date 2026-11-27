/** Bilingual brand-story paragraphs. Older versions are kept so the story can be switched back. */
export type BrandStoryParagraph = { en: string; ms: string };

/** v1 — original story (Malaysian design house), retired 27 Nov 2026. */
export const brandStoryV1: BrandStoryParagraph[] = [
  {
    en: "MAQAMY is a Malaysian design house dedicated to the art of mindful living, creating contemporary furnishings and considered spaces that bring together design excellence, cultural identity, and spiritual meaning. Rooted in the belief that the home is a sanctuary for the heart, MAQAMY explores how thoughtful design can restore a sense of peace, presence, and connection in everyday life.",
    ms: "MAQAMY ialah sebuah rumah reka bentuk Malaysia yang mengkhusus dalam seni kehidupan penuh kesedaran, menghasilkan perabot kontemporari dan ruang yang dirancang teliti untuk menyatukan kecemerlangan reka bentuk, identiti budaya dan makna kerohanian. Berteraskan kepercayaan bahawa rumah ialah tempat perlindungan bagi hati, MAQAMY meneroka bagaimana reka bentuk yang teliti dapat mengembalikan ketenangan, kehadiran hati dan hubungan dalam kehidupan seharian.",
  },
  {
    en: "Founded on the vision of bringing greater meaning to the spaces in which we live, MAQAMY approaches design as more than an exercise in aesthetics. It is an ongoing exploration of form, material, proportion, and craftsmanship, guided by the timeless principles of Islamic art and architecture and reinterpreted through a contemporary Malaysian perspective.",
    ms: "Diasaskan atas visi untuk membawa makna yang lebih mendalam kepada ruang kehidupan kita, MAQAMY melihat reka bentuk sebagai sesuatu yang melampaui estetika. Ia merupakan penerokaan berterusan terhadap bentuk, bahan, perkadaran dan pertukangan, berpandukan prinsip seni dan seni bina Islam yang abadi serta ditafsir semula melalui perspektif Malaysia kontemporari.",
  },
  {
    en: "Through a commitment to purposeful design and enduring quality, MAQAMY seeks to bridge tradition and modernity, translating cultural heritage into objects and spaces that feel relevant to contemporary living. Each creation reflects a considered balance between simplicity and detail, function and beauty, and the physical environment and the inner experience of those who inhabit it.",
    ms: "Melalui komitmen terhadap reka bentuk yang bermatlamat dan kualiti yang berkekalan, MAQAMY berusaha menghubungkan tradisi dengan kemodenan, menterjemahkan warisan budaya kepada objek dan ruang yang relevan dengan kehidupan kontemporari. Setiap ciptaan mencerminkan keseimbangan yang teliti antara kesederhanaan dan perincian, fungsi dan keindahan, serta persekitaran fizikal dan pengalaman dalaman penghuninya.",
  },
  {
    en: "At the heart of MAQAMY lies the philosophy of Ḥuḍūr al-Qalb — the presence of the heart. This guiding principle inspires a design language that encourages mindfulness, particularly in the sacred moments of prayer and reflection. From thoughtfully designed prayer spaces to complementary furnishings and objects, MAQAMY aspires to make these moments more intentional, meaningful, and deeply personal.",
    ms: "Di teras MAQAMY terletaknya falsafah Ḥuḍūr al-Qalb — kehadiran hati. Prinsip ini mengilhamkan bahasa reka bentuk yang menggalakkan kesedaran, khususnya dalam saat-saat suci solat dan renungan. Daripada ruang solat yang direka dengan teliti hingga perabot dan objek pelengkap, MAQAMY berhasrat menjadikan saat-saat ini lebih terarah, bermakna dan dekat di hati.",
  },
  {
    en: "As a Malaysian design brand with an international outlook, MAQAMY continues to develop its own expression of contemporary Islamic living — one that honours its origins while embracing new possibilities in design, craftsmanship, and spatial experience.",
    ms: "Sebagai jenama reka bentuk Malaysia yang berpandangan antarabangsa, MAQAMY terus membangunkan ekspresinya sendiri tentang kehidupan Islam kontemporari — yang menghormati asal usulnya sambil menerima kemungkinan baharu dalam reka bentuk, pertukangan dan pengalaman ruang.",
  },
];

/** v2 — brand-led story, live from 27 Nov 2026. */
export const brandStoryV2: BrandStoryParagraph[] = [
  {
    en: "MAQAMY is a design house creating spaces that bring the heart into presence. We design furnishings and considered interiors for prayer and reflection — made not to impress, but to quiet the noise and make room for what matters.",
    ms: "MAQAMY ialah rumah reka bentuk yang mencipta ruang untuk menghadirkan hati. Kami mereka perabot dan ruang dalaman untuk solat dan renungan — bukan untuk mengagumkan, tetapi untuk meredakan kebisingan dan memberi ruang kepada perkara yang benar-benar penting.",
  },
  {
    en: "Our name comes from maqām — a station, a place where one stands. Every piece begins with that idea: that where you pray, pause and remember deserves the same care as the rest of your home, if not more.",
    ms: "Nama kami berasal daripada maqām — satu kedudukan, tempat seseorang berdiri. Setiap ciptaan bermula dengan idea itu: bahawa tempat anda solat, berhenti seketika dan mengingati-Nya wajar diberi perhatian yang sama seperti bahagian lain rumah anda, malah lebih lagi.",
  },
  {
    en: "We work through form, material, proportion and craft. Guided by the timeless principles of Islamic art and architecture, we reduce each idea to what is essential, then finish it with the detail it deserves — so every object feels both quiet and complete.",
    ms: "Kami bekerja melalui bentuk, bahan, perkadaran dan pertukangan. Berpandukan prinsip abadi seni dan seni bina Islam, kami memudahkan setiap idea kepada intipatinya, lalu menyempurnakannya dengan perincian yang sewajarnya — supaya setiap objek terasa tenang dan lengkap.",
  },
  {
    en: "At our heart is Ḥuḍūr al-Qalb — the presence of the heart. Devotion cannot be designed, but it can be invited. Our prayer spaces, furnishings and objects are made to do exactly that: to slow you down, to settle the room, and to make each moment of prayer a little more intentional.",
    ms: "Di teras kami terletak Ḥuḍūr al-Qalb — kehadiran hati. Pengabdian tidak boleh direka, namun ia boleh diundang. Ruang solat, perabot dan objek kami dicipta untuk tujuan itu: untuk memperlahankan langkah, menenangkan ruang, dan menjadikan setiap saat solat lebih bermakna.",
  },
  {
    en: "From Malaysia, for the world. Rooted in heritage and made for modern homes everywhere, MAQAMY is shaping its own language of contemporary Islamic living — one space, one moment, one heart at a time.",
    ms: "Dari Malaysia, untuk dunia. Berakar pada warisan dan dicipta untuk rumah moden di mana-mana, MAQAMY sedang membentuk bahasanya sendiri tentang kehidupan Islam kontemporari — satu ruang, satu saat, satu hati pada satu masa.",
  },
];

/** The version shown on the story page. */
export const brandStory = brandStoryV2;
