import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { ENV } from '../config/env';

/**
 * Generate dynamic sitemap.xml
 * GET /sitemap.xml or GET /api/seo/sitemap.xml
 */
export const getSitemapXml = async (req: Request, res: Response): Promise<void> => {
  try {
    const baseUrl = ENV.CLIENT_URL.replace(/\/+$/, '');

    let categories: any[] = [];
    let products: any[] = [];

    // Safely query database if connected
    if (mongoose.connection.readyState === 1) {
      try {
        [categories, products] = await Promise.all([
          Category.find({ isActive: true }).select('slug updatedAt').lean(),
          Product.find({ status: 'published' }).select('slug updatedAt').lean(),
        ]);
      } catch (dbErr) {
        console.warn('Could not query DB for sitemap products/categories, generating static sitemap.');
      }
    }

    const staticPages = [
      { url: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { url: `${baseUrl}/products`, priority: '0.9', changefreq: 'daily' },
      { url: `${baseUrl}/categories`, priority: '0.8', changefreq: 'weekly' },
      { url: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly' },
      { url: `${baseUrl}/contact`, priority: '0.8', changefreq: 'monthly' },
      { url: `${baseUrl}/quote`, priority: '0.8', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Category pages
    for (const cat of categories) {
      const lastMod = cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : '';
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products?category=${cat.slug}</loc>\n`;
      if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    // Product pages
    for (const prod of products) {
      const lastMod = prod.updatedAt ? new Date(prod.updatedAt).toISOString().split('T')[0] : '';
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/products/${prod.slug}</loc>\n`;
      if (lastMod) xml += `    <lastmod>${lastMod}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error: any) {
    res.status(500).send('Error generating sitemap');
  }
};

/**
 * Generate robots.txt
 * GET /robots.txt or GET /api/seo/robots.txt
 */
export const getRobotsTxt = (req: Request, res: Response): void => {
  const baseUrl = ENV.CLIENT_URL.replace(/\/+$/, '');
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.header('Content-Type', 'text/plain');
  res.send(robots);
};
