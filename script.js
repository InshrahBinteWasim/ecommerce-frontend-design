document.addEventListener('DOMContentLoaded', () => {
    // --- Header Search Bar Interactivity (Applies to all pages with the header) ---
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-btn');

    if (searchInput && searchButton) {
        searchInput.addEventListener('focus', () => {
            console.log('Search input focused.');
        });
        searchInput.addEventListener('blur', () => {
            console.log('Search input blurred.');
        });
        searchButton.addEventListener('click', (event) => {
            event.preventDefault();
            console.log('Search button clicked. Search term:', searchInput.value);
        });
    }

    // --- Product Listing Page Interactivity (Applies only to products.html) ---
    const productGridView = document.getElementById('product-grid-view');
    const productListView = document.getElementById('product-list-view');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const listViewBtn = document.getElementById('list-view-btn');

    if (productGridView && productListView && gridViewBtn && listViewBtn) {
        function toggleProductView(viewType) {
            if (viewType === 'grid') {
                productGridView.classList.add('active');
                productListView.classList.remove('active');
                gridViewBtn.classList.add('active');
                listViewBtn.classList.remove('active');
            } else if (viewType === 'list') {
                productListView.classList.add('active');
                productGridView.classList.remove('active');
                listViewBtn.classList.add('active');
                gridViewBtn.classList.remove('active');
            }
        }
        gridViewBtn.addEventListener('click', () => toggleProductView('grid'));
        listViewBtn.addEventListener('click', () => toggleProductView('list'));
    }

    // --- Dynamic Active Filters Logic (Applies only to products.html) ---
    const activeFiltersSection = document.querySelector('.active-filters-section');
    const activeFiltersTagsContainer = document.querySelector('.active-filters-tags');
    const clearAllFiltersBtn = document.querySelector('.clear-all-filters-btn');
    const filterInputs = document.querySelectorAll(
        '.sidebar-filters input[type="checkbox"], ' +
        '.sidebar-filters input[type="radio"]'
    );

    if (activeFiltersSection && activeFiltersTagsContainer && clearAllFiltersBtn && filterInputs.length > 0) {
        function updateActiveFilters() {
            activeFiltersTagsContainer.innerHTML = '';
            let filtersActive = false;

            filterInputs.forEach(input => {
                if (input.checked) {
                    const filterId = input.id;
                    let filterText = input.nextElementSibling ? input.nextElementSibling.textContent.trim() : input.value;

                    if (input.closest('.ratings-filter')) {
                        const filledStars = input.nextElementSibling.querySelectorAll('.star-filled').length;
                        filterText = `${filledStars} star`;
                    } else if (input.closest('.condition-filter')) {
                        filterText = input.nextElementSibling ? input.nextElementSibling.textContent.trim() : input.value;
                    }

                    if (filterText) {
                        createFilterTag(filterText, filterId);
                        filtersActive = true;
                    }
                }
            });

            if (filtersActive) {
                activeFiltersSection.style.display = 'flex';
            } else {
                activeFiltersSection.style.display = 'none';
            }
        }

        function createFilterTag(text, filterId) {
            const tagDiv = document.createElement('div');
            tagDiv.classList.add('filter-tag');
            tagDiv.setAttribute('data-filter-id', filterId);

            const tagText = document.createElement('span');
            tagText.textContent = text;
            tagDiv.appendChild(tagText);

            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-filter-btn');
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', () => {
                const originalInput = document.getElementById(filterId);
                if (originalInput) {
                    if (originalInput.type === 'checkbox' || originalInput.type === 'radio') {
                        originalInput.checked = false;
                    }
                }
                updateActiveFilters();
            });
            tagDiv.appendChild(removeBtn);
            activeFiltersTagsContainer.appendChild(tagDiv);
        }

        filterInputs.forEach(input => {
            input.addEventListener('change', updateActiveFilters);
        });

        clearAllFiltersBtn.addEventListener('click', () => {
            filterInputs.forEach(input => {
                if (input.checked) {
                    input.checked = false;
                }
            });
            updateActiveFilters();
        });

        updateActiveFilters();
    }


    // --- Product Details Page Interactivity (Applies only to product-details.html) ---
    const mainProductImage = document.querySelector('.product-images .main-image-wrapper img');
    const thumbnailImages = document.querySelectorAll('.product-images .thumbnail-images .thumbnail');
    const tabButtons = document.querySelectorAll('.product-tabs-section .tab-button');
    const tabContents = document.querySelectorAll('.product-tabs-section .tab-content');

    if (mainProductImage && thumbnailImages.length > 0 && tabButtons.length > 0 && tabContents.length > 0) {
        thumbnailImages.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                thumbnailImages.forEach(img => img.classList.remove('active'));
                thumbnail.classList.add('active');
                mainProductImage.src = thumbnail.src;
            });
        });

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTabId = button.dataset.tab + '-content';
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const targetContent = document.getElementById(targetTabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });

        const initialActiveTabButton = document.querySelector('.product-tabs-section .tab-button.active');
        if (initialActiveTabButton) {
            const initialTargetContentId = initialActiveTabButton.dataset.tab + '-content';
            const initialTargetContent = document.getElementById(initialTargetContentId);
            if (initialTargetContent) {
                initialTargetContent.classList.add('active');
            }
        }
    }

    // --- My Cart Page Interactivity (Applies only to cart.html) ---
    // This section will handle logic specific to the cart page.
    // E.g., updating total based on quantity, removing items, etc.
    const cartItemCards = document.querySelectorAll('.cart-item-card');
    const cartItemCountSpan = document.getElementById('cart-item-count');

    if (cartItemCards.length > 0 && cartItemCountSpan) {
        /**
         * Updates the total item count in the cart heading.
         */
        function updateCartItemCount() {
            const currentItemCount = document.querySelectorAll('.cart-item-card').length;
            cartItemCountSpan.textContent = currentItemCount;
        }

        cartItemCards.forEach(card => {
            const removeBtn = card.querySelector('.remove-btn');
            const saveBtn = card.querySelector('.save-btn');
            const qtySelect = card.querySelector('.quantity-control select');

            // Handle 'Remove' button click
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    card.remove(); // Remove the entire cart item card
                    updateCartItemCount(); // Update the count in the heading
                    // In a real app, you'd also update backend/local storage here
                    console.log('Item removed from cart.');
                });
            }

            // Handle 'Save for later' button click
            if (saveBtn) {
                saveBtn.addEventListener('click', () => {
                    // Logic to move item to 'Saved for later' section
                    // For now, just remove from cart and log
                    card.remove();
                    updateCartItemCount();
                    console.log('Item saved for later.');
                });
            }

            // Handle quantity change
            if (qtySelect) {
                qtySelect.addEventListener('change', (event) => {
                    console.log(`Quantity for item changed to: ${event.target.value}`);
                    // In a real app, you'd update item total and overall cart total here
                });
            }
        });

        // Handle 'Remove all' button
        const removeAllBtn = document.querySelector('.cart-bottom-actions .remove-all-btn');
        if (removeAllBtn) {
            removeAllBtn.addEventListener('click', () => {
                const confirmClear = confirm('Are you sure you want to remove all items from your cart?');
                if (confirmClear) {
                    document.querySelectorAll('.cart-item-card').forEach(card => card.remove());
                    updateCartItemCount();
                    console.log('All items removed from cart.');
                }
            });
        }

        // Handle 'Move to cart' button for saved items
        const moveToCartBtns = document.querySelectorAll('.saved-item-card .move-to-cart-btn');
        moveToCartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const savedCard = btn.closest('.saved-item-card');
                if (savedCard) {
                    // In a real app, you'd clone the item, add it to the cart section,
                    // and remove it from the saved section. For now, just remove.
                    savedCard.remove();
                    console.log('Item moved to cart (simulated).');
                    // You might want to add it back to the cart-items-section here
                    // and then update the cart item count.
                }
            });
        });

        updateCartItemCount(); // Initial count update on page load
    }
});
