//loading spinner
const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("product-container").classList.add("hidden");
  } else {
    document.getElementById("product-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

// Load Categories
const loadCategories = () => {
  fetch("https://fakestoreapi.com/products/categories")
    .then((res) => res.json())
    .then((categories) => displayCategories(categories));
};

// Display Category Buttons
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("category-container");
  categoryContainer.innerHTML = "";

  // Add an "All" button manually so we can see all products
  const allBtn = document.createElement("div");
  allBtn.innerHTML = `
      <button id="btn-all" onclick="loadProducts('all')" class="btn btn-outline btn-primary category-btn active">
         All Products
      </button>
  `;
  categoryContainer.append(allBtn);

  // Add Dynamic Category Buttons
  categories.forEach((category) => {
    const btnDiv = document.createElement("div");
    const categoryName = category.replace("'", "\\'");
    btnDiv.innerHTML = `
       <button id="btn-${categoryName}" onclick="loadProducts('${categoryName}')" class="btn btn-outline btn-primary category-btn capitalize px-6">
          ${category}
       </button>
    `;
    categoryContainer.append(btnDiv);
  });
};

// remove active class from buttons
const removeActive = () => {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
};

//Load Products 
const loadProducts = (category) => {
  manageSpinner(true);
  removeActive();

  // Highlight the clicked button
  const activeBtnId = category === 'all' ? 'btn-all' : `btn-${category}`;
  const activeBtn = document.getElementById(activeBtnId);
  if (activeBtn) activeBtn.classList.add("active");

  // If 'all', fetch all products. If specific category, fetch category specific.
  let url = "https://fakestoreapi.com/products";
  if (category !== 'all') {
    url = `https://fakestoreapi.com/products/category/${category}`;
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayProducts(data);
    });
};

// Display Products 
const displayProducts = (products) => {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";


  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("h-full"); 
    card.innerHTML = `
      <div class="card bg-base-100 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
        
        <div class="px-4 pt-4">
            <div class="bg-[#F3F4F6] rounded-xl h-48 flex items-center justify-center p-4 relative">
                <img src="${product.image}" alt="${product.title}" class="h-full w-auto object-contain mix-blend-multiply" />
            </div>
        </div>

        <div class="card-body px-4 pb-4 pt-4 flex-grow">
            
            <div class="flex justify-between items-center text-xs text-gray-500 mb-2">
                <span class="bg-blue-50 text-blue-600 px-2 py-1 rounded-full capitalize font-medium">
                  ${product.category}
                </span>
                <div class="flex items-center gap-1 text-gray-500 font-medium">
                    <i class="fa-solid fa-star text-yellow-400"></i>
                    <span>${product.rating.rate}</span>
                    <span class="text-gray-400"> (${product.rating.count})</span>
                </div>
            </div>
            
            <h2 class="card-title text-base font-bold text-gray-800 h-10 overflow-hidden leading-tight" title="${product.title}">
                ${product.title.length > 40 ? product.title.slice(0, 40) + '...' : product.title}
            </h2>
            
            <div class="mt-auto pt-4">
              <p class="text-lg font-bold text-gray-900 mb-3">$${product.price}</p>
              
              <div class="flex flex-row justify-between gap-3 w-full">
                  <button onclick="loadProductDetail(${product.id})" class="btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-primary hover:text-white flex-1">
                      <i class="fa-regular fa-eye"></i> Details
                  </button>
                  <button class="btn btn-sm btn-primary flex-1 text-white">
                      <i class="fa-solid fa-cart-shopping"></i> Add
                  </button>
              </div>
            </div>

        </div>
      </div>
    `;
    productContainer.append(card);
  });
  manageSpinner(false);
};

// Load Product Detail 
const loadProductDetail = async (id) => {
  const url = `https://fakestoreapi.com/products/${id}`;
  const res = await fetch(url);
  const product = await res.json();
  displayProductDetails(product);
};

// Display Details in Modal
const displayProductDetails = (product) => {
  const detailsBox = document.getElementById("details-container");
  
  // Customizing the modal content
  detailsBox.innerHTML = `
    <div class="flex flex-col gap-4">
       <figure class="h-40 w-full flex justify-center">
          <img src="${product.image}" class="h-full object-contain" />
       </figure>
       <div>
          <h2 class="text-xl font-bold">${product.title}</h2>
          <div class="badge badge-secondary my-2 capitalize">${product.category}</div>
          <p class="text-gray-600 my-2"> ${product.description.length > 250 ? product.description.slice(0, 250) + '...' : product.description}</p>
          <div class="flex justify-between items-center mt-4">
             <span class="text-2xl font-bold text-primary">$${product.price}</span>
             <div class="rating rating-sm">
                <input type="radio" name="rating-2" class="mask mask-star-2 bg-orange-400" />
                <span class="ml-1 text-sm">(${product.rating.rate})</span>
             </div>
          </div>
       </div>
       <div class="mt-auto pt-4">
              <div class="flex flex-row justify-between gap-3 w-full">
                  <button onclick="loadProductDetail(${product.id})" class="btn btn-sm btn-outline border-gray-300 text-gray-600 hover:bg-primary hover:text-white flex-1">
                      <i class="fa-regular fa-eye"></i> Details
                  </button>
                  <button class="btn btn-sm btn-primary flex-1 text-white">
                      <i class="fa-solid fa-cart-shopping"></i> Add
                  </button>
              </div>
            </div>
    </div>
  `;
  document.getElementById("word_modal").showModal();
};

// Load functions
loadCategories();
loadProducts('all'); 
