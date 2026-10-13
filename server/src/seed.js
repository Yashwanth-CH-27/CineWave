require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Video = require('./models/Video');
const Watchlist = require('./models/Watchlist');
const Payment = require('./models/Payment');

async function seedData() {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Video.deleteMany({});
    await Watchlist.deleteMany({});
    await Payment.deleteMany({});

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const creatorPasswordHash = await bcrypt.hash('creator123', salt);
    const userPasswordHash = await bcrypt.hash('user123', salt);
    const premiumPasswordHash = await bcrypt.hash('premium123', salt);

    console.log('[Seed] Creating demo users...');
    // 1. Primary Creator
    const creator1 = await User.create({
      name: 'Christopher Nolan (Creator Studio)',
      email: 'creator@cinewave.com',
      passwordHash: creatorPasswordHash,
      role: 'CREATOR',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    // 2. Second Creator
    const creator2 = await User.create({
      name: 'Ava DuVernay (Indie Studio)',
      email: 'ava@cinewave.com',
      passwordHash: creatorPasswordHash,
      role: 'CREATOR',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    // 3. Normal Free User
    const normalUser = await User.create({
      name: 'Alex Johnson',
      email: 'user@cinewave.com',
      passwordHash: userPasswordHash,
      role: 'USER',
      isPremium: false,
      subscriptionExpiry: null,
    });

    // 4. Premium VIP User
    const premiumUser = await User.create({
      name: 'Sophia Martinez (VIP)',
      email: 'premium@cinewave.com',
      passwordHash: premiumPasswordHash,
      role: 'USER',
      isPremium: true,
      subscriptionExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seed] Creating demo videos across all genres...');
    const sampleVideos = [
      {
        title: 'Tears of Steel',
        description: 'Set in a dystopian future of Amsterdam, a group of scientists and warriors attempt to stage a desperate alternate-reality memory transfer to prevent a robotic apocalypse.',
        genre: 'Action',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '12m',
        featured: true,
        views: 3420,
      },
      {
        title: 'Sintel: The Dragon Tale',
        description: 'A lonely young warrior embarks on a dangerous journey across snowy wastes and desert ruins to rescue her beloved pet dragon that was taken by a fearsome beast.',
        genre: 'Action',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        creator: creator1._id,
        isPremium: false,
        duration: '15m',
        featured: true,
        views: 8950,
      },
      {
        title: 'Big Buck Bunny: Forest Havoc',
        description: 'A giant, gentle rabbit with a heart of gold takes revenge on three mischievous woodland bullies who enjoy tormenting innocent forest butterflies.',
        genre: 'Comedy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        creator: creator2._id,
        isPremium: false,
        duration: '10m',
        featured: false,
        views: 12400,
      },
      {
        title: 'Subway Chronicles: The Funny Incident',
        description: 'A hilarious indie short capturing the absurd and unpredictable antics of commuters on the evening subway line after a torrential downpour.',
        genre: 'Comedy',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '8m',
        featured: false,
        views: 1980,
      },
      {
        title: 'Shadows in the Mist',
        description: 'An introspective drama about an aging musician searching for lost recordings in an abandoned coastal villa, reckoning with grief, music, and redemption.',
        genre: 'Drama',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        creator: creator2._id,
        isPremium: false,
        duration: '18m',
        featured: false,
        views: 2840,
      },
      {
        title: 'The Last Train to Kyoto',
        description: 'Two estranged travelers strike up an unexpected nocturnal conversation across rainy neon-lit station platforms, uncovering deeply hidden truths about each other.',
        genre: 'Drama',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '22m',
        featured: false,
        views: 4120,
      },
      {
        title: 'Midnight Pulse: The Neon Heist',
        description: 'An adrenaline-fueled cyber-thriller where an underground hacker crew infiltrates an impenetrable offshore financial server within a strict 6-minute power outage.',
        genre: 'Thriller',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '14m',
        featured: true,
        views: 6510,
      },
      {
        title: 'The Cipher Code',
        description: 'When an enigmatic signal from the deep arctic station begins overriding military satellites, a cryptographer races against time to decrypt the warning before global blackout.',
        genre: 'Thriller',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        creator: creator2._id,
        isPremium: false,
        duration: '16m',
        featured: false,
        views: 3110,
      },
      {
        title: 'Elephants Dream: Synthetic Machinery',
        description: 'Two companions explore a vast, surreal, and ever-shifting mechanical labyrinth that physically manifests their inner thoughts and anxieties.',
        genre: 'Animation',
        thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
        creator: creator2._id,
        isPremium: false,
        duration: '11m',
        featured: false,
        views: 5200,
      },
      {
        title: 'Dreamscapes: The Cloud Kingdom',
        description: 'A visually breathtaking 3D animation exploring ethereal floating islands powered by starlight crystals, facing an approaching tempest of dark matter.',
        genre: 'Animation',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '13m',
        featured: false,
        views: 4890,
      },
      {
        title: 'A Letter from Nowhere',
        description: 'An award-winning festival short film depicting an artist in 1968 who receives an anonymous package containing photographs of future cityscapes not yet built.',
        genre: 'Short Films',
        thumbnailUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        creator: creator2._id,
        isPremium: false,
        duration: '9m',
        featured: false,
        views: 7420,
      },
      {
        title: 'Whispers of the Deep Blue',
        description: 'A cinematic documentary short following deep-sea researchers who discover a bioluminescent oceanic canyon teeming with unidentified marine species.',
        genre: 'Short Films',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&auto=format&fit=crop&q=80',
        videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
        creator: creator1._id,
        isPremium: true,
        duration: '14m',
        featured: false,
        views: 3890,
      },
    ];

    const insertedVideos = await Video.insertMany(sampleVideos);
    console.log(`[Seed] Inserted ${insertedVideos.length} videos successfully!`);

    // Create initial watchlists
    await Watchlist.create({
      user: normalUser._id,
      videos: [insertedVideos[0]._id, insertedVideos[1]._id],
    });

    await Watchlist.create({
      user: premiumUser._id,
      videos: [insertedVideos[2]._id, insertedVideos[6]._id],
    });

    await Watchlist.create({
      user: creator1._id,
      videos: [insertedVideos[0]._id],
    });

    await Watchlist.create({
      user: creator2._id,
      videos: [],
    });

    // Create initial payment for the VIP user
    await Payment.create({
      user: premiumUser._id,
      razorpayOrderId: 'order_seed_demo_998877',
      razorpayPaymentId: 'pay_seed_demo_554433',
      razorpaySignature: 'sig_seed_verified_signature',
      amount: 19900,
      currency: 'INR',
      status: 'successful',
      plan: 'CineWave VIP Monthly',
      subscriptionDays: 30,
    });

    console.log('\n=============================================');
    console.log('🎉 CineWave Seed Data Generated Successfully!');
    console.log('=============================================');
    console.log('Demo Credentials for Testing:');
    console.log('1. Creator Account:');
    console.log('   Email:    creator@cinewave.com');
    console.log('   Password: creator123');
    console.log('   Role:     CREATOR (Access to Creator Studio)');
    console.log('');
    console.log('2. Normal Free User:');
    console.log('   Email:    user@cinewave.com');
    console.log('   Password: user123');
    console.log('   Role:     USER (Can stream free content, subscribe to VIP)');
    console.log('');
    console.log('3. Premium VIP User:');
    console.log('   Email:    premium@cinewave.com');
    console.log('   Password: premium123');
    console.log('   Role:     USER (Active VIP subscription, streams all videos)');
    console.log('=============================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedData();
