export const C = {
  bg:"#F6F8F5", surface:"#FFFFFF", ink:"#16221B", inkSoft:"#5B6560",
  primary:"#0B6B43", primaryDark:"#084F31", primarySoft:"#E4F1EA",
  accent:"#E8962E", accentSoft:"#FCEEDB", line:"#E1E7DF", danger:"#B3402A",
  statusPending:"#8A9187", statusConfirmed:"#2D6CB0", statusOut:"#E8962E",
  statusDelivered:"#0B6B43"
};

export const CATEGORY_LIST = ["boissons","epicerie","hygiene","snacks"];
export const STATUS_FLOW = ["pending","confirmed","outfordelivery","delivered"];

export const DEFAULT_CATALOG = [
{id:"p1",name:"Hamoud Boualem Citron 1L",unit:"1L",price:90,category:"boissons",stock:true,lowStock:false,emoji:"🍋"},
{id:"p2",name:"Ifri Orange 1L",unit:"1L",price:85,category:"boissons",stock:true,lowStock:false,emoji:"🍊"},
{id:"p3",name:"Coca-Cola 1.5L",unit:"1.5L",price:150,category:"boissons",stock:true,lowStock:true,emoji:"🥤"},
{id:"p4",name:"Rouiba Jus Pomme 1L",unit:"1L",price:110,category:"boissons",stock:false,lowStock:false,emoji:"🍏"},
{id:"p5",name:"Ifri Eau Minérale 1.5L",unit:"1.5L",price:40,category:"boissons",stock:true,lowStock:false,emoji:"💧"},
{id:"p6",name:"Huile Elio 1L",unit:"1L",price:320,category:"epicerie",stock:true,lowStock:false,emoji:"🫙"},
{id:"p7",name:"Farine de Blé 1kg",unit:"1kg",price:90,category:"epicerie",stock:true,lowStock:false,emoji:"🌾"},
{id:"p8",name:"Sucre Cristal 1kg",unit:"1kg",price:130,category:"epicerie",stock:true,lowStock:true,emoji:"🧂"},
{id:"p9",name:"Couscous Extra 1kg",unit:"1kg",price:160,category:"epicerie",stock:true,lowStock:false,emoji:"🍚"},
{id:"p10",name:"Café Moulu 250g",unit:"250g",price:380,category:"epicerie",stock:true,lowStock:false,emoji:"☕"},
{id:"p11",name:"Concentré de Tomate 400g",unit:"400g",price:95,category:"epicerie",stock:false,lowStock:false,emoji:"🍅"},
{id:"p12",name:"Savon de Toilette 4x100g",unit:"4x100g",price:220,category:"hygiene",stock:true,lowStock:false,emoji:"🧼"},
{id:"p13",name:"Shampoing Classique 400ml",unit:"400ml",price:350,category:"hygiene",stock:true,lowStock:false,emoji:"🧴"},
{id:"p14",name:"Dentifrice 100ml",unit:"100ml",price:180,category:"hygiene",stock:true,lowStock:false,emoji:"🪥"},
{id:"p15",name:"Détergent Poudre 1kg",unit:"1kg",price:210,category:"hygiene",stock:true,lowStock:false,emoji:"🧺"},
{id:"p16",name:"Biscuits Sablés 200g",unit:"200g",price:90,category:"snacks",stock:true,lowStock:false,emoji:"🍪"},
{id:"p17",name:"Chips Nature 100g",unit:"100g",price:70,category:"snacks",stock:true,lowStock:false,emoji:"🍟"},
{id:"p18",name:"Tablette Chocolat 90g",unit:"90g",price:150,category:"snacks",stock:true,lowStock:false,emoji:"🍫"},
{id:"p19",name:"Gâteau Fourré Choco 300g",unit:"300g",price:80,category:"snacks",stock:false,lowStock:false,emoji:"🧁"}
];

export const DEMO_SHOPS = [
 {id:"shop-1",shopName:"Hanout Amine",phone:"0555 12 34 56"},
 {id:"shop-2",shopName:"Épicerie Nadia",phone:"0661 22 33 44"},
 {id:"shop-3",shopName:"Marché El Bahia",phone:"0770 45 67 89"}
];

