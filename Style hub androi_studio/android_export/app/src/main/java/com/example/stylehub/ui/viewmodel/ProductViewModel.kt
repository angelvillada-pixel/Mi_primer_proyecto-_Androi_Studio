package com.example.stylehub.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.stylehub.data.model.*
import com.example.stylehub.data.repository.ProductRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch

data class CatalogUiState(
    val isLoading: Boolean = true,
    val products: List<Product> = emptyList(),
    val categories: List<String> = emptyList(),
    val selectedCategory: String = "all",
    val searchQuery: String = "",
    val error: String? = null
)

data class CartUiState(
    val items: List<CartItemUi> = emptyList(),
    val totalItems: Int = 0,
    val subtotal: Double = 0.0,
    val tax: Double = 0.0,
    val total: Double = 0.0,
    val isDrawerOpen: Boolean = false
)

data class AuthUiState(
    val currentUser: User? = null,
    val availableUsers: List<User> = emptyList(),
    val isAuthenticated: Boolean = false,
    val isAuthModalOpen: Boolean = false,
    val userCarts: List<Cart> = emptyList(),
    val isLoadingCarts: Boolean = false,
    val toastMessage: String? = null
)

/**
 * 3. ViewModel MVVM con StateFlow reactivo y Smart Fallback
 */
