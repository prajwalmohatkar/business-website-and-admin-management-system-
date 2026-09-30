import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { ENV } from '../config/env';
import { Admin } from '../models/Admin';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { BusinessSettings } from '../models/BusinessSettings';
import { logger } from '../utils/logger';

export const seedDatabase = async () => {
  logger.info('Starting database seeding...');
  const connected = await connectDB();
  if (!connected) {
    logger.error('Database connection failed. Seeding aborted.');
    return;
  }

  try {
    // 1. Seed or update Business Settings
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = new BusinessSettings({
        businessName: 'Apex Industrial & Solar Solutions',
        tagline: 'Reliable Solutions for Weighing, Solar & Water Purification',
        logo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        phone: '+91 98765 43210',
        alternatePhone: '+91 98765 43211',
        whatsapp: '+91 98765 43210',
        email: 'sales@apexsolutions.in',
        address: 'Plot 42, Industrial Area, Sector 58',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        businessHours: 'Mon - Sat: 9:00 AM - 7:30 PM (Sunday Closed)',
        aboutBusiness:
          'Apex Industrial & Solar Solutions is a leading authorized supplier and service provider of high-precision Digital Weighing Scales, Rooftop & Agriculture Solar Systems, and Commercial Water Purifiers. With over 15 years of industry excellence, we deliver durable hardware, compliant calibration, and dependable after-sales maintenance across India.',
        googleMapsEmbed:
          'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.803884144074!2d72.8776559!3d19.0760908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjkiTiA3MsKwNTInMzkuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
        socialLinks: {
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
          youtube: 'https://youtube.com',
        },
      });
      await settings.save();
      logger.info('Business Settings initialized.');
    }

    // 2. Seed Initial Admin Account
    const adminExists = await Admin.findOne({
      $or: [{ email: ENV.INITIAL_ADMIN_EMAIL }, { username: ENV.INITIAL_ADMIN_USERNAME }],
    });

    if (!adminExists) {
      const admin = new Admin({
        username: ENV.INITIAL_ADMIN_USERNAME,
        email: ENV.INITIAL_ADMIN_EMAIL,
        password: ENV.INITIAL_ADMIN_PASSWORD,
        role: 'superadmin',
      });
      await admin.save();
      logger.info(`Initial admin account created: ${ENV.INITIAL_ADMIN_EMAIL} / username: ${ENV.INITIAL_ADMIN_USERNAME}`);
    } else {
      logger.info(`Admin account already exists (${adminExists.email}).`);
    }

    // 3. Seed Categories
    const categoriesData = [
      {
        name: 'Weighing Scale Machines',
        slug: 'weighing-scale-machines',
        description:
          'High precision digital weighing scales for commercial, retail, laboratory, and heavy industrial applications.',
        image:
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        displayOrder: 1,
      },
      {
        name: 'Solar Products',
        slug: 'solar-products',
        description:
          'Renewable on-grid, off-grid rooftop solar systems, solar water pumps, and tubular solar batteries.',
        image:
          'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        displayOrder: 2,
      },
      {
        name: 'Water Purifiers',
        slug: 'water-purifiers',
        description:
          'Commercial RO plants, industrial water treatment solutions, and residential multi-stage alkaline purifiers.',
        image:
          'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
        isActive: true,
        displayOrder: 3,
      },
    ];

    const categoryMap: { [slug: string]: any } = {};

    for (const catData of categoriesData) {
      let cat = await Category.findOne({ slug: catData.slug });
      if (!cat) {
        cat = new Category(catData);
        await cat.save();
        logger.info(`Category created: ${cat.name}`);
      }
      categoryMap[catData.slug] = cat;
    }

    // 4. Seed Products
    const productsCount = await Product.countDocuments();
    if (productsCount === 0) {
      const sampleProducts = [
        // Weighing Scale Machines
        {
          name: 'ATOM 300kg Digital Heavy Duty Platform Weighing Scale',
          slug: 'atom-300kg-digital-platform-weighing-scale',
          category: categoryMap['weighing-scale-machines']._id,
          subcategory: 'Platform Scales',
          brand: 'ATOM',
          shortDescription:
            'Rugged 300kg digital platform weighing scale with heavy duty chequered plate, bright green LED display, and rechargeable battery backup.',
          description:
            'The ATOM 300kg Platform Weighing Scale is engineered for commercial warehouses, agricultural mandis, transport hubs, and manufacturing facilities. Built with reinforced mild steel structure and heavy-duty load cell technology, it delivers consistent weight readings even in demanding industrial environments.\n\nFeaturing Tare, Zero, and Auto-calibration functions, this machine comes with dual power operation (direct AC power and internal long-life rechargeable battery delivering over 48 hours of continuous operation on a single charge).',
          price: 7800,
          mrp: 9500,
          showPrice: 'mrp_selling',
          priceLabel: 'Starting Price (GST Extra)',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'ATOM 300kg Platform Scale Front View',
            },
            {
              url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
              isPrimary: false,
              altText: 'Display indicator and controls',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '300 kg' },
            { key: 'Accuracy / Division', value: '50 g' },
            { key: 'Platform Size', value: '450 mm x 450 mm' },
            { key: 'Platform Material', value: 'Heavy Duty MS Chequered Top Plate' },
            { key: 'Display Type', value: 'High Brightness Green LED Display' },
            { key: 'Power Supply', value: '220V AC ±10%, 50Hz' },
            { key: 'Battery Backup', value: '6V 4.5Ah Rechargeable (48 Hours)' },
            { key: 'Certification', value: 'Approved by Legal Metrology Dept (Govt of India)' },
          ],
          features: [
            'Heavy-gauge iron tubular frame designed for industrial abuse',
            'High-precision strain gauge load cell with overload protection',
            'Piece counting & price computation functionality built-in',
            'Tare / Zero subtraction for tare container weights',
            'Rust-resistant powder coated finish',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'ATOM 300kg Digital Platform Weighing Scale | Apex Solutions',
          seoDescription:
            'Buy genuine ATOM 300kg Digital Platform Scale with high precision load cell, government stamping certification, and fast nationwide delivery.',
          seoKeywords: ['ATOM weighing scale', '300kg platform scale', 'commercial digital scale', 'industrial weighing machine'],
        },
        {
          name: 'Eagle 30kg Tabletop Commercial Counter Scale',
          slug: 'eagle-30kg-tabletop-commercial-counter-scale',
          category: categoryMap['weighing-scale-machines']._id,
          subcategory: 'Counter Scales',
          brand: 'Eagle',
          shortDescription:
            'High precision 30kg electronic counter scale with dual front-and-back LED displays for retail shops, grocery, and packaging.',
          description:
            'The Eagle 30kg Tabletop Counter Scale is the workhorse of modern retail and grocery operations. Designed with a food-grade stainless steel platter and dual displays facing both shopkeeper and customer, it builds trust and speeds up checkout.\n\nEquipped with lightning-fast weight stabilization (less than 1.5 seconds) and an ultra-sensitive 1g resolution.',
          price: 2650,
          mrp: 3200,
          showPrice: 'mrp_selling',
          priceLabel: 'Special Counter Offer',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Eagle 30kg Counter Scale',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '30 kg' },
            { key: 'Accuracy / Division', value: '1 g / 2 g' },
            { key: 'Platter Size', value: '240 mm x 290 mm' },
            { key: 'Platter Material', value: 'SS 304 Grade Stainless Steel' },
            { key: 'Display', value: 'Dual Red LED (Customer & Operator)' },
            { key: 'Battery', value: 'Built-in 6V Rechargeable Battery' },
          ],
          features: [
            'Dual customer and operator high-contrast LED displays',
            'Splash-proof membrane tactile keyboard',
            'Auto power saving standby mode',
            'Fast response load cell for rapid retail billing',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'Eagle 30kg Tabletop Scale | Retail & Grocery Weighing',
          seoDescription:
            'Shop Eagle 30kg electronic tabletop digital counter scale with 1g accuracy and dual display at wholesale price.',
          seoKeywords: ['Eagle 30kg scale', 'tabletop weighing scale', 'grocery scale', 'electronic retail scale'],
        },
        {
          name: 'Heavy Duty 1000kg Industrial Floor Weighing Scale',
          slug: 'heavy-duty-1000kg-industrial-floor-weighing-scale',
          category: categoryMap['weighing-scale-machines']._id,
          subcategory: 'Industrial Floor Scales',
          brand: 'PrecisionPro',
          shortDescription:
            '1 Ton 4-load cell industrial floor scale with ramp options, ideal for pallets, drums, scrap, and factory loading bays.',
          description:
            'Designed for heavy-duty industrial weighing of pallets, crates, drums, and manufactured machinery. This 1000kg floor scale features four IP67 hermetically sealed shear beam alloy steel load cells, adjustable swivel leveling feet, and an impact-resistant indicator.\n\nCustom platform sizes and pitless installation ramps available on request.',
          price: 18500,
          mrp: 24000,
          showPrice: 'quote',
          priceLabel: 'Get Custom Quote',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: '1000kg Industrial Floor Scale',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '1000 kg (1 Ton)' },
            { key: 'Accuracy', value: '100 g / 200 g' },
            { key: 'Platform Dimensions', value: '1000 mm x 1000 mm (1m x 1m)' },
            { key: 'Load Cells', value: '4 x IP67 Alloy Steel Shear Beam' },
            { key: 'Junction Box', value: 'Waterproof 4-channel Stainless Steel' },
            { key: 'Overload Rating', value: '150% Safe Overload' },
          ],
          features: [
            'Four load-cell corner-balanced architecture prevents eccentric loading errors',
            'Optional access ramps for forklift and hand pallet trucks',
            'RS232 serial communication port for PC / Thermal Printer connectivity',
          ],
          stockStatus: 'on_request',
          featured: false,
          status: 'published',
          seoTitle: '1000kg Industrial Floor Scale 1 Ton | Apex Solutions',
          seoDescription:
            'Industrial 1000kg heavy duty floor scale with 4 shear beam load cells, IP67 waterproof junction box, and customized platform options.',
          seoKeywords: ['1 ton scale', '1000kg floor scale', 'industrial pallet scale', 'heavy duty weighing machine'],
        },

        // Solar Products
        {
          name: '5kW On-Grid Rooftop Solar Power System (Complete Turnkey)',
          slug: '5kw-on-grid-rooftop-solar-power-system',
          category: categoryMap['solar-products']._id,
          subcategory: 'Rooftop Solar Systems',
          brand: 'SolarApex',
          shortDescription:
            'Complete 5kW grid-connected rooftop solar plant with Tier-1 Mono PERC solar panels, 5kVA MPPT smart inverter, net-metering support, and 25-year performance warranty.',
          description:
            'Slash your residential or commercial electricity bills by up to 85% with our 5kW On-Grid Rooftop Solar Power System. Generating an average of 20 to 25 units (kWh) of clean electricity every sunny day, this system pays for itself within 3-4 years.\n\nOur turnkey package includes site survey, high-efficiency Half-Cut Mono PERC solar modules, anodized aluminium mounting structures engineered to withstand 150 km/h wind speeds, DCDB/ACDB protection boxes, lightning arrestor, complete earth grounding, and full assistance with DISCOM net-metering approvals.',
          price: 220000,
          mrp: 260000,
          showPrice: 'mrp_selling',
          priceLabel: 'Turnkey Installation Price',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Rooftop Solar System 5kW Installation',
            },
          ],
          specifications: [
            { key: 'System Capacity', value: '5.0 kW' },
            { key: 'Solar Module Type', value: 'Tier-1 Mono PERC Bifacial 545Wp' },
            { key: 'Number of Modules', value: '9-10 Panels' },
            { key: 'Inverter', value: '5 kW Dual MPPT Grid-Tie with Wi-Fi Monitoring' },
            { key: 'Daily Energy Generation', value: '20 - 25 kWh (Units) / Day' },
            { key: 'Required Rooftop Area', value: '350 - 400 sq.ft Shadow-free area' },
            { key: 'Warranty', value: '25 Years Module Performance, 5 Years Inverter' },
            { key: 'Subsidy Support', value: 'PM Surya Ghar Muft Bijli Yojana Eligible' },
          ],
          features: [
            'Real-time Wi-Fi generation tracking directly on your smartphone',
            'Surge protection with Type-II SPD in ACDB and DCDB boxes',
            'HDG (Hot Dip Galvanized) structure with rust warranty',
            'End-to-end DISCOM net metering documentation and commissioning',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: '5kW On-Grid Rooftop Solar System Price & Subsidy | Apex',
          seoDescription:
            'Install 5kW On-Grid Solar System in India. Highest efficiency Tier 1 Mono PERC panels, PM Surya Ghar subsidy eligible with 25-year warranty.',
          seoKeywords: ['5kW solar system', 'rooftop solar panels', 'solar on-grid system', 'PM Surya Ghar subsidy'],
        },
        {
          name: 'Solar Water Pump System 3HP AC Submersible',
          slug: 'solar-water-pump-system-3hp-ac-submersible',
          category: categoryMap['solar-products']._id,
          subcategory: 'Solar Agricultural Pumps',
          brand: 'AgriSun',
          shortDescription:
            'High-discharge 3HP solar submersible pump powered by 3000Wp solar array and MPPT VFD controller for agricultural irrigation.',
          description:
            'Say goodbye to erratic electricity supply and expensive diesel pump costs. The AgriSun 3HP Solar Submersible Water Pump delivers reliable day-long irrigation directly from borewells, rivers, or open wells.\n\nEquipped with a smart MPPT Variable Frequency Drive (VFD) controller, the pump starts automatically at sunrise, tracks peak solar radiation, and shuts off safely at dusk or if dry-run conditions are detected.',
          price: 135000,
          mrp: 165000,
          showPrice: 'contact',
          priceLabel: 'Request Subsidy / Price Details',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Solar Agricultural Water Pump',
            },
          ],
          specifications: [
            { key: 'Motor Power', value: '3.0 HP (2.2 kW)' },
            { key: 'Pump Type', value: 'Stainless Steel AC Submersible' },
            { key: 'Solar PV Array', value: '3000 Wp Polycrystalline/Mono Modules' },
            { key: 'Water Discharge', value: 'Up to 1,20,000 Litres / Day' },
            { key: 'Head Range', value: '30 m to 90 m' },
            { key: 'Controller', value: 'IP65 MPPT VFD with Dry-Run Protection' },
          ],
          features: [
            'Zero fuel cost and zero recurring electricity bills',
            'Full automatic operation without manual monitoring',
            'Dry-run, reverse polarity, and over-voltage sensor safety',
            'Heavy duty ground mounting structure with manual seasonal tracker',
          ],
          stockStatus: 'in_stock',
          featured: false,
          status: 'published',
          seoTitle: '3HP Solar Water Pump System for Agriculture | Apex Solutions',
          seoDescription:
            'Reliable 3HP solar submersible agricultural water pump with 3000Wp solar array, automatic VFD controller, and high discharge head.',
          seoKeywords: ['solar water pump', '3HP solar submersible pump', 'KUSUM solar pump', 'agriculture irrigation solar'],
        },
        {
          name: 'Luminous Solar 150Ah Tubular Battery (C10 Rated)',
          slug: 'luminous-solar-150ah-tubular-battery-c10',
          category: categoryMap['solar-products']._id,
          subcategory: 'Solar Batteries',
          brand: 'Luminous',
          shortDescription:
            'Heavy-duty C10 rated tall tubular solar battery with high cycle life, low maintenance, and 60-month warranty for off-grid power storage.',
          description:
            'The Luminous 150Ah C10 Solar Tubular Battery is specially manufactured for cyclic deep discharge applications in off-grid and hybrid solar installations. Its patented tall tubular spine design resists positive plate shedding and corrosion even in high ambient temperatures.',
          price: 14500,
          mrp: 17500,
          showPrice: 'exact',
          priceLabel: 'Best Counter Price',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1558441719-8b489c652790?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: '150Ah Solar Tubular Battery',
            },
          ],
          specifications: [
            { key: 'Rated Capacity', value: '150 Ah @ C10' },
            { key: 'Voltage', value: '12 V DC' },
            { key: 'Technology', value: 'Tall Tubular Lead-Acid' },
            { key: 'Expected Life', value: '1500+ Cycles at 80% DOD' },
            { key: 'Warranty', value: '60 Months (36 months free replacement + 24 pro-rata)' },
          ],
          features: [
            'Special alloy composition minimizes water loss for low maintenance',
            'Handles frequent power cuts and rapid deep recharging',
            'Ceramic vent plugs with electrolyte level indicators',
          ],
          stockStatus: 'in_stock',
          featured: false,
          status: 'published',
          seoTitle: 'Luminous 150Ah Solar Tubular Battery C10 Price | Apex',
          seoDescription:
            'Buy genuine Luminous 150Ah C10 solar tall tubular battery with 5-year warranty, fast charging, and nationwide delivery.',
          seoKeywords: ['solar battery', '150Ah tubular battery', 'Luminous solar battery', 'C10 battery'],
        },

        // Water Purifiers
        {
          name: 'Commercial RO Water Plant 250 LPH Stainless Steel',
          slug: 'commercial-ro-water-plant-250-lph-stainless-steel',
          category: categoryMap['water-purifiers']._id,
          subcategory: 'Commercial RO Plants',
          brand: 'AquaPure Pro',
          shortDescription:
            '250 Litres/Hour commercial Reverse Osmosis plant with SS 304 skid, dual Dow/Toray 4040 membranes, raw water pump, and automatic control panel for schools, hostels, and factories.',
          description:
            'The AquaPure Pro 250 LPH Commercial RO System provides crystal clear, bacteria-free drinking water for small manufacturing plants, corporate offices, schools, hostels, restaurants, and residential buildings with 100 to 500 people.\n\nBuilt on a durable SS 304 stainless steel frame, it integrates sand and activated carbon media filtration, 5-micron spun pre-filtration, vertical high-pressure multistage pump, and high-rejection Dow Filmtec RO membranes to eliminate up to 98% of dissolved impurities (TDS), heavy metals, pesticides, and microbial pathogens.',
          price: 48000,
          mrp: 58000,
          showPrice: 'mrp_selling',
          priceLabel: 'Standard Unit (Installation Extra)',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: '250 LPH Commercial RO Plant Skid',
            },
          ],
          specifications: [
            { key: 'Flow Rate Capacity', value: '250 Litres / Hour' },
            { key: 'Daily Output', value: '2000 - 3000 Litres / Day' },
            { key: 'RO Membrane', value: '1 x 4040 High Rejection Polyamide' },
            { key: 'High Pressure Pump', value: 'Vertical Multistage (CRI / CNP 1HP)' },
            { key: 'Skid Construction', value: 'Food Grade SS 304 Stainless Steel' },
            { key: 'Pre-Filtration Vessels', value: 'FRP Vessels (10x54) with Sand & Carbon' },
            { key: 'Operating Pressure', value: '150 - 200 PSI' },
            { key: 'Recovery Rate', value: '40% - 50%' },
          ],
          features: [
            'Fully automated control panel with dry-run protection and auto-flushing',
            'Low maintenance multiport valves for fast backwash and rinsing',
            'Online rotameters for pure and reject flow measurement',
            'Pressure gauges for inlet and high-pressure monitoring',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'Commercial RO Plant 250 LPH Price | SS 304 | Apex Solutions',
          seoDescription:
            'Buy high quality 250 LPH commercial RO plant in stainless steel skid for commercial establishments, offices, and schools at direct manufacturer pricing.',
          seoKeywords: ['250 lph ro plant', 'commercial water purifier', 'industrial ro system', 'stainless steel ro plant'],
        },
        {
          name: 'Industrial Stainless Steel 500 LPH RO Purification Plant',
          slug: 'industrial-stainless-steel-500-lph-ro-purification-plant',
          category: categoryMap['water-purifiers']._id,
          subcategory: 'Industrial RO Plants',
          brand: 'AquaPure Pro',
          shortDescription:
            'Industrial grade 500 LPH twin-membrane RO plant engineered for pharmaceuticals, food processing, bottling units, and industrial manufacturing.',
          description:
            'Our 500 LPH Industrial Reverse Osmosis plant is constructed to deliver continuous, high-volume purified water under rigorous industrial conditions. Featuring two industrial 4040 membrane housings, dual FRP media vessels, automated antiscalant dosing system, and high-efficiency CRI vertical booster pump.\n\nSuitable for treating feed water with TDS levels up to 3000 ppm.',
          price: 78000,
          mrp: 95000,
          showPrice: 'quote',
          priceLabel: 'Custom Engineering Quote',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: '500 LPH Industrial Water Purifier System',
            },
          ],
          specifications: [
            { key: 'Capacity', value: '500 Litres / Hour' },
            { key: 'Membranes', value: '2 x 4040 Industrial RO Membranes' },
            { key: 'Vessels', value: 'FRP 13x54 with Multiport Valves' },
            { key: 'Micron Filter', value: '20" Big Blue Spun Filter Housing' },
            { key: 'Antiscalant Dosing', value: 'Electronic Dosing Pump with Chemical Tank' },
            { key: 'Frame', value: 'Heavy Duty Stainless Steel Tubular Skid' },
          ],
          features: [
            'Dual membrane housing configuration for maximum water output efficiency',
            'Automatic low pressure and high pressure cut-off switches',
            'Digital panel with TDS and flow rate sensors',
            'Antiscalant dosing system prevents premature membrane fouling',
          ],
          stockStatus: 'in_stock',
          featured: false,
          status: 'published',
          seoTitle: '500 LPH Industrial RO Plant Manufacturer | Apex Solutions',
          seoDescription:
            'Get 500 LPH Industrial Reverse Osmosis Water Treatment Plant with complete automation, SS skid, and anti-scalant dosing system.',
          seoKeywords: ['500 lph ro plant', 'industrial water purification', 'reverse osmosis plant', 'water filtration factory'],
        },
        {
          name: 'Multi-Stage Alkaline RO Water Purifier with UV+UF (Residential/Office)',
          slug: 'multi-stage-alkaline-ro-water-purifier-uv-uf',
          category: categoryMap['water-purifiers']._id,
          subcategory: 'Domestic & Office Purifiers',
          brand: 'AquaPure Pro',
          shortDescription:
            'Wall-mountable 15 LPH 7-stage RO+UV+UF+Alkaline water purifier with 10L food-grade storage tank and natural mineral infusion.',
          description:
            'Enjoy healthy, pH-balanced antioxidant drinking water. The AquaPure Alkaline RO purifier doesn’t just remove 99.9% of harmful chemicals, microplastics, and dissolved solids—it enriches your water with vital essential minerals like Calcium and Magnesium while restoring healthy alkaline pH (7.5 - 8.5).\n\nFeatures a transparent water level indicator, smart auto on/off sensor, and child-safe dispense tap.',
          price: 8999,
          mrp: 13999,
          showPrice: 'mrp_selling',
          priceLabel: 'Festive Offer',
          images: [
            {
              url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
              isPrimary: true,
              altText: 'Alkaline RO Purifier',
            },
          ],
          specifications: [
            { key: 'Purification Stages', value: '7 Stages (Sediment + Carbon + RO + UV + UF + Alkaline + Post Carbon)' },
            { key: 'Purification Speed', value: '15 Litres / Hour' },
            { key: 'Storage Capacity', value: '10 Litres Food-Grade ABS Tank' },
            { key: 'Suitable Feed Water', value: 'Borewell, Tanker, or Municipal Water up to 2000 ppm' },
            { key: 'Water pH Level', value: 'Alkaline 7.5 - 8.5 pH' },
          ],
          features: [
            'Bio-alkaline mineralizer enhances taste and boosts hydration',
            'Stainless steel UV chamber kills bacteria and viruses instantly',
            'Compact sleek wall-mountable and countertop design',
            'Full 1-Year Comprehensive Warranty',
          ],
          stockStatus: 'in_stock',
          featured: true,
          status: 'published',
          seoTitle: 'Alkaline RO Water Purifier UV UF 15 LPH | Apex Solutions',
          seoDescription:
            'Order 7-stage alkaline RO+UV+UF water purifier with natural mineral enrichment, 10L tank, and free installation.',
          seoKeywords: ['alkaline ro purifier', 'water purifier with uv uf', '15 lph water filter', 'domestic ro system'],
        },
      ];

      for (const prodData of sampleProducts) {
        const prod = new Product(prodData);
        await prod.save();
        logger.info(`Product created: ${prod.name}`);
      }
    } else {
      logger.info(`Products already exist in database (${productsCount} products). Skipping product seeding.`);
    }

    logger.info('Database seeding completed successfully.');
  } catch (error: any) {
    logger.error('Error during seeding:', error);
  }
};

// If run directly via CLI: tsx src/seed/seedData.ts
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Seed script finished. Exiting...');
      process.exit(0);
    })
    .catch((err) => {
      logger.error('Seed script failed:', err);
      process.exit(1);
    });
}
