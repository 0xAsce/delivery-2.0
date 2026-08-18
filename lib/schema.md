# Data model

Shop: id, shopName, phone, balance

Product: id, name, unit, price, category, stock, lowStock, image

Order: id, shopId, shopName, phone, items, total, note, status,
paymentStatus, paidAmount, creditAmount, createdAt

LedgerTransaction: id, shopId, type, amount, orderId, note, createdAt

The pilot uses lib/store.js with browser localStorage. The API route contracts
under app/api/are kept small so the data implementation can later be replaced
with Prisma/Postgres without changing the UI model.
