const admin = require('firebase-admin');
const fs = require('fs');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('❌ Ошибка: Переменная FIREBASE_SERVICE_ACCOUNT не найдена в Secrets!');
  process.exit(1);
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function buildSitemap() {
  try {
    const articlesSnapshot = await db.collection('articles').get();
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    xml += `  <url>\n    <loc>https://wikivnezakona.cc.cd/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    
    articlesSnapshot.forEach(doc => {
      xml += `  <url>\n    <loc>https://wikivnezakona.cc.cd/article.html?id=\${doc.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });
    
    xml += `</urlset>`;
    
    fs.writeFileSync('sitemap.xml', xml);
    console.log('✅ Файл sitemap.xml успешно сгенерирован и обновлен роботом!');
    
  } catch (error) {
    console.error('❌ Произошла ошибка при сборке sitemap:', error);
    process.exit(1);
  }
}

buildSitemap();
