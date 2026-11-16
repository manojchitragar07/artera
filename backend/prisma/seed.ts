import { PrismaClient, Role, AccountStatus, ArtworkStatus, ExhibitionStatus, EnquiryStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting ARTÉRA Seed Script ---');

  // Clean existing data in reverse order of dependencies
  await prisma.adminAuditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.artworkView.deleteMany({});
  await prisma.exhibitionArtwork.deleteMany({});
  await prisma.exhibition.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.collectionArtwork.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.artistFollow.deleteMany({});
  await prisma.favourite.deleteMany({});
  await prisma.artworkImage.deleteMany({});
  await prisma.artwork.deleteMany({});
  await prisma.medium.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.visitorProfile.deleteMany({});
  await prisma.artistProfile.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✓ Cleaned existing tables');

  // 1. Categories
  const categoriesData = [
    {
      name: 'Canvas Painting',
      slug: 'canvas-painting',
      description: 'Masterful oil and acrylic paintings on hand-stretched canvas and Belgian linen.',
      coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Watercolour',
      slug: 'watercolour',
      description: 'Transparent pigments and delicate washes on archival cotton rag paper.',
      coverImage: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Sketches & Charcoal',
      slug: 'sketches-charcoal',
      description: 'Intimate figurative studies, charcoal drawings, and fine graphite portraiture.',
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Sculpture & Bronze',
      slug: 'sculpture-bronze',
      description: 'Three-dimensional forms cast in bronze, carved in marble, and shaped from stone.',
      coverImage: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Pottery & Ceramics',
      slug: 'pottery-ceramics',
      description: 'Wheel-thrown pottery, wood-fired stoneware, and hand-sculpted ceramic vessels.',
      coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Traditional Crafts',
      slug: 'traditional-crafts',
      description: 'Centuries-old artisan techniques including woodcarving, metal repoussé, and textiles.',
      coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Murals & Frescoes',
      slug: 'murals-frescoes',
      description: 'Monumental architectural paintings, true fresco on lime plaster, and wall narratives.',
      coverImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
    },
    {
      name: 'Folk & Cultural Art',
      slug: 'folk-cultural-art',
      description: 'Indigenous motifs, cultural heritage storytelling, and mythological expressions.',
      coverImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.create({ data: cat });
  }
  console.log(`✓ Seeded ${categoriesData.length} categories`);

  // 2. Mediums
  const mediumsData = [
    { name: 'Oil on Canvas', slug: 'oil-on-canvas', description: 'Layered classical oils with glaze techniques.' },
    { name: 'Pure Watercolour on Rag Paper', slug: 'pure-watercolour', description: 'Artist-grade transparent watercolors.' },
    { name: 'Charcoal & Graphite on Archival Paper', slug: 'charcoal-graphite', description: 'Deep vine charcoal and compressed graphite.' },
    { name: 'Lost-Wax Cast Bronze', slug: 'cast-bronze', description: 'Solid foundry bronze with hand-applied patina.' },
    { name: 'Wood-Fired Stoneware & Glaze', slug: 'stoneware-ceramic', description: 'High-temperature anagama wood-fired clay.' },
    { name: 'Terracotta & Mineral Slip', slug: 'terracotta', description: 'Porous earthenware clay with natural ochres.' },
    { name: 'Carved Walnut & Oak', slug: 'carved-wood', description: 'Sculpted native hardwood finished with beeswax.' },
    { name: 'Natural Mineral Pigments & Gold Leaf', slug: 'mineral-gold-leaf', description: 'Lapis lazuli, malachite, and 24K gold foil.' },
    { name: 'Acrylic & Mixed Media on Linen', slug: 'acrylic-mixed-media', description: 'Heavy body acrylic combined with raw textural fibers.' },
  ];

  const mediums: Record<string, any> = {};
  for (const med of mediumsData) {
    mediums[med.slug] = await prisma.medium.create({ data: med });
  }
  console.log(`✓ Seeded ${mediumsData.length} mediums`);

  // 3. User Accounts (Admin, Demo Artist, Demo Visitor)
  const defaultPassword = await bcrypt.hash('Admin@123456', 12);
  const artistPassword = await bcrypt.hash('Artist@123456', 12);
  const visitorPassword = await bcrypt.hash('Visitor@123456', 12);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@artera.art',
      password: defaultPassword,
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
    },
  });

  const demoVisitorUser = await prisma.user.create({
    data: {
      email: 'visitor@artera.art',
      password: visitorPassword,
      role: Role.VISITOR,
      status: AccountStatus.ACTIVE,
      visitorProfile: {
        create: {
          name: 'Julian Sterling',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          bio: 'Connoisseur of traditional European classical painting and Japanese wood-fired ceramic vessels.',
          location: 'London, United Kingdom',
        },
      },
    },
    include: { visitorProfile: true },
  });

  console.log('✓ Seeded Admin and Demo Visitor accounts');

  // 4. Seed 8 Realistic Traditional Artists
  const artistsData = [
    {
      email: 'artist@artera.art', // Demo Artist Account
      password: artistPassword,
      name: 'Elena Rostova',
      slug: 'elena-rostova',
      speciality: 'Classical Oil Painting & Chiaroscuro Portraits',
      disciplines: 'Oil on Canvas, Linen, Renaissance Glazing',
      location: 'Florence, Italy',
      yearsOfExperience: 18,
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
      website: 'https://elenarostova.art',
      instagram: '@elena_rostova_art',
      bio: 'Trained at the Accademia di Belle Arti in Florence, Elena practices indirect oil painting inspired by Rembrandt and Caravaggio. Her work emphasizes emotional gravity, rich impasto, and luminous translucent glazing.',
      statement: 'I believe the human countenance carries the quiet history of eternity. Through patience and the slow layering of oil, I aim to evoke the presence of the soul beneath the surface.',
      featured: true,
    },
    {
      email: 'aarav.sharma@artera.art',
      password: defaultPassword,
      name: 'Aarav Sharma',
      slug: 'aarav-sharma',
      speciality: 'Heritage Miniature & Mineral Pigment Painting',
      disciplines: 'Natural Pigments, Squirrel Hair Brush, 24K Gold Leaf',
      location: 'Jaipur, Rajasthan, India',
      yearsOfExperience: 22,
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80',
      website: 'https://aaravsharma-heritage.art',
      instagram: '@aarav_jaipur_art',
      bio: 'A fourth-generation practitioner of the Kishangarh and Mughal court painting tradition. Aarav grinds his own pigments from lapis lazuli, cinnabar, and malachite, applying 24K gold foil burnished with agate stone.',
      statement: 'Every brushstroke is a meditation on memory. Miniature art demands that the viewer step closer and quiet their mind to receive the detail of the universe.',
      featured: true,
    },
    {
      email: 'clara.beauchamp@artera.art',
      password: defaultPassword,
      name: 'Clara Beauchamp',
      slug: 'clara-beauchamp',
      speciality: 'Anatomical Sketching & Charcoal Figurative Art',
      disciplines: 'Vine Charcoal, Sanguine Conté, Toned Archival Paper',
      location: 'Paris, France',
      yearsOfExperience: 14,
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
      website: 'https://clarabeauchamp.fr',
      instagram: '@clara_atelier_paris',
      bio: 'Formed in classical atelier ateliers in Montmartre, Clara investigates the mechanical architecture and subtle posture of the human form using raw charcoal and chalk highlights on raw linen paper.',
      statement: 'Charcoal is the earth speaking directly through burnt willow. It leaves no room for hesitation; each mark is an uncompromising commitment.',
      featured: true,
    },
    {
      email: 'mateo.alvarez@artera.art',
      password: defaultPassword,
      name: 'Mateo Álvarez',
      slug: 'mateo-alvarez',
      speciality: 'Foundry Bronze Sculpture & Lost-Wax Casting',
      disciplines: 'Molten Bronze, Acid Patinas, Hand-Chiseled Stone',
      location: 'Oaxaca, Mexico',
      yearsOfExperience: 25,
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=1600&q=80',
      website: 'https://mateoalvarez-escultura.com',
      instagram: '@mateo_alvarez_sculptor',
      bio: 'Mateo operates an independent bronze foundry outside Oaxaca, synthesizing pre-Columbian organic rhythms with dynamic classical anatomical tension.',
      statement: 'To cast bronze is to capture liquid fire and freeze it into enduring gravity. My sculptures breathe through their weathered patinas.',
      featured: true,
    },
    {
      email: 'sarah.macleod@artera.art',
      password: defaultPassword,
      name: 'Sarah MacLeod',
      slug: 'sarah-macleod',
      speciality: 'Wood-Fired Anagama Ceramics & Stoneware',
      disciplines: 'High-fire Stoneware, Feldspar Glazes, Native Scottish Clays',
      location: 'Edinburgh, Scotland',
      yearsOfExperience: 16,
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=80',
      website: 'https://macleod-pottery.scot',
      instagram: '@macleod_ceramics',
      bio: 'Drawing clays directly from the Scottish highlands, Sarah fires an authentic single-chamber anagama wood kiln continuously for four days, allowing natural ash fly to create one-of-a-kind surfaces.',
      statement: 'The kiln is an unpredictable collaborator. I shape the vessel, but it is the flame and ash that write its true story.',
      featured: true,
    },
    {
      email: 'gabriel.vance@artera.art',
      password: defaultPassword,
      name: 'Gabriel Vance',
      slug: 'gabriel-vance',
      speciality: 'Atmospheric Plein Air Watercolor',
      disciplines: 'Pure Watercolor, Rough Cold-Press Cotton, Natural Sponges',
      location: 'Santa Fe, New Mexico, USA',
      yearsOfExperience: 20,
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1600&q=80',
      website: 'https://gabrielvanceart.com',
      instagram: '@gabriel_vance_watercolor',
      bio: 'Renowned for his evocative depictions of high-desert atmospheric light, canyon storms, and morning mists. Gabriel paints exclusively on location using rapid wet-in-wet wash techniques.',
      statement: 'Watercolor is the art of surrender. You cannot dictate to water; you can only invite it to dance across the paper and seize the fleeting light.',
      featured: true,
    },
    {
      email: 'mei.ling.chen@artera.art',
      password: defaultPassword,
      name: 'Mei-Ling Chen',
      slug: 'mei-ling-chen',
      speciality: 'Classical Sumi-e & Xuan Paper Wash',
      disciplines: 'Pine Soot Ink, Goat Hair Brush, Mulberry Xuan Paper',
      location: 'Kyoto, Japan',
      yearsOfExperience: 19,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1600&q=80',
      website: 'https://meilingchen-ink.jp',
      instagram: '@meiling_inkwash',
      bio: 'Raised in Taipei and now working in a secluded studio in Kyoto, Mei-Ling creates monumental ink wash compositions honoring the Song Dynasty masters while celebrating negative space (Ma).',
      statement: 'White space is not emptiness; it is the pregnant breath before creation. One brushmark must hold the energy of ten thousand mountains.',
      featured: true,
    },
    {
      email: 'tenzin.norbu@artera.art',
      password: defaultPassword,
      name: 'Tenzin Norbu',
      slug: 'tenzin-norbu',
      speciality: 'Sacred Mineral Plaster Murals & Frescoes',
      disciplines: 'Lime Plaster, Crushed Gemstones, Yak Hide Glue Binder',
      location: 'Dharamsala, India',
      yearsOfExperience: 30,
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      coverImage: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80',
      website: 'https://tenzinnorbu-frescoes.org',
      instagram: '@tenzin_sacred_murals',
      bio: 'Master fresco painter preserving centuries-old Himalayan iconographic formulas. Tenzin formulates wet slaked lime plasters and applies powdered lapis, cinnabar, and gold leaf with exquisite sacred proportions.',
      statement: 'Sacred painting is an architecture for the mind. It is constructed to bring harmony, stillness, and spiritual refuge to whoever stands before it.',
      featured: false,
    },
  ];

  const artists: Record<string, any> = {};

  for (const art of artistsData) {
    const user = await prisma.user.create({
      data: {
        email: art.email,
        password: art.password,
        role: Role.ARTIST,
        status: AccountStatus.ACTIVE,
        artistProfile: {
          create: {
            name: art.name,
            slug: art.slug,
            speciality: art.speciality,
            disciplines: art.disciplines,
            location: art.location,
            yearsOfExperience: art.yearsOfExperience,
            profileImage: art.profileImage,
            coverImage: art.coverImage,
            website: art.website,
            instagram: art.instagram,
            bio: art.bio,
            statement: art.statement,
            featured: art.featured,
          },
        },
      },
      include: { artistProfile: true },
    });
    artists[art.slug] = user.artistProfile;
  }

  console.log(`✓ Seeded ${artistsData.length} master artists`);

  // 5. Seed 22 Masterpiece Artworks across diverse traditional disciplines
  const artworksData = [
    // Elena Rostova (Oil)
    {
      artistSlug: 'elena-rostova',
      categorySlug: 'canvas-painting',
      mediumSlug: 'oil-on-canvas',
      title: 'Solitude of the Old Atelier',
      slug: 'solitude-of-the-old-atelier',
      description: 'An evocative chiaroscuro study of natural afternoon light striking an antique wooden easel and draped linen in an undisturbed Florentine studio.',
      dimensions: '100 x 130 cm (39.4 x 51.2 in)',
      creationYear: 2024,
      price: 6800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      tags: 'oil,figurative,atelier,chiaroscuro,florence',
      viewsCount: 342,
      favoritesCount: 48,
    },
    {
      artistSlug: 'elena-rostova',
      categorySlug: 'canvas-painting',
      mediumSlug: 'oil-on-canvas',
      title: 'Portrait in Amber and Shadow',
      slug: 'portrait-in-amber-and-shadow',
      description: 'Layered portrait executed using authentic Venetian glaze techniques over a warm verdaccio underpainting. The subject glances toward an off-canvas window light.',
      dimensions: '75 x 95 cm (29.5 x 37.4 in)',
      creationYear: 2023,
      price: 8400,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-gold',
      primaryImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      tags: 'oil,portrait,classical,amber,venetian',
      viewsCount: 512,
      favoritesCount: 89,
    },
    {
      artistSlug: 'elena-rostova',
      categorySlug: 'canvas-painting',
      mediumSlug: 'oil-on-canvas',
      title: 'Tuscan Twilight Over Val d’Orcia',
      slug: 'tuscan-twilight-over-val-dorcia',
      description: 'Sweeping plein air oil painting on Belgian linen capturing the golden hour shadows elongating across cypress groves and ancient stone farmhouses.',
      dimensions: '120 x 80 cm (47.2 x 31.5 in)',
      creationYear: 2024,
      price: 5200,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&w=1200&q=85',
      tags: 'landscape,tuscany,oil,plein-air,cypress',
      viewsCount: 220,
      favoritesCount: 31,
    },

    // Aarav Sharma (Miniature & Cultural)
    {
      artistSlug: 'aarav-sharma',
      categorySlug: 'folk-cultural-art',
      mediumSlug: 'mineral-gold-leaf',
      title: 'The Peacock Pavilion at Moonrise',
      slug: 'the-peacock-pavilion-at-moonrise',
      description: 'Intricately detailed miniature painting created with single-hair squirrel brushes. Embellished with 24-karat crushed gold leaf depicting royal peacocks under marble arches.',
      dimensions: '40 x 55 cm (15.7 x 21.6 in)',
      creationYear: 2024,
      price: 4900,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-gold',
      primaryImageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
      tags: 'miniature,rajasthan,gold-leaf,peacock,heritage',
      viewsCount: 460,
      favoritesCount: 67,
    },
    {
      artistSlug: 'aarav-sharma',
      categorySlug: 'folk-cultural-art',
      mediumSlug: 'mineral-gold-leaf',
      title: 'Lapis Celestial Garden',
      slug: 'lapis-celestial-garden',
      description: 'Natural ultramarine blue grounded from genuine Badakhshan lapis lazuli, illuminated with delicate golden floral vines depicting classical Krishna motifs.',
      dimensions: '50 x 70 cm (19.7 x 27.5 in)',
      creationYear: 2023,
      price: 6200,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85',
      tags: 'lapis-lazuli,spiritual,traditional,gold,jaipur',
      viewsCount: 310,
      favoritesCount: 42,
    },

    // Clara Beauchamp (Sketches & Charcoal)
    {
      artistSlug: 'clara-beauchamp',
      categorySlug: 'sketches-charcoal',
      mediumSlug: 'charcoal-graphite',
      title: 'Anatomy of Motion: The Contemplative Dancer',
      slug: 'anatomy-of-motion-the-contemplative-dancer',
      description: 'Large-scale charcoal and white chalk study executed from life at the Palais Garnier studio. The raw vine charcoal captures muscle tension and fleeting balance.',
      dimensions: '90 x 120 cm (35.4 x 47.2 in)',
      creationYear: 2024,
      price: 3600,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
      tags: 'charcoal,sketch,dancer,ballet,figurative',
      viewsCount: 388,
      favoritesCount: 54,
    },
    {
      artistSlug: 'clara-beauchamp',
      categorySlug: 'sketches-charcoal',
      mediumSlug: 'charcoal-graphite',
      title: 'Study of Hands and Drapery',
      slug: 'study-of-hands-and-drapery',
      description: 'Classical academic study on toned hand-milled French rag paper exploring the subtle folds of heavy linen fabric and the weathered knuckles of a sculptor.',
      dimensions: '60 x 80 cm (23.6 x 31.5 in)',
      creationYear: 2023,
      price: 2400,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85',
      tags: 'graphite,drawing,hands,drapery,atelier',
      viewsCount: 195,
      favoritesCount: 28,
    },

    // Mateo Alvarez (Bronze & Sculpture)
    {
      artistSlug: 'mateo-alvarez',
      categorySlug: 'sculpture-bronze',
      mediumSlug: 'cast-bronze',
      title: 'The Sentinel of Monte Albán',
      slug: 'the-sentinel-of-monte-alban',
      description: 'Solid foundry bronze cast using the ancestral lost-wax process. Finished with a multi-layered emerald and liver-of-sulfur acid patina.',
      dimensions: '58 x 34 x 26 cm (22.8 x 13.4 x 10.2 in)',
      creationYear: 2024,
      price: 11500,
      isForSale: false,
      isEnquiryOnly: true,
      isFeatured: true,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=1200&q=85',
      tags: 'sculpture,bronze,lost-wax,patina,monumental',
      viewsCount: 640,
      favoritesCount: 92,
    },
    {
      artistSlug: 'mateo-alvarez',
      categorySlug: 'sculpture-bronze',
      mediumSlug: 'cast-bronze',
      title: 'Embrace in Chiseled Basalt and Bronze',
      slug: 'embrace-in-chiseled-basalt-and-bronze',
      description: 'Two interlocking abstract figurative silhouettes rising out of a raw hand-quarried volcanic basalt plinth.',
      dimensions: '72 x 40 x 30 cm (28.3 x 15.7 x 11.8 in)',
      creationYear: 2023,
      price: 9800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=85',
      tags: 'sculpture,bronze,basalt,duo,mexico',
      viewsCount: 290,
      favoritesCount: 39,
    },

    // Sarah MacLeod (Pottery & Ceramics)
    {
      artistSlug: 'sarah-macleod',
      categorySlug: 'pottery-ceramics',
      mediumSlug: 'stoneware-ceramic',
      title: 'Hebridean Anagama Ash-Glazed Urn',
      slug: 'hebridean-anagama-ash-glazed-urn',
      description: 'A monumental wood-fired stoneware vessel fired for 96 hours in an anagama tunnel kiln. Natural pine ash melt has created dripping amber and jade glaze patterns.',
      dimensions: '45 x 42 x 42 cm (17.7 x 16.5 x 16.5 in)',
      creationYear: 2024,
      price: 3200,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85',
      tags: 'ceramics,anagama,pottery,woodfired,stoneware',
      viewsCount: 410,
      favoritesCount: 63,
    },
    {
      artistSlug: 'sarah-macleod',
      categorySlug: 'pottery-ceramics',
      mediumSlug: 'terracotta',
      title: 'Terra Incognita: Three Ceremonial Vessels',
      slug: 'terra-incognita-three-ceremonial-vessels',
      description: 'Trio of hand-burnished porous terracotta vessels coated in wild iron slips harvested from riverbeds in the Scottish Highlands.',
      dimensions: '30 x 20 x 20 cm each',
      creationYear: 2023,
      price: 2100,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=85',
      tags: 'terracotta,vessels,clay,scotland,burnished',
      viewsCount: 260,
      favoritesCount: 35,
    },

    // Gabriel Vance (Watercolor)
    {
      artistSlug: 'gabriel-vance',
      categorySlug: 'watercolour',
      mediumSlug: 'pure-watercolour',
      title: 'Sangre de Cristo Morning Mist',
      slug: 'sangre-de-cristo-morning-mist',
      description: 'Atmospheric plein air watercolor on 640gsm Arches rough paper. Masterful negative space and soft-edge blooms capture early mountain fog burning away under dawn sunlight.',
      dimensions: '56 x 76 cm (22 x 30 in)',
      creationYear: 2024,
      price: 2900,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=85',
      tags: 'watercolor,landscape,mountain,mist,santafe',
      viewsCount: 375,
      favoritesCount: 51,
    },
    {
      artistSlug: 'gabriel-vance',
      categorySlug: 'watercolour',
      mediumSlug: 'pure-watercolour',
      title: 'Rio Grande Basin Storm Clouds',
      slug: 'rio-grande-basin-storm-clouds',
      description: 'Dramatic indigo and cobalt wash technique rendering a thunderhead passing over the high desert plateau with razor-sharp light breaks.',
      dimensions: '50 x 70 cm (19.7 x 27.5 in)',
      creationYear: 2023,
      price: 3400,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      tags: 'watercolor,storm,newmexico,indigo,light',
      viewsCount: 315,
      favoritesCount: 44,
    },

    // Mei-Ling Chen (Ink Wash & Mixed Media)
    {
      artistSlug: 'mei-ling-chen',
      categorySlug: 'mixed-media',
      mediumSlug: 'mineral-gold-leaf',
      title: 'Echoes of the Dragon Pines',
      slug: 'echoes-of-the-dragon-pines',
      description: 'Traditional pine-soot ink wash (Sumi-e) on raw mulberry paper, accented with delicate veins of beaten silver leaf. Contemplating the resilience of ancient trees in winter.',
      dimensions: '140 x 70 cm (55.1 x 27.5 in)',
      creationYear: 2024,
      price: 5800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: true,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      tags: 'ink,sumi-e,kyoto,pines,zen',
      viewsCount: 490,
      favoritesCount: 78,
    },
    {
      artistSlug: 'mei-ling-chen',
      categorySlug: 'mixed-media',
      mediumSlug: 'pure-watercolour',
      title: 'The Quiet Crossing: River Mist in Winter',
      slug: 'the-quiet-crossing-river-mist-in-winter',
      description: 'Minimalist horizontal scroll format depicting a lone fisherman boat navigating a fog-shrouded gorge in the northern mountains of Taiwan.',
      dimensions: '35 x 120 cm (13.8 x 47.2 in)',
      creationYear: 2023,
      price: 4200,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      tags: 'ink,scroll,minimalism,fog,river',
      viewsCount: 295,
      favoritesCount: 38,
    },

    // Tenzin Norbu (Murals & Frescoes)
    {
      artistSlug: 'tenzin-norbu',
      categorySlug: 'murals-frescoes',
      mediumSlug: 'mineral-gold-leaf',
      title: 'Wheel of Transience: Sacred Plaster Panel',
      slug: 'wheel-of-transience-sacred-plaster-panel',
      description: 'Genuine fresco panel painted on fresh wet slaked-lime plaster using pure lapis lazuli, vermilion, and malachite bound with natural resins.',
      dimensions: '150 x 150 cm (59 x 59 in)',
      creationYear: 2024,
      price: 14000,
      isForSale: false,
      isEnquiryOnly: true,
      isFeatured: true,
      frameStyle: 'frame-gold',
      primaryImageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=85',
      tags: 'fresco,mural,sacred,himalayas,lapis',
      viewsCount: 780,
      favoritesCount: 110,
    },
    {
      artistSlug: 'tenzin-norbu',
      categorySlug: 'murals-frescoes',
      mediumSlug: 'mineral-gold-leaf',
      title: 'The White Tara of Compassion',
      slug: 'the-white-tara-of-compassion',
      description: 'Iconographic sacred painting rendered with exact proportional grid lines. The eyes are painted in pristine silver and gold leaf.',
      dimensions: '90 x 120 cm (35.4 x 47.2 in)',
      creationYear: 2023,
      price: 8800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame-gold',
      primaryImageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85',
      tags: 'fresco,tara,compassion,sacred-art,gold',
      viewsCount: 450,
      favoritesCount: 65,
    },

    // More masterpieces across categories
    {
      artistSlug: 'elena-rostova',
      categorySlug: 'canvas-painting',
      mediumSlug: 'oil-on-canvas',
      title: 'Still Life with Quince and Pewter',
      slug: 'still-life-with-quince-and-pewter',
      description: 'Rich Dutch Golden Age inspired still life exploring tactile textures: velvet drape, oxidized pewter goblet, and bruised ripe quince.',
      dimensions: '70 x 90 cm (27.5 x 35.4 in)',
      creationYear: 2024,
      price: 4800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=85',
      tags: 'oil,still-life,pewter,quince,dutch',
      viewsCount: 230,
      favoritesCount: 34,
    },
    {
      artistSlug: 'mateo-alvarez',
      categorySlug: 'traditional-crafts',
      mediumSlug: 'carved-wood',
      title: 'Ancestral Jaguar Mask in Wild Walnut',
      slug: 'ancestral-jaguar-mask-in-wild-walnut',
      description: 'Hand-carved from a single log of cured Oaxacan walnut. Features obsidian stone inlays and finished with heated beeswax and copal resin.',
      dimensions: '42 x 30 x 20 cm (16.5 x 11.8 x 7.8 in)',
      creationYear: 2024,
      price: 3800,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=85',
      tags: 'woodcarving,mask,walnut,jaguar,craft',
      viewsCount: 275,
      favoritesCount: 40,
    },
    {
      artistSlug: 'clara-beauchamp',
      categorySlug: 'sketches-charcoal',
      mediumSlug: 'charcoal-graphite',
      title: 'Portrait of an Elder: Life Lines',
      slug: 'portrait-of-an-elder-life-lines',
      description: 'Intense charcoal study magnifying the deep character lines and dignity of an octogenarian stonemason from Normandy.',
      dimensions: '65 x 85 cm (25.6 x 33.5 in)',
      creationYear: 2024,
      price: 3100,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame-walnut',
      primaryImageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
      tags: 'charcoal,portrait,elder,lines,expressive',
      viewsCount: 320,
      favoritesCount: 46,
    },
    {
      artistSlug: 'sarah-macleod',
      categorySlug: 'pottery-ceramics',
      mediumSlug: 'stoneware-ceramic',
      title: 'Shino Glaze Tea Bowl (Chawan)',
      slug: 'shino-glaze-tea-bowl-chawan',
      description: 'Wheel-thrown and intentionally deformed tea ceremony bowl, coated with thick feldspathic Shino glaze showing fire-orange carbon trap markings.',
      dimensions: '14 x 14 x 9 cm (5.5 x 5.5 x 3.5 in)',
      creationYear: 2024,
      price: 950,
      isForSale: true,
      isEnquiryOnly: false,
      isFeatured: false,
      frameStyle: 'frame',
      primaryImageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=85',
      tags: 'chawan,tea-bowl,shino,ceramics,wabi-sabi',
      viewsCount: 380,
      favoritesCount: 52,
    },
  ];

  const createdArtworks: any[] = [];

  for (const art of artworksData) {
    const artist = artists[art.artistSlug];
    const category = categories[art.categorySlug];
    const medium = mediums[art.mediumSlug];

    if (artist && category) {
      const artwork = await prisma.artwork.create({
        data: {
          artistId: artist.id,
          categoryId: category.id,
          mediumId: medium ? medium.id : null,
          title: art.title,
          slug: art.slug,
          description: art.description,
          dimensions: art.dimensions,
          creationYear: art.creationYear,
          price: art.price,
          isForSale: art.isForSale,
          isEnquiryOnly: art.isEnquiryOnly,
          status: ArtworkStatus.PUBLISHED,
          isFeatured: art.isFeatured,
          frameStyle: art.frameStyle,
          tags: art.tags,
          viewsCount: art.viewsCount,
          favoritesCount: art.favoritesCount,
          primaryImageUrl: art.primaryImageUrl,
          images: {
            create: [
              {
                url: art.primaryImageUrl,
                isPrimary: true,
                order: 0,
                caption: 'Primary Gallery View',
              },
              {
                url: art.primaryImageUrl,
                isPrimary: false,
                order: 1,
                caption: 'Detail Texture & Impasto View',
              },
            ],
          },
        },
      });
      createdArtworks.push(artwork);
    }
  }

  console.log(`✓ Seeded ${createdArtworks.length} museum-grade artworks`);

  // 6. Curated Exhibitions
  const exhibitionsData = [
    {
      title: 'The Art of Tradition: Lineage and Craft',
      slug: 'the-art-of-tradition',
      subtitle: 'A survey of master artists preserving manual disciplines across continents',
      curatorStatement: 'In an era dominated by instantaneous synthetic reproduction, The Art of Tradition honors the artists whose work remains rooted in direct human tactile engagement. From the molten bronze foundries of Oaxaca to the stone-ground mineral pigments of Rajasthan, this exhibition gathers artists who dedicate decades to physical mastery.',
      coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
      startDate: new Date('2025-01-15T00:00:00Z'),
      endDate: new Date('2025-06-30T00:00:00Z'),
      status: ExhibitionStatus.ONGOING,
      featured: true,
      artworkSlugs: [
        'solitude-of-the-old-atelier',
        'the-peacock-pavilion-at-moonrise',
        'the-sentinel-of-monte-alban',
        'hebridean-anagama-ash-glazed-urn',
      ],
    },
    {
      title: 'Portraits and Expressions: The Human Gaze',
      slug: 'portraits-and-expressions',
      subtitle: 'Chiaroscuro, charcoal, and the psychological architecture of the countenance',
      curatorStatement: 'What does a painted or sketched portrait reveal that a lens cannot capture? This exhibition interrogates the silent dialogues between traditional portraitists and their sitters, featuring oil glazing and vine charcoal studies from Paris and Florence.',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
      startDate: new Date('2025-02-01T00:00:00Z'),
      endDate: new Date('2025-07-15T00:00:00Z'),
      status: ExhibitionStatus.ONGOING,
      featured: true,
      artworkSlugs: [
        'portrait-in-amber-and-shadow',
        'anatomy-of-motion-the-contemplative-dancer',
        'study-of-hands-and-drapery',
        'portrait-of-an-elder-life-lines',
      ],
    },
    {
      title: 'Beyond the Canvas: Form, Fire & Bronze',
      slug: 'beyond-the-canvas',
      subtitle: 'Tactile investigations into wood-fired stoneware and lost-wax cast sculpture',
      curatorStatement: 'Crossing the boundary between functional utility and pure sculptural contemplation. Featuring unglazed terracotta slips, anagama kiln deposits, and cast foundry bronze.',
      coverImage: 'https://images.unsplash.com/photo-1558865869-c93f6f8482af?auto=format&fit=crop&w=1600&q=80',
      startDate: new Date('2025-03-01T00:00:00Z'),
      endDate: new Date('2025-08-31T00:00:00Z'),
      status: ExhibitionStatus.UPCOMING,
      featured: true,
      artworkSlugs: [
        'the-sentinel-of-monte-alban',
        'hebridean-anagama-ash-glazed-urn',
        'terra-incognita-three-ceremonial-vessels',
        'ancestral-jaguar-mask-in-wild-walnut',
      ],
    },
    {
      title: 'Colours of Culture: Earth and Spirit',
      slug: 'colours-of-culture',
      subtitle: 'Sacred mineral frescoes, illuminated gold leaf, and high-desert watercolor washes',
      curatorStatement: 'A spiritual expedition into sacred palettes. Artists harness pure lapis lazuli, crushed malachite, and natural ochres to manifest cultural cosmologies.',
      coverImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1600&q=80',
      startDate: new Date('2025-04-10T00:00:00Z'),
      endDate: new Date('2025-09-30T00:00:00Z'),
      status: ExhibitionStatus.UPCOMING,
      featured: false,
      artworkSlugs: [
        'wheel-of-transience-sacred-plaster-panel',
        'the-peacock-pavilion-at-moonrise',
        'sangre-de-cristo-morning-mist',
        'echoes-of-the-dragon-pines',
      ],
    },
  ];

  for (const exh of exhibitionsData) {
    const exhibition = await prisma.exhibition.create({
      data: {
        title: exh.title,
        slug: exh.slug,
        subtitle: exh.subtitle,
        curatorStatement: exh.curatorStatement,
        coverImage: exh.coverImage,
        startDate: exh.startDate,
        endDate: exh.endDate,
        status: exh.status,
        featured: exh.featured,
      },
    });

    const matchingArtworks = createdArtworks.filter((a) => exh.artworkSlugs.includes(a.slug));
    for (let i = 0; i < matchingArtworks.length; i++) {
      await prisma.exhibitionArtwork.create({
        data: {
          exhibitionId: exhibition.id,
          artworkId: matchingArtworks[i].id,
          order: i,
          curatorNotes: `Featured selection for ${exh.title}`,
        },
      });
    }
  }

  console.log(`✓ Seeded ${exhibitionsData.length} curated exhibitions`);

  // 7. Seed Initial Favourites and Following for Demo Visitor
  if (demoVisitorUser.visitorProfile && createdArtworks.length > 0) {
    const visitorProfileId = demoVisitorUser.visitorProfile.id;

    // Favourites
    const favArtworks = createdArtworks.slice(0, 5);
    for (const art of favArtworks) {
      await prisma.favourite.create({
        data: {
          visitorId: visitorProfileId,
          artworkId: art.id,
        },
      });
    }

    // Follow artists
    const followedArtists = Object.values(artists).slice(0, 3);
    for (const art of followedArtists) {
      await prisma.artistFollow.create({
        data: {
          visitorId: visitorProfileId,
          artistId: art.id,
        },
      });
    }

    // Seed Visitor Personal Collection
    const collection = await prisma.collection.create({
      data: {
        visitorId: visitorProfileId,
        title: 'Masterpieces for the Private Salon',
        slug: 'masterpieces-for-the-private-salon',
        description: 'A curated selection of classical figurative oils and wood-fired ceramics selected for my residence.',
        isPublic: true,
        coverImage: favArtworks[0].primaryImageUrl,
      },
    });

    for (let i = 0; i < 3; i++) {
      await prisma.collectionArtwork.create({
        data: {
          collectionId: collection.id,
          artworkId: favArtworks[i].id,
          order: i,
        },
      });
    }

    // Seed Enquiries
    await prisma.enquiry.create({
      data: {
        visitorId: visitorProfileId,
        artistId: artists['elena-rostova'].id,
        artworkId: createdArtworks[0].id,
        senderName: demoVisitorUser.visitorProfile.name,
        senderEmail: demoVisitorUser.email,
        senderPhone: '+44 20 7946 0991',
        subject: 'Acquisition & Private Viewing Enquiry for "Solitude of the Old Atelier"',
        message: 'Dear Elena, I have long admired your chiaroscuro works. I am deeply interested in acquiring this piece for our family collection in London. Could you provide details regarding international shipping with museum crate packaging?',
        status: EnquiryStatus.IN_PROGRESS,
        artistResponse: 'Dear Julian, thank you for your kind words and appreciation. The painting is currently varnished and ready. I work with a certified Florentine fine-art courier who specializes in climate-controlled museum shipments. I would be pleased to arrange a private video consultation to review the surface details.',
        respondedAt: new Date(),
      },
    });

    await prisma.enquiry.create({
      data: {
        visitorId: visitorProfileId,
        artistId: artists['mateo-alvarez'].id,
        artworkId: createdArtworks.find((a) => a.slug === 'the-sentinel-of-monte-alban')?.id,
        senderName: demoVisitorUser.visitorProfile.name,
        senderEmail: demoVisitorUser.email,
        subject: 'Commission Enquiry for Outdoor Bronze Sculpture',
        message: 'Dear Maestro Álvarez, I am inquiring whether you accept private garden commissions in a similar spirit to The Sentinel of Monte Albán. We have an estate courtyard that would be elevated by your sculptural language.',
        status: EnquiryStatus.PENDING,
      },
    });
  }

  // 8. Seed Admin Audit Log
  await prisma.adminAuditLog.create({
    data: {
      adminId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      targetType: 'System',
      targetId: 'root',
      details: JSON.stringify({ message: 'ARTÉRA production database seeded successfully with 8 master artists and 22 artworks.' }),
    },
  });

  console.log('--- ARTÉRA Seed Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