class ProductViewModel(
    private val repository: ProductRepository = ProductRepository()
) : ViewModel() {

    private val _catalogState = MutableStateFlow(CatalogUiState())
    val catalogState: StateFlow<CatalogUiState> = _catalogState.asStateFlow()

    private val _cartState = MutableStateFlow(CartUiState())
    val cartState: StateFlow<CartUiState> = _cartState.asStateFlow()

    private val _authState = MutableStateFlow(AuthUiState())
    val authState: StateFlow<AuthUiState> = _authState.asStateFlow()

    private var allProducts: List<Product> = emptyList()

    init {
        loadCatalog()
    }

    fun loadCatalog() {
        // Pintamos contenido local inmediatamente; la red solo lo actualiza después.
        allProducts = repository.immediateProducts()
        _catalogState.update {
            it.copy(
                isLoading = false,
                products = allProducts,
                categories = repository.immediateCategories(),
                error = null
            )
        }
        viewModelScope.launch {
            val (productsResult, categoriesResult) = coroutineScope {
                val products = async { repository.getProducts() }
                val categories = async { repository.getCategories() }
                products.await() to categories.await()
            }

            if (productsResult.isSuccess) {
                allProducts = productsResult.getOrDefault(emptyList())
                val categories = categoriesResult.getOrDefault(emptyList())

                _catalogState.update {
                    it.copy(
                        isLoading = false,
                        products = allProducts,
                        categories = categories
                    )
                }
                filterProducts()

            } else {
                _catalogState.update {
                    it.copy(isLoading = false, error = "Error al conectar con Fake Store API")
                }
            }
        }
    }

    private fun loadUsers() {
        viewModelScope.launch {
            val usersResult = repository.getUsers()
            if (usersResult.isSuccess) {
                val users = usersResult.getOrDefault(emptyList())
                _authState.update {
                    it.copy(
                        availableUsers = users,
                        currentUser = null,
                        isAuthenticated = false
                    )
                }
            }
        }
    }

    fun selectCategory(category: String) {
        _catalogState.update { it.copy(selectedCategory = category) }
        filterProducts()
    }

    fun searchProducts(query: String) {
        _catalogState.update { it.copy(searchQuery = query) }
        filterProducts()
    }

    private fun filterProducts() {
        val cat = _catalogState.value.selectedCategory
        val q = _catalogState.value.searchQuery.trim().lowercase()

        var filtered = allProducts
        if (cat != "all") {
            filtered = filtered.filter { it.category == cat }
        }
        if (q.isNotEmpty()) {
            filtered = filtered.filter {
                it.title.lowercase().contains(q) || it.description.lowercase().contains(q)
            }
        }

        _catalogState.update { it.copy(products = filtered) }
    }

    // --- Métodos de Carrito Reactivo ---

    fun addToCart(product: Product, quantity: Int = 1, silent: Boolean = false) {
        _cartState.update { current ->
            val existing = current.items.find { it.product.id == product.id }
            val newItems = if (existing != null) {
                current.items.map {
                    if (it.product.id == product.id) it.copy(quantity = it.quantity + quantity)
                    else it
                }
            } else {
                current.items + CartItemUi(product, quantity)
            }

            calculateCartState(newItems, current.isDrawerOpen)
        }

        if (!silent) {
            setToast("Añadido al carrito: ${product.title}")
        }
    }

    fun updateCartQuantity(productId: Int, quantity: Int) {
        _cartState.update { current ->
            val newItems = if (quantity <= 0) {
                current.items.filter { it.product.id != productId }
            } else {
                current.items.map {
                    if (it.product.id == productId) it.copy(quantity = quantity)
                    else it
                }
            }
            calculateCartState(newItems, current.isDrawerOpen)
        }
    }

    fun removeFromCart(productId: Int) {
        _cartState.update { current ->
            val newItems = current.items.filter { it.product.id != productId }
            calculateCartState(newItems, current.isDrawerOpen)
        }
    }

    fun clearCart() {
        _cartState.update { current ->
            calculateCartState(emptyList(), current.isDrawerOpen)
        }
    }

    fun checkout() {
        if (_cartState.value.items.isEmpty()) {
            setToast("Tu carrito está vacío")
            return
        }
        if (!_authState.value.isAuthenticated) {
            _authState.update { it.copy(isAuthModalOpen = true) }
            setToast("Inicia sesión antes de confirmar el pedido")
            return
        }
        clearCart()
        setToast("Pedido registrado en esta demostración.")
    }

    fun setCartDrawerOpen(isOpen: Boolean) {
        _cartState.update { it.copy(isDrawerOpen = isOpen) }
    }

    private fun calculateCartState(items: List<CartItemUi>, isDrawerOpen: Boolean): CartUiState {
        val totalCount = items.sumOf { it.quantity }
        val subtotal = items.sumOf { it.subtotal }
        val tax = subtotal * 0.08
        val total = subtotal + tax
        return CartUiState(
            items = items,
            totalItems = totalCount,
            subtotal = subtotal,
            tax = tax,
            total = total,
            isDrawerOpen = isDrawerOpen
        )
    }

    // --- Métodos de Autenticación con Smart Fallback ---

    private fun login(userId: Int) {
        val user = _authState.value.availableUsers.find { it.id == userId }
            ?: _authState.value.availableUsers.firstOrNull()

        _authState.update {
            it.copy(
                currentUser = user,
                isAuthenticated = user != null,
                isAuthModalOpen = false
            )
        }

        user?.let {
            loadUserCarts(it.id)
            setToast("Sesión iniciada: ${it.name.firstname} ${it.name.lastname}")
        }
    }

    fun loginWithCredentials(username: String, password: String) {
        if (username.isBlank() || password.isBlank()) {
            setToast("Escribe usuario y contraseña")
            return
        }
        viewModelScope.launch {
            val result = repository.authenticate(username.trim(), password)
            val user = _authState.value.availableUsers.find {
                it.username.equals(username.trim(), ignoreCase = true) ||
                    it.email.equals(username.trim(), ignoreCase = true)
            }
            if (result.isSuccess && user != null) {
                _authState.update {
                    it.copy(currentUser = user, isAuthenticated = true, isAuthModalOpen = false)
                }
                loadUserCarts(user.id)
                setToast("¡Bienvenido de nuevo, ${user.name.firstname}!")
            } else {
                setToast("No pudimos verificar tus credenciales")
            }
        }
    }

    fun logout() {
        _authState.update {
            it.copy(
                currentUser = null,
                isAuthenticated = false,
                userCarts = emptyList()
            )
        }
        setToast("Has cerrado sesión")
    }

    fun setAuthModalOpen(isOpen: Boolean) {
        _authState.update { it.copy(isAuthModalOpen = isOpen) }
        if (isOpen && _authState.value.availableUsers.isEmpty()) loadUsers()
    }

    fun loadUserCarts(userId: Int) {
        viewModelScope.launch {
            _authState.update { it.copy(isLoadingCarts = true) }
            val result = repository.getUserCarts(userId)
            _authState.update {
                it.copy(
                    userCarts = result.getOrDefault(emptyList()),
                    isLoadingCarts = false
                )
            }
        }
    }

    fun setToast(message: String?) {
        _authState.update { it.copy(toastMessage = message) }
    }
}
