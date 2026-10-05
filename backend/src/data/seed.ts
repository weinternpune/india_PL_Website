import { store } from './store.js';

console.log('🌱 Seeding INDIA P.L. Backend database with fresh initial records...');
store.resetData();
console.log('✅ Successfully seeded:');
console.log(`   - ${store.getWorkers().length} Service Professionals`);
console.log(`   - ${store.getCustomers().length} Customers`);
console.log(`   - ${store.getServices().length} Service Catalog Items`);
console.log(`   - ${store.getBookings().length} Bookings with GPS dispatch tracking`);
console.log(`   - ${store.getRatings().length} Verified Customer Ratings`);
console.log(`   - ${store.getPayoutRequests().length} Payout & Settlement Records`);
console.log(`   - ${store.getNotifications().length} Operations Alerts`);
console.log('🎉 Database is ready for operations!');
process.exit(0);
