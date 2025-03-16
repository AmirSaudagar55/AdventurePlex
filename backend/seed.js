const sequelize = require('./db');
const Category = require('./models/Category');
const Activity = require('./models/Activity');
const ActivityImage = require('./models/ActivityImage');

(async () => {
  try {
    // Connect and sync the database without data loss.
    await sequelize.authenticate();
    console.log('Database connected successfully');
    await sequelize.sync({ alter: true });
    console.log('Database tables synchronized');

    // *****************************
    // 1. Insert Categories
    // *****************************
    const categoriesData = [
      {
        id: 1,
        name: 'Prime',
        slug: 'prime',
        description: 'Strategy and action sports for thrill-seekers',
        image_url:
          'https://images.unsplash.com/photo-1607627000458-210e8d2bdb1d?q=80&w=2049&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: 'indigo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Studio',
        slug: 'studio',
        description: 'Short-format, high-thrill simulated experiences',
        image_url:
          'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1600',
        color: 'rose',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Union',
        slug: 'union',
        description: 'Classic recreational sports and activities',
        image_url:
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1600',
        color: 'amber',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Junior',
        slug: 'junior',
        description: 'Safe and fun activities for young adventurers',
        image_url:
          'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=1600',
        color: 'emerald',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Pixel',
        slug: 'pixel',
        description: 'Immersive gaming and virtual experiences',
        image_url:
          'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?auto=format&fit=crop&q=80&w=1600',
        color: 'purple',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Social',
        slug: 'social',
        description: 'Perfect venues for celebrations and gatherings',
        image_url:
          'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1600',
        color: 'pink',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Conference Halls',
        slug: 'conference-halls',
        description: 'Conference halls for meetings and events',
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/meeting-room.jpg?updatedAt=1739941860778',
        color: 'black',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ];

    for (const cat of categoriesData) {
      // upsert ensures we update if the record already exists.
      await Category.upsert(cat);
    }
    console.log('Categories inserted');

    // *****************************
    // 2. Insert Activities
    // *****************************
    const activitiesData = [
      // Category 1: Prime
      {
        category_id: 1,
        name: 'Car Simulator',
        description:
          '{"Per Game": "₹295", "Game": "01", "Min Age/Min Height": "10+/4 ft", "Max Players": "03"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹295',
        maximum_group_members_allowed: 3,
        duration: 8,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: '4 ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/Car_sim1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 1,
        name: 'Cricket Simulator',
        description:
          '{"Per Game": "₹295", "Game Duration": "3 Overs", "Min Age/Min height": "10 yrs/ 5ft", "Max Players": "02"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹295',
        maximum_group_members_allowed: 2,
        duration: 18,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: '5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/Cnets_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 1,
        name: 'Lazermaze',
        description:
          '{"Per Game": "₹295", "Game Duration": "10 Mins", "Min Age/Height": "10+yrs / 5ft", "Max Players": "06"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹295',
        maximum_group_members_allowed: 6,
        duration: 10,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: '5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/lazermaze1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 1,
        name: '7D Theatre',
        description:
          '{"Per Game": "₹295", "Game Duration": "10 Mins", "Min Age/ Min Height": "7 yrs /4.5ft", "Max Players": "08"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹295',
        maximum_group_members_allowed: 8,
        duration: 10,
        duration_unit: 'Mins',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/7D-1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 1,
        name: 'VR Escape',
        description:
          '{"Per Game": "₹395", "Game Duration": "10 Mins", "years": "13+", "Max Players": "04"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 4,
        duration: 10,
        duration_unit: 'Mins',
        min_age: 13,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/vrescape_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 1,
        name: 'VR Coaster',
        description:
          '{"Per Game": "₹295", "Min Age/Height": "7+/4.5ft", "Game": "01", "Max Slots": "02"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹295',
        maximum_group_members_allowed: 2,
        duration: 8,
        duration_unit: 'Mins',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url: 'https://playarena.in/wp-content/uploads/2024/07/vr-coaster-4.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Category 2: Studio
      {
        category_id: 2,
        name: 'Archery',
        description:
          '{"Per Game": "₹354", "Arrows": "15", "Min Age/Min Height": "10/5ft", "Max Archers": "06"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹354',
        maximum_group_members_allowed: 6,
        duration: 15,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: '5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/Archery-4.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        name: 'Rope Course',
        description:
          '{"Per Attempt": "₹354", "Levels": "2", "Min Age/Min Height": "7+/4.5ft", "Max Weight": "90 Kgs"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹354',
        maximum_group_members_allowed: 10,
        duration: 20,
        duration_unit: 'Mins',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs',
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/Ropecourse_05.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        name: 'Climbing',
        description:
          '{"Per Game": "₹354", "Attempts": "3", "Min Age/Min Height": "7+/4.5ft", "Max Weight": "90 Kgs"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹354',
        maximum_group_members_allowed: 10,
        duration: 20,
        duration_unit: 'Mins',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs',
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/climbing_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        name: 'Trampoline Park',
        description:
          '{"Per Session": "₹354", "Session Duration": "20 Mins", "Min Age/Min Height": "7+/4.5ft", "Max Weight": "90 Kgs"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹354',
        maximum_group_members_allowed: 20,
        duration: 20,
        duration_unit: 'Mins',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs',
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/trampoline_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        name: 'Shooting',
        description:
          '{"Per Game": "₹354", "Pellets": "15", "Min Age/Min Height": "10+/5ft", "Max Shooters": "06"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹354',
        maximum_group_members_allowed: 6,
        duration: 15,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: '5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/shooting-1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 2,
        name: 'Carnival Games',
        description:
          '{"Per Game": "₹125", "Game": "1", "Min Age": "5 Years", "Games Available": "14"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹125',
        maximum_group_members_allowed: 14,
        duration: 10,
        duration_unit: 'Mins',
        min_age: 5,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: 14,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/carnival_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Category 3: Union
      {
        category_id: 3,
        name: 'Badminton',
        description:
          '{"Per Hour": "₹400", "Min Duration": "60 Mins", "Age Groups": "All", "Max Players": "04"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹400',
        maximum_group_members_allowed: 4,
        duration: 60,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/badminton_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 3,
        name: 'Cricket Nets',
        description:
          '{"Per Hour": "₹600", "Min Duration": "60 Mins", "Age Groups": "All", "Nets": "4"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹600',
        maximum_group_members_allowed: 4,
        duration: 60,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/Cnets-01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 3,
        name: 'Swimming Pool',
        description:
          '{"Per Hour": "₹3000", "Min Duration": "60 Mins", "Min Height": "4.5ft", "Max Swimmers": "10"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹3000',
        maximum_group_members_allowed: 10,
        duration: 60,
        duration_unit: 'Mins',
        min_age: null,
        min_height: '4.5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/pool-4.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 3,
        name: 'Skate Park',
        description:
          '{"Per Day": "₹450", "Your day, your time!": "No Limits", "Age Groups": "All", "Max Players": "50"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹450',
        maximum_group_members_allowed: 50,
        duration: 240,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/08/skate_park_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 3,
        name: 'Gym',
        description:
          '{"Per Day": "₹500", "Usage Per Day": "Unlimited", "Years": "18+", "Users at a time": "Max 20"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹500',
        maximum_group_members_allowed: 20,
        duration: 480,
        duration_unit: 'Mins',
        min_age: 18,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/gym_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Category 4: Junior
      {
        category_id: 4,
        name: 'Gokarting',
        description:
          '{"For 6 Laps": "₹395", "Laps Per Race": "06", "Min Height": "5ft", "Racers at a go": "5"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 5,
        duration: 15,
        duration_unit: 'Mins',
        min_age: null,
        min_height: '5ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: 6,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/Gokart-1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 4,
        name: 'Bowling',
        description:
          '{"Per Player": "₹395", "Per game": "10 Frames", "Min Age": "10+yrs", "players per alley": "4"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 4,
        duration: 30,
        duration_unit: 'Mins',
        min_age: 10,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2023/12/bowling_1.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 4,
        name: 'Lasertag',
        description:
          '{"Per Game": "10 Mins", "Min Height": "4.5 Ft", "Max Players": "10"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 10,
        duration: 10,
        duration_unit: 'Mins',
        min_age: null,
        min_height: '4.5 Ft',
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/lasertag_06.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 4,
        name: 'Paintball',
        description:
          '{"Per Player": "₹395", "Per Game": "20 Mins", "Paintballs": "30", "Max Players": "10"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 10,
        duration: 20,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/paintball_6.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 4,
        name: 'Bumper Cars',
        description:
          '{"Per Game": "7 Mins", "min Age": "8+", "Max Players": "8"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹395',
        maximum_group_members_allowed: 8,
        duration: 7,
        duration_unit: 'Mins',
        min_age: 8,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/10/bumper4.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Category 5: Pixel
      {
        category_id: 5,
        name: 'Little Gym',
        description:
          '{"Per Session": "60 Mins", "Max Age": "12 Years", "Max Per Session": "18"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹400',
        maximum_group_members_allowed: 18,
        duration: 60,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/little_gym_01.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        category_id: 5,
        name: 'Soft Play',
        description:
          '{"Per Session": "60 Mins", "Age Eligibility": "1-12 Years", "Max Per Session": "25"}',
        will_price_remain_same_for_whole_group: true,
        price: '₹350',
        maximum_group_members_allowed: 25,
        duration: 60,
        duration_unit: 'Mins',
        min_age: null,
        min_height: null,
        max_weight: null,
        max_participants_per_slots: 20,
        games_available: null,
        laps_per_race: null,
        type: 'group',
        image_url:
          'https://playarena.in/wp-content/uploads/2024/07/softplay-05.jpg',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    for (const activity of activitiesData) {
      await Activity.upsert(activity);
    }
    console.log('Activities inserted');

    // *****************************
    // 3. Update Activities (Adjust descriptions and constraints)
    // *****************************
    await Activity.update(
      {
        description:
          'Experience the thrill of a realistic car driving simulation game.',
        min_age: 10,
        min_height: '4 ft'
      },
      { where: { name: 'Car Simulator' } }
    );
    await Activity.update(
      {
        description:
          'Experience a cricket simulation with fast-paced overs and realistic gameplay.',
        min_age: 10,
        min_height: '5ft'
      },
      { where: { name: 'Cricket Simulator' } }
    );
    await Activity.update(
      {
        description:
          'Navigate a thrilling maze with lasers in a fast-paced, interactive game.',
        min_age: 10,
        min_height: '5ft'
      },
      { where: { name: 'Lazermaze' } }
    );
    await Activity.update(
      {
        description:
          'Immerse yourself in a 7D theatre experience with multi-sensory visuals and sound.',
        min_age: 7,
        min_height: '4.5ft'
      },
      { where: { name: '7D Theatre' } }
    );
    await Activity.update(
      {
        description:
          'Enter a virtual reality escape room for an exhilarating challenge.',
        min_age: 13
      },
      { where: { name: 'VR Escape' } }
    );
    await Activity.update(
      {
        description:
          'Enjoy a thrilling VR coaster ride with immersive virtual reality technology.',
        min_age: 7,
        min_height: '4.5ft'
      },
      { where: { name: 'VR Coaster' } }
    );

    // Studio updates
    await Activity.update(
      {
        description:
          'Test your aim at our archery range with a set of 15 arrows and expert guidance.',
        min_age: 10,
        min_height: '5ft'
      },
      { where: { name: 'Archery' } }
    );
    await Activity.update(
      {
        description:
          'Challenge yourself on our rope course featuring two levels and safety measures.',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs'
      },
      { where: { name: 'Rope Course' } }
    );
    await Activity.update(
      {
        description:
          'Scale new heights with our climbing challenge, complete with three attempts and safety guidelines.',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs'
      },
      { where: { name: 'Climbing' } }
    );
    await Activity.update(
      {
        description:
          'Bounce into fun at our trampoline park with a 20-minute session and secure environment.',
        min_age: 7,
        min_height: '4.5ft',
        max_weight: '90 Kgs'
      },
      { where: { name: 'Trampoline Park' } }
    );
    await Activity.update(
      {
        description:
          'Experience precision shooting with professional equipment and expert guidance.',
        min_age: 10,
        min_height: '5ft'
      },
      { where: { name: 'Shooting' } }
    );
    await Activity.update(
      {
        description:
          'Enjoy a variety of fun carnival games with an assortment of 14 games available.',
        min_age: 5
      },
      { where: { name: 'Carnival Games' } }
    );

    // Union updates
    await Activity.update(
      {
        description:
          'Play a game of badminton in our well-equipped court with professional lighting and facilities.'
      },
      { where: { name: 'Badminton' } }
    );
    await Activity.update(
      {
        description:
          'Practice your batting and bowling in our professionally set-up cricket nets.'
      },
      { where: { name: 'Cricket Nets' } }
    );
    await Activity.update(
      {
        description:
          'Enjoy a refreshing swim in our well-maintained pool with a capacity for 10 swimmers.',
        min_height: '4.5ft'
      },
      { where: { name: 'Swimming Pool' } }
    );
    await Activity.update(
      {
        description:
          'Skate at our expansive park with no time limits and space for up to 50 players.'
      },
      { where: { name: 'Skate Park' } }
    );
    await Activity.update(
      {
        description:
          'Work out in our fully-equipped gym with unlimited daily access and a capacity of 20 users at a time.',
        min_age: 18
      },
      { where: { name: 'Gym' } }
    );

    // Junior updates
    await Activity.update(
      {
        description:
          'Race your friends in an exciting go-karting challenge with 6 laps per race.',
        min_height: '5ft',
        laps_per_race: 6,
        maximum_group_members_allowed: 5
      },
      { where: { name: 'Gokarting' } }
    );
    await Activity.update(
      {
        description:
          'Enjoy a classic game of bowling with 10 frames per game and a maximum of 4 players per alley.',
        min_age: 10
      },
      { where: { name: 'Bowling' } }
    );
    await Activity.update(
      {
        description:
          'Engage in a fast-paced game of lasertag in our state-of-the-art arena.',
        min_height: '4.5 Ft'
      },
      { where: { name: 'Lasertag' } }
    );
    await Activity.update(
      {
        description:
          'Experience the excitement of paintball with 30 paintballs per game and a maximum of 10 players.'
      },
      { where: { name: 'Paintball' } }
    );
    await Activity.update(
      {
        description:
          'Have a fun-filled ride on our bumper cars designed for thrilling collisions.',
        min_age: 8
      },
      { where: { name: 'Bumper Cars' } }
    );

    // Pixel updates
    await Activity.update(
      {
        description:
          'Enjoy an engaging session at our little gym designed for kids, with a maximum of 18 participants per session.'
      },
      { where: { name: 'Little Gym' } }
    );
    await Activity.update(
      {
        description:
          'Let your little ones have fun in our soft play area, suitable for ages 1-12 with 25 participants per session.'
      },
      { where: { name: 'Soft Play' } }
    );

    console.log('Activity updates applied');

    // *****************************
    // 4. Insert Activity Images
    // *****************************
    // The following mapping associates an activity (by name) with three image URLs.
    const activityImagesMapping = [
      {
        activityName: 'Shooting',
        images: [
          'https://images.unsplash.com/photo-1584847642060-a46e239155a8?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Archery',
        images: [
          'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1544786797-c4c5d2c7c8b9?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1541742425281-c1d3fc8aff96?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Climbing',
        images: [
          'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1516592066400-86808b960619?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1578016275490-e33cf9c85587?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Gokarting',
        images: [
          'https://images.unsplash.com/photo-1551092868-0b77c6db2537?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1630216741411-8c4b6b51d688?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1623073284214-397d85c72cd6?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Lasertag',
        images: [
          'https://images.unsplash.com/photo-1626557981101-aae6f84aa6ff?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626557981107-8dfb53d51d8f?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626557981111-4c3e5850a9cf?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Paintball',
        images: [
          'https://images.unsplash.com/photo-1555004879-50cfdde01ce3?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800353-1e1be4156d38?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800787-9ed8fc58b5d2?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Bumper Cars',
        images: [
          'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800654-67651c687c6a?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800890-21f1f0d2ff6c?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Carnival Games',
        images: [
          'https://images.unsplash.com/photo-1572508589584-94d778209dd9?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800234-9e6c3c2bf85b?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800432-7e47d5c0f0b6?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Trampoline Park',
        images: [
          'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800123-7e47d5c0f0b5?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800543-7e47d5c0f0b7?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Cricket Simulator',
        images: [
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800765-7e47d5c0f0b8?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800876-7e47d5c0f0b9?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Car Simulator',
        images: [
          'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248800987-7e47d5c0f0ba?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801098-7e47d5c0f0bb?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'VR Coaster',
        images: [
          'https://images.unsplash.com/photo-1622979135240-caa6648190b6?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801209-7e47d5c0f0bc?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801320-7e47d5c0f0bd?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'VR Escape',
        images: [
          'https://images.unsplash.com/photo-1610851467358-f1b3092e0f0a?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801431-7e47d5c0f0be?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801542-7e47d5c0f0bf?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: '7D Theatre',
        images: [
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801653-7e47d5c0f0c0?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801764-7e47d5c0f0c1?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Badminton',
        images: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1613918431703-aa50889e3be8?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Skate Park',
        images: [
          'https://images.unsplash.com/photo-1572776685600-aca8c3456337?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801875-7e47d5c0f0c2?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248801986-7e47d5c0f0c3?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Swimming Pool',
        images: [
          'https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802097-7e47d5c0f0c4?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802208-7e47d5c0f0c5?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Lazermaze',
        images: [
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802541-7e47d5c0f0c8?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802652-7e47d5c0f0c9?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Soft Play',
        images: [
          'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802763-7e47d5c0f0ca?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802874-7e47d5c0f0cb?auto=format&fit=crop&q=80&w=1600'
        ]
      },
      {
        activityName: 'Little Gym',
        images: [
          'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248802985-7e47d5c0f0cc?auto=format&fit=crop&q=80&w=1600',
          'https://images.unsplash.com/photo-1626248803096-7e47d5c0f0cd?auto=format&fit=crop&q=80&w=1600'
        ]
      }
    ];

    for (const mapping of activityImagesMapping) {
      const activity = await Activity.findOne({
        where: { name: mapping.activityName }
      });
      if (activity) {
        for (const imageUrl of mapping.images) {
          await ActivityImage.create({
            activity_id: activity.id,
            image_url: imageUrl,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
    }
    console.log('Activity images inserted');


    const conferenceHallsData = [
      {
        id: 1,
        category_id: 7,
        name: 'Alpha Conference Hall',
        description: 'A spacious hall equipped with modern amenities for large conferences.',
        capacity: 150,
        floorNumber: 1,
        pricePerMin: 0.50,
        location: 'Building A, First Floor',
        features: { projector: true, soundSystem: true },
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/tyler-callahan-e_RpjNyMgEM-unsplash.jpg?updatedAt=1739941409286',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        category_id: 7,
        name: 'Beta Conference Hall',
        description: 'Ideal for corporate meetings and training sessions.',
        capacity: 80,
        floorNumber: 1,
        pricePerMin: 0.40,
        location: 'Building A, First Floor',
        features: { projector: true, soundSystem: false },
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/myko-makhlai-3il_GxILUF8-unsplash.jpg?updatedAt=1739941413933',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        category_id: 7,
        name: 'Gamma Conference Hall',
        description: 'An elegant hall perfect for high-level conferences.',
        capacity: 200,
        floorNumber: 2,
        pricePerMin: 0.75,
        location: 'Building B, Second Floor',
        features: { projector: true, soundSystem: true, videoConferencing: true },
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/strategic-meeting-room-setting-staged-crucial-business-decisions.jpg?updatedAt=1739941879516',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        category_id: 7,
        name: 'Delta Conference Hall',
        description: 'A cozy and intimate space for small gatherings and meetings.',
        capacity: 40,
        floorNumber: 2,
        pricePerMin: 0.35,
        location: 'Building B, Second Floor',
        features: { projector: false, soundSystem: false },
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/asia-culturecenter-mlp5WY7c0XE-unsplash.jpg?updatedAt=1739941411717',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        category_id: 7,
        name: 'Epsilon Conference Hall',
        description: 'A state-of-the-art hall for large-scale events and seminars.',
        capacity: 250,
        floorNumber: 1,
        pricePerMin: 1.00,
        location: 'Building C, First Floor',
        features: { projector: true, soundSystem: true, lighting: true },
        image_url: 'https://ik.imagekit.io/r9wd8jzgs/asia-culturecenter-8Vhl4KvlJE8-unsplash.jpg?updatedAt=1739941409681',
        available: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    

    for (const hall of conferenceHallsData) {
      await ConferenceHall.upsert(hall);
    }
    console.log("Conference Halls data inserted successfully.");
    
    const conferenceHallImagesMapping = [
      {
        conferenceHallId: 1,
        images: [
          'https://ik.imagekit.io/r9wd8jzgs/tyler-callahan-e_RpjNyMgEM-unsplash.jpg?updatedAt=1739941409286',
          'https://ik.imagekit.io/r9wd8jzgs/product-school-D0rMhzEwiEA-unsplash.jpg?updatedAt=1739941407963'
        ]
      },
      {
        conferenceHallId: 2,
        images: [
          'https://ik.imagekit.io/r9wd8jzgs/myko-makhlai-3il_GxILUF8-unsplash.jpg?updatedAt=1739941413933',
          'https://ik.imagekit.io/r9wd8jzgs/product-school-8ohCiNjxOls-unsplash.jpg?updatedAt=1739941406145'
        ]
      },
      {
        conferenceHallId: 3,
        images: [
          'https://ik.imagekit.io/r9wd8jzgs/strategic-meeting-room-setting-staged-crucial-business-decisions.jpg?updatedAt=1739941879516',
          'https://ik.imagekit.io/r9wd8jzgs/meeting-room.jpg?updatedAt=1739941860778'
        ]
      },
      {
        conferenceHallId: 4,
        images: [
          'https://ik.imagekit.io/r9wd8jzgs/asia-culturecenter-mlp5WY7c0XE-unsplash.jpg?updatedAt=1739941411717',
          'https://ik.imagekit.io/r9wd8jzgs/meeting-room.jpg?updatedAt=1739941860778'
        ]
      },
      {
        conferenceHallId: 5,
        images: [
          'https://ik.imagekit.io/r9wd8jzgs/asia-culturecenter-8Vhl4KvlJE8-unsplash.jpg?updatedAt=1739941409681',
          'https://ik.imagekit.io/r9wd8jzgs/asia-culturecenter-2qv-Ot8gSIU-unsplash.jpg?updatedAt=1739941412042'
        ]
      }
    ];
    

    for (const mapping of conferenceHallImagesMapping) {
      for (const imageUrl of mapping.images) {
        await ConferenceHallImage.create({
          conferenceHallId: mapping.conferenceHallId,
          imageUrl: imageUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    console.log('Conference hall images inserted');


    console.log('Data insertion completed successfully.');
  } catch (error) {
    console.error('Error during data insertion:', error);
  } finally {
    await sequelize.close();
  }
})();