export const T = {
fr:{
appName:"Hanout Direct",tagline:"Commandez votre stock en 2 minutes",home:"Accueil",
catalogTitle:"Catalogue",cartTitle:"Panier",ordersTitle:"Mes commandes",reorderBtn:"Recommander la dernière commande",
viewCatalog:"Voir le catalogue",myOrders:"Mes commandes",all:"Tout",searchPlaceholder:"Rechercher un produit...",
inStock:"Disponible",outOfStock:"Rupture de stock",lowStock:"Stock limité",add:"Ajouter",total:"Total",itemsInCart:"article(s)",
placeOrder:"Passer la commande",yourCart:"Votre panier",emptyCart:"Votre panier est vide",emptyCartSub:"Ajoutez des produits depuis le catalogue",
goToCatalog:"Aller au catalogue",shopInfoTitle:"Vos informations",shopInfoSub:"Nécessaire pour la première commande",
shopNameLabel:"Nom du magasin",shopNamePlaceholder:"Ex: Hanout Amine",phoneLabel:"Numéro de téléphone",phonePlaceholder:"Ex: 0555 12 34 56",
confirm:"Confirmer",cancel:"Annuler",orderPlacedTitle:"Commande envoyée !",orderPlacedSub:"Le distributeur va confirmer votre commande",
orderNumber:"Commande",orderDate:"Date",statusPending:"En attente",statusConfirmed:"Confirmée",statusOutForDelivery:"En livraison",statusDelivered:"Livrée",
backHome:"Retour à l'accueil",noOrders:"Aucune commande pour le moment",noOrdersSub:"Vos commandes passées s'afficheront ici",
paymentNote:"Paiement à la livraison (espèces)",distributorSpace:"Espace distributeur",adminLoginTitle:"Connexion distributeur",password:"Mot de passe",
login:"Se connecter",wrongPassword:"Mot de passe incorrect",back:"Retour",incomingOrders:"Commandes",catalogMgmt:"Produits",balances:"Crédits",
dashboard:"Tableau de bord",todayOrders:"Commandes aujourd'hui",todayValue:"Valeur aujourd'hui",outstanding:"Crédit total",
noOrdersYet:"Aucune commande reçue",nextStatus:"Statut suivant",fullyDelivered:"Commande livrée",addProduct:"Ajouter un produit",
productName:"Nom du produit",unitSize:"Format / unité",priceLabel:"Prix (DA)",categoryLabel:"Catégorie",saveBtn:"Enregistrer",deleteBtn:"Supprimer",
markOut:"Marquer rupture",markIn:"Marquer disponible",logout:"Déconnexion",refresh:"Actualiser",confirmDeleteProduct:"Supprimer ce produit du catalogue ?",
yes:"Oui",no:"Non",shop:"Magasin",phoneShort:"Tél",da:"DA",unitEach:"unité",edit:"Modifier",close:"Fermer",qty:"Qté",
catalogEmpty:"Aucun produit dans cette catégorie",orderSummary:"Récapitulatif",placingOrderAs:"Commande au nom de",note:"Note de livraison (optionnel)",
notePlaceholder:"Ex: livrer avant 14h",paymentStatus:"Paiement",unpaid:"Impayé",partial:"Partiel",paid:"Payé",credit:"Crédit",
paidFull:"Payé en totalité",partialPayment:"Paiement partiel",addToCredit:"Ajouter au crédit",amountPaid:"Montant payé",
recordPayment:"Enregistrer un paiement",recordPaymentTitle:"Enregistrer un paiement",paymentAmount:"Montant",shopBalance:"Solde à payer",
paymentHistory:"Historique des paiements",savePayment:"Enregistrer",searchShop:"Rechercher un magasin...",noBalance:"Aucun crédit",categories:{boissons:"Boissons",epicerie:"Épicerie",hygiene:"Hygiène",snacks:"Snacks"},
lowStockLabel:"Stock limité",inStockLabel:"En stock",bulkEdit:"Modification rapide",saveChanges:"Enregistrer les changements",
statusFilter:"Filtrer par statut",allStatuses:"Tous les statuts",searchOrder:"Rechercher un magasin ou commande...",image:"Photo",imageUrl:"Ou collez un lien image",
},
ar:{
appName:"حانوت دايركت",tagline:"اطلب بضاعتك في دقيقتين",home:"الرئيسية",catalogTitle:"الكتالوج",cartTitle:"السلة",ordersTitle:"طلباتي",
reorderBtn:"إعادة آخر طلب",viewCatalog:"عرض الكتالوج",myOrders:"طلباتي",all:"الكل",searchPlaceholder:"ابحث عن منتج...",
inStock:"متوفر",outOfStock:"غير متوفر",lowStock:"المخزون محدود",add:"إضافة",total:"المجموع",itemsInCart:"منتج",
placeOrder:"إرسال الطلب",yourCart:"سلتك",emptyCart:"سلتك فارغة",emptyCartSub:"أضف منتجات من الكتالوج",goToCatalog:"الذهاب إلى الكتالوج",
shopInfoTitle:"معلوماتك",shopInfoSub:"مطلوبة لأول طلب",shopNameLabel:"اسم المحل",shopNamePlaceholder:"مثال: حانوت أمين",phoneLabel:"رقم الهاتف",
phonePlaceholder:"مثال: 0555 12 34 56",confirm:"تأكيد",cancel:"إلغاء",orderPlacedTitle:"تم إرسال الطلب!",orderPlacedSub:"سيقوم الموزع بتأكيد طلبك",
orderNumber:"رقم الطلب",orderDate:"التاريخ",statusPending:"قيد الانتظار",statusConfirmed:"تم التأكيد",statusOutForDelivery:"في الطريق",statusDelivered:"تم التوصيل",
backHome:"العودة للرئيسية",noOrders:"لا توجد طلبات بعد",noOrdersSub:"ستظهر طلباتك السابقة هنا",paymentNote:"الدفع عند التسليم (نقداً)",
distributorSpace:"مساحة الموزع",adminLoginTitle:"دخول الموزع",password:"كلمة المرور",login:"دخول",wrongPassword:"كلمة المرور غير صحيحة",back:"رجوع",
incomingOrders:"الطلبات",catalogMgmt:"المنتجات",balances:"الأرصدة",dashboard:"لوحة التحكم",todayOrders:"طلبات اليوم",todayValue:"قيمة اليوم",outstanding:"إجمالي الائتمان",
noOrdersYet:"لا توجد طلبات واردة",nextStatus:"الحالة التالية",fullyDelivered:"تم توصيل الطلب",addProduct:"إضافة منتج",productName:"اسم المنتج",
unitSize:"الحجم / الوحدة",priceLabel:"السعر (دج)",categoryLabel:"الفئة",saveBtn:"حفظ",deleteBtn:"حذف",markOut:"وضع كغير متوفر",markIn:"وضع كمتوفر",
logout:"تسجيل الخروج",refresh:"تحديث",confirmDeleteProduct:"هل تريد حذف هذا المنتج من الكتالوج؟",yes:"نعم",no:"لا",shop:"المحل",phoneShort:"الهاتف",
da:"دج",unitEach:"وحدة",edit:"تعديل",close:"إغلاق",qty:"الكمية",catalogEmpty:"لا توجد منتجات في هذه الفئة",orderSummary:"ملخص الطلب",
placingOrderAs:"الطلب باسم",note:"ملاحظة التوصيل (اختياري)",notePlaceholder:"مثال: التوصيل قبل الساعة 14",paymentStatus:"الدفع",unpaid:"غير مدفوع",
partial:"جزئي",paid:"مدفوع",credit:"ائتمان",paidFull:"دفع كامل",partialPayment:"دفع جزئي",addToCredit:"إضافة إلى الائتمان",amountPaid:"المبلغ المدفوع",
recordPayment:"تسجيل دفعة",recordPaymentTitle:"تسجيل دفعة",paymentAmount:"المبلغ",shopBalance:"الرصيد المستحق",paymentHistory:"سجل الدفعات",
savePayment:"حفظ",searchShop:"ابحث عن محل...",noBalance:"لا يوجد رصيد",categories:{boissons:"مشروبات",epicerie:"بقالة",hygiene:"نظافة",snacks:"وجبات خفيفة"},lowStockLabel:"المخزون محدود",inStockLabel:"متوفر",bulkEdit:"تعديل سريع",
saveChanges:"حفظ التغييرات",statusFilter:"تصفية حسب الحالة",allStatuses:"كل الحالات",searchOrder:"ابحث عن محل أو طلب...",image:"الصورة",imageUrl:"أو ألصق رابط الصورة"
}
};

export const STATUS_LABELS = (t)=>({
pending:t.statusPending,confirmed:t.statusConfirmed,outfordelivery:t.statusOutForDelivery,delivered:t.statusDelivered
});
