import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';

const CATEGORIES = [
  { name: 'Prozessoren', description: 'Leistungsstarke CPUs für Gaming und Arbeit.', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Grafikkarten', description: 'High-End GPUs für flüssiges Gaming.', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Mainboards', description: 'Die Basis für dein System.', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000' },
  { name: 'RAM', description: 'Schneller Arbeitsspeicher für Multitasking.', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=1000' },
  { name: 'SSD / Festplatten', description: 'Schneller Speicher für deine Daten.', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Netzteile', description: 'Zuverlässige Stromversorgung für dein PC.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1000' },
];

const PRODUCTS: Record<string, any[]> = {
  'Prozessoren': [
    { name: 'Intel Core i5-13600K', description: '14 Kerne, bis zu 5.1 GHz.', price: 329.99, stock: 50, brand: 'Intel', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=60&w=500' },
    { name: 'Intel Core i7-13700K', description: '16 Kerne, bis zu 5.4 GHz.', price: 419.99, stock: 30, brand: 'Intel', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=60&w=500' },
    { name: 'Intel Core i9-13900K', description: '24 Kerne, bis zu 5.8 GHz.', price: 589.99, stock: 15, brand: 'Intel', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD Ryzen 5 7600X', description: '6 Kerne, bis zu 5.3 GHz.', price: 249.99, stock: 40, brand: 'AMD', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD Ryzen 7 7700X', description: '8 Kerne, bis zu 5.4 GHz.', price: 349.99, stock: 25, brand: 'AMD', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD Ryzen 9 7950X', description: '16 Kerne, bis zu 5.7 GHz.', price: 599.99, stock: 10, brand: 'AMD', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=60&w=500' },
    { name: 'Intel Pentium Gold G7400', description: 'Dual-Core für Office.', price: 89.99, stock: 100, brand: 'Intel', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD Athlon 3000G', description: 'Günstiger Einstieg.', price: 59.99, stock: 80, brand: 'AMD', image: 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=60&w=500' },
  ],
  'Grafikkarten': [
    { name: 'NVIDIA RTX 4060', description: '8GB GDDR6, DLSS 3.', price: 299.99, stock: 20, brand: 'NVIDIA', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=60&w=500' },
    { name: 'NVIDIA RTX 4070', description: '12GB GDDR6X, High-End.', price: 599.99, stock: 15, brand: 'NVIDIA', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=60&w=500' },
    { name: 'NVIDIA RTX 4080', description: '16GB GDDR6X, Ultra-Performance.', price: 1199.99, stock: 5, brand: 'NVIDIA', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD RX 7600', description: '8GB GDDR6, RDNA 3.', price: 269.99, stock: 25, brand: 'AMD', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD RX 7700 XT', description: '12GB GDDR6, WQHD Gaming.', price: 449.99, stock: 18, brand: 'AMD', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD RX 7800 XT', description: '16GB GDDR6, 4K Ready.', price: 549.99, stock: 12, brand: 'AMD', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=60&w=500' },
    { name: 'NVIDIA RTX 3050', description: '8GB GDDR6, Raytracing Einstieg.', price: 229.99, stock: 30, brand: 'NVIDIA', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=60&w=500' },
    { name: 'AMD RX 6600', description: '8GB GDDR6, Preis-Leistungs-Tipp.', price: 199.99, stock: 35, brand: 'AMD', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=60&w=500' },
  ],
  'Mainboards': [
    { name: 'ASUS Prime Z790-P', description: 'Intel Z790, DDR5, PCIe 5.0.', price: 219.99, stock: 15, brand: 'ASUS', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'MSI Pro B760-P', description: 'Intel B760, DDR4, Solide Basis.', price: 149.99, stock: 20, brand: 'MSI', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'Gigabyte Aorus Elite AX', description: 'AMD B650, WiFi 6E, RGB.', price: 239.99, stock: 12, brand: 'Gigabyte', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'ASRock Steel Legend B650', description: 'Robustes Design, AM5.', price: 199.99, stock: 10, brand: 'ASRock', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'ASUS TUF Gaming B550-Plus', description: 'AMD B450, AM4 Klassiker.', price: 129.99, stock: 25, brand: 'ASUS', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'MSI MAG X670E Tomahawk', description: 'High-End AM5 Mainboard.', price: 299.99, stock: 8, brand: 'MSI', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'Gigabyte Gaming X AX', description: 'Z790, DDR5, WiFi.', price: 209.99, stock: 14, brand: 'Gigabyte', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
    { name: 'ASRock Pro RS B760', description: 'Günstiges B760 Board.', price: 119.99, stock: 22, brand: 'ASRock', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=60&w=500' },
  ],
  'RAM': [
    { name: 'Corsair Vengeance 16 GB', description: 'DDR5-5200, CL40.', price: 69.99, stock: 50, brand: 'Corsair', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'Corsair Vengeance 32 GB', description: 'DDR5-6000, CL36.', price: 119.99, stock: 30, brand: 'Corsair', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'Kingston Fury 16 GB', description: 'DDR4-3200, CL16.', price: 49.99, stock: 60, brand: 'Kingston', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'Kingston Fury 32 GB', description: 'DDR4-3600, CL18.', price: 89.99, stock: 40, brand: 'Kingston', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'G.Skill Ripjaws 16 GB', description: 'DDR4-3200, Klassiker.', price: 44.99, stock: 55, brand: 'G.Skill', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'G.Skill Trident Z 32 GB', description: 'DDR5-6400, RGB.', price: 149.99, stock: 20, brand: 'G.Skill', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'Crucial 16 GB', description: 'DDR5-4800, Standard.', price: 59.99, stock: 70, brand: 'Crucial', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
    { name: 'TeamGroup 32 GB', description: 'DDR4-3200, Günstig.', price: 79.99, stock: 45, brand: 'TeamGroup', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=60&w=500' },
  ],
  'SSD / Festplatten': [
    { name: 'Samsung 990 Pro 1 TB', description: 'NVMe PCIe 4.0, 7450 MB/s.', price: 109.99, stock: 40, brand: 'Samsung', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'Samsung 980 1 TB', description: 'NVMe PCIe 3.0, 3500 MB/s.', price: 79.99, stock: 50, brand: 'Samsung', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'WD Black SN850 1 TB', description: 'NVMe PCIe 4.0, Gaming SSD.', price: 99.99, stock: 35, brand: 'WD', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'WD Blue 1 TB', description: 'SATA SSD, Zuverlässig.', price: 59.99, stock: 60, brand: 'WD', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'Crucial P3 1 TB', description: 'Günstige NVMe SSD.', price: 54.99, stock: 70, brand: 'Crucial', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'Kingston NV2 2 TB', description: 'Viel Speicher für wenig Geld.', price: 99.99, stock: 30, brand: 'Kingston', image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=60&w=500' },
    { name: 'Seagate Barracuda 2 TB', description: 'HDD, 7200 RPM.', price: 54.99, stock: 100, brand: 'Seagate', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=60&w=500' },
    { name: 'Toshiba P300 1 TB', description: 'HDD, Office Speicher.', price: 39.99, stock: 80, brand: 'Toshiba', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=60&w=500' },
  ],
  'Netzteile': [
    { name: 'be quiet! Pure Power 12 M 750W', description: '80 PLUS Gold, Modular.', price: 109.99, stock: 25, brand: 'be quiet!', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'Corsair RM750e 750W', description: '80 PLUS Gold, Leise.', price: 114.99, stock: 20, brand: 'Corsair', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'Seasonic Focus GX 650W', description: '80 PLUS Gold, Kompakt.', price: 99.99, stock: 15, brand: 'Seasonic', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'EVGA 600 W1', description: '80 PLUS White, Budget.', price: 49.99, stock: 40, brand: 'EVGA', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'Cooler Master MWE 750 Gold', description: '80 PLUS Gold, V2.', price: 89.99, stock: 18, brand: 'Cooler Master', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'Thermaltake Toughpower 850W', description: '80 PLUS Gold, RGB.', price: 129.99, stock: 12, brand: 'Thermaltake', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'MSI MAG A650BN 650W', description: '80 PLUS Bronze.', price: 59.99, stock: 30, brand: 'MSI', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
    { name: 'ASUS ROG Strix 850W', description: '80 PLUS Gold, High-End.', price: 159.99, stock: 10, brand: 'ASUS', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=60&w=500' },
  ],
};

export async function clearDatabase() {
  try {
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    for (const d of categoriesSnap.docs) {
      await deleteDoc(doc(db, 'categories', d.id));
    }
    const productsSnap = await getDocs(collection(db, 'products'));
    for (const d of productsSnap.docs) {
      await deleteDoc(doc(db, 'products', d.id));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'clear');
  }
}

export async function seedData(force: boolean = false) {
  try {
    if (force) {
      console.log('Clearing database for force seed...');
      await clearDatabase();
    } else {
      const categoriesSnap = await getDocs(collection(db, 'categories'));
      if (!categoriesSnap.empty) {
        console.log('Database already seeded.');
        return;
      }
    }

    console.log('Seeding database...');

    for (const cat of CATEGORIES) {
      const catRef = await addDoc(collection(db, 'categories'), cat);
      const products = PRODUCTS[cat.name] || [];
      for (const prod of products) {
        await addDoc(collection(db, 'products'), {
          ...prod,
          category_id: catRef.id,
        });
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}
