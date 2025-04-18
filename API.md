## 📦 Collections API

**Path**: `app/graphqlQuery/collection.ts`

### GET_COLLECTIONS_QUERY
Fetches a paginated list of collections with optional search support.

**Used for:** Displaying collections with pagination and search.

---

### COLLECTION_COUNT_QUERY
Fetches the total number of collections.

**Used for:** Showing overall collection count, typically for pagination or stats.

## 👤 Customers API

**Path**: `app/graphqlQuery/customer.ts`

### GET_CUSTOMERS_QUERY  
Fetches a paginated list of customers with optional search functionality.

**Used for:** Displaying customer list with pagination and search on the UI.

---

### CUSTOMERS_COUNT_QUERY  
Fetches the total number of customers.

**Used for:** Displaying total customer count, useful for pagination or dashboard stats.

---

### DELETE_CUSTOMER_QUERY  
Deletes a specific customer by ID.

**Used for:** Handling customer deletion with confirmation modal and error handling.

## 🧩 Product Variants & Categories API

**Path**: `app/graphqlQuery/product.ts`

### PRODUCT_VARIANTS_QUERY  
Fetches a paginated list of product variants with optional search support.

**Used for:** Displaying product variants along with related product info, including inventory and media.

---

### PRODUCT_VARIANTS_COUNT_QUERY  
Fetches the total number of product variants.

**Used for:** Supporting pagination or showing variant stats.

---

### PRODUCT_VARIANT_BY_ID_QUERY  
Fetches detailed information of a specific product and its variants by product ID.

**Used for:** Displaying product variant details in modals or detail views.

---

### GET_CATEGORIES_QUERY  
Fetches all categories, with optional support to get child categories of a specific parent.

**Used for:** Populating category dropdowns, trees, or filtering options.

## 🎨 Theme API

**Path**: `app/graphqlQuery/theme.ts`

### GET_PUBLISHED_THEME_QUERY  
Fetches the currently published (main) theme.

**Used for:** Identifying the active theme to access its data or settings.

---

### GET_THEME_SETTINGS_QUERY  
Fetches settings data (`settings_data.json`) for a given theme ID.

**Used for:** Reading theme configuration settings like colors, fonts, or custom layout options.

## 💸 Discount API

**Path**: `app/graphqlQuery/discount.ts`

### DISCOUNT_TYPE_QUERY  
Fetches the type of a discount (manual or automatic) based on the given ID.

**Used for:** Determining the discount type before fetching more details.

---

### GET_DISCOUNT_CODES_QUERY  
Fetches discount codes for a specific discount ID (only for basic discount types).

**Used for:** Displaying all codes associated with a specific discount.

---

### GET_ALL_DISCOUNT_DETAILS_QUERY  
Fetches detailed information for both manual and automatic discounts, including discount type, conditions, targets (products/collections), and more.

**Used for:** Viewing or editing full discount details in the UI.

---

### GET_BASIC_DISCOUNT_CODE_USAGE_COUNT_QUERY  
Fetches the usage count for a basic discount code.

**Used for:** Displaying how many times a discount code has been used.

## 💳 Discount Management API

**Path**: `app/graphqlQuery/mutationDiscount.ts`

### CREATE_BUYXGETY_DISCOUNT_QUERY  
Creates a "Buy X, Get Y" discount code for manual discounts.

**Used for:** Creating a discount where customers buy a certain quantity of items and get others for free.

---

### CREATE_BUYXGETY_AUTOMATIC_DISCOUNT_CODE_QUERY  
Creates a "Buy X, Get Y" automatic discount.

**Used for:** Automatically applying a "Buy X, Get Y" discount at checkout without a code.

---

### CREATE_BASIC_DISCOUNT_CODE_QUERY  
Creates a basic discount code (percentage-based).

**Used for:** Creating a simple discount code that applies a percentage off items.

---

### CREATE_AUTOMATIC_BASIC_DISCOUNTCODE_QUERY  
Creates a basic automatic discount (percentage-based).

**Used for:** Automatically applying a percentage-based discount at checkout without a code.

---

### DELETE_DISCOUNT_CODE_QUERY  
Deletes a specific discount code by its ID.

**Used for:** Deleting an existing discount code.

---

### DELETE_AUTOMATIC_DISCOUNT_CODE_QUERY  
Deletes an automatic discount by its ID.

**Used for:** Removing an automatic discount from the system.

---

### DELETE_BULK_REDEEM_DISCOUNT_CODES_QUERY  
Deletes multiple redeemed discount codes in bulk.

**Used for:** Removing a batch of redeemed discount codes.

---

### UPDATE_BASIC_DISCOUNT_CODE_QUERY  
Updates an existing basic discount code.

**Used for:** Modifying details of an existing percentage-based discount code.

---

### UPDATE_BASIC_AUTOMATIC_DISCOUNT_CODE_QUERY  
Updates an existing automatic basic discount.

**Used for:** Modifying an existing percentage-based automatic discount.

---

### UPDATE_BUY_X_GET_Y_DISCOUNT_CODE_QUERY  
Updates a "Buy X, Get Y" discount code.

**Used for:** Editing the details of an existing "Buy X, Get Y" discount.

---

### UPDATE_BUY_X_GET_Y_AUTOMATIC_DISCOUNT_CODE_QUERY  
Updates a "Buy X, Get Y" automatic discount.

**Used for:** Modifying an automatic "Buy X, Get Y" discount that applies at checkout.
